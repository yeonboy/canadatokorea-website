/**
 * Inbox 신규 항목 생성 API (로컬 작성용)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import cors from '../_cors';

type Source = { title: string; url: string; publisher: string };

type Card = {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  fullContent?: string;
  tags: string[];
  geo?: { lat?: number; lng?: number; area?: string } | null;
  sources: Source[];
  images?: string[];
  lastUpdatedKST: string;
  i18n?: any;
};

const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');

function loadJson<T>(file: string, def: T): T {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

function saveJson(file: string, data: any) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function kstNowISO(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 3600000).toISOString();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req as any, res as any)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      title,
      fullContent = '',
      tags = [],
      geo = null,
      sources = [],
      images = [],
      i18n = undefined,
      type = 'issue'
    } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Missing title' });
    }

    const summary = (fullContent || '').trim().length > 0
      ? String(fullContent).trim().substring(0, 200) + '...'
      : String(title).trim();

    const card: Card = {
      id: `${type}-${Date.now().toString(36)}`,
      type,
      title: String(title).trim(),
      summary,
      fullContent: String(fullContent || '').trim() || undefined,
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      geo: geo && typeof geo === 'object' ? geo : null,
      sources: Array.isArray(sources) ? sources.filter((s: any) => s && s.url) : [],
      images: Array.isArray(images) ? images.filter(Boolean) : undefined,
      lastUpdatedKST: kstNowISO(),
      i18n
    };

    const inbox: Card[] = loadJson(inboxFile, []);
    // 중복(제목) 제거
    const seen = new Set(inbox.map((c) => `${c.type}:${c.title}`));
    if (!seen.has(`${card.type}:${card.title}`)) inbox.unshift(card);

    saveJson(inboxFile, inbox);
    return res.status(200).json({ ok: true, id: card.id, card });
  } catch (error: any) {
    console.error('Inbox create error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error?.message || 'Unknown error' });
  }
}


