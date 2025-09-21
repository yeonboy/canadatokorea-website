import type { NextApiRequest, NextApiResponse } from 'next';

function buildQS(q: Record<string, any>): string {
  const sp = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { area, bbox, since, ttl, q, type, start, end } = req.query as Record<string, string | undefined>;
    const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const base = `${proto}://${host}`;
    const trafficQS = buildQS({ area, bbox, since, ttl });
    const weatherQS = buildQS({});
    const hotspotsQS = buildQS({ q, type, area, start, end, ttl });

    const [traffic, weather, hotspots, population, weatherPoints] = await Promise.all([
      fetch(`${base}/api/rkn/traffic${trafficQS}`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${base}/api/rkn/weather${weatherQS}`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${base}/api/rkn/hotspots${hotspotsQS}`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${base}/api/rkn/population`).then(r => r.json()).catch(() => ({ items: [] })),
      fetch(`${base}/api/rkn/weather-points`).then(r => r.json()).catch(() => ({ items: [] }))
    ]);

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    res.status(200).json({ traffic, weather, hotspots, population, weatherPoints });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}


