import type { NextApiRequest, NextApiResponse } from 'next';
import { globalCache } from '@/server/cache';

type PopItem = { id: string; type: 'population'; title: string; density: number; geo: { lat: number; lng: number; area?: string }; source?: string };

const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  Seoul: { lat: 37.5665, lng: 126.9780 },
  Gangnam: { lat: 37.4979, lng: 127.0276 },
  Hongdae: { lat: 37.5563, lng: 126.9250 },
  'Hongik Univ': { lat: 37.5572, lng: 126.9254 },
  Sinchon: { lat: 37.5598, lng: 126.9427 },
  Seongsu: { lat: 37.5446, lng: 127.0559 }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = process.env.SEOUL_TOPIS_API_KEY;
    const cacheKey = 'rkn:population';
    const cached = globalCache.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(cached);
    }

    const items: PopItem[] = [];
    if (key) {
      try {
        // CityData: 지역별 실시간 정보. 응답 스키마는 공개 버전별 상이할 수 있어 방어적으로 파싱
        const url = `http://openapi.seoul.go.kr:8088/${key}/json/CityData/1/25/${encodeURIComponent('서울특별시')}`;
        const resp = await fetch(url);
        if (resp.ok) {
          const json = await resp.json();
          const rows: any[] = json?.['CityData']?.['row'] || json?.['SeoulRtd.citydata']?.['row'] || [];
          for (const r of rows) {
            const name: string = r?.AREA_NM || r?.ADSTRD_CD_NM || 'Seoul';
            const rate = Number(r?.LIVE_PPLTN_STTS?.PPLTN_RATE || r?.LIVE_PPLTN_RATE || 0);
            const coord = AREA_COORDS[name] || AREA_COORDS.Seoul;
            items.push({ id: `pop-${name}`, type: 'population', title: `Population: ${name}`, density: rate, geo: { ...coord, area: name }, source: 'topis' });
          }
        }
      } catch {}
    }

    const data = { items, sources: { topis: Boolean(key) } };
    globalCache.set(cacheKey, data, 5 * 60 * 1000);
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(200).json({ items: [], error: e.message });
  }
}


