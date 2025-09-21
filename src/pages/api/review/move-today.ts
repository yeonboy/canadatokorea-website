/**
 * Today 페이지 게시물 순서 이동 API
 */

import { NextApiRequest, NextApiResponse } from 'next';
import cors from '../_cors';
import fs from 'fs';
import path from 'path';

type Card = {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  fullContent?: string;
  tags: string[];
  geo?: { lat?: number; lng?: number; area?: string } | null;
  sources: { title: string; url: string; publisher: string }[];
  lastUpdatedKST: string;
  generated?: boolean;
  generatedAt?: string;
};

const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');

function loadJson<T>(file: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function saveJson(file: string, data: any) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, direction } = req.body;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing card id' });
  }

  if (!direction || !['up', 'down'].includes(direction)) {
    return res.status(400).json({ error: 'Invalid direction. Must be "up" or "down"' });
  }

  try {
    const todayCards: Card[] = loadJson(dataFile, []);
    const cardIndex = todayCards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    let newIndex: number;
    
    if (direction === 'up') {
      if (cardIndex === 0) {
        return res.status(400).json({ error: 'Already at the top' });
      }
      newIndex = cardIndex - 1;
    } else { // down
      if (cardIndex === todayCards.length - 1) {
        return res.status(400).json({ error: 'Already at the bottom' });
      }
      newIndex = cardIndex + 1;
    }

    // 배열에서 요소 이동
    const [movedCard] = todayCards.splice(cardIndex, 1);
    todayCards.splice(newIndex, 0, movedCard);

    // 파일 저장
    saveJson(dataFile, todayCards);

    // 캐시 방지 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json({
      success: true,
      message: `Card moved ${direction} successfully`,
      newPosition: newIndex + 1,
      total: todayCards.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Move today item error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
