/**
 * Today 페이지 게시물 수정 API
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import cors from '../_cors';

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
  i18n?: {
    en?: { title: string; summary: string; fullContent?: string; tags?: string[] };
    fr?: { title: string; summary: string; fullContent?: string; tags?: string[] };
  };
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

  const { id, updates } = req.body;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing card id' });
  }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Missing updates object' });
  }

  try {
    const todayCards: Card[] = loadJson(dataFile, []);
    const cardIndex = todayCards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    // 허용된 필드만 업데이트 (i18n 추가)
    const allowedFields = ['title', 'summary', 'fullContent', 'tags', 'type', 'images', 'i18n', 'geo', 'sources'];
    const filteredUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    // 수정 시간 업데이트
    filteredUpdates.lastUpdatedKST = new Date().toISOString();

    // 카드 업데이트
    todayCards[cardIndex] = {
      ...todayCards[cardIndex],
      ...filteredUpdates
    };

    // 파일 저장
    saveJson(dataFile, todayCards);

    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      card: todayCards[cardIndex]
    });
  } catch (error: any) {
    console.error('Update today item error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
