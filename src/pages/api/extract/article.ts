import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

// Simple article extractor targeting common news patterns and the user's sample
// Returns: { images: [{src, alt, caption}], textHtml }

function normalizeUrl(u: string): string {
  try {
    const url = new URL(u);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid'].forEach((k) => url.searchParams.delete(k));
    return url.toString();
  } catch { return u; }
}

function extractCanonical(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);
  const link = $('link[rel="canonical"]').attr('href') || $('meta[property="og:url"]').attr('content');
  if (link) {
    try { return new URL(link, baseUrl).toString(); } catch {}
  }
  // meta refresh
  const meta = $('meta[http-equiv="refresh"]').attr('content');
  if (meta) {
    const m = meta.match(/url=(.+)$/i);
    if (m && m[1]) {
      try { return new URL(m[1], baseUrl).toString(); } catch {}
    }
  }
  return null;
}

async function resolveFinalUrl(input: string): Promise<string> {
  const first = normalizeUrl(input);
  try {
    const r = await fetch(first, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 ca.korea extractor/1.0' } });
    const resolved = normalizeUrl(r.url || first);
    const ctype = r.headers.get('content-type') || '';
    if (ctype.includes('text/html')) {
      let html = '';
      try { html = await r.text(); } catch {}
      const canon = extractCanonical(html, resolved);
      if (canon) return normalizeUrl(canon);
      // Google News aggregator → pick external publisher link
      try {
        const u = new URL(resolved);
        if (u.hostname.endsWith('news.google.com')) {
          const $ = cheerio.load(html);
          const anchors = Array.from($('a[href]')).map((el) => $(el).attr('href') || '').filter(Boolean);
          for (const a of anchors) {
            try {
              const abs = new URL(a, u).toString();
              const h = new URL(abs).hostname;
              if (!/google\.(com|co\.[a-z]+)|gstatic\.com|googleusercontent\.com|consent\.google\.com/.test(h)) {
                return normalizeUrl(abs);
              }
            } catch {}
          }
        }
      } catch {}
    }
    return resolved;
  } catch { return first; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = String(req.query.url || '');
  if (!url) return res.status(400).json({ error: 'Missing url' });
  try {
    // 1) news.google.com 등의 중계 링크를 실 기사로 해석
    const finalUrl = await resolveFinalUrl(url);

    const r = await fetch(finalUrl, { headers: { 'User-Agent': 'Mozilla/5.0 ca.korea crawler' } });
    if (!r.ok) return res.status(r.status).json({ error: `Fetch failed: ${r.status}` });
    const html = await r.text();
    const $ = cheerio.load(html);

    // Try several selectors
    const candidates = [
      // 사용자 예시 패턴 및 국내 언론 공통
      'section.section_view article#articleText',
      'div.sec_body',
      'div.news_cnt_detail_wrap',
      'div#articleBody',
      'article.article-body',
      'article#articleText',
      'div#articleText',
      'div.article-body',
      'main article',
      'article'
    ];
    let $body: any | null = null;
    for (const sel of candidates) {
      const el = $(sel);
      if (el && el.length) { $body = el; break; }
    }
    if (!$body) $body = $('body');

    const base = new URL(finalUrl);
    const abs = (u?: string) => {
      if (!u) return undefined;
      try { return new URL(u, base).href; } catch { return undefined; }
    };
    const pickSrc = ($img: cheerio.Cheerio<any>) => {
      const attrs = ['src','data-src','data-original','data-lazy','data-lazy-src'];
      for (const a of attrs) {
        const v = $img.attr(a);
        if (v && v.trim()) return abs(v.trim());
      }
      const ss = ($img.attr('srcset') || $img.attr('data-srcset') || '').trim();
      if (ss) {
        // choose largest candidate
        const cands = ss.split(',').map(s => s.trim().split(' ')[0]).filter(Boolean);
        const last = cands[cands.length - 1];
        if (last) return abs(last);
      }
      return undefined;
    };

    // 이미지 추출 완전 비활성화 (저작권 문제 방지)
    const images: Array<{ src: string; alt?: string; caption?: string }> = [];
    console.log('🚫 Image extraction disabled to prevent copyright issues');

    // Sanitize text HTML: keep paragraphs and basic formatting
    const allowTags = new Set(['p','br','strong','em','b','i','figure','img','figcaption','ul','ol','li','h2','h3','blockquote']);
    const clone = $('<div></div>').append($body.clone());
    // remove noisy tags completely
    clone.find('script,style,noscript,iframe').remove();
    clone.find('*').each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      if (!tag || !allowTags.has(tag)) {
        // keep only text content for paragraphs/heads; for others drop
        if (tag && ['div','span','section','article'].includes(tag)) {
          $(el).replaceWith($(el).text());
        } else {
          $(el).remove();
        }
      } else if (tag === 'img') {
        // 모든 img 태그 제거 (저작권 문제 방지)
        $(el).remove();
      }
    });
    const textHtml = clone.html() || '';

    res.status(200).json({ images, textHtml, resolved: finalUrl });
  } catch (e: any) {
    res.status(200).json({ images: [], textHtml: '' });
  }
}


