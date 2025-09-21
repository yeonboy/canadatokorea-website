import type { NextApiRequest, NextApiResponse } from 'next';
import { globalCache } from '@/server/cache';

type TrafficItem = { id: string; type: 'congestion' | 'incident'; title: string; summary?: string; geo?: { lat: number; lng: number; area?: string }; severity?: number; source?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const exKey = process.env.KEC_ROAD_API_KEY || process.env.KOREA_ROAD_API_KEY; // 한국도로공사
    const topisKey = process.env.SEOUL_TOPIS_API_KEY
      || process.env.TOPIS_API_KEY
      || process.env.SEOUL_TOPIS_KEY
      || process.env.SEOUL_OPENAPI_KEY
      || process.env.SEOUL_API_KEY;

    const area = (req.query.area as string) || '서울특별시';
    const bbox = (req.query.bbox as string) || undefined; // "minLng,minLat,maxLng,maxLat"
    const cacheKey = `rkn:traffic:${area}:${bbox || ''}`;
    const cached = globalCache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const items: TrafficItem[] = [];
    
    // 서울 자치구 중심 좌표(대략)
    const SEOUL_DIST_COORD: Record<string, { lat: number; lng: number }> = {
      '종로구': { lat: 37.5733, lng: 126.9794 }, '중구': { lat: 37.5636, lng: 126.9976 }, '용산구': { lat: 37.5326, lng: 126.9901 },
      '성동구': { lat: 37.5636, lng: 127.0369 }, '광진구': { lat: 37.5385, lng: 127.0824 }, '동대문구': { lat: 37.5740, lng: 127.0396 },
      '중랑구': { lat: 37.6063, lng: 127.0930 }, '성북구': { lat: 37.5894, lng: 127.0167 }, '강북구': { lat: 37.6396, lng: 127.0254 },
      '도봉구': { lat: 37.6688, lng: 127.0471 }, '노원구': { lat: 37.6542, lng: 127.0568 }, '은평구': { lat: 37.6176, lng: 126.9227 },
      '서대문구': { lat: 37.5791, lng: 126.9368 }, '마포구': { lat: 37.5663, lng: 126.9018 }, '양천구': { lat: 37.5172, lng: 126.8666 },
      '강서구': { lat: 37.5510, lng: 126.8495 }, '구로구': { lat: 37.4955, lng: 126.8877 }, '금천구': { lat: 37.4569, lng: 126.8958 },
      '영등포구': { lat: 37.5264, lng: 126.8963 }, '동작구': { lat: 37.5124, lng: 126.9393 }, '관악구': { lat: 37.4784, lng: 126.9516 },
      '서초구': { lat: 37.4836, lng: 127.0327 }, '강남구': { lat: 37.5172, lng: 127.0473 }, '송파구': { lat: 37.5145, lng: 127.1065 },
      '강동구': { lat: 37.5301, lng: 127.1238 }
    };

    // 1) 서울 TOPIS (예: 도시혼잡/교통상황 요약 API; 실제 엔드포인트는 키에 따라 상이할 수 있음)
    const tried: Array<{ url: string; ok: boolean; count?: number }> = [];
    if (topisKey) {
      try {
        // 여러 후보 엔드포인트 시도 (대소문자/네임스페이스 상이 이슈 대응)
        const candidates = [
          `http://openapi.seoul.go.kr:8088/${topisKey}/json/CityData/1/25/${encodeURIComponent(area)}`,
          `http://openapi.seoul.go.kr:8088/${topisKey}/json/citydata/1/25/${encodeURIComponent(area)}`,
          `http://openapi.seoul.go.kr:8088/${topisKey}/json/SeoulRtd.citydata/1/25/${encodeURIComponent(area)}`
        ];
        let used = '';
        for (const urlCandidate of candidates) {
          try {
            const resp = await fetch(urlCandidate);
            if (!resp.ok) continue;
            const json = await resp.json();
            const rows: any[] = json?.['CityData']?.['row'] || json?.['citydata']?.['row'] || json?.['SeoulRtd.citydata']?.['row'] || [];
            tried.push({ url: urlCandidate, ok: true, count: Array.isArray(rows) ? rows.length : 0 });
            if (!Array.isArray(rows) || rows.length === 0) continue;
            used = urlCandidate;
            for (const r of rows) {
              const name = r?.AREA_NM || r?.ADSTRD_CD_NM || r?.AREA_NM2 || 'Seoul';
              const road = r?.ROAD_TRAFFIC_STTS || r?.ROAD_TRAFFIC || r?.ROAD || {};
              const speed = Number(road?.ROAD_AVG_SPD || road?.AVG_ROAD_SPD || road?.SPEED || r?.ROAD_AVG_SPD || 0);
              let sev = Number(road?.TRAFFIC_INDEX || road?.ROAD_TRAFFIC_IDX || r?.ROAD_TRAFFIC_IDX || r?.CONGESTION_IDX || 0);
              if (!(sev > 0)) sev = Math.max(0, Math.min(100, 100 - Math.min(100, speed * 3)));
              const coords = SEOUL_DIST_COORD[name] || { lat: 37.5665, lng: 126.9780 };
              items.push({
                id: `topis-${name}-${Math.round(sev)}`,
                type: 'congestion',
                title: `Traffic in ${name}`,
                summary: speed ? `Avg speed ${speed} km/h` : `Congestion level ${Math.round(sev)}`,
                geo: { ...coords, area: name },
                severity: sev,
                source: 'topis'
              });
            }
            break; // 성공 시 종료
          } catch {
            tried.push({ url: urlCandidate, ok: false });
          }
        }
      } catch {}
    }

    // 2) 한국도로공사 간단 요약 (엔드포인트 가드)
    if (exKey) {
      try {
        // 참고: 실제 도로공사 오픈 API 스펙에 맞게 교체 필요. 여기서는 통신 가능 여부만 확인.
        const testUrl = `https://openapi.kric.go.kr/openapi/congestion?key=${encodeURIComponent(exKey)}`;
        await fetch(testUrl).catch(() => undefined);
        // 실 데이터 연동 전까지는 요약 항목만 보강하지 않음.
      } catch {}
    }

    const wantDebug = String(req.query.debug || '0') === '1';
    const envKeys = ['SEOUL_TOPIS_API_KEY','TOPIS_API_KEY','SEOUL_TOPIS_KEY','SEOUL_OPENAPI_KEY','SEOUL_API_KEY'];
    const envSeen = envKeys.filter((k) => !!process.env[k]).map((k) => ({ key: k, len: String(process.env[k]).length }));
    const data: any = { sources: { ex: Boolean(exKey), topis: Boolean(topisKey) }, items };
    if (wantDebug) data.debug = { tried, envSeen, area };
    globalCache.set(cacheKey, data, 5 * 60 * 1000);
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(200).json({ error: e.message, items: [] });
  }
}

