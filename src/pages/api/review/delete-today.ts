/**
 * Today 페이지 게시물 삭제 API
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

  const { id } = req.body;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing card id' });
  }

  try {
    const todayCards: Card[] = loadJson(dataFile, []);
    const cardIndex = todayCards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // 카드 제거
    const deletedCard = todayCards[cardIndex];
    const updatedCards = todayCards.filter(c => c.id !== id);

    // 파일 저장
    saveJson(dataFile, updatedCards);

    res.status(200).json({
      success: true,
      message: 'Card deleted successfully',
      deletedCard: deletedCard,
      remaining: updatedCards.length
    });
  } catch (error: any) {
    console.error('Delete today item error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
