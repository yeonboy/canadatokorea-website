// Broad area aliases and helpers for resolving coordinates
export type LatLng = [number, number];

// Major KR cities and neighborhoods commonly appearing in scraped texts
export const AREA_ALIASES: Record<string, LatLng> = {
  // Cities
  'seoul': [37.5665, 126.9780], '서울': [37.5665, 126.9780],
  'busan': [35.1796, 129.0756], '부산': [35.1796, 129.0756],
  'incheon': [37.4563, 126.7052], '인천': [37.4563, 126.7052],
  'daegu': [35.8714, 128.6014], '대구': [35.8714, 128.6014],
  'daejeon': [36.3504, 127.3845], '대전': [36.3504, 127.3845],
  'gwangju': [35.1595, 126.8526], '광주': [35.1595, 126.8526],
  'jeju': [33.4996, 126.5312], '제주': [33.4996, 126.5312],
  'ulsan': [35.5384, 129.3114], '울산': [35.5384, 129.3114],
  'suwon': [37.2636, 127.0286], '수원': [37.2636, 127.0286],
  'seongnam': [37.4200, 127.1267], '성남': [37.4200, 127.1267],
  'goyang': [37.6584, 126.8320], '고양': [37.6584, 126.8320],
  'yongin': [37.2411, 127.1775], '용인': [37.2411, 127.1775],
  'paju': [37.7600, 126.7799], '파주': [37.7600, 126.7799],
  'namyangju': [37.6350, 127.2165], '남양주': [37.6350, 127.2165],
  'anyang': [37.3943, 126.9568], '안양': [37.3943, 126.9568],

  // Seoul districts / neighborhoods
  'gangnam': [37.4979, 127.0276], '강남': [37.4979, 127.0276], 'gangnam-gu': [37.5172, 127.0473],
  'hongdae': [37.5563, 126.9250], 'hongik univ': [37.5572, 126.9254], '홍대': [37.5563, 126.9250], '홍익대': [37.5572, 126.9254],
  'sinchon': [37.5598, 126.9427], '신촌': [37.5598, 126.9427],
  'itaewon': [37.5349, 126.9943], '이태원': [37.5349, 126.9943],
  'seongsu': [37.5446, 127.0559], '성수': [37.5446, 127.0559], 'seongsu-dong': [37.5446, 127.0559], '성수동': [37.5446, 127.0559],
  'jongno': [37.5720, 126.9794], '종로': [37.5720, 126.9794], 'jongno-gu': [37.5720, 126.9794],
  'myeongdong': [37.5637, 126.9827], '명동': [37.5637, 126.9827],
  'yeouido': [37.5219, 126.9244], '여의도': [37.5219, 126.9244],
  'jamsil': [37.5133, 127.1002], '잠실': [37.5133, 127.1002],
  'apgujeong': [37.5273, 127.0286], '압구정': [37.5273, 127.0286],
  'hanam': [37.5393, 127.2149], '하남': [37.5393, 127.2149],
  // Additional hotspots often appearing in articles
  'itaewon-ro': [37.5349, 126.9943], 'garosu-gil': [37.5207, 127.0239],
  'yeonnam': [37.5668, 126.9237], '연남동': [37.5668, 126.9237],
  'seochon': [37.5791, 126.9696], '서촌': [37.5791, 126.9696],
  'ikseon': [37.5743, 126.9917], '익선동': [37.5743, 126.9917],
  'hyehwa': [37.5821, 127.0023], '혜화': [37.5821, 127.0023],
  'daecheon': [36.6048, 126.5116], '대천': [36.6048, 126.5116],
  'gimpo': [37.623, 126.714], '김포': [37.623, 126.714]
};

export function normalizeAreaKey(area?: string): string | undefined {
  if (!area) return undefined;
  const a = area.trim().toLowerCase();
  return a
    .replace(/\s+gu$/,'')
    .replace(/\s+\-?dong$/,'')
    .replace(/[^a-z0-9가-힣\s]/g,'')
    .trim();
}

export function resolveAreaToCoord(area?: string): LatLng | null {
  const key = normalizeAreaKey(area);
  if (!key) return null;
  if (AREA_ALIASES[key]) return AREA_ALIASES[key];
  // partial includes
  for (const k of Object.keys(AREA_ALIASES)) {
    if (key.includes(k)) return AREA_ALIASES[k];
  }
  return null;
}


