// 단순화된 번역 함수 - 테스트용

export async function simpleTranslateToFrench(text: string): Promise<string> {
  // 텍스트가 너무 길면 분할하여 번역
  if (text.length > 400) {
    console.log(`🔄 [Simple] Text too long (${text.length} chars), splitting...`);
    return await translateLongText(text);
  }

  // 1차: MyMemory API (짧은 텍스트)
  try {
    console.log(`🔄 [Simple] Translating: ${text.substring(0, 30)}...`);
    
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`);

    if (response.ok) {
      const result = await response.json();
      let translated = result.responseData?.translatedText || '';
      
      if (translated && translated.length > 3 && translated !== text && !translated.includes('MYMEMORY WARNING') && !translated.includes('QUERY LENGTH LIMIT')) {
        // 캐나다식 후처리
        translated = applyCanadianFrench(translated);
        console.log(`✅ [Simple] Translation successful: ${translated.substring(0, 30)}...`);
        return translated;
      }
    }
  } catch (error: any) {
    console.warn('[Simple] MyMemory failed:', error?.message || error);
  }

  // 2차: 기본 키워드 번역
  console.log('🔄 [Simple] Using keyword fallback...');
  return keywordOnlyTranslation(text);
}

async function translateLongText(text: string): Promise<string> {
  // 문장 단위로 분할 (400자 이하로)
  const sentences = text.split(/[.!?]\s+/).filter(s => s.trim());
  const translatedSentences: string[] = [];
  
  for (const sentence of sentences) {
    if (sentence.trim().length === 0) continue;
    
    const fullSentence = sentence.trim() + (sentence.match(/[.!?]$/) ? '' : '.');
    
    if (fullSentence.length > 400) {
      // 문장이 너무 길면 키워드 번역만
      translatedSentences.push(keywordOnlyTranslation(fullSentence));
    } else {
      try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(fullSentence)}&langpair=en|fr`);
        
        if (response.ok) {
          const result = await response.json();
          let translated = result.responseData?.translatedText || '';
          
          if (translated && !translated.includes('QUERY LENGTH LIMIT') && !translated.includes('MYMEMORY WARNING')) {
            translatedSentences.push(applyCanadianFrench(translated));
          } else {
            translatedSentences.push(keywordOnlyTranslation(fullSentence));
          }
        } else {
          translatedSentences.push(keywordOnlyTranslation(fullSentence));
        }
      } catch {
        translatedSentences.push(keywordOnlyTranslation(fullSentence));
      }
      
      // API 호출 제한 방지 (100ms 대기)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return translatedSentences.join(' ');
}

function applyCanadianFrench(text: string): string {
  const replacements: [string, string][] = [
    // 지명 우선 처리
    ['Corée du Sud', 'Corée'],
    ['Seoul', 'Séoul'],
    
    // 인사말
    ['Salut tout le monde', 'Salut les amis!'],
    ['Bonjour les gars', 'Salut les amis!'],
    ['Hey les gars', 'Salut les amis!'],
    
    // 용어 정리
    ['pop-up', 'pop-up'], // 일관성 유지
    ['popup', 'pop-up'],
    
    // 캐나다 특화
    ['double-double', 'double-double'], // 원형 유지
    ['eh', 'hein']
  ];

  let result = text;
  for (const [from, to] of replacements) {
    result = result.replace(new RegExp(from, 'gi'), to);
  }
  
  return result;
}

function keywordOnlyTranslation(text: string): string {
  // 확장된 번역 사전 - 제목과 핵심 표현들
  const keywords: Record<string, string> = {
    // 지명
    'Korea': 'Corée',
    'Seoul': 'Séoul',
    'Canada': 'Canada',
    'Canadian': 'canadien',
    'Canadians': 'canadiens',
    
    // 인사말과 표현
    'Hey guys!': 'Salut les amis!',
    'Hey there!': 'Salut!',
    'Hey fellow Canadians!': 'Salut, mes compatriotes canadiens!',
    'Hey fam!': 'Salut la famille!',
    
    // 핵심 동사/형용사
    'Rally Roadblocks': 'Barrages de Manifestation',
    'How to Keep': 'Comment Maintenir',
    'Your Loonie-Traveling Life': 'Votre Vie de Voyage au Huard',
    'Smooth': 'Sans Problème',
    'Roadblocks': 'barrages routiers',
    'Rally': 'manifestation',
    'Traffic': 'circulation',
    'Life': 'vie',
    'Traveling': 'voyage',
    'Travel': 'voyage',
    'Keep': 'maintenir',
    'Your': 'votre',
    'How': 'comment',
    'Loonie': 'huard',
    
    // 기타 용어
    'pop-up': 'pop-up',
    'event': 'événement',
    'culture': 'culture',
    'insider': 'initié',
    'authentic': 'authentique',
    'experience': 'expérience',
    'amazing': 'incroyable',
    'discover': 'découvrir',
    'trust me': 'croyez-moi',
    'double-double': 'double-double'
  };

  // 긴 구문부터 먼저 번역 (더 정확한 번역을 위해)
  const sortedKeywords = Object.entries(keywords).sort((a, b) => b[0].length - a[0].length);

  let result = text;
  for (const [en, fr] of sortedKeywords) {
    // 단어 경계 없이 정확한 매칭 (구문 번역을 위해)
    if (en.includes(' ')) {
      result = result.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), fr);
    } else {
      result = result.replace(new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), fr);
    }
  }
  
  return result;
}
