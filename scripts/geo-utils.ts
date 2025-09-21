/**
 * 지역 정보 추출을 위한 공통 유틸리티
 */

export interface GeoLocation {
  area?: string;
  lat?: number;
  lng?: number;
}

// 확장된 지역 사전 (한글명 + 영문명 + 좌표)
export const KOREA_LOCATIONS = [
  // 서울 주요 지역 (구체적인 동네 우선)
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
  { names: ['garosu', '가로수길'], area: 'Garosu-gil', lat: 37.5205, lng: 127.0227 },
  { names: ['banpo', '반포'], area: 'Banpo', lat: 37.5048, lng: 127.0107 },
  { names: ['seocho', '서초'], area: 'Seocho', lat: 37.4837, lng: 127.0324 },
  { names: ['songpa', '송파'], area: 'Songpa', lat: 37.5145, lng: 127.1066 },
  { names: ['nowon', '노원'], area: 'Nowon', lat: 37.6541, lng: 127.0568 },
  { names: ['gangbuk', '강북'], area: 'Gangbuk', lat: 37.6396, lng: 127.0254 },
  { names: ['seodaemun', '서대문'], area: 'Seodaemun', lat: 37.5794, lng: 126.9368 },
  { names: ['yongsan', '용산'], area: 'Yongsan', lat: 37.5326, lng: 126.9658 },
  { names: ['jung-gu', '중구'], area: 'Jung-gu', lat: 37.5640, lng: 126.9979 },
  { names: ['gangdong', '강동'], area: 'Gangdong', lat: 37.5301, lng: 127.1238 },
  { names: ['gwangjin', '광진'], area: 'Gwangjin', lat: 37.5384, lng: 127.0822 },
  { names: ['seongdong', '성동'], area: 'Seongdong', lat: 37.5636, lng: 127.0365 },
  
  // 서울 외곽 및 기타 도시
  { names: ['busan', '부산'], area: 'Busan', lat: 35.1796, lng: 129.0756 },
  { names: ['gyeongju', '경주'], area: 'Gyeongju', lat: 35.8562, lng: 129.2247 },
  { names: ['jeju', '제주'], area: 'Jeju', lat: 33.4996, lng: 126.5312 },
  { names: ['incheon', '인천'], area: 'Incheon', lat: 37.4563, lng: 126.7052 },
  { names: ['suwon', '수원'], area: 'Suwon', lat: 37.2636, lng: 127.0286 },
  { names: ['daegu', '대구'], area: 'Daegu', lat: 35.8714, lng: 128.6014 },
  { names: ['daejeon', '대전'], area: 'Daejeon', lat: 36.3504, lng: 127.3845 },
  { names: ['gwangju', '광주'], area: 'Gwangju', lat: 35.1595, lng: 126.8526 },
  { names: ['ulsan', '울산'], area: 'Ulsan', lat: 35.5384, lng: 129.3114 },
  { names: ['sejong', '세종'], area: 'Sejong', lat: 36.4800, lng: 127.2890 },
  
  // 일반적인 서울 언급 (가장 마지막에 매칭)
  { names: ['seoul', '서울', 'seoul city'], area: 'Seoul', lat: 37.5665, lng: 126.9780 }
];

/**
 * 텍스트에서 지역 정보 추출
 */
export function extractGeoFromText(text: string): GeoLocation {
  const normalizedText = text.toLowerCase();
  
  // 구체적인 지역부터 우선 매칭 (배열 순서대로)
  for (const location of KOREA_LOCATIONS) {
    for (const name of location.names) {
      if (normalizedText.includes(name)) {
        return { 
          area: location.area, 
          lat: location.lat, 
          lng: location.lng 
        };
      }
    }
  }
  
  return {};
}

/**
 * HTML에서 지역 정보 추출 (제목, 요약, 본문 순서로 우선순위)
 */
export async function enrichGeoFromUrl(
  url: string, 
  title?: string, 
  summary?: string,
  userAgent = 'ca.korea geo-collector/1.0'
): Promise<GeoLocation> {
  try {
    // 1. 제목과 요약에서 먼저 추출 시도 (더 정확함)
    if (title || summary) {
      const titleSummaryText = `${title || ''} ${summary || ''}`;
      const geoFromTitle = extractGeoFromText(titleSummaryText);
      if (geoFromTitle.area) {
        return geoFromTitle;
      }
    }
    
    // 2. URL에서 HTML 페치하여 본문에서 추출
    const response = await fetch(url, {
      headers: { 'user-agent': userAgent }
    });
    
    if (!response.ok) return {};
    
    const html = await response.text();
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);
    
    // 메타 태그에서 지역 정보 추출 시도
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaText = `${metaKeywords} ${metaDescription}`;
    
    const geoFromMeta = extractGeoFromText(metaText);
    if (geoFromMeta.area) {
      return geoFromMeta;
    }
    
    // 본문에서 지역 정보 추출 (20,000자 제한)
    const bodyText = $('body').text().slice(0, 20000);
    return extractGeoFromText(bodyText);
    
  } catch (error: any) {
    console.warn(`Geo enrichment failed for ${url}:`, error?.message || error);
    return {};
  }
}

/**
 * 지역명을 표준화 (한글 → 영문)
 */
export function normalizeAreaName(area: string): string {
  const location = KOREA_LOCATIONS.find(loc => 
    loc.names.some(name => name.toLowerCase() === area.toLowerCase())
  );
  return location?.area || area;
}

/**
 * 좌표로부터 가장 가까운 지역 찾기
 */
export function findNearestArea(lat: number, lng: number, maxDistance = 5): GeoLocation | null {
  let nearestLocation = null;
  let minDistance = maxDistance;
  
  for (const location of KOREA_LOCATIONS) {
    if (!location.lat || !location.lng) continue;
    
    // 간단한 거리 계산 (하버사인 공식 간소화)
    const distance = Math.sqrt(
      Math.pow(lat - location.lat, 2) + 
      Math.pow(lng - location.lng, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestLocation = location;
    }
  }
  
  return nearestLocation ? {
    area: nearestLocation.area,
    lat: nearestLocation.lat,
    lng: nearestLocation.lng
  } : null;
}
