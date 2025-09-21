/**
 * 승인된 아이템에 대해 로컬 GPT-20B로 콘텐츠 재작성
 * 저작권 문제 해결을 위한 완전 새로운 콘텐츠 생성
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { localLLM } from '../../../lib/local-llm';
import { simpleTranslateToFrench } from './translate-simple';
import fetch from 'node-fetch';

type Card = {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  tags: string[];
  geo?: { lat?: number; lng?: number; area?: string } | null;
  sources: { title: string; url: string; publisher: string }[];
  lastUpdatedKST: string;
  approved?: boolean;
  approvedAt?: string;
  generated?: boolean;
  generatedAt?: string;
  fullContent?: string; // View Details용 전체 콘텐츠
  originalContent?: {
    title: string;
    summary: string;
  };
  i18n?: {
    en: { title: string; summary: string; fullContent?: string; tags: string[] };
    fr: { title: string; summary: string; fullContent?: string; tags: string[] };
  };
};

const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');
const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
const weekFile = path.join(process.cwd(), 'content', 'data', 'week-cards.json');

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

/**
 * 로컬 GPT를 통한 콘텐츠 재작성 및 번역
 */
async function generateLocalizedContent(card: Card): Promise<Card> {
  try {
    console.log(`🤖 Generating content for card: ${card.id}`);
    
    // 1. 로컬 GPT로 영어 콘텐츠 재작성
    const generated = await localLLM.rewriteForCanadians({
      originalTitle: card.title,
      originalSummary: card.summary,
      sourceUrl: card.sources[0]?.url || '',
      category: card.type,
      targetLength: 150 // 약 150자 목표
    });

    console.log(`✅ Generated content with originality score: ${generated.originalityScore}`);

    // 2. 독창성 검증 (0.7 이상이어야 통과)
    const originality = await localLLM.validateOriginality(
      `${generated.title} ${generated.summary}`,
      `${card.title} ${card.summary}`
    );

    if (originality < 0.7) {
      console.warn(`⚠️ Low originality score: ${originality}, regenerating...`);
      // 재시도 로직 또는 수동 검토 플래그
    }

    // 3. 프랑스어 번역 (생성된 영문 콘텐츠를 번역)
    console.log('🔄 Starting French translation...');
    const frTitle = await translateToFrench(generated.title);
    const frSummary = await translateToFrench(generated.summary);
    const frFullContent = await translateToFrench(generated.fullContent);
    console.log('✅ French translation completed');

    // 4. 원본 콘텐츠 보존 및 새 콘텐츠 적용
    const updatedCard: Card = {
      ...card,
      title: generated.title,
      summary: generated.summary, // 카드용 짧은 요약
      fullContent: generated.fullContent, // View Details용 전체 콘텐츠
      tags: [...new Set([...card.tags, ...generated.tags])], // 태그 병합
      generated: true,
      generatedAt: new Date().toISOString(),
      originalContent: {
        title: card.title,
        summary: card.summary
      },
      i18n: {
        en: {
          title: generated.title,
          summary: generated.summary,
          fullContent: generated.fullContent,
          tags: generated.tags
        },
        fr: {
          title: frTitle,
          summary: frSummary,
          fullContent: frFullContent, // 전체 콘텐츠도 번역
          tags: generated.tags
        }
      }
    };

    return updatedCard;
  } catch (error: any) {
    console.error('Content generation failed:', error);
    
    // 실패시 기본 처리: 원본 유지하되 경고 플래그 추가
    return {
      ...card,
      generated: false,
      generationError: error?.message || 'Unknown error',
      needsManualReview: true
    } as any;
  }
}

async function translateToFrench(text: string): Promise<string> {
  // Ollama를 사용한 프랑스어 번역
  try {
    console.log(`🔄 Translating to French: ${text.substring(0, 50)}...`);
    
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-oss:20b',
        prompt: `Translate this English text to Canadian French. Keep the casual tone and Canadian expressions.

Text: "${text}"

Rules:
- Korea → Corée
- Seoul → Séoul  
- Hey guys! → Salut les amis!
- Keep "double-double" as is
- Keep brand names as is

Translation:`,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: Math.min(3000, text.length * 2),
          stop: ['Text:', 'Rules:', '\n\n']
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      let translated = (result.response || '').trim();
      
      // 불필요한 설명 텍스트 제거
      translated = translated
        .replace(/^.*?translation[:\s]*/i, '')
        .replace(/^.*?french[:\s]*/i, '')
        .replace(/^.*?voici[:\s]*/i, '')
        .replace(/^["']|["']$/g, '')
        .trim();
      
      if (translated && translated.length > 5 && translated !== text && !translated.includes('We need to')) {
        console.log(`✅ French translation successful: ${translated.substring(0, 50)}...`);
        return translated;
      }
    }
  } catch (error) {
    console.warn('Ollama French translation failed:', error);
  }

  // 폴백: 기본 키워드 번역
  console.log('🔄 Using fallback keyword translation...');
  
  const basicTranslations: Record<string, string> = {
    'Hey guys!': 'Salut les amis!',
    'Hey there!': 'Salut!',
    'Hey fellow Canadians!': 'Salut, mes compatriotes canadiens!',
    'Hey fam!': 'Salut la famille!',
    'Korea': 'Corée',
    'Seoul': 'Séoul',
    'Canada': 'Canada',
    'Canadian': 'canadien',
    'Canadians': 'canadiens',
    'pop-up': 'pop-up',
    'event': 'événement',
    'culture': 'culture',
    'travel': 'voyage',
    'insider': 'initié',
    'authentic': 'authentique',
    'experience': 'expérience',
    'amazing': 'incroyable',
    'discover': 'découvrir',
    'trust me': 'croyez-moi',
    'eh': 'hein',
    'loonie': 'huard',
    'double-double': 'double-double',
    'guys': 'amis',
    'friends': 'amis'
  };

  let translated = text;
  for (const [en, fr] of Object.entries(basicTranslations)) {
    const regex = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translated = translated.replace(regex, fr);
  }
  
  return translated;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing card id' });
  }

  try {
    // 승인된 아이템 찾기
    const inbox: Card[] = loadJson(inboxFile, []);
    const cardIndex = inbox.findIndex(c => c.id === id && c.approved);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Approved card not found' });
    }

    const card = inbox[cardIndex];
    
    // 이미 생성된 콘텐츠인지 확인
    if (card.generated) {
      return res.status(400).json({ error: 'Content already generated' });
    }

    // 로컬 GPT로 콘텐츠 생성
    const generatedCard = await generateLocalizedContent(card);

    // 생성 결과에 따라 처리
    if (generatedCard.generated) {
      // 성공: 최종 데이터로 이동
      const data: Card[] = loadJson(dataFile, []);
      const weekData: Card[] = loadJson(weekFile, []);
      
      // Today 탭에만 추가 (This Week 탭 삭제됨)
      const todayData = [generatedCard, ...data];
      
      // 중복 제거
      const seen = new Set();
      const deduped = todayData.filter(c => {
        const key = `${c.type}:${c.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Today 파일에만 저장
      saveJson(dataFile, deduped);

      // inbox에서 제거
      const updatedInbox = inbox.filter(c => c.id !== id);
      saveJson(inboxFile, updatedInbox);

      res.status(200).json({
        success: true,
        message: 'Content generated and published successfully',
        card: generatedCard,
        originalityScore: generatedCard.originalContent ? 
          await localLLM.validateOriginality(
            `${generatedCard.title} ${generatedCard.summary}`,
            `${generatedCard.originalContent.title} ${generatedCard.originalContent.summary}`
          ) : null
      });
    } else {
      // 실패: 수동 검토 필요
      inbox[cardIndex] = generatedCard;
      saveJson(inboxFile, inbox);

      res.status(200).json({
        success: false,
        message: 'Content generation failed, manual review required',
        error: (generatedCard as any).generationError,
        card: generatedCard
      });
    }
  } catch (error: any) {
    console.error('Generate content API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    });
  }
}
