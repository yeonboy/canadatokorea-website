/*
  Re-translate existing cards in content/data/today-cards.json where fr equals en or i18n missing.
  - Uses same translate fallback chain as API: LIBRETRANSLATE_URL → local → libretranslate.de → astian → mentality → MyMemory
  - Run:  npm run fix-translations
*/

import fs from 'fs';
import path from 'path';
import { translateForI18n } from '@/utils/translate';

type Lang = 'en'|'ko'|'fr';

type Source = { title: string; url: string; publisher: string };
type Card = {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  tags: string[];
  geo?: { lat?: number; lng?: number; area?: string } | null;
  period?: { start: string; end: string } | null;
  sources: Source[];
  lastUpdatedKST: string;
  i18n?: {
    en?: { title: string; summary: string; tags?: string[] };
    fr?: { title: string; summary: string; tags?: string[] };
  };
};

function normalizeText(s: unknown): string {
  return (typeof s === 'string' ? s : '').replace(/\s+/g, ' ').trim();
}

function detectLang(s: string): Lang {
  const hangulCount = (s.match(/[\uAC00-\uD7AF]/g) || []).length;
  const letterCount = (s.match(/[A-Za-z\uAC00-\uD7AF]/g) || []).length || 1;
  const ratio = hangulCount / letterCount;
  if (ratio >= 0.2) return 'ko';
  if (/[éèêàçùâîôëïü]/i.test(s)) return 'fr';
  return 'en';
}

async function translateChain(q: string, source: Lang, target: Lang): Promise<{ text: string; engine: string }> {
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  const raw = [
    process.env.LIBRETRANSLATE_URL,
    'http://127.0.0.1:5000',
    'http://localhost:5000',
    'https://libretranslate.de',
    'https://translate.astian.org',
    'https://translate.mentality.rip'
  ].filter(Boolean) as string[];
  const candidates = raw.map((u) => (u!.endsWith('/translate') ? u! : `${u}/translate`));
  for (const url of candidates) {
    try {
      const payload: any = { q, source, target, format: 'text' };
      if (apiKey) payload.api_key = apiKey;
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) continue;
      const js: any = await r.json();
      const out = normalizeText(js?.translatedText || '');
      if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: url };
      // retry with auto
      const payload2: any = { q, source: 'auto', target, format: 'text' };
      if (apiKey) payload2.api_key = apiKey;
      const r2 = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload2) });
      if (r2.ok) {
        const js2: any = await r2.json();
        const out2 = normalizeText(js2?.translatedText || '');
        if (out2 && out2.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out2, engine: url };
      }
    } catch {}
  }
  // MyMemory fallback
  try {
    const mm = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${source}|${target}`, { headers: { 'Accept': 'application/json' } });
    if (mm.ok) {
      const js: any = await mm.json();
      const out = normalizeText(js?.responseData?.translatedText || '');
      if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: 'mymemory' };
    }
  } catch {}
  return { text: q, engine: 'none' };
}

async function main() {
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  const raw = fs.readFileSync(file, 'utf8');
  const cards: Card[] = JSON.parse(raw);

  let changed = 0;

  for (let i = 0; i < cards.length; i += 1) {
    const c = cards[i];
    const title = normalizeText(c.title);
    const summary = normalizeText(c.summary);
    const base: Lang = detectLang(title || summary);

    const tr = await translateForI18n(title, summary);
    const enTitle = tr.i18n.en.title; const enSummary = tr.i18n.en.summary;
    const frTitle = tr.i18n.fr.title; const frSummary = tr.i18n.fr.summary;

    const needFix = !c.i18n || !c.i18n.fr || normalizeText(c.i18n.fr.title) === normalizeText(enTitle);
    if (needFix) {
      (c as any).i18n = { en: { title: enTitle, summary: enSummary, tags: c.tags }, fr: { title: frTitle, summary: frSummary, tags: c.tags } };
      // ensure default title is English
      (c as any).title = enTitle;
      (c as any).summary = enSummary;
      changed += 1;
      // gentle delay to reduce rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (changed > 0) {
    fs.writeFileSync(file, JSON.stringify(cards, null, 2));
  }
  console.log(`fix-translations done. changed: ${changed}`);
}

main().catch((e) => { console.error(e); process.exit(1); });


