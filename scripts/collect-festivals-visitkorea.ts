#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

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

const LIST_URL = 'https://korean.visitkorea.or.kr/kfes/list/wntyFstvlList.do';

function kstNowISO(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kst = new Date(utc + 9 * 3600000);
  return kst.toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(s = ''): string { return s.replace(/\s+/g, ' ').trim(); }

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'ca.korea/1.0 (+https://ca.korea)' } });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return await res.text();
}

async function collect(): Promise<Card[]> {
  const html = await fetchHtml(LIST_URL);
  const $ = cheerio.load(html);
  const out: Card[] = [];

  // 페이지 구조가 수시로 바뀔 수 있어 넉넉히 셀렉터 탐색
  const text = $('body').text();
  const previewBlocks: { title: string; period: string; area: string }[] = [];

  // 본문 예시에 등장하는 3개 항목 패턴 추출 시도 (fallback)
  const candidates = text.match(/([가-힣A-Za-z0-9·\s]+)\s+\d{4}\.[01]\d\.[0-3]\d\s~\s\d{4}\.[01]\d\.[0-3]\d\s+[가-힣A-Za-z\s]+/g) || [];
  for (const c of candidates) {
    const m = c.match(/^(.*?)\s(\d{4}\.[01]\d\.[0-3]\d\s~\s\d{4}\.[01]\d\.[0-3]\d)\s(.*)$/);
    if (m) previewBlocks.push({ title: normalize(m[1]), period: normalize(m[2]), area: normalize(m[3]) });
  }

  // DOM 기반 추출: 카드/리스트 아이템 탐색
  $('a, li, div').each((_: number, el: any) => {
    const t = normalize($(el).text());
    // 제목 + 기간 + 지역 형태로 보이는 텍스트만 후보
    const m = t.match(/^(.*?)(\d{4}\.[01]\d\.[0-3]\d\s~\s\d{4}\.[01]\d\.[0-3]\d)\s([가-힣A-Za-z\s]+)$/);
    if (m) {
      previewBlocks.push({ title: normalize(m[1]), period: normalize(m[2]), area: normalize(m[3]) });
    }
  });

  // 중복 제거
  const seen = new Set<string>();
  const items = previewBlocks.filter((b) => {
    const key = `${b.title}|${b.period}|${b.area}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return b.title.length >= 4 && /\d{4}\./.test(b.period);
  }).slice(0, 100);

  for (const it of items) {
    const card: Card = {
      id: makeId('popup'),
      type: 'popup',
      title: it.title,
      summary: `${it.area} · ${it.period}`,
      tags: ['festival','event','visitkorea'],
      geo: { area: it.area },
      period: null,
      sources: [{ title: 'VisitKorea Festivals', url: LIST_URL, publisher: 'KTO' }],
      lastUpdatedKST: kstNowISO(),
    };
    out.push(card);
  }
  return out;
}

function merge(cards: Card[]) {
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  let existing: Card[] = [];
  try { existing = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  const merged = [...existing, ...cards];
  const seen = new Set<string>();
  const deduped: Card[] = [];
  for (const c of merged) {
    const key = `${c.type}:${c.title}`;
    if (!seen.has(key)) { seen.add(key); deduped.push(c); }
  }
  deduped.sort((a, b) => new Date(b.lastUpdatedKST).getTime() - new Date(a.lastUpdatedKST).getTime());
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(deduped, null, 2));
  console.log(`✅ visitkorea festivals: +${cards.length}, total: ${deduped.length}`);
}

async function main() {
  const cards = await collect();
  merge(cards);
}

main().catch((e) => { console.error('❌ collect-festivals-visitkorea failed:', e); process.exit(1); });


