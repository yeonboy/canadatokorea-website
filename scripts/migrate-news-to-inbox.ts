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

const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');

function loadJson<T>(file: string, fallback: T): T {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}

function saveJson(file: string, data: any) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isNoisyNews(card: Card): boolean {
  const title = (card.title || '').toLowerCase();
  const tags = card.tags || [];
  const publishers = (card.sources || []).map(s => (s.publisher || '').toLowerCase());
  const urls = (card.sources || []).map(s => (s.url || '').toLowerCase());

  const keywordHit = /politic|government|president|election|econom|inflation|stock|finance|trade|sanction|parliament|assembly|tax|budget|crime|police|prosecutor|court|lawsuit|strike|union/.test(title);
  const googleHit = publishers.includes('google news') || urls.some(u => u.includes('news.google.com'));
  const tagHit = tags.some(t => ['news', 'google'].includes((t || '').toLowerCase()));
  const isIssue = card.type === 'issue';
  return isIssue && (googleHit || tagHit || keywordHit);
}

function main() {
  const all: Card[] = loadJson<Card[]>(dataFile, []);
  const inbox: Card[] = loadJson<Card[]>(inboxFile, []);

  const keep: Card[] = [];
  const moved: Card[] = [];

  for (const c of all) {
    if (isNoisyNews(c)) moved.push(c); else keep.push(c);
  }

  // inbox에 합치되 제목+타입 중복 제거
  const merged = [...inbox, ...moved];
  const seen = new Set<string>();
  const deduped: Card[] = [];
  for (const c of merged) {
    const k = `${c.type}:${c.title}`;
    if (!seen.has(k)) { seen.add(k); deduped.push(c); }
  }

  saveJson(dataFile, keep);
  saveJson(inboxFile, deduped);
  console.log(`✅ moved noisy news to inbox: ${moved.length}, kept: ${keep.length}, inbox total: ${deduped.length}`);
}

main();


