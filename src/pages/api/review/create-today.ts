/**
 * Today 페이지 신규 게시물 생성 API
 * - 로컬 글쓰기용: 작성 즉시 Today 목록과 프런트에 반영
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { loadTodayJson, saveTodayJson } from './_storage';
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
  generated?: boolean;
  generatedAt?: string;
  i18n?: any;
};


function kstNowISO(): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 3600000).toISOString();
}

function makeId(type: Card['type']): string {
  const n = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${type}-${n}-${rand}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type = 'issue',
      title,
      fullContent = '',
      tags = [],
      geo = null,
      sources = [],
      images = [],
      i18n = undefined
    } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Missing title' });
    }

    const computedSummary = (fullContent || '').trim().length > 0
      ? String(fullContent).trim().substring(0, 200) + '...'
      : String(title).trim();

    const newCard: Card = {
      id: makeId(type),
      type,
      title: String(title).trim(),
      summary: computedSummary,
      fullContent: String(fullContent || '').trim() || undefined,
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      geo: geo && typeof geo === 'object' ? geo : null,
      sources: Array.isArray(sources) ? sources.filter((s: any) => s && s.url) : [],
      images: Array.isArray(images) ? images.filter(Boolean) : undefined,
      lastUpdatedKST: kstNowISO(),
      generated: false,
      i18n
    };

    const todayCards: Card[] = await loadTodayJson<Card[]>([]);
    // 중복(제목+타입) 방지
    const exists = todayCards.find((c) => c.type === newCard.type && c.title === newCard.title);
    if (!exists) {
      todayCards.unshift(newCard);
      await saveTodayJson(todayCards);
    }

    return res.status(200).json({ success: true, card: newCard });
  } catch (error: any) {
    console.error('Create today error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error?.message || 'Unknown error' });
  }
}


