#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Notion API 설정
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

if (!NOTION_TOKEN || !NOTION_DB_ID) {
  console.error('❌ Missing NOTION_TOKEN or NOTION_DB_ID environment variables');
  process.exit(1);
}

// Notion API 호출 함수
async function queryNotionDatabase() {
  const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      },
      sorts: [
        {
          property: 'Last Updated',
          direction: 'descending'
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 좌표 파싱 함수
function parseCoordinates(coordText) {
  if (!coordText) return null;
  const match = coordText.match(/([0-9.-]+),\s*([0-9.-]+)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (isNaN(lat) || isNaN(lng)) return null;
  return { lat, lng };
}

// 기간 파싱 함수
function parsePeriod(dateRange) {
  if (!dateRange || !dateRange.start) return null;
  return {
    start: dateRange.start,
    end: dateRange.end || dateRange.start
  };
}

// Notion 페이지를 RealKoreaCard로 변환
function transformNotionToCard(page) {
  const props = page.properties;
  
  // 기본 필드 추출
  const title = props.Title?.title?.[0]?.plain_text || '';
  const summary = props.Summary?.rich_text?.[0]?.plain_text || '';
  const type = props.Type?.select?.name?.toLowerCase() || 'issue';
  const area = props.Area?.rich_text?.[0]?.plain_text || '';
  const coordinates = parseCoordinates(props.Coordinates?.rich_text?.[0]?.plain_text);
  const period = parsePeriod(props.Period?.date);
  
  // 태그 추출
  const tags = props.Tags?.multi_select?.map(tag => tag.name) || [];
  
  // 출처 추출
  const sources = [];
  if (props.Source1?.url) {
    sources.push({
      url: props.Source1.url,
      title: props['Source1 Title']?.rich_text?.[0]?.plain_text || 'Source 1',
      publisher: props['Source1 Publisher']?.rich_text?.[0]?.plain_text || 'Publisher 1'
    });
  }
  if (props.Source2?.url) {
    sources.push({
      url: props.Source2.url,
      title: props['Source2 Title']?.rich_text?.[0]?.plain_text || 'Source 2',
      publisher: props['Source2 Publisher']?.rich_text?.[0]?.plain_text || 'Publisher 2'
    });
  }

  // 프랑스어 번역
  const frTitle = props['FR Title']?.rich_text?.[0]?.plain_text;
  const frSummary = props['FR Summary']?.rich_text?.[0]?.plain_text;
  const frTags = props['FR Tags']?.rich_text?.[0]?.plain_text?.split(',').map(t => t.trim()).filter(Boolean);

  // 지오 정보 구성
  let geo = null;
  if (coordinates) {
    geo = { ...coordinates, area };
  } else if (area) {
    // area만 있으면 별칭으로 처리 (클라이언트에서 좌표 변환)
    geo = { area };
  }

  return {
    id: page.id.replace(/-/g, ''),
    type,
    title,
    summary,
    tags,
    geo,
    period,
    sources,
    lastUpdatedKST: page.last_edited_time,
    i18n: (frTitle || frSummary || frTags) ? {
      fr: {
        title: frTitle,
        summary: frSummary,
        tags: frTags
      }
    } : undefined
  };
}

// 데이터 검증 함수
function validateCard(card) {
  const errors = [];
  
  if (!card.title || card.title.length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  
  if (!card.summary || card.summary.length < 10) {
    errors.push('Summary must be at least 10 characters');
  }
  
  if (!card.sources || card.sources.length < 1) {
    errors.push('At least 1 source is required');
  }
  
  if (!['issue', 'popup', 'congestion', 'tip', 'weather', 'hotspot', 'population'].includes(card.type)) {
    errors.push('Invalid card type');
  }

  return { isValid: errors.length === 0, errors };
}

// 메인 실행 함수
async function syncFromNotion() {
  try {
    console.log('🚀 Starting Notion sync...');
    
    // Notion에서 데이터 가져오기
    const notionData = await queryNotionDatabase();
    console.log(`📥 Fetched ${notionData.results.length} pages from Notion`);
    
    // 카드로 변환
    const cards = [];
    const errors = [];
    
    for (const page of notionData.results) {
      try {
        const card = transformNotionToCard(page);
        const validation = validateCard(card);
        
        if (validation.isValid) {
          cards.push(card);
        } else {
          errors.push({
            id: page.id,
            title: card.title || 'Untitled',
            errors: validation.errors
          });
        }
      } catch (error) {
        errors.push({
          id: page.id,
          title: 'Parse Error',
          errors: [error.message]
        });
      }
    }
    
    console.log(`✅ Converted ${cards.length} valid cards`);
    if (errors.length > 0) {
      console.log(`⚠️  ${errors.length} cards had errors:`);
      errors.forEach(err => {
        console.log(`  - ${err.title}: ${err.errors.join(', ')}`);
      });
    }
    
    // 기존 데이터와 병합 (로컬 우선)
    const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
    let existingCards = [];
    
    try {
      const existingData = fs.readFileSync(dataFile, 'utf8');
      existingCards = JSON.parse(existingData);
    } catch {
      console.log('📝 No existing data file found, creating new one');
    }
    
    // Notion 카드로 업데이트 (ID 기준 병합)
    const notionIds = new Set(cards.map(c => c.id));
    const localOnly = existingCards.filter(c => !notionIds.has(c.id));
    const finalCards = [...cards, ...localOnly];
    
    // 날짜순 정렬
    finalCards.sort((a, b) => new Date(b.lastUpdatedKST) - new Date(a.lastUpdatedKST));
    
    // 파일 저장
    const outputDir = path.dirname(dataFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(finalCards, null, 2));
    console.log(`💾 Saved ${finalCards.length} cards to ${dataFile}`);
    
    // 통계 출력
    const stats = finalCards.reduce((acc, card) => {
      acc[card.type] = (acc[card.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Card statistics:');
    Object.entries(stats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    // API 호출 카운트 (추정)
    const apiCalls = Math.ceil(notionData.results.length / 100) + 1; // 페이지네이션 고려
    console.log(`🔢 Estimated API calls used: ${apiCalls}`);
    
    return {
      success: true,
      cardsProcessed: cards.length,
      totalCards: finalCards.length,
      errors: errors.length,
      apiCalls
    };
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  syncFromNotion()
    .then(result => {
      if (result.success) {
        console.log(`\n🎉 Sync completed successfully!`);
        console.log(`📝 Processed: ${result.cardsProcessed} cards`);
        console.log(`💾 Total: ${result.totalCards} cards`);
        if (result.errors > 0) {
          console.log(`⚠️  Errors: ${result.errors} cards`);
        }
        console.log(`🔢 API calls: ~${result.apiCalls}/1000 monthly limit`);
      } else {
        console.error(`\n💥 Sync failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { syncFromNotion };
