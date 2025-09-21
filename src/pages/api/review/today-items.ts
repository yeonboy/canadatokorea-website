/**
 * Today 페이지 게시물 목록 조회 API
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
};

const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');

function loadJson<T>(file: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultValue;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (cors(req, res)) return;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const todayCards: Card[] = loadJson(dataFile, []);
    
    // 최신순으로 정렬 (생성 시간 기준)
    const sortedCards = todayCards.sort((a, b) => {
      const timeA = (a as any).generatedAt || a.lastUpdatedKST;
      const timeB = (b as any).generatedAt || b.lastUpdatedKST;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });

    // 캐시 방지 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json({
      success: true,
      items: sortedCards,
      total: sortedCards.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Today items fetch error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
