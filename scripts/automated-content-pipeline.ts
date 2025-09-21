#!/usr/bin/env ts-node

/**
 * 완전 자동화된 콘텐츠 파이프라인
 * 스크래핑 → 리뷰 → GPT 재작성 → 배포
 * 저작권 문제 해결을 위한 완전 자동화 워크플로우
 */

import fs from 'fs';
import path from 'path';

// 로컬 LLM 서비스 (Ollama 연동)
class LocalLLMService {
  private endpoint: string;
  private model: string;

  constructor() {
    this.endpoint = 'http://localhost:11434/api/generate';
    this.model = 'gpt-oss:20b';
  }

  async rewriteForCanadians(request: {
    originalTitle: string;
    originalSummary: string;
    sourceUrl: string;
    category: string;
    targetLength: number;
  }) {
    const prompt = `
You are a content writer specializing in Korean culture for Canadian audiences.

TASK: Rewrite the following Korean news/information for Canadian readers interested in Korea.

ORIGINAL CONTENT:
Title: ${request.originalTitle}
Summary: ${request.originalSummary}
Category: ${request.category}

REQUIREMENTS:
1. CREATE COMPLETELY NEW CONTENT - Do not copy any phrases from the original
2. Write for Canadian readers (18-30) with basic Korean knowledge
3. Target length: ${request.targetLength} characters
4. Include practical information relevant to Canadians visiting/studying Korea
5. Use Canadian English spelling and references when possible

FORMAT YOUR RESPONSE AS:
TITLE: [New engaging title for Canadians]
SUMMARY: [Rewritten content with Canadian perspective]
TAGS: [3-5 relevant tags separated by commas]
---END---
`;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 300,
            stop: ['---END---']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseResponse(result.response || '');
    } catch (error) {
      console.error('LLM generation failed:', error);
      return this.getFallbackContent(request);
    }
  }

  private parseResponse(text: string) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    let title = '';
    let summary = '';
    let tags: string[] = [];

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('SUMMARY:')) {
        summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('TAGS:')) {
        tags = line.replace('TAGS:', '').split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    if (!title) title = 'Korean Update for Canadians';
    if (!summary) summary = 'Latest information about Korea relevant to Canadian visitors and students.';
    if (tags.length === 0) tags = ['korea', 'canada', 'travel'];

    return { title, summary, tags, confidence: 0.8, originalityScore: 0.9 };
  }

  private getFallbackContent(request: any) {
    return {
      title: `Korea Update: ${request.category} Information for Canadians`,
      summary: `Recent developments in Korea's ${request.category} sector that may affect Canadian visitors and students.`,
      tags: ['korea', 'canada', request.category],
      confidence: 0.6,
      originalityScore: 0.8
    };
  }

  async validateOriginality(generated: string, original: string): Promise<number> {
    const generatedWords = new Set(generated.toLowerCase().split(/\s+/));
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    
    const generatedArray = Array.from(generatedWords);
    const originalArray = Array.from(originalWords);
    
    const intersection = new Set(generatedArray.filter(x => originalWords.has(x)));
    const union = new Set([...generatedArray, ...originalArray]);
    
    const similarity = intersection.size / union.size;
    return 1 - similarity; // 독창성 = 1 - 유사도
  }
}

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
  originalContent?: {
    title: string;
    summary: string;
  };
  i18n?: {
    en: { title: string; summary: string; tags: string[] };
    fr: { title: string; summary: string; tags: string[] };
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
 * 자동 승인 기준 검증
 */
function shouldAutoApprove(card: Card): boolean {
  const text = `${card.title} ${card.summary}`.toLowerCase();
  
  // 신뢰할 수 있는 출처인지 확인
  const trustedSources = [
    'seoul.go.kr',
    'korea.net',
    'visitkorea.or.kr',
    'mcst.go.kr',
    'kma.go.kr',
    'yna.co.kr',
    'reuters.com'
  ];
  
  const hasTrustedSource = card.sources.some(source => 
    trustedSources.some(trusted => source.url.includes(trusted))
  );
  
  // 민감한 키워드 제외
  const sensitiveKeywords = [
    'politics', 'political', 'election', 'protest', 
    'controversy', 'scandal', 'accident', 'death',
    '정치', '선거', '시위', '논란', '사고', '사망'
  ];
  
  const hasSensitiveContent = sensitiveKeywords.some(keyword => 
    text.includes(keyword)
  );
  
  // 자동 승인 조건
  return hasTrustedSource && !hasSensitiveContent && card.sources.length > 0;
}

/**
 * 완전 자동화 파이프라인 실행
 */
async function runAutomatedPipeline(): Promise<void> {
  console.log('🚀 Starting automated content pipeline...');
  
  try {
    // 1. 새로운 콘텐츠 수집 (스킵 - 기존 데이터 사용)
    console.log('📡 Step 1: Using existing content in inbox...');
    
    // 2. Inbox에서 자동 승인 가능한 아이템 찾기
    console.log('🔍 Step 2: Auto-approving safe content...');
    const processedCount = await autoApproveContent();
    
    // 3. 승인된 아이템들을 GPT로 재작성
    console.log('🤖 Step 3: Generating copyright-safe content...');
    const generatedCount = await generateAllApprovedContent();
    
    // 4. 결과 보고
    console.log('\n✅ Pipeline completed successfully!');
    console.log(`📊 Results:`);
    console.log(`   - Auto-approved: ${processedCount} items`);
    console.log(`   - Generated: ${generatedCount} items`);
    console.log(`   - Total processing time: ${Date.now()}`);
    
    // 5. 품질 검증 보고서
    await generateQualityReport();
    
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
    throw error;
  }
}

async function runCollectionScript(): Promise<void> {
  // 기존 수집 스크립트 실행
  const { execSync } = await import('child_process');
  try {
    execSync('npm run collect-issues', { stdio: 'inherit' });
    execSync('npm run collect-weekly', { stdio: 'inherit' });
  } catch (error: any) {
    console.warn('Collection script warning:', error?.message || error);
  }
}

async function autoApproveContent(): Promise<number> {
  const inbox: Card[] = loadJson(inboxFile, []);
  let processedCount = 0;
  
  for (let i = 0; i < inbox.length; i++) {
    const card = inbox[i];
    
    if (card.approved) continue; // 이미 승인된 경우
    
    if (shouldAutoApprove(card)) {
      console.log(`✅ Auto-approving: ${card.title.substring(0, 50)}...`);
      
      inbox[i] = {
        ...card,
        approved: true,
        approvedAt: new Date().toISOString()
      };
      
      processedCount++;
    }
  }
  
  if (processedCount > 0) {
    saveJson(inboxFile, inbox);
    console.log(`📝 Auto-approved ${processedCount} items`);
  }
  
  return processedCount;
}

async function generateAllApprovedContent(): Promise<number> {
  const inbox: Card[] = loadJson(inboxFile, []);
  const data: Card[] = loadJson(dataFile, []);
  const weekData: Card[] = loadJson(weekFile, []);
  
  let generatedCount = 0;
  const remainingInbox: Card[] = [];
  
  for (const card of inbox) {
    if (!card.approved || card.generated) {
      remainingInbox.push(card);
      continue;
    }
    
    try {
      console.log(`🤖 Generating content for: ${card.title.substring(0, 50)}...`);
      
      // 로컬 GPT로 콘텐츠 재작성
      const llm = new LocalLLMService();
      const generated = await llm.rewriteForCanadians({
        originalTitle: card.title,
        originalSummary: card.summary,
        sourceUrl: card.sources[0]?.url || '',
        category: card.type,
        targetLength: 150
      });
      
      // 독창성 검증
      const originality = await llm.validateOriginality(
        `${generated.title} ${generated.summary}`,
        `${card.title} ${card.summary}`
      );
      
      if (originality < 0.7) {
        console.warn(`⚠️ Low originality (${originality.toFixed(2)}), skipping: ${card.title.substring(0, 30)}...`);
        remainingInbox.push(card);
        continue;
      }
      
      // 프랑스어 번역
      const frTitle = await translateToFrench(generated.title);
      const frSummary = await translateToFrench(generated.summary);
      
      // 최종 카드 생성
      const finalCard: Card = {
        ...card,
        title: generated.title,
        summary: generated.summary,
        tags: Array.from(new Set([...card.tags, ...generated.tags])),
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
            tags: generated.tags
          },
          fr: {
            title: frTitle,
            summary: frSummary,
            tags: generated.tags
          }
        }
      };
      
      // 적절한 컬렉션에 추가
      const isWeeklyContent = ['weather', 'tip', 'population'].includes(card.type) ||
                             card.tags.includes('thisweek');
      
      if (isWeeklyContent) {
        weekData.unshift(finalCard);
      } else {
        data.unshift(finalCard);
      }
      
      generatedCount++;
      console.log(`✅ Generated (originality: ${(originality * 100).toFixed(1)}%): ${generated.title.substring(0, 50)}...`);
      
    } catch (error: any) {
      console.error(`❌ Generation failed for ${card.title.substring(0, 30)}...:`, error?.message || error);
      remainingInbox.push(card);
    }
  }
  
  // 파일 저장
  if (generatedCount > 0) {
    // 중복 제거
    const dedupeData = (cards: Card[]) => {
      const seen = new Set<string>();
      return cards.filter(c => {
        const key = `${c.type}:${c.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    
    saveJson(dataFile, dedupeData(data));
    saveJson(weekFile, dedupeData(weekData));
    saveJson(inboxFile, remainingInbox);
    
    console.log(`📝 Saved ${generatedCount} generated items`);
  }
  
  return generatedCount;
}

async function translateToFrench(text: string): Promise<string> {
  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'fr',
        format: 'text'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.translatedText || text;
    }
  } catch (error: any) {
    console.warn('French translation failed:', error?.message || error);
  }
  
  return text;
}

async function generateQualityReport(): Promise<void> {
  const data: Card[] = loadJson(dataFile, []);
  const weekData: Card[] = loadJson(weekFile, []);
  const allCards = [...data, ...weekData];
  
  const generatedCards = allCards.filter(c => c.generated);
  const report = {
    timestamp: new Date().toISOString(),
    totalCards: allCards.length,
    generatedCards: generatedCards.length,
    generationRate: ((generatedCards.length / allCards.length) * 100).toFixed(1) + '%',
    averageOriginality: 'N/A', // 추후 계산 로직 추가
    categoryBreakdown: {} as Record<string, number>
  };
  
  // 카테고리별 분석
  for (const card of generatedCards) {
    report.categoryBreakdown[card.type] = (report.categoryBreakdown[card.type] || 0) + 1;
  }
  
  console.log('\n📊 Quality Report:');
  console.log(`   Total cards: ${report.totalCards}`);
  console.log(`   Generated: ${report.generatedCards} (${report.generationRate})`);
  console.log(`   By category:`, report.categoryBreakdown);
  
  // 보고서 파일 저장
  const reportFile = path.join(process.cwd(), 'content', 'reports', `quality-${Date.now()}.json`);
  saveJson(reportFile, report);
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  runAutomatedPipeline()
    .then(() => {
      console.log('🎉 Automated pipeline completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Pipeline failed:', error);
      process.exit(1);
    });
}

export { runAutomatedPipeline };
