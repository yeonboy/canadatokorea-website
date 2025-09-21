/**
 * AI 콘텐츠 수정 요청 API
 * 사용자가 직접 AI에게 수정 요청을 할 수 있는 엔드포인트
 */

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { title, content, request, language = 'korean' } = req.body;

    if (!title && !content) {
      return res.status(400).json({ 
        success: false, 
        message: '제목 또는 내용이 필요합니다' 
      });
    }

    if (!request || !request.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: '수정 요청 내용이 필요합니다' 
      });
    }

    console.log(`🤖 AI 수정 요청 시작: ${request.substring(0, 50)}...`);

    let aiResponse = '';

    // 1차 시도: Ollama 로컬 LLM
    try {
      console.log('🔄 Ollama 로컬 LLM 시도 중...');
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-oss:20b',
          prompt: buildModificationPrompt(title, content, request, language),
          stream: false,
          options: {
            temperature: 0.3,
            num_predict: Math.min(4000, (title.length + content.length) * 2),
            stop: ['---END---', 'ORIGINAL:', 'REQUEST:']
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        aiResponse = (result.response || '').trim();
        
        if (aiResponse && aiResponse.length > 10) {
          console.log('✅ Ollama 성공');
        } else {
          throw new Error('Ollama 응답이 비어있음');
        }
      } else {
        throw new Error(`Ollama API 오류: ${response.status}`);
      }
    } catch (ollamaError: any) {
      console.warn('⚠️ Ollama 실패, 대체 방법 시도:', ollamaError.message);
      
      // 2차 시도: 간단한 텍스트 처리 (프랑스어 번역 등)
      aiResponse = await fallbackTextProcessing(title, content, request, language);
    }

    if (!aiResponse) {
      throw new Error('AI 응답이 비어있습니다');
    }

    console.log(`✅ AI 수정 완료: ${aiResponse.substring(0, 100)}...`);

    // AI 응답 파싱
    const parsed = parseAiResponse(aiResponse);

    if (!parsed.modifiedTitle && !parsed.modifiedContent) {
      throw new Error('AI가 유효한 수정 결과를 생성하지 못했습니다');
    }

    return res.status(200).json({
      success: true,
      modifiedTitle: parsed.modifiedTitle || title,
      modifiedContent: parsed.modifiedContent || content,
      originalRequest: request,
      aiResponse: aiResponse.substring(0, 500) + '...' // 로그용
    });

  } catch (error: any) {
    console.error('❌ AI 수정 요청 실패:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'AI 수정 중 오류가 발생했습니다',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * AI 수정 요청을 위한 프롬프트 생성
 */
function buildModificationPrompt(title: string, content: string, request: string, language: string): string {
  const languageInstruction = language === 'french' 
    ? 'Respond in Canadian French'
    : language === 'english' 
    ? 'Respond in Canadian English' 
    : 'Respond in Korean';

  return `You are a professional content editor specializing in Korean culture content for Canadian audiences.

ORIGINAL TITLE: "${title}"

ORIGINAL CONTENT: "${content}"

USER REQUEST: "${request}"

INSTRUCTIONS:
1. ${languageInstruction}
2. Follow the user's specific request exactly
3. Maintain the original meaning while implementing the requested changes
4. Keep the tone appropriate for Canadian readers interested in Korean culture
5. If translating to French, use Canadian French expressions
6. If the request is unclear, make reasonable improvements

FORMAT YOUR RESPONSE EXACTLY AS:
MODIFIED_TITLE: [Your modified title here]
MODIFIED_CONTENT: [Your modified content here]
---END---

Begin your modification now:`;
}

/**
 * AI 응답 파싱
 */
function parseAiResponse(response: string): { modifiedTitle?: string; modifiedContent?: string } {
  const result: { modifiedTitle?: string; modifiedContent?: string } = {};

  // MODIFIED_TITLE 추출
  const titleMatch = response.match(/MODIFIED_TITLE:\s*(.*?)(?=\nMODIFIED_CONTENT:|$)/s);
  if (titleMatch) {
    result.modifiedTitle = titleMatch[1].trim();
  }

  // MODIFIED_CONTENT 추출
  const contentMatch = response.match(/MODIFIED_CONTENT:\s*(.*?)(?=---END---|$)/s);
  if (contentMatch) {
    result.modifiedContent = contentMatch[1].trim();
  }

  // 만약 형식이 맞지 않으면 전체 응답을 콘텐츠로 사용
  if (!result.modifiedTitle && !result.modifiedContent) {
    // 간단한 파싱 시도
    const lines = response.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      // 첫 번째 줄을 제목으로, 나머지를 내용으로 처리
      result.modifiedTitle = lines[0].replace(/^(제목|title):\s*/i, '').trim();
      if (lines.length > 1) {
        result.modifiedContent = lines.slice(1).join('\n').trim();
      }
    }
  }

  return result;
}

/**
 * Ollama 실패 시 대체 텍스트 처리
 */
async function fallbackTextProcessing(title: string, content: string, request: string, language: string): Promise<string> {
  const requestLower = request.toLowerCase();
  
  // 프랑스어 번역 요청 감지
  if (requestLower.includes('프랑스어') || requestLower.includes('french') || requestLower.includes('français')) {
    console.log('🔄 프랑스어 번역 요청 감지, MyMemory API 사용...');
    
    try {
      const translatedTitle = await translateWithMyMemory(title, 'en', 'fr');
      const translatedContent = await translateWithMyMemory(content, 'en', 'fr');
      
      return `MODIFIED_TITLE: ${translatedTitle}
MODIFIED_CONTENT: ${translatedContent}
---END---`;
    } catch (error) {
      console.warn('MyMemory 번역 실패:', error);
    }
  }
  
  // 영어 번역 요청 감지
  if (requestLower.includes('영어') || requestLower.includes('english')) {
    console.log('🔄 영어 번역 요청 감지, 기본 처리...');
    
    // 이미 영어인 경우 그대로 반환
    if (isEnglishText(title) && isEnglishText(content)) {
      return `MODIFIED_TITLE: ${title}
MODIFIED_CONTENT: ${content}
---END---`;
    }
    
    try {
      const translatedTitle = await translateWithMyMemory(title, 'ko', 'en');
      const translatedContent = await translateWithMyMemory(content, 'ko', 'en');
      
      return `MODIFIED_TITLE: ${translatedTitle}
MODIFIED_CONTENT: ${translatedContent}
---END---`;
    } catch (error) {
      console.warn('영어 번역 실패:', error);
    }
  }
  
  // 기타 수정 요청 - 간단한 텍스트 개선
  console.log('🔄 기본 텍스트 개선 처리...');
  
  let modifiedTitle = title;
  let modifiedContent = content;
  
  // 제목을 더 흥미롭게 만들기
  if (requestLower.includes('흥미') || requestLower.includes('interesting') || requestLower.includes('catchy')) {
    modifiedTitle = makeMoreInteresting(title);
  }
  
  // 캐나다인 친화적으로 만들기
  if (requestLower.includes('캐나다') || requestLower.includes('canadian')) {
    modifiedContent = makeCanadianFriendly(content);
  }
  
  // 더 친근하게 만들기
  if (requestLower.includes('친근') || requestLower.includes('friendly') || requestLower.includes('casual')) {
    modifiedContent = makeFriendly(content);
  }
  
  return `MODIFIED_TITLE: ${modifiedTitle}
MODIFIED_CONTENT: ${modifiedContent}
---END---`;
}

/**
 * MyMemory API를 사용한 번역
 */
async function translateWithMyMemory(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;
  
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
    
    if (response.ok) {
      const result = await response.json();
      const translated = result.responseData?.translatedText || '';
      
      if (translated && !translated.includes('MYMEMORY WARNING') && !translated.includes('QUERY LENGTH LIMIT')) {
        return translated;
      }
    }
  } catch (error) {
    console.warn('MyMemory 번역 실패:', error);
  }
  
  return text; // 실패 시 원본 반환
}

/**
 * 영어 텍스트 감지
 */
function isEnglishText(text: string): boolean {
  const englishChars = text.match(/[a-zA-Z]/g) || [];
  const koreanChars = text.match(/[가-힣]/g) || [];
  return englishChars.length > koreanChars.length;
}

/**
 * 제목을 더 흥미롭게 만들기
 */
function makeMoreInteresting(title: string): string {
  // 감탄사나 이모지 추가
  if (!title.includes('!') && !title.includes('?')) {
    title += '!';
  }
  
  // 캐나다 관련 표현 추가
  if (title.toLowerCase().includes('korea') && !title.toLowerCase().includes('canadian')) {
    title = title.replace(/korea/gi, 'Korea for Canadians');
  }
  
  return title;
}

/**
 * 캐나다인 친화적으로 만들기
 */
function makeCanadianFriendly(content: string): string {
  let result = content;
  
  // 캐나다 관련 표현 추가
  const canadianPhrases = [
    'Hey fellow Canadians!',
    'eh?',
    'double-double',
    'loonie',
    'toonie'
  ];
  
  // 인사말이 없으면 추가
  if (!result.toLowerCase().includes('hey') && !result.toLowerCase().includes('hello')) {
    result = 'Hey fellow Canadians!\n\n' + result;
  }
  
  return result;
}

/**
 * 더 친근하게 만들기
 */
function makeFriendly(content: string): string {
  let result = content;
  
  // 딱딱한 표현을 친근하게 변경
  const friendlyReplacements: [string, string][] = [
    ['It is recommended', 'I\'d recommend'],
    ['You should', 'You might want to'],
    ['It is important', 'It\'s really helpful'],
    ['Furthermore', 'Also'],
    ['Therefore', 'So'],
    ['However', 'But hey'],
  ];
  
  for (const [formal, friendly] of friendlyReplacements) {
    result = result.replace(new RegExp(formal, 'gi'), friendly);
  }
  
  return result;
}
