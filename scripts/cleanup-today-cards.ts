#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

type Card = { id: string } & Record<string, any>;

const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');

function load<T>(p: string, fallback: T): T {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function save(p: string, data: any) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function main() {
  const all: Card[] = load<Card[]>(dataFile, []);
  // Keep only curated sample cards: ids starting with "card-" (샘플 데이터 규칙)
  const kept = all.filter((c) => typeof c.id === 'string' && c.id.startsWith('card-'));
  save(dataFile, kept);
  console.log(`✅ today-cards cleaned. kept=${kept.length}, removed=${all.length - kept.length}`);
}

main();


