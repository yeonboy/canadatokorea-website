import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { globalCache } from '@/server/cache';
import { KOREAN_CITIES } from '@/utils/constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cacheKey = 'rkn:hotspots';
    const cached = globalCache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    // 1) 로컬 카드 데이터: today + week에서 hotspot/ popup / issue / tip / congestion 수집
    const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
    const weekFile = path.join(process.cwd(), 'content', 'data', 'week-cards.json');
    let items: any[] = [];
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const cards = JSON.parse(raw) as any[];
      items = cards
        .filter((c) => ['hotspot','popup','issue','tip','congestion'].includes(c.type))
        .map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          summary: c.summary,
          geo: c.geo || null,
          period: c.period || null,
          sources: c.sources || [],
          lastUpdatedKST: c.lastUpdatedKST
        }));
    } catch {}

    // 주간 카드 병합
    try {
      const rawW = fs.readFileSync(weekFile, 'utf8');
      const wcards = JSON.parse(rawW) as any[];
      const witems = wcards
        .filter((c) => ['hotspot','popup','issue','tip','congestion'].includes(c.type))
        .map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          summary: c.summary,
          geo: c.geo || null,
          period: c.period || null,
          sources: c.sources || [],
          lastUpdatedKST: c.lastUpdatedKST
        }));
      items = [...witems, ...items];
    } catch {}

    // area 별칭을 좌표로 보정 (서버측 보강)
    const aliases: Record<string, [number, number]> = {
      Seoul: KOREAN_CITIES.Seoul.coord as [number, number],
      Busan: KOREAN_CITIES.Busan.coord as [number, number],
      Incheon: KOREAN_CITIES.Incheon.coord as [number, number],
      Daejeon: KOREAN_CITIES.Daejeon.coord as [number, number],
      Daegu: KOREAN_CITIES.Daegu.coord as [number, number],
      Gwangju: KOREAN_CITIES.Gwangju.coord as [number, number],
      Jeju: KOREAN_CITIES.Jeju.coord as [number, number],
      Gangnam: [37.4979, 127.0276],
      Hongdae: [37.5563, 126.9250],
      'Hongik Univ': [37.5572, 126.9254],
      Sinchon: [37.5598, 126.9427],
      Seongsu: [37.5446, 127.0559]
    };
    items = items.map((it) => {
      if (it.geo && typeof it.geo.lat === 'number' && typeof it.geo.lng === 'number') return it;
      const area = it?.geo?.area || '';
      if (aliases[area]) {
        const [lat, lng] = aliases[area];
        it.geo = { lat, lng, area };
      }
      return it;
    });

    // 2) 외부 오픈데이터(예: KTO) 사용 가능 여부 플래그
    const ktoKey = process.env.KTO_TOURAPI_KEY || process.env.TOURAPI_KEY;

    // 필터 적용
    const { q, type, area, start, end } = req.query as Record<string, string | undefined>;
    let filtered = items;
    if (type) filtered = filtered.filter((it) => (it.type === type) || (type === 'hotspot' && (it.type === 'popup' || it.type === 'tip')));
    if (area) filtered = filtered.filter((it) => (it.geo?.area || '').toLowerCase().includes(area.toLowerCase()));
    if (q) filtered = filtered.filter((it) => (it.title + ' ' + (it.summary || '')).toLowerCase().includes(q.toLowerCase()));
    if (start || end) {
      filtered = filtered.filter((it) => {
        const s = it?.period?.start; const e = it?.period?.end;
        if (!s || !e) return false;
        const ds = (start || s).slice(0,10); const de = (end || e).slice(0,10);
        return !(de < s.slice(0,10) || ds > e.slice(0,10));
      });
    }

    const data = { items: filtered, source: 'local-cards', external: { kto: Boolean(ktoKey) }, cached: true };
    globalCache.set(cacheKey, data, 5 * 60 * 1000);
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

