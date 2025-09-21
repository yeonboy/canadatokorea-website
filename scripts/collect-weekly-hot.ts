#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import fetch from 'node-fetch';
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
  score?: number;
};

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

async function collectFeeds(feeds: { url: string; publisher: string }[]): Promise<any[]> {
  const parser = new Parser({ timeout: 15000 });
  const items: any[] = [];
  for (const f of feeds) {
    try {
      const feed = await parser.parseURL(f.url);
      (feed.items || []).forEach((it) => items.push({ it, publisher: f.publisher, feedTitle: feed.title }));
    } catch {}
  }
  return items;
}

function computeScore(title: string, summary: string, publisher?: string): number {
  const text = `${title} ${summary}`.toLowerCase();
  let score = 1;
  const kw: Record<string, number> = {
    'pop-up': 2.0, popup: 2.0, exhibition: 1.6, festival: 1.6, event: 1.2,
    seongsu: 1.6, hongdae: 1.6, gangnam: 1.2, itaewon: 1.2, jamsil: 1.0,
    traffic: 1.5, delay: 1.5, congestion: 1.5, subway: 1.2, 'line 2': 1.1,
  };
  for (const [k, w] of Object.entries(kw)) { if (text.includes(k)) score += w; }
  const DOMAIN_WEIGHTS: Record<string, number> = { 'reuters.com': 2.0, 'yna.co.kr': 2.0, 'visitkorea.or.kr': 2.0, 'korea.net': 2.0 };
  try { const u = new URL(publisher || ''); const host = u.hostname.split('.').slice(-2).join('.'); if (DOMAIN_WEIGHTS[host]) score += DOMAIN_WEIGHTS[host]; } catch {}
  return Math.round(score * 10) / 10;
}

async function enrichGeo(url: string): Promise<{ area?: string; lat?: number; lng?: number }> {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'ca.korea weekly-collector/1.0' } });
    if (!r.ok) return {};
    const html = await r.text();
    const $ = cheerio.load(html);
    const text = $('body').text().slice(0, 20000).toLowerCase();
    
    // 확장된 지역 사전 (collect-issues.ts와 동일)
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
    
    // 지역명 매칭
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
    
  } catch (error: any) {
    console.warn('Geo enrichment failed:', error?.message || error);
  }
  return {};
}

function classifyTypeFromText(text: string): Card['type'] {
  const t = text.toLowerCase();
  if (/(pop\-?up|popup|exhibition|store|festival|event)/.test(t)) return 'popup';
  if (/(congestion|traffic|delay|accident|line\s?\d|subway|metro|bus)/.test(t)) return 'congestion';
  if (/(weather|heat|rain|typhoon|snow|wind)/.test(t)) return 'weather';
  if (/(population|density)/.test(t)) return 'population';
  if (/(tip|guide|how\s?to|best time|avoid crowds)/.test(t)) return 'tip';
  if (/(hotspot|hot spot)/.test(t)) return 'hotspot';
  return 'issue';
}

async function main() {
  const q = (s: string) => encodeURIComponent(s);
  const GN_EN = (query: string) => `https://news.google.com/rss/search?q=${q(query)}&hl=en-US&gl=US&ceid=US:en`;
  const GN_KO = (query: string) => `https://news.google.com/rss/search?q=${q(query)}&hl=ko&gl=KR&ceid=KR:ko`;
  const topicQueries: Record<Card['type'], string[]> = {
    issue: [
      "Korea news Seoul culture OR policy OR trend",
      "Seoul trend Korea headline site:reuters.com OR site:koreaherald.com OR site:koreatimes.co.kr",
      "한국 뉴스 이슈 서울",
      "서울 트렌드 뉴스",
    ],
    popup: [
      "Seoul pop-up store OR exhibition OR festival",
      "Seongsu pop-up OR event",
      "Hongdae festival OR concert",
      "Gangnam event OR exhibition",
      "팝업 스토어 서울",
      "성수 팝업",
      "홍대 팝업",
      "서울 전시회",
    ],
    congestion: [
      "Seoul subway delay OR traffic congestion",
      "Line 2 delay OR Line 9 accident Seoul",
      "Seoul bus traffic jam",
      "서울 지하철 지연",
      "서울 교통 정체",
      "서울 혼잡 공지",
    ],
    tip: [
      "Seoul travel tips guide foreigners",
      "Best time avoid crowds Seoul",
      "서울 여행 꿀팁",
      "외국인 팁 서울",
    ],
    hotspot: [
      "Seoul hotspot Seongsu Hongdae Myeongdong trend",
      "Korea hotspot young people trend Seoul",
      "서울 핫플 성수",
      "홍대 핫플",
      "명동 핫플",
      "서울 트렌드 장소",
    ],
    weather: [
      "Seoul weather rain typhoon heatwave",
      "Korea weather forecast storm snow",
      "서울 날씨 태풍 폭우",
      "기상청 예보 서울",
    ],
    population: [
      "Seoul population density foot traffic crowds",
      "Korea crowd level footfall data",
      "서울 유동인구",
      "인구 밀집 서울",
      "혼잡도 서울",
    ]
  };

  type Raw = { it: any; publisher: string; feedTitle?: string; typeHint: Card['type'] };
  const feeds: Array<{ url: string; publisher: string; typeHint: Card['type'] }> = [];
  (Object.keys(topicQueries) as Card['type'][]).forEach((t) => {
    for (const query of topicQueries[t]) {
      feeds.push({ url: GN_EN(query), publisher: 'Google News', typeHint: t });
      feeds.push({ url: GN_KO(query), publisher: 'Google 뉴스', typeHint: t });
    }
  });

  const parser = new Parser({ timeout: 15000 });
  const rawItems: Raw[] = [];
  for (const f of feeds) {
    try {
      const feed = await parser.parseURL(f.url);
      (feed.items || []).forEach((it) => rawItems.push({ it, publisher: f.publisher, feedTitle: feed.title, typeHint: f.typeHint }));
    } catch {}
  }

  const mapped = rawItems.map(({ it, publisher, feedTitle, typeHint }) => ({
    title: normalize(it.title),
    summary: normalize((it.contentSnippet as string) || (it.content as string) || it.isoDate || ''),
    isoDate: it.isoDate,
    typeHint,
    source: { title: feedTitle || publisher, url: normalize(it.link), publisher }
  })).filter((m) => m.title && m.source.url);

  // keep only last 10 days (close to this week)
  const cutoffMs = Date.now() - 10 * 24 * 3600 * 1000;
  const recent = mapped.filter((m) => {
    const ts = m.isoDate ? Date.parse(m.isoDate) : Date.now();
    return isFinite(ts) && ts >= cutoffMs;
  });

  // Simple score & selection for ~50
  const scored = recent.map((m) => ({ ...m, score: computeScore(m.title, m.summary, m.source.url) }));

  // Group by topic and sort inside groups by score desc
  const byTopic: Record<Card['type'], typeof scored> = { issue: [], popup: [], congestion: [], tip: [], hotspot: [], weather: [], population: [] };
  for (const it of scored) {
    const classified = classifyTypeFromText(it.title + ' ' + it.summary);
    const topic = it.typeHint || classified;
    (byTopic[topic] ||= []).push(it);
  }
  (Object.keys(byTopic) as Card['type'][]).forEach((k) => byTopic[k].sort((a, b) => b.score - a.score));

  // Balanced selection across topics
  const TARGET = parseInt(process.env.WEEKLY_TARGET || '50', 10) || 50;
  const topics: Card['type'][] = ['issue','popup','congestion','tip','hotspot','weather','population'];
  const base = Math.floor(TARGET / topics.length); // 7
  let remainder = TARGET % topics.length; // 1
  const quota: Record<Card['type'], number> = { issue: base, popup: base, congestion: base, tip: base, hotspot: base, weather: base, population: base };
  // give extras to topics with more supply
  const supplyOrder = [...topics].sort((a, b) => (byTopic[b].length - byTopic[a].length));
  for (const k of supplyOrder) { if (remainder <= 0) break; quota[k] += 1; remainder -= 1; }

  let picked: any[] = [];
  for (const k of topics) picked.push(...byTopic[k].slice(0, quota[k]).map((x) => ({ ...x, finalType: k })));

  // If some topics were short, backfill by global remaining pool
  if (picked.length < TARGET) {
    const used = new Set(picked.map((x) => x.title.toLowerCase()));
    const restPool = scored
      .filter((x) => !used.has(x.title.toLowerCase()))
      .sort((a, b) => b.score - a.score);
    picked = [...picked, ...restPool.slice(0, TARGET - picked.length)];
  }

  // Convert to inbox cards
  const toCards: Card[] = [];
  for (const m of picked.slice(0, TARGET)) {
    const geo = await enrichGeo(m.source.url);
    const type: Card['type'] = (m as any).finalType || classifyTypeFromText(m.title + ' ' + m.summary);
    // define this-week period: today (KST) ~ +6 days
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const start = new Date(utc + 9 * 3600000); // KST now
    start.setHours(0,0,0,0);
    const end = new Date(start.getTime() + 6 * 24 * 3600 * 1000);
    toCards.push({
      id: makeId('week'),
      type,
      title: m.title,
      summary: m.summary,
      tags: ['thisweek', type, 'google'],
      geo: geo.area ? { area: geo.area } : undefined,
      period: { start: start.toISOString(), end: end.toISOString() },
      sources: [{ title: m.source.title, url: m.source.url, publisher: m.source.title }],
      lastUpdatedKST: kstNowISO(),
      score: m.score
    });
  }

  // Merge into inbox with dedupe by title
  let inbox: Card[] = [];
  try { inbox = JSON.parse(fs.readFileSync(inboxFile, 'utf8')); } catch {}
  const merged = [...toCards, ...inbox];
  const seen = new Set<string>();
  const deduped: Card[] = [];
  for (const c of merged) {
    const k = `${c.title}`.toLowerCase();
    if (!seen.has(k)) { seen.add(k); deduped.push(c); }
  }
  // keep only top TARGET for thisweek tag
  const TARGET2 = parseInt(process.env.WEEKLY_TARGET || '50', 10) || 50;
  const thisWeek = deduped.filter((c) => c.tags?.includes('thisweek'))
    .sort((a: any, b: any) => (Number(b?.score || 0) - Number(a?.score || 0)))
    .slice(0, TARGET2);
  // merge back with non-thisweek items
  const others = deduped.filter((c) => !c.tags?.includes('thisweek'));
  const finalData = [...thisWeek, ...others];

  fs.mkdirSync(path.dirname(inboxFile), { recursive: true });
  fs.writeFileSync(inboxFile, JSON.stringify(finalData, null, 2));
  console.log(`✅ weekly hot collected: ${thisWeek.length} (target=${TARGET2}) (inbox total: ${finalData.length})`);
}

main().catch((e) => { console.error('❌ collect-weekly-hot failed:', e); process.exit(1); });


