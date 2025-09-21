import type { NextApiRequest, NextApiResponse } from 'next';
import { globalCache } from '@/server/cache';

function pickMeta(html: string, baseUrl: string) {
  const out: Record<string, string> = {};
  const find = (re: RegExp) => {
    const m = html.match(re);
    return m && m[1] ? m[1] : undefined;
  };
  const ogImage = find(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                  find(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const ogTitle = find(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                  find(/<title[^>]*>([^<]+)<\/title>/i);
  if (ogImage) {
    // 모든 외부 이미지 완전 차단 (저작권 문제 방지)
    const isBlockedImage = ogImage.includes('google') || 
                          ogImage.includes('gstatic') || 
                          ogImage.includes('googleapis') ||
                          ogImage.includes('favicon') ||
                          ogImage.includes('logo') ||
                          ogImage.includes('sprite') ||
                          ogImage.includes('news') ||
                          ogImage.includes('media') ||
                          ogImage.includes('cdn') ||
                          ogImage.includes('static') ||
                          true; // 모든 외부 이미지 차단
    
    // 이미지를 아예 설정하지 않음 - 기본 아이콘만 사용
    console.log(`🚫 External image blocked: ${ogImage.substring(0, 50)}...`);
  }
  if (ogTitle) out.title = ogTitle;
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const raw = String(req.query.url || '');
    if (!raw) return res.status(400).json({ error: 'Missing url' });
    
    // 구글 관련 URL 완전 차단
    if (raw.includes('google') || raw.includes('gstatic') || raw.includes('googleapis')) {
      return res.status(200).json({ 
        url: raw,
        blocked: true,
        reason: 'Google images blocked'
      });
    }
    
    const url = new URL(raw).toString();

    const cacheKey = `og:${url}`;
    const cached = globalCache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const resp = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'ca.korea og-extractor/1.0' } });
    const finalUrl = resp.url || url;
    const type = resp.headers.get('content-type') || '';
    if (!type.includes('text/html')) {
      const data = { url: finalUrl };
      globalCache.set(cacheKey, data, 10 * 60 * 1000);
      res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
      return res.status(200).json(data);
    }
    const buf = await resp.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(buf).slice(0, 300000); // 300KB
    const meta = pickMeta(text, finalUrl);
    const data = { url: finalUrl, ...meta };
    globalCache.set(cacheKey, data, 10 * 60 * 1000);
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(200).json({ error: e.message });
  }
}


