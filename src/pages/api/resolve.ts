import type { NextApiRequest, NextApiResponse } from 'next';

// 간단한 URL 정규화
function normalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    // 트래킹 파라미터 제거 최소화
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','mc_cid','mc_eid'].forEach((k) => {
      url.searchParams.delete(k);
    });
    return url.toString();
  } catch {
    return u;
  }
}

// HTML에서 canonical/og:url 추출
function extractCanonical(html: string, baseUrl: string): string | null {
  const linkMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
  if (linkMatch) {
    const hrefMatch = linkMatch[0].match(/href=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      try {
        return new URL(hrefMatch[1], baseUrl).toString();
      } catch {}
    }
  }
  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (ogUrlMatch && ogUrlMatch[1]) {
    try {
      return new URL(ogUrlMatch[1], baseUrl).toString();
    } catch {}
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = String(req.query.url || '');
    if (!raw) return res.status(400).json({ error: 'Missing url' });

    const inputUrl = normalizeUrl(raw);

    // 1) 리디렉션 추적 (자동)
    const resp = await fetch(inputUrl, { redirect: 'follow', method: 'GET', headers: { 'user-agent': 'ca.korea resolver/1.0' } });
    const resolvedUrl = normalizeUrl(resp.url || inputUrl);

    // 2) HTML이면 canonical/og:url 일부만 파싱 (최대 250KB)
    let canonical: string | null = null;
    const ctype = resp.headers.get('content-type') || '';
    if (ctype.includes('text/html')) {
      const reader = resp.body?.getReader();
      if (reader) {
        const chunks: Uint8Array[] = [];
        let total = 0;
        const limit = 250 * 1024; // 250KB
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            total += value.byteLength;
            if (total >= limit) break;
          }
        }
        const html = new TextDecoder('utf-8').decode(Buffer.concat(chunks as any));
        canonical = extractCanonical(html, resolvedUrl);
      } else {
        // 일부 런타임에서는 body reader 미지원 → text() 사용(비권장)
        try {
          const html = await resp.text();
          canonical = extractCanonical(html, resolvedUrl);
        } catch {}
      }
    }

    const finalUrl = normalizeUrl(canonical || resolvedUrl);

    return res.status(200).json({ input: inputUrl, resolved: resolvedUrl, canonical: canonical || null, final: finalUrl });
  } catch (e: any) {
    return res.status(200).json({ error: e.message, final: String(req.query.url || '') });
  }
}

