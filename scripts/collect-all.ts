#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

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

async function safeFetchJson(url: string): Promise<any | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const t = await r.text();
    try { return JSON.parse(t); } catch { return null; }
  } catch { return null; }
}

function kstNowISO(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60) * 60000 - now.getTimezoneOffset() * 60000);
  return kst.toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

// 1) 공개 RSS/기관 뉴스 (간단 mock + 확장 포인트)
async function collectRssIssues(): Promise<Card[]> {
  const sources: Source[] = [
    { title: 'Korea Tourism News', url: 'https://example.kto.go.kr/rss', publisher: 'KTO' },
    { title: 'Seoul City News', url: 'https://example.seoul.go.kr/rss', publisher: 'SMG' }
  ];
  const items: Card[] = [];
  for (const s of sources) {
    items.push({
      id: makeId('issue'),
      type: 'issue',
      title: `Latest update from ${s.publisher}`,
      summary: 'Auto-collected headline for Real Korea Now (placeholder)',
      tags: ['news'],
      sources: [s],
      lastUpdatedKST: kstNowISO()
    } as Card);
  }
  return items;
}

// 2) 서울시/지자체 팝업·행사 (공개 데이터 포인트: mock + 확장)
async function collectPopups(): Promise<Card[]> {
  const list = [
    { title: 'Seongsu Pop-up', area: 'Seongsu', start: '2025-09-14', end: '2025-09-20' },
    { title: 'Hongdae Live Event', area: 'Hongdae', start: '2025-09-16', end: '2025-09-18' }
  ];
  return list.map((e) => ({
    id: makeId('popup'),
    type: 'popup',
    title: e.title,
    summary: `${e.area} · ${e.start}~${e.end}`,
    tags: ['popup','event'],
    geo: { area: e.area },
    period: { start: e.start, end: e.end },
    sources: [{ title: 'Seoul Open Data', url: 'https://data.seoul.go.kr', publisher: 'Seoul' }],
    lastUpdatedKST: kstNowISO()
  }));
}

// 3) 교통/인구 (실제 API 키 없을 시 graceful mock)
async function collectTrafficAndPopulation(): Promise<Card[]> {
  const out: Card[] = [];
  const host = 'http://localhost:3000';
  const updates = await safeFetchJson(`${host}/api/rkn/updates?area=서울특별시&ts=${Date.now()}`);
  if (updates?.traffic?.items?.length) {
    for (const it of updates.traffic.items.slice(0, 10)) {
      out.push({
        id: makeId('congestion'),
        type: 'congestion',
        title: it.title || 'Traffic update',
        summary: it.summary || `Congestion ${Math.round(it.severity || 0)}`,
        tags: ['traffic'],
        geo: it.geo || null,
        sources: [{ title: 'Seoul TOPIS', url: 'https://topis.seoul.go.kr', publisher: 'TOPIS' }],
        lastUpdatedKST: kstNowISO()
      });
    }
  }
  if (updates?.population?.items?.length) {
    for (const it of updates.population.items.slice(0, 10)) {
      out.push({
        id: makeId('population'),
        type: 'population',
        title: it.title || 'Population update',
        summary: `Density ${Math.round(it.density || 0)}`,
        tags: ['population'],
        geo: it.geo || null,
        sources: [{ title: 'Seoul TOPIS', url: 'https://topis.seoul.go.kr', publisher: 'TOPIS' }],
        lastUpdatedKST: kstNowISO()
      });
    }
  }
  return out;
}

// 4) 생활 팁 (로컬 LLM/규칙 기반 생성 포인트)
async function collectTips(): Promise<Card[]> {
  const tips = [
    { title: 'T-money recharge', summary: 'Recharge at convenience stores or stations, get transfer discounts.' },
    { title: 'Subway peak hours', summary: 'Avoid 7:30–9:00 and 18:00–19:30 for Line 2 and 9.' }
  ];
  return tips.map((t) => ({
    id: makeId('tip'),
    type: 'tip',
    title: t.title,
    summary: t.summary,
    tags: ['tip'],
    sources: [{ title: 'Real Korea Tips', url: 'https://ca.korea.com', publisher: 'ca.korea' }],
    lastUpdatedKST: kstNowISO()
  }));
}

async function main() {
  const cards: Card[] = [];
  const batches = await Promise.all([
    collectRssIssues(),
    collectPopups(),
    collectTrafficAndPopulation(),
    collectTips()
  ]);
  batches.forEach((b) => cards.push(...b));

  // 기존 파일 로드 및 병합
  const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  let existing: Card[] = [];
  try {
    existing = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch {}

  const merged = [...existing, ...cards];
  // 중복 간단 제거 (제목+타입)
  const keySet = new Set<string>();
  const deduped: Card[] = [];
  for (const c of merged) {
    const k = `${c.type}:${c.title}`;
    if (!keySet.has(k)) {
      keySet.add(k);
      deduped.push(c);
    }
  }

  // 최근순 정렬
  deduped.sort((a, b) => new Date(b.lastUpdatedKST).getTime() - new Date(a.lastUpdatedKST).getTime());

  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(deduped, null, 2));
  console.log(`✅ Collected ${cards.length} new entries, total ${deduped.length}`);
}

main().catch((e) => {
  console.error('❌ collect-all failed:', e);
  process.exit(1);
});


