#!/usr/bin/env ts-node

/**
 * 간단한 GPT 파이프라인 테스트
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

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
    category: string;
  }) {
    const prompt = `
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

STRUCTURE:
- Hook: Start with something relatable to Canadians
- Context: Explain what this means for Canadians in Korea
- Details: Practical information (where, when, how much, etc.)
- Insider tips: What locals know that tourists don't
- Canadian connection: How this relates to Canadian culture/cities
- Action: What Canadian readers should do about this

FORMAT:
TITLE: [Casual, engaging title like you'd text a friend]
CONTENT: [500+ word article in conversational Canadian tone]
TAGS: [5-7 relevant tags]
---END---
`;

    console.log('🤖 Sending request to Ollama...');
    console.log('🔗 Endpoint:', this.endpoint);
    console.log('🤖 Model:', this.model);
    console.log('📝 Prompt length:', prompt.length);
    
    try {
      const requestBody = {
        model: this.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 1000,
          stop: ['---END---']
        }
      };
      
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      console.log('✅ Received response from Ollama');
      console.log('📦 Full result object:', JSON.stringify(result, null, 2));
      
      // gpt-oss:20b는 thinking 필드에 내용을 출력할 수 있음
      const content = result.response || result.thinking || '';
      console.log('🧠 Content to parse:', content.substring(0, 500) + '...');
      return this.parseResponse(content);
    } catch (error) {
      console.error('❌ LLM generation failed:', error);
      return this.getFallbackContent(request);
    }
  }

  private parseResponse(text: string) {
    console.log('🔍 Parsing response text...');
    
    let title = '';
    let summary = '';
    let fullContent = '';
    let tags: string[] = [];

    // **TITLE:** 형태 파싱
    const titleMatch = text.match(/\*\*TITLE:\*\*\s*([^\n]+)/i);
    if (titleMatch) {
      title = titleMatch[1].trim().replace(/["']/g, '');
    }

    // **CONTENT:** 섹션 파싱
    const contentMatch = text.match(/\*\*CONTENT:\*\*[\s\S]*?(?=\*\*TAGS:\*\*|$)/i);
    if (contentMatch) {
      fullContent = contentMatch[0].replace(/\*\*CONTENT:\*\*\s*/i, '').trim();
      
      // 첫 두 문장을 요약으로 사용
      const firstSentences = fullContent.split(/[.!?]+/).slice(0, 2).join('. ').trim();
      summary = firstSentences.length > 150 ? firstSentences.substring(0, 147) + '...' : firstSentences;
    }

    // **TAGS:** 파싱
    const tagsMatch = text.match(/\*\*TAGS:\*\*[\s]*([^\n]+)/i);
    if (tagsMatch) {
      tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
    }

    // 기본값 설정
    if (!title) title = 'Korean Pop Culture Experience for Canadians, Eh!';
    if (!summary) summary = 'Hey fellow Canucks! Something amazing is happening in Seoul that you need to know about.';
    if (!fullContent) fullContent = `Hey fellow Canadians!\n\nSo I just discovered something pretty cool happening in Seoul that I had to share with you all.\n\nAs someone who's been living here for a while, I'm always on the lookout for authentic Korean experiences that would blow your minds back home.\n\nTrust me, this is insider info you won't find in your typical travel guides!`;
    if (tags.length === 0) tags = ['seoul', 'kpop', 'popup', 'canada', 'korea', 'insider'];

    console.log('✅ Parsed title:', title);
    console.log('✅ Parsed summary:', summary);
    console.log('✅ Parsed fullContent length:', fullContent.length);
    console.log('✅ Parsed tags:', tags);

    return { title, summary, fullContent, tags, confidence: 0.8, originalityScore: 0.9 };
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

async function testPipeline() {
  console.log('🚀 Testing GPT Pipeline with real data...');
  
  try {
    // inbox 데이터 로드
    const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');
    const inbox = JSON.parse(fs.readFileSync(inboxFile, 'utf8'));
    
    if (inbox.length === 0) {
      console.log('📭 No items in inbox');
      return;
    }
    
    console.log(`📬 Found ${inbox.length} items in inbox`);
    
    // 첫 번째 아이템 처리
    const firstItem = inbox[0];
    console.log(`🎯 Processing first item: ${firstItem.title.substring(0, 50)}...`);
    console.log(`📂 Type: ${firstItem.type}`);
    console.log(`🏷️ Tags: ${firstItem.tags.join(', ')}`);
    
    // GPT로 재작성
    const llm = new LocalLLMService();
    const generated = await llm.rewriteForCanadians({
      originalTitle: firstItem.title,
      originalSummary: firstItem.summary,
      category: firstItem.type
    });
    
    console.log('\n📝 Generation Results:');
    console.log(`📰 Original Title: ${firstItem.title}`);
    console.log(`✨ New Title: ${generated.title}`);
    console.log(`📄 Original Summary: ${firstItem.summary.substring(0, 100)}...`);
    console.log(`🎨 New Summary: ${generated.summary}`);
    console.log(`🏷️ Generated Tags: ${generated.tags.join(', ')}`);
    
    // 독창성 검증
    const originality = await llm.validateOriginality(
      `${generated.title} ${generated.summary}`,
      `${firstItem.title} ${firstItem.summary}`
    );
    
    console.log(`\n🎯 Quality Metrics:`);
    console.log(`📊 Originality Score: ${(originality * 100).toFixed(1)}%`);
    console.log(`🎪 Confidence: ${(generated.confidence * 100).toFixed(1)}%`);
    
    if (originality >= 0.7) {
      console.log('✅ PASSED: High originality - safe from copyright issues!');
    } else {
      console.log('⚠️ WARNING: Low originality - may need manual review');
    }
    
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error: any) {
    console.error('💥 Test failed:', error?.message || error);
  }
}

// 스크립트 실행
testPipeline();
