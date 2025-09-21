import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { globalCache } from '@/server/cache';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const withGeo = String(req.query.withGeo || '0') === '1';
    const exclude = String(req.query.exclude || '').split(',').map((s) => s.trim()).filter(Boolean);
    const include = String(req.query.include || '').split(',').map((s) => s.trim()).filter(Boolean);

    const cacheKey = `cards:${withGeo}:${exclude.sort().join('.')}:${include.sort().join('.')}`;
    const cached = globalCache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
    let items: any[] = [];
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const cards = JSON.parse(raw) as any[];
      items = cards.slice();
    } catch {}

    if (withGeo) items = items.filter((c) => c?.geo && (typeof c.geo.lat === 'number') && (typeof c.geo.lng === 'number'));
    if (exclude.length) items = items.filter((c) => !exclude.includes(c.type));
    if (include.length) items = items.filter((c) => include.includes(c.type));

    const data = { items };
    globalCache.set(cacheKey, data, 5 * 60 * 1000);
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e.message, items: [] });
  }
}


