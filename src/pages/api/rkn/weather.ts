import type { NextApiRequest, NextApiResponse } from 'next';

function toKst(date = new Date()) {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60000);
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const kmaKey = process.env.KMA_SERVICE_KEY;
    if (!kmaKey) {
      return res.status(200).json({ enabled: false, type: 'sun' });
    }

    // 좌표: 기본 서울청사 근방(nx=60, ny=127). 쿼리로 덮어쓰기 가능
    const nx = String(req.query.nx || '60');
    const ny = String(req.query.ny || '127');

    const now = toKst();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    let hh = now.getHours();
    const mm = now.getMinutes();

    // 초단기실황: 매시 40분 이후 업데이트. 45분 이전이면 한 시간 전
    if (mm < 45) {
      hh -= 1;
      if (hh < 0) {
        // 이전 일자 처리
        const prev = new Date(now.getTime() - 24 * 60 * 60000);
        y = prev.getFullYear();
        m = prev.getMonth() + 1;
        d = prev.getDate();
        hh = 23;
      }
    }

    const base_date = `${y}${pad(m)}${pad(d)}`;
    const base_time = `${pad(hh)}30`;

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodeURIComponent(
      kmaKey
    )}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

    const resp = await fetch(url);
    const json = await resp.json();
    const items: any[] = json?.response?.body?.items?.item || [];

    let pty: string | undefined;
    let sky: string | undefined;
    for (const it of items) {
      if (it.category === 'PTY' && pty === undefined) pty = String(it.obsrValue);
      if (it.category === 'SKY' && sky === undefined) sky = String(it.obsrValue);
    }

    let type: 'rain' | 'snow' | 'clouds' | 'sun' = 'sun';
    if (pty && pty !== '0') {
      if (pty === '3' || pty === '2') type = 'snow';
      else type = 'rain';
    } else if (sky) {
      if (sky === '1') type = 'sun';
      else type = 'clouds';
    }

    return res.status(200).json({ enabled: true, type, kma: { pty, sky, base_date, base_time } });
  } catch (e: any) {
    return res.status(200).json({ enabled: false, type: 'sun', error: e.message });
  }
}


