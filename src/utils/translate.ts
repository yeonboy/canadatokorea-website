export type Lang = 'en'|'ko'|'fr';

export function normalizeText(s: unknown): string {
  return (typeof s === 'string' ? s : '').replace(/\s+/g, ' ').trim();
}

export function detectLang(s: string): Lang {
  const hangulCount = (s.match(/[\uAC00-\uD7AF]/g) || []).length;
  const letters = (s.match(/[A-Za-z\uAC00-\uD7AF]/g) || []).length || 1;
  const ratio = hangulCount / letters;
  if (ratio >= 0.2) return 'ko';
  if (/[éèêàçùâîôëïü]/i.test(s)) return 'fr';
  return 'en';
}

export async function translateSmart(q: string, source: Lang, target: Lang): Promise<{ text: string; engine: string }> {
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  const baseCandidates = [
    process.env.LIBRETRANSLATE_URL,
    'http://127.0.0.1:5000',
    'http://localhost:5000',
    'https://libretranslate.de',
    'https://translate.astian.org',
    'https://translate.mentality.rip'
  ].filter(Boolean) as string[];
  const candidates = baseCandidates.map((u) => (u.endsWith('/translate') ? u : `${u}/translate`));
  const payload = (s: Lang) => {
    const p: any = { q, source: s, target, format: 'text' };
    if (apiKey) p.api_key = apiKey; return p;
  };
  for (const url of candidates) {
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload(source)) });
      if (r.ok) {
        const js: any = await r.json();
        const out = normalizeText(js?.translatedText || '');
        if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: url };
      }
      // retry with auto
      const r2 = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload('en')) });
      if (r2.ok) {
        const js2: any = await r2.json();
        const out2 = normalizeText(js2?.translatedText || '');
        if (out2 && out2.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out2, engine: url };
      }
    } catch {}
  }
  // MyMemory fallback
  try {
    const mm = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${source}|${target}`);
    if (mm.ok) {
      const js: any = await mm.json();
      const out = normalizeText(js?.responseData?.translatedText || '');
      if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: 'mymemory' };
    }
  } catch {}
  return { text: q, engine: 'none' };
}

export async function translateForI18n(title: string, summary: string) {
  const t = normalizeText(title); const s = normalizeText(summary);
  const base = detectLang(t || s || '');
  if (base === 'ko') {
    const enT = (await translateSmart(t, 'ko', 'en')).text;
    const enS = (await translateSmart(s, 'ko', 'en')).text;
    const frT = (await translateSmart(enT, 'en', 'fr')).text;
    const frS = (await translateSmart(enS, 'en', 'fr')).text;
    return { base, i18n: { en: { title: enT, summary: enS }, fr: { title: frT, summary: frS } }, title: enT, summary: enS };
  }
  if (base === 'fr') {
    const enT = (await translateSmart(t, 'fr', 'en')).text;
    const enS = (await translateSmart(s, 'fr', 'en')).text;
    return { base, i18n: { fr: { title: t, summary: s }, en: { title: enT, summary: enS } }, title: enT, summary: enS };
  }
  const frT = (await translateSmart(t, 'en', 'fr')).text;
  const frS = (await translateSmart(s, 'en', 'fr')).text;
  return { base, i18n: { en: { title: t, summary: s }, fr: { title: frT, summary: frS } }, title: t, summary: s };
}


