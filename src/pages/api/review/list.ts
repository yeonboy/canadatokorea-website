import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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
};

const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');

function loadInbox(): Card[] {
  try { return JSON.parse(fs.readFileSync(inboxFile, 'utf8')); } catch { return []; }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const q = String(req.query.q || '').toLowerCase();
  const type = String(req.query.type || '');
  const tag = String(req.query.tag || '').toLowerCase();
  const sort = String(req.query.sort || '');
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const pageSize = Math.min(200, Math.max(1, parseInt(String(req.query.pageSize || '50'), 10) || 50));

  const all = loadInbox();
  let filtered = all;
  if (type && type !== 'all') {
    filtered = filtered.filter((c) => c.type === (type as Card['type']));
  }
  if (tag) {
    filtered = filtered.filter((c) => Array.isArray(c.tags) && c.tags.some((t) => String(t).toLowerCase() === tag));
  }
  if (q) {
    filtered = filtered.filter((c) => {
      const hay = [c.title, c.summary, ...(c.tags || []), ...(c.sources || []).map((s) => `${s.publisher} ${s.url}`)]
        .join(' ') .toLowerCase();
      return hay.includes(q);
    });
  }

  // optional sort by score (desc)
  if (sort === 'score' || (!sort && tag === 'thisweek')) {
    filtered = [...filtered].sort((a: any, b: any) => (Number(b?.score || 0) - Number(a?.score || 0)));
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  // geo 정규화: 문자열/undefined를 안전한 객체로 변환하여 프론트 지도 오류 방지
  const normalized = items.map((c: any) => {
    if (!c.geo) return c;
    if (typeof c.geo === 'object') return c;
    return { ...c, geo: { area: String(c.geo) } };
  });

  res.status(200).json({ total, page, pageSize, items: normalized });
}


