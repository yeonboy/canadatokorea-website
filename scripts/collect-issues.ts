#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

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

const rssFeeds: { url: string; publisher: string; title?: string }[] = [
  // 한국 정부 공식 포털 (영문)
  { url: 'https://www.korea.net/rss/rss.xml?cid=1365', publisher: 'Korea.net' },
  // 서울시 영문 공지/뉴스
  { url: 'https://english.seoul.go.kr/feed/', publisher: 'Seoul Metropolitan Government' },
  // 문화체육관광부 보도자료(RSS)
  { url: 'https://www.mcst.go.kr/kor/s_notice/press/rss.jsp', publisher: 'MCST' },
  // 기상청 중기예보 RSS(수도권)
  { url: 'https://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=109', publisher: 'KMA' },
  // 서울시 전체 뉴스 RSS (가용시)
  { url: 'https://news.seoul.go.kr/gov/rss/all', publisher: 'SMG' },
];

const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');

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

async function collectFeeds(feeds: { url: string; publisher: string; type?: Card['type'] }[]): Promise<any[]> {
  const parser = new Parser({ timeout: 15000 });
  const items: any[] = [];
  for (const f of feeds) {
    try {
      const feed = await parser.parseURL(f.url);
      (feed.items || []).forEach((it) => items.push({ it, publisher: f.publisher, feedTitle: feed.title, type: f.type }));
    } catch {}
  }
  return items;
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

function balanceAndFilterLastDays(cards: any[], days: number, desiredPerType: number): any[] {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromMs = from.getTime();

  const byType: Record<string, any[]> = {};
  for (const c of cards) {
    const ts = c.isoDate ? new Date(c.isoDate).getTime() : Date.now();
    if (!isFinite(ts) || ts < fromMs) continue;
    const t = c.type || 'issue';
    (byType[t] ||= []).push(c);
  }
  const out: any[] = [];
  for (const [t, arr] of Object.entries(byType)) {
    arr.sort(() => Math.random() - 0.5);
    out.push(...arr.slice(0, desiredPerType));
  }
  return out;
}

async function main() {
  // Google News typed queries (balanced by type)
  const enc = encodeURIComponent;
  const gFeeds = [
    { q: 'Seoul pop-up OR popup OR exhibition', type: 'popup' as const },
    { q: 'Seoul traffic OR congestion OR delay OR subway OR metro', type: 'congestion' as const },
    { q: 'Seoul weather OR heat OR rain OR typhoon', type: 'weather' as const },
    { q: 'Seoul hotspot OR "hot place" OR festival', type: 'hotspot' as const },
    { q: 'Seoul travel tip OR guide OR how to', type: 'tip' as const },
    { q: 'Seoul news -politics -election -economy -finance -stock -parliament', type: 'issue' as const }
  ].map((gf) => ({ url: `https://news.google.com/rss/search?q=${enc(gf.q)}&hl=en-US&gl=US&ceid=US:en`, publisher: 'Google News', type: gf.type }));

  const feeds = gFeeds;

  const items = await collectFeeds(feeds);

  const mapped = items.map(({ it, publisher, feedTitle, type }) => {
    const title = normalize(it.title);
    const summary = normalize((it.contentSnippet as string) || (it.content as string) || it.isoDate || '');
    const initType = type || 'issue';
    const finalType = classifyTypeFromText(`${title} ${summary}`, initType as any);
    return {
      type: finalType,
      title,
      summary,
      isoDate: it.isoDate,
      source: { title: feedTitle || publisher, url: normalize(it.link), publisher }
    };
  }).filter((m) => m.title && m.source.url);

  // balance by type, last 7 days (this week)
  const selected = balanceAndFilterLastDays(mapped, 7, 15);

  // write to inbox only
  let inbox: any[] = [];
  try { inbox = JSON.parse(fs.readFileSync(inboxFile, 'utf8')); } catch {}
  async function enrichGeo(m: any): Promise<{ area?: string; lat?: number; lng?: number }> {
    try {
      const r = await fetch(m.source.url, { headers: { 'user-agent': 'ca.korea collector/1.0' } });
      if (!r.ok) return {};
      const html = await r.text();
      const $ = cheerio.load(html);
      const text = $('body').text().slice(0, 20000).toLowerCase();
      
      // 확장된 지역 사전 (한글명 + 영문명 + 좌표)
      const locations = [
        // 서울 주요 지역
        { names: ['seongsu', '성수', '성수동'], area: 'Seongsu-dong', lat: 37.5447, lng: 127.0557 },
        { names: ['hongdae', '홍대', '홍익대'], area: 'Hongdae', lat: 37.5563, lng: 126.9233 },
        { names: ['gangnam', '강남', '강남역'], area: 'Gangnam', lat: 37.4979, lng: 127.0276 },
        { names: ['itaewon', '이태원'], area: 'Itaewon', lat: 37.5344, lng: 126.9943 },
        { names: ['myeongdong', '명동'], area: 'Myeong-dong', lat: 37.5636, lng: 126.9816 },
        { names: ['jamsil', '잠실'], area: 'Jamsil', lat: 37.5133, lng: 127.1000 },
        { names: ['yeouido', '여의도'], area: 'Yeouido', lat: 37.5219, lng: 126.9245 },
        { names: ['apgujeong', '압구정'], area: 'Apgujeong', lat: 37.5274, lng: 127.0417 },
        { names: ['jongno', '종로'], area: 'Jongno', lat: 37.5735, lng: 126.9788 },
        { names: ['ikseon', '익선동'], area: 'Ikseon-dong', lat: 37.5714, lng: 126.9923 },
        { names: ['yeonnam', '연남동'], area: 'Yeonnam-dong', lat: 37.5635, lng: 126.9254 },
        { names: ['hannam', '한남동'], area: 'Hannam-dong', lat: 37.5345, lng: 127.0023 },
        { names: ['cheongdam', '청담동'], area: 'Cheongdam-dong', lat: 37.5237, lng: 127.0473 },
        { names: ['samcheong', '삼청동'], area: 'Samcheong-dong', lat: 37.5862, lng: 126.9815 },
        { names: ['insadong', '인사동'], area: 'Insadong', lat: 37.5714, lng: 126.9858 },
        { names: ['dongdaemun', '동대문'], area: 'Dongdaemun', lat: 37.5663, lng: 127.0092 },
        { names: ['sinchon', '신촌'], area: 'Sinchon', lat: 37.5596, lng: 126.9370 },
        { names: ['ewha', '이대', '이화여대'], area: 'Ewha Womans University', lat: 37.5596, lng: 126.9463 },
        { names: ['kondae', '건대', '건국대'], area: 'Konkuk University', lat: 37.5412, lng: 127.0734 },
        { names: ['hapjeong', '합정'], area: 'Hapjeong', lat: 37.5496, lng: 126.9139 },
        { names: ['mapo', '마포'], area: 'Mapo', lat: 37.5663, lng: 126.9019 },
        { names: ['ttukseom', '뚝섬'], area: 'Ttukseom', lat: 37.5304, lng: 127.0661 },
        
        // 서울 외곽 및 기타 도시
        { names: ['busan', '부산'], area: 'Busan', lat: 35.1796, lng: 129.0756 },
        { names: ['gyeongju', '경주'], area: 'Gyeongju', lat: 35.8562, lng: 129.2247 },
        { names: ['jeju', '제주'], area: 'Jeju', lat: 33.4996, lng: 126.5312 },
        { names: ['incheon', '인천'], area: 'Incheon', lat: 37.4563, lng: 126.7052 },
        { names: ['suwon', '수원'], area: 'Suwon', lat: 37.2636, lng: 127.0286 },
        
        // 일반적인 서울 언급
        { names: ['seoul', '서울', 'seoul city'], area: 'Seoul', lat: 37.5665, lng: 126.9780 }
      ];
      
      // 지역명 매칭 (우선순위: 구체적인 동네 > 일반적인 지역)
      for (const location of locations) {
        for (const name of location.names) {
          if (text.includes(name)) {
            return { 
              area: location.area, 
              lat: location.lat, 
              lng: location.lng 
            };
          }
        }
      }
      
      // 제목이나 요약에서 지역명 추출 시도
      const titleText = (m.title + ' ' + m.summary).toLowerCase();
      for (const location of locations) {
        for (const name of location.names) {
          if (titleText.includes(name)) {
            return { 
              area: location.area, 
              lat: location.lat, 
              lng: location.lng 
            };
          }
        }
      }
      
    } catch (error: any) {
      console.warn('Geo enrichment failed:', error?.message || error);
    }
    return {};
  }

  const toCards = await Promise.all(selected.map(async (m) => {
    const geo = await enrichGeo(m);
    return {
      id: makeId('issue'),
      type: m.type || 'issue',
      title: m.title,
      summary: m.summary,
      tags: [m.type || 'issue','google'],
      geo: (geo.area || geo.lat) ? { area: geo.area, lat: geo.lat, lng: geo.lng } : undefined,
      sources: [m.source],
      lastUpdatedKST: kstNowISO()
    } as any;
  }));

  const merged = [...toCards, ...inbox];
  const seen = new Set<string>();
  const deduped: any[] = [];
  for (const c of merged) {
    const k = `${c.type}:${c.title}`;
    if (!seen.has(k)) { seen.add(k); deduped.push(c); }
  }
  fs.mkdirSync(path.dirname(inboxFile), { recursive: true });
  fs.writeFileSync(inboxFile, JSON.stringify(deduped, null, 2));
  console.log(`✅ inbox appended: +${toCards.length}, inbox total: ${deduped.length}`);
}

main().catch((e) => { console.error('❌ collect-issues failed:', e); process.exit(1); });


