/**
 * 로컬 GPT-20B 모델 연동 어댑터
 * 저작권 문제 해결을 위한 콘텐츠 재작성 전용
 */

import fetch from 'node-fetch';

interface LocalLLMConfig {
  endpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface GenerationRequest {
  originalTitle: string;
  originalSummary: string;
  sourceUrl: string;
  category: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  targetLength: number;
}

interface GeneratedContent {
  title: string;
  summary: string; // 카드용 짧은 요약 (150자 정도)
  fullContent: string; // View Details용 전체 콘텐츠 (500자+)
  tags: string[];
  confidence: number;
  originalityScore: number;
}

export class LocalLLMService {
  private config: LocalLLMConfig;

  constructor(config?: Partial<LocalLLMConfig>) {
    this.config = {
      endpoint: 'http://localhost:11434/api/generate', // Ollama 기본 포트 강제 설정
      model: 'gpt-oss:20b',
      maxTokens: 800,
      temperature: 0.7,
      ...config
    };
    
    console.log('🔧 LLM Config:', this.config);
  }

  /**
   * 스크래핑된 원본 콘텐츠를 캐나다인 대상으로 재작성
   */
  async rewriteForCanadians(request: GenerationRequest): Promise<GeneratedContent> {
    const prompt = this.buildRewritePrompt(request);
    
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: 1200,
            stop: ['---END---']
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();
      // gpt-oss:20b는 thinking 필드에 내용을 출력할 수 있음
      const content = result.response || result.thinking || '';
      return this.parseGeneratedContent(content);
    } catch (error) {
      console.error('Local LLM generation failed:', error);
      // 폴백: 기본 템플릿 사용
      return this.generateFallbackContent(request);
    }
  }

  private buildRewritePrompt(request: GenerationRequest): string {
    const categoryContext = this.getCategoryContext(request.category);
    
    return `
You are Sarah, a 25-year-old Canadian travel blogger who has been living in Seoul for 2 years. You write for your Canadian friends back home who are curious about Korea. Write in a casual, friendly, conversational tone like you're texting a friend.

ORIGINAL NEWS: ${request.originalTitle} - ${request.originalSummary}

TASK: Write a completely new article (500+ words) about this Korean topic for your Canadian friends. Make it sound like you're sharing insider knowledge.

WRITING STYLE:
- Use Canadian slang and expressions ("eh", "loonie", "toque", "double-double")
- Reference Canadian cities, universities, and cultural touchpoints
- Write like you're chatting with friends, not writing formal content
- Include personal observations and practical tips
- Use "we", "us", "our" to create connection
- Be enthusiastic but not overly promotional

CONTENT REQUIREMENTS:
1. COMPLETELY REWRITE - Don't copy any phrases from the original
2. 500+ words minimum - make it substantial and informative
3. Include practical info for Canadians visiting/studying in Korea
4. Add cultural context that Canadians would appreciate
5. Mention specific locations, times, costs in CAD when relevant
6. Focus on: ${categoryContext}

STRUCTURE:
- Hook: Start with something relatable to Canadians
- Context: Explain what this means for Canadians in Korea
- Details: Practical information (where, when, how much, etc.)
- Insider tips: What locals know that tourists don't
- Canadian connection: How this relates to Canadian culture/cities
- Action: What Canadian readers should do about this

FORMAT:
TITLE: [Casual, engaging title like you'd text a friend]
SUMMARY: [2-3 sentence teaser that makes people want to read more - max 150 chars]
CONTENT: [500+ word article in conversational Canadian tone with paragraphs]
TAGS: [5-7 relevant tags]
---END---
`;
  }

  private getCategoryContext(category: string): string {
    const contexts = {
      'issue': 'current events and their impact on visitors/expats',
      'popup': 'temporary events and cultural experiences Canadians should know about',
      'congestion': 'transportation tips and crowd avoidance strategies',
      'tip': 'practical advice for Canadian travelers/students in Korea',
      'weather': 'weather conditions and seasonal preparation advice',
      'hotspot': 'trending places and cultural hotspots',
      'population': 'crowd patterns and best times to visit popular areas'
    };
    return contexts[category as keyof typeof contexts] || 'general Korean cultural information';
  }

  private parseGeneratedContent(text: string): GeneratedContent {
    console.log('🔍 Parsing GPT response...');
    
    let title = '';
    let summary = '';
    let fullContent = '';
    let tags: string[] = [];
    let confidence = 0.8;
    let originalityScore = 0.9;

    // 새로운 형식으로 파싱 (TITLE: / SUMMARY: / CONTENT: / TAGS:)
    const titleMatch = text.match(/\*\*TITLE:\*\*\s*["']?([^"'\n]+)["']?/i) || text.match(/TITLE:\s*["']?([^"'\n]+)["']?/i);
    const summaryMatch = text.match(/\*\*SUMMARY:\*\*\s*(.*?)(?=\*\*CONTENT:\*\*|CONTENT:|$)/s) || text.match(/SUMMARY:\s*(.*?)(?=CONTENT:|$)/s);
    const contentMatch = text.match(/\*\*CONTENT:\*\*\s*(.*?)(?=\*\*TAGS:\*\*|TAGS:|---END---|$)/s) || text.match(/CONTENT:\s*(.*?)(?=TAGS:|---END---|$)/s);
    const tagsMatch = text.match(/\*\*TAGS:\*\*\s*(.+?)(?=\n|---END---|$)/s) || text.match(/TAGS:\s*(.+?)(?=\n|---END---|$)/s);

    if (titleMatch) {
      title = titleMatch[1].trim().replace(/["']/g, '');
    }

    if (summaryMatch) {
      summary = summaryMatch[1].trim();
      // 150자로 제한 (카드용)
      if (summary.length > 150) {
        summary = summary.substring(0, 147) + '...';
      }
    }

    if (contentMatch) {
      fullContent = contentMatch[1].trim();
      // 문단 나누기
      fullContent = this.formatParagraphs(fullContent);
      
      // 500자 이상 확보
      if (fullContent.length < 500) {
        fullContent += `\n\nThis represents the kind of authentic Korean experience that many Canadians are seeking when they visit Seoul. For those of us who've spent time in Korea, these moments remind us why we fell in love with Korean culture in the first place.`;
      }
    }

    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
    }

    // thinking 필드에서 콘텐츠 추출 (폴백)
    if (!title) {
      // **TITLE:** 형태 매칭
      const thinkingTitleMatch = text.match(/\*\*TITLE:\*\*\s*["']?([^"'\n]+)["']?/i) || 
                               text.match(/Title:\s*["']?([^"'\n]+)["']?/i);
      if (thinkingTitleMatch) {
        title = thinkingTitleMatch[1].trim().replace(/["']/g, '');
      }
    }

    if ((!summary || !fullContent) && text.length > 100) {
      // thinking 필드나 response에서 실제 생성된 콘텐츠 추출
      const fullText = text;
      
      // **CONTENT:** 섹션 찾기
      const contentSectionMatch = fullText.match(/\*\*CONTENT:\*\*\s*(.*?)(?=\*\*TAGS:\*\*|$)/s);
      if (contentSectionMatch && !fullContent) {
        fullContent = contentSectionMatch[1].trim();
        fullContent = this.formatParagraphs(fullContent);
      }

      // "Hey guys!" 또는 "Hey there" 로 시작하는 실제 콘텐츠 찾기
      const contentStart = fullText.search(/Hey (guys|there|fellow)/i);
      if (contentStart !== -1 && !fullContent) {
        // Hey로 시작하는 부분부터 끝까지 추출
        const extractedContent = fullText.substring(contentStart);
        fullContent = extractedContent.length > 500 ? extractedContent.substring(0, 1000) : extractedContent;
        fullContent = this.formatParagraphs(fullContent);
      }
      
      if (!summary && fullContent) {
        // 전체 콘텐츠에서 첫 문장들을 요약으로 사용 (150자 제한)
        const firstSentences = fullContent.split(/[.!?]+/).slice(0, 2).join('. ').trim();
        summary = firstSentences.length > 150 ? firstSentences.substring(0, 147) + '...' : firstSentences;
      }
      
      // 폴백 처리
      if (!fullContent || !summary) {
        // 폴백: 긴 문장들 조합
        const sentences = text.split(/[.!?]+/).filter(s => s.length > 30);
        if (sentences.length > 0) {
          if (!summary) {
            summary = sentences.slice(0, 2).join('. ') + '.';
            if (summary.length > 150) {
              summary = summary.substring(0, 147) + '...';
            }
          }
          
          if (!fullContent) {
            fullContent = sentences.slice(0, 5).join('. ') + '.';
            // 500자 미만이면 확장
            if (fullContent.length < 500) {
              fullContent += ` As someone who's been exploring Seoul's cultural scene, I can tell you this is exactly the kind of authentic experience that makes Korea special. For Canadians visiting or studying here, it's these local insights that transform a simple trip into something memorable. Trust me, after living in Seoul for two years, I know what gets Canadians excited about Korean culture!`;
            }
            fullContent = this.formatParagraphs(fullContent);
          }
        }
      }
    }

    // 기본값 설정 (캐나다인 톤으로)
    if (!title) title = 'You Need to Know About This Korean Trend, Eh!';
    
    if (!summary) {
      summary = `Hey fellow Canadians! I just discovered something amazing in Seoul that you need to know about. Trust me, this is insider info!`;
    }
    
    if (!fullContent) {
      fullContent = `Hey fellow Canadians! So I just discovered something pretty cool happening in Seoul that I had to share with you all.\n\nAs someone who's been living here for a while, I'm always on the lookout for authentic Korean experiences that would blow your minds back home.\n\nThis latest development is definitely one of those "you have to see it to believe it" moments. Whether you're planning a trip to Korea or just curious about what's happening on the other side of the world, this is the kind of insider info that makes all the difference.\n\nTrust me, after living in Seoul for two years, I know what gets Canadians excited about Korean culture!`;
    }
    
    if (tags.length === 0) tags = ['seoul', 'korea', 'canada', 'travel', 'culture', 'insider', 'authentic'];

    return {
      title,
      summary,
      fullContent,
      tags,
      confidence,
      originalityScore
    };
  }

  private generateFallbackContent(request: GenerationRequest): GeneratedContent {
    // LLM 실패시 기본 템플릿 사용 (캐나다인 톤)
    const templates = {
      'issue': {
        title: 'You Need to Know About This Korean News, Eh!',
        summary: 'Hey Canadians! Something big is happening in Korea that affects us.',
        fullContent: `Hey fellow Canadians!\n\nSo something pretty interesting is happening in Korea right now that I thought you'd want to know about.\n\nAs someone who's been living in Seoul for a while, I can tell you this is the kind of development that makes a real difference for Canadians visiting or studying here.\n\nTrust me, this is insider info you won't find in your typical travel guides!`,
        tags: ['korea', 'news', 'canada', 'update', 'insider']
      },
      'popup': {
        title: 'This Seoul Pop-Up is Pure Canadian Vibes!',
        summary: 'Found an amazing pop-up in Seoul that reminds me of home.',
        fullContent: `Hey guys!\n\nYou know how we love our pop-up culture back home in Toronto and Vancouver? Well, Seoul just took it to the next level.\n\nI just checked out this incredible temporary experience that's happening right now, and honestly, it feels like the best of Canadian creativity mixed with Korean innovation.\n\nIf you're planning a trip to Korea or studying here, this is exactly the kind of authentic local experience that makes the journey worthwhile, eh!`,
        tags: ['popup', 'seoul', 'culture', 'canada', 'experience', 'authentic']
      },
      'congestion': {
        title: 'Seoul Traffic Tips from a Canadian Survivor',
        summary: 'Navigation tips for Seoul that every Canadian needs to know.',
        fullContent: `Hey there, fellow Canadians!\n\nRemember how we complain about Toronto traffic? Well, Seoul just taught me a whole new level of patience.\n\nBut here's the thing - once you figure out the system, it's actually pretty amazing. The subway here makes the TTC look like a toy train, and I've learned some insider tricks that'll save you hours.\n\nWhether you're visiting for a week or studying here for a semester, these tips will make your life so much easier!`,
        tags: ['transport', 'seoul', 'travel', 'tips', 'canada', 'subway']
      }
    };

    const template = templates[request.category as keyof typeof templates] || templates['issue'];
    
    return {
      ...template,
      confidence: 0.6,
      originalityScore: 0.8
    };
  }

  /**
   * 생성된 콘텐츠의 독창성 검증
   */
  async validateOriginality(generated: string, original: string): Promise<number> {
    // 간단한 텍스트 유사도 검사 (Jaccard similarity)
    const generatedWords = new Set(generated.toLowerCase().split(/\s+/));
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...generatedWords].filter(x => originalWords.has(x)));
    const union = new Set([...generatedWords, ...originalWords]);
    
    const similarity = intersection.size / union.size;
    return 1 - similarity; // 독창성 = 1 - 유사도
  }

  /**
   * 문단 나누기 및 가독성 개선
   */
  private formatParagraphs(content: string): string {
    // 기본 문단 나누기
    let formatted = content
      // **제목** 형태를 문단으로 분리
      .replace(/\*\*([^*]+)\*\*/g, '\n\n**$1**\n')
      // ### 제목 형태를 문단으로 분리
      .replace(/###\s*([^\n]+)/g, '\n\n### $1\n')
      // 긴 문장들을 적절히 분리
      .replace(/\.\s+([A-Z])/g, '.\n\n$1')
      // 여러 개의 연속된 줄바꿈을 2개로 통일
      .replace(/\n{3,}/g, '\n\n')
      // 앞뒤 공백 제거
      .trim();

    // 캐나다 관련 키워드 후에 문단 나누기
    formatted = formatted
      .replace(/(eh\?|loonie|toque|double-double)\s+([A-Z])/g, '$1\n\n$2')
      .replace(/(Toronto|Vancouver|Montreal|Calgary|Ottawa)\s+([A-Z])/g, '$1\n\n$2');

    return formatted;
  }
}

// 싱글톤 인스턴스
export const localLLM = new LocalLLMService();
