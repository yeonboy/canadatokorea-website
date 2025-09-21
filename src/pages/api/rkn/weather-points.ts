import type { NextApiRequest, NextApiResponse } from 'next';
import { globalCache } from '@/server/cache';

// 간단한 그리드 포인트(주요 도시) 날씨 아이콘/온도 수집 샘플
const GRID_POINTS = [
  { name: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { name: 'Incheon', lat: 37.4563, lng: 126.7052 },
  { name: 'Busan', lat: 35.1796, lng: 129.0756 },
  { name: 'Daegu', lat: 35.8714, lng: 128.6014 },
  { name: 'Gwangju', lat: 35.1595, lng: 126.8526 },
  { name: 'Daejeon', lat: 36.3504, lng: 127.3845 },
  { name: 'Jeju', lat: 33.4996, lng: 126.5312 }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const kmaKey = process.env.KMA_SERVICE_KEY;
    const cacheKey = 'rkn:weather-points';
    const cached = globalCache.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
      return res.status(200).json(cached);
    }

    if (!kmaKey) {
      return res.status(200).json({ items: [], enabled: false });
    }

    // 샘플: 포인트마다 간단히 현재 상태를 /api/rkn/weather의 type으로 대체
    const items: any[] = [];
    const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const base = `${proto}://${host}`;

    for (const p of GRID_POINTS) {
      // 단순화: 기존 weather API를 재사용해 type만 가져옴 (포인트별 상세는 후속 확장)
      const r = await fetch(`${base}/api/rkn/weather`);
      const data = await r.json();
      items.push({ name: p.name, lat: p.lat, lng: p.lng, type: data?.type || 'sun' });
    }

    const out = { items, enabled: true };
    globalCache.set(cacheKey, out, 10 * 60 * 1000);
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=600');
    return res.status(200).json(out);
  } catch (e: any) {
    return res.status(200).json({ items: [], enabled: false, error: e.message });
  }
}


