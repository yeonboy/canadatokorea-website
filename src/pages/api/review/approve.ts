import type { NextApiRequest, NextApiResponse } from 'next';
import cors from '../_cors';
import { translateForI18n, normalizeText } from '@/utils/translate';
import fs from 'fs';
import path from 'path';

// -------- Helpers: scoring, classification, translation --------
// moved to utils/translate

// 제목 끝의 매체명 접미사 제거(예: " - 조선일보", " - Korea JoongAng Daily")
function stripPublisherSuffix(title: string): string {
  const t = title.trim();
  const candidates = [' - ', ' — ', ' – '];
  const lastIdx = Math.max(...candidates.map((d) => t.lastIndexOf(d)));
  if (lastIdx > -1 && lastIdx >= Math.floor(t.length * 0.6)) {
    return t.slice(0, lastIdx).trim();
  }
  return t;
}

function getPrimaryDomain(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const parts = host.split('.');
    return parts.slice(-2).join('.');
  } catch {
    return '';
  }
}

const DOMAIN_TRUST_WEIGHTS: Record<string, number> = {
  'seoul.go.kr': 3.0,
  'visitkorea.or.kr': 2.5,
  'korea.net': 2.2,
  'yna.co.kr': 2.0,
  'reuters.com': 2.0,
  'koreatimes.co.kr': 1.6,
  'koreaherald.com': 1.6,
  'joongang.co.kr': 1.5,
  'chosun.com': 1.4,
  'news.google.com': 0.8
};

const KEYWORD_WEIGHTS: Record<string, number> = {
  'pop-up': 2.0, 'popup': 2.0, 'exhibition': 1.4, 'festival': 1.6, 'event': 1.2,
  'seongsu': 1.6, 'hongdae': 1.6, 'gangnam': 1.2,
  'traffic': 1.5, 'delay': 1.5, 'congestion': 1.5, 'line 2': 1.2, 'subway': 1.2,
  'weather': 1.4, 'heat': 1.1, 'rain': 1.2, 'typhoon': 1.6,
  'population': 1.0, 'density': 1.0,
  'visa': 1.2, 'topik': 1.0
};

function computeTrafficScore(card: Card): number {
  const text = `${normalizeText(card.title)} ${normalizeText(card.summary)} ${normalizeText((card.tags||[]).join(' '))}`.toLowerCase();
  let score = 1;
  for (const [kw, w] of Object.entries(KEYWORD_WEIGHTS)) {
    if (text.includes(kw)) score += w;
  }
  const primary = getPrimaryDomain(card.sources?.[0]?.url || '');
  if (primary && DOMAIN_TRUST_WEIGHTS[primary]) score += DOMAIN_TRUST_WEIGHTS[primary];
  // small bonus for geo present
  if (card.geo?.area) score += 0.5;
  return Math.round(score * 10) / 10;
}

function classifyTypeFromText(text: string, current?: Card['type']): Card['type'] {
  const t = text.toLowerCase();
  if (/(pop\-?up|popup|exhibition|store|festival|event)/.test(t)) return 'popup';
  if (/(congestion|traffic|delay|accident|line\s?\d|subway|metro|bus)/.test(t)) return 'congestion';
  if (/(weather|heat|rain|typhoon|snow|wind)/.test(t)) return 'weather';
  if (/(population|density)/.test(t)) return 'population';
  if (/(tip|guide|how\s?to|best time|avoid crowds)/.test(t)) return 'tip';
  if (/(hotspot|hot spot)/.test(t)) return 'hotspot';
  return current || 'issue';
}

function enrichGeoAreaFromText(text: string): string | undefined {
  const t = text.toLowerCase();
  if (/seongsu/.test(t) || /\uC131\uC218/.test(text)) return 'Seongsu';
  if (/hongdae/.test(t) || /\uD64D\uB300/.test(text)) return 'Hongdae';
  if (/gangnam/.test(t) || /\uAC15\uB0A8/.test(text)) return 'Gangnam';
  if (/jongno/.test(t) || /\uC885\uB85C/.test(text)) return 'Jongno';
  if (/gwangjin/.test(t) || /\uAD11\uC9C4/.test(text)) return 'Gwangjin';
  return undefined;
}

function extractTagsFromText(text: string, area?: string, type?: Card['type'], seed: string[] = []): string[] {
  const t = text.toLowerCase();
  const out = new Set<string>((seed || []).map((s) => s.toLowerCase()));
  const add = (s: string) => { if (s && !out.has(s)) out.add(s); };
  if (/(seongsu|\uC131\uC218)/.test(t)) add('seongsu');
  if (/(hongdae|\uD64D\uB300)/.test(t)) add('hongdae');
  if (/(gangnam|\uAC15\uB0A8)/.test(t)) add('gangnam');
  if (/(sinchon|\uC2E0\uCD98)/.test(t)) add('sinchon');
  if (/(jongno|\uC885\uB85C)/.test(t)) add('jongno');
  if (/(itaewon|\uC774\uD0DC\uC6D0)/.test(t)) add('itaewon');
  if (/(seoul|\uC11C\uC6B8)/.test(t)) add('seoul');
  if (/(pop-?up|popup)/.test(t)) add('popup');
  if (/(festival|exhibition|event)/.test(t)) add('festival');
  if (/(traffic|delay|congestion|subway|metro|bus|line\s?\d)/.test(t)) add('traffic');
  if (/(weather|heat|rain|typhoon|snow|wind)/.test(t)) add('weather');
  if (/(tip|guide|how\s?to)/.test(t)) add('tip');
  if (/(hotspot|hot spot)/.test(t)) add('hotspot');
  const m = t.match(/line\s?(\d)/); if (m) add(`line${m[1]}`);
  if (area) add(area.toLowerCase().replace(/\s+gu$/, '').replace(/\s+\-?dong$/, '').replace(/\s+/g, '-'));
  if (type) add(type);
  return Array.from(out).slice(0, 8);
}

function detectLang(s: string): 'ko'|'en'|'fr' {
  const hangulCount = (s.match(/[\uAC00-\uD7AF]/g) || []).length;
  const letterCount = (s.match(/[A-Za-z\uAC00-\uD7AF]/g) || []).length || 1;
  const ratio = hangulCount / letterCount;
  if (ratio >= 0.2) return 'ko';
  if (/[éèêàçùâîôëïü]/i.test(s)) return 'fr';
  return 'en';
}

async function translateLibre(q: string, source: 'en'|'ko'|'fr', target: 'en'|'ko'|'fr'): Promise<{ text: string; engine: string }> {
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  const raw = [
    process.env.LIBRETRANSLATE_URL,
    'http://127.0.0.1:5000',
    'http://localhost:5000',
    'https://libretranslate.de',
    // 추가 공개 인스턴스 (가용성 보강)
    'https://translate.astian.org',
    'https://translate.mentality.rip'
  ].filter(Boolean) as string[];
  const candidates = raw.map((u) => u.endsWith('/translate') ? u : `${u}/translate`);
  for (const url of candidates) {
    try {
      const payload: any = { q, source, target, format: 'text' };
      if (apiKey) payload.api_key = apiKey;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) continue;
      const js: any = await r.json();
      const out = normalizeText(js?.translatedText || '');
      if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: url };
      // 2차 시도: 자동 감지로 재요청
      try {
        const payload2: any = { q, source: 'auto', target, format: 'text' };
        if (apiKey) payload2.api_key = apiKey;
        const r2 = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload2)
        });
        if (r2.ok) {
          const js2: any = await r2.json();
          const out2 = normalizeText(js2?.translatedText || '');
          if (out2 && out2.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out2, engine: url };
        }
      } catch {}
    } catch {
      // try next
    }
  }
  // 최후 폴백: MyMemory (무료 공개 API)
  try {
    const mm = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${source}|${target}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (mm.ok) {
      const js: any = await mm.json();
      const out = normalizeText(js?.responseData?.translatedText || '');
      if (out && out.toLowerCase() !== normalizeText(q).toLowerCase()) return { text: out, engine: 'mymemory' };
    }
  } catch {}
  return { text: q, engine: 'none' }; // 모든 시도가 실패하면 원문 유지
}

async function addI18nOnApprove(card: Card): Promise<Card> {
  const title = stripPublisherSuffix(normalizeText(card.title));
  const summary = stripPublisherSuffix(normalizeText(card.summary));
  const langTitle = detectLang(title);
  const langSummary = detectLang(summary);
  let baseLang: 'en'|'ko'|'fr' = langTitle || langSummary || 'en';

  const out: any = { ...card };

  if (baseLang === 'ko') {
    const enTitleR = await translateLibre(title, 'ko', 'en');
    const enSummaryR = await translateLibre(summary, 'ko', 'en');
    const enTitle = enTitleR.text; const enSummary = enSummaryR.text;
    out.title = enTitle;
    out.summary = enSummary;
    const frTitleR = await translateLibre(enTitle, 'en', 'fr');
    const frSummaryR = await translateLibre(enSummary, 'en', 'fr');
    const frTitle = frTitleR.text; const frSummary = frSummaryR.text;
    out.i18n = {
      en: { title: enTitle, summary: enSummary, tags: card.tags },
      fr: { title: frTitle, summary: frSummary, tags: card.tags }
    };
  } else if (baseLang === 'fr') {
    const enTitleR = await translateLibre(title, 'fr', 'en');
    const enSummaryR = await translateLibre(summary, 'fr', 'en');
    const enTitle = enTitleR.text; const enSummary = enSummaryR.text;
    out.title = enTitle; // default 영어
    out.summary = enSummary;
    out.i18n = {
      fr: { title, summary, tags: card.tags },
      en: { title: enTitle, summary: enSummary, tags: card.tags }
    };
  } else {
    // base is English
    const frTitleR = await translateLibre(title, 'en', 'fr');
    const frSummaryR = await translateLibre(summary, 'en', 'fr');
    const frTitle = frTitleR.text; const frSummary = frSummaryR.text;
    out.i18n = {
      en: { title, summary, tags: card.tags },
      fr: { title: frTitle, summary: frSummary, tags: card.tags }
    };
  }
  return out as Card;
}

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
};

const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');
const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
const weekFile = path.join(process.cwd(), 'content', 'data', 'week-cards.json');

function loadJson<T>(file: string, fallback: T): T {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function saveJson(file: string, data: any) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { id } = req.body || {};
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  const inbox: Card[] = loadJson<Card[]>(inboxFile, []);
  const data: Card[] = loadJson<Card[]>(dataFile, []);
  const weekData: Card[] = loadJson<Card[]>(weekFile, []);

  const idx = inbox.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  let card = inbox[idx];
  // 승인 마킹
  (card as any).approved = true;
  (card as any).approvedAt = new Date().toISOString();

  // 분류/스코어/지역 보강
  const baseText = `${card.title} ${card.summary}`;
  const inferredType = classifyTypeFromText(baseText, card.type);
  // geo 보정: 좌표가 없고 area만 있는 경우 유지, 아예 geo가 없으면 null이 아닌 객체로 통일
  const area = card.geo?.area || enrichGeoAreaFromText(baseText);
  const baseGeo = card.geo && (typeof (card as any).geo === 'object') ? (card.geo as any) : {};
  const geo = { lat: Number.isFinite((baseGeo as any).lat) ? baseGeo.lat : undefined, lng: Number.isFinite((baseGeo as any).lng) ? baseGeo.lng : undefined, area };
  const score = computeTrafficScore(card);
  const tags = extractTagsFromText(baseText, area, inferredType, card.tags || []);
  card = { ...card, type: inferredType, geo, score, tags } as any;

  // 승인만 하고 inbox에 유지 (GPT 생성을 위해)
  inbox[idx] = card;
  saveJson(inboxFile, inbox);
  
  res.status(200).json({ 
    ok: true, 
    approvedId: id, 
    card: card,
    message: 'Item approved. Ready for GPT content generation.' 
  });
}


