#!/usr/bin/env ts-node

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

function normalize(s?: string | null): string { return (s || '').replace(/\s+/g, ' ').trim(); }

// Google News RSS 쿼리 빌더
function gNewsRss(query: string, hl = 'en-US', gl = 'US', ceid = 'US:en'): string {
  // 참고: https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

const queries = [
  'Seoul pop-up store',
  'Seongsu pop-up',
  'Hongdae event',
  'Seoul event festival',
  'Korea weather alert',
  'Korea subway line 2 delay',
  'Korea traffic delay',
];

async function collect(): Promise<Card[]> {
  const parser = new Parser({ timeout: 15000 });
  const out: Card[] = [];
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const monthAgoMs = monthAgo.getTime();
  for (const q of queries) {
    const url = gNewsRss(q);
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items || [];
      for (const it of items) {
        const title = normalize(it.title);
        const link = normalize(it.link);
        if (!title || !link) continue;
        const summary = normalize((it.contentSnippet as string) || (it.content as string) || it.isoDate || '');
        // 최근 1개월 이내만 수집
        const d = it.isoDate ? new Date(it.isoDate).getTime() : Date.now();
        if (!isFinite(d) || d < monthAgoMs) continue;
        out.push({
          id: makeId('issue'),
          type: 'issue',
          title,
          summary,
          tags: ['news','google','issue'],
          sources: [{ title: feed.title || 'Google News', url: link, publisher: 'Google News' }],
          lastUpdatedKST: kstNowISO(),
        });
      }
    } catch (e) {
      console.warn('Google News RSS 실패:', q, e instanceof Error ? e.message : e);
    }
  }
  return out;
}

function merge(cards: Card[]) {
  // Inbox only: 승인 전에는 today-cards.json에 병합하지 않음
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
  console.log(`✅ google issues (inbox): +${cards.length}, inbox total: ${deduped.length}`);
}

async function main() {
  const cards = await collect();
  const filtered = cards.filter(c => c.title.length > 12);
  merge(filtered);
}

main().catch((e) => { console.error('❌ collect-issues-google failed:', e); process.exit(1); });


