#!/usr/bin/env ts-node

/**
 * Collect trending Korea topics for this week from public sources
 * - PandaRank (keywords only) → used to seed Google News RSS queries
 * - Google News RSS (ko-KR) for recent 7 days
 * - Targets topics popular with foreigners: pop-ups, hotspots, traffic, weather, tips
 *
 * Output: content/data/inbox.json (append + dedupe by type:title)
 */

import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

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

function kstNowISO(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600000);
  return kst.toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(s?: string | null): string {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function gNewsRss(query: string, hl = 'ko-KR', gl = 'KR', ceid = 'KR:ko'): string {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

async function fetchPandaRankKeywords(limit = 20): Promise<string[]> {
  try {
    const res = await fetch('https://pandarank.co.kr/');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    const out: string[] = [];
    // Heuristic selectors
    $('a').each((_, el) => {
      const txt = normalize($(el).text());
      if (txt && txt.length <= 25 && /^[가-힣a-zA-Z0-9\s#&+-]+$/.test(txt)) {
        out.push(txt);
      }
    });
    // Deduplicate & slice
    const unique = Array.from(new Set(out));
    return unique.slice(0, limit);
  } catch (e) {
    console.warn('⚠️ PandaRank fetch failed:', (e as Error).message);
    return [];
  }
}

function classifyFromTitle(title: string): Card['type'] {
  const t = title.toLowerCase();
  if (t.includes('팝업') || t.includes('popup')) return 'popup';
  if (t.includes('지연') || t.includes('혼잡') || t.includes('교통') || t.includes('traffic')) return 'congestion';
  if (t.includes('날씨') || t.includes('한파') || t.includes('폭우') || t.includes('폭염') || t.includes('weather')) return 'weather';
  if (t.includes('핫플') || t.includes('성수') || t.includes('홍대') || t.includes('인기') || t.includes('hotspot')) return 'hotspot';
  if (t.includes('팁') || t.includes('tip') || t.includes('가이드') || t.includes('guide')) return 'tip';
  return 'issue';
}

async function collect(): Promise<Card[]> {
  const parser = new Parser({ timeout: 15000 });
  const out: Card[] = [];

  const baseQueries = [
    // KR
    '성수 팝업', '홍대 팝업', '더현대 서울 팝업', '잠실 팝업', '한남 핫플', '서울 핫플',
    '지하철 지연', '2호선 지연', '서울 교통 혼잡', '김포공항 혼잡', '인천공항 혼잡',
    '한파 특보', '폭우 특보', '미세먼지 경보',
    '외국인 관광 한국', '한국 비자 안내', '원 달러 환율',
    // EN (for foreign media)
    'Seoul pop-up', 'Seongsu pop-up', 'Hongdae pop-up', 'Seoul traffic delay', 'Korea weather alert',
  ];

  const trending = await fetchPandaRankKeywords(20);
  const queries = Array.from(new Set([...trending, ...baseQueries]));

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoMs = weekAgo.getTime();

  for (const q of queries) {
    const url = gNewsRss(q);
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items || [];
      for (const it of items) {
        const title = normalize(it.title);
        const link = normalize((it.link as string) || '');
        if (!title || !link) continue;
        const summary = normalize((it.contentSnippet as string) || (it.content as string) || it.isoDate || '');
        const d = it.isoDate ? new Date(it.isoDate).getTime() : Date.now();
        if (!isFinite(d) || d < weekAgoMs) continue; // last 7 days only
        const type = classifyFromTitle(title);
        out.push({
          id: makeId(type),
          type,
          title,
          summary,
          tags: ['trend','google','ko'],
          sources: [{ title: feed.title || 'Google News', url: link, publisher: 'Google News' }],
          lastUpdatedKST: kstNowISO(),
        });
      }
    } catch (e) {
      console.warn('RSS failed:', q, (e as Error).message);
    }
  }
  return out;
}

function merge(cards: Card[]) {
  const file = path.join(process.cwd(), 'content', 'data', 'inbox.json');
  let existing: Card[] = [];
  try { existing = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  const merged = [...cards, ...existing];
  const seen = new Set<string>();
  const deduped: Card[] = [];
  for (const c of merged) {
    const key = `${c.type}:${c.title}`;
    if (!seen.has(key)) { seen.add(key); deduped.push(c); }
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(deduped, null, 2));
  console.log(`✅ trending collected: +${cards.length} (inbox total: ${deduped.length})`);
}

async function main() {
  const cards = await collect();
  const filtered = cards.filter(c => c.title.length > 8);
  merge(filtered);
}

main().catch((e) => { console.error('❌ collect-trending-korea failed:', e); process.exit(1); });


