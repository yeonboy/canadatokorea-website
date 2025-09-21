/**
 * 통합 검색 API
 * Today Cards, QnA, 페이지 콘텐츠를 통합 검색
 */

import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type SearchResult = {
  type: 'post' | 'qna' | 'tool' | 'guide';
  title: string;
  summary: string;
  url: string;
  category: string;
  lastUpdated: string;
  relevance: number;
  i18n?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, category = 'all', limit = 20 } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const query = q.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 1. Today Cards 검색
    const todayCardsFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
    if (fs.existsSync(todayCardsFile)) {
      const todayCards = JSON.parse(fs.readFileSync(todayCardsFile, 'utf8'));
      
      for (const card of todayCards) {
        const titleMatch = card.title?.toLowerCase().includes(query);
        const summaryMatch = card.summary?.toLowerCase().includes(query);
        const fullContentMatch = card.fullContent?.toLowerCase().includes(query);
        const tagsMatch = card.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const areaMatch = card.geo?.area?.toLowerCase().includes(query);
        
        // 영어/프랑스어 i18n 데이터도 검색
        const enTitleMatch = card.i18n?.en?.title?.toLowerCase().includes(query);
        const frTitleMatch = card.i18n?.fr?.title?.toLowerCase().includes(query);
        const enSummaryMatch = card.i18n?.en?.summary?.toLowerCase().includes(query);
        const frSummaryMatch = card.i18n?.fr?.summary?.toLowerCase().includes(query);
        
        if (titleMatch || summaryMatch || fullContentMatch || tagsMatch || areaMatch || 
            enTitleMatch || frTitleMatch || enSummaryMatch || frSummaryMatch) {
          let relevance = 0;
          if (titleMatch || enTitleMatch || frTitleMatch) relevance += 60;
          if (summaryMatch || enSummaryMatch || frSummaryMatch) relevance += 40;
          if (fullContentMatch) relevance += 30;
          if (areaMatch) relevance += 25;
          if (tagsMatch) relevance += 15;
          
          results.push({
            type: 'post',
            title: card.title,
            summary: (card.summary?.substring(0, 200) || '') + '...',
            url: `/real-korea-now/${card.id}`,
            category: 'real-korea-now',
            lastUpdated: card.lastUpdatedKST,
            relevance,
            i18n: card.i18n // i18n 데이터 포함
          });
        }
      }
    }

    // 1-2. Inbox 데이터도 검색 (더 많은 콘텐츠)
    const inboxFile = path.join(process.cwd(), 'content', 'data', 'inbox.json');
    if (fs.existsSync(inboxFile)) {
      const inboxCards = JSON.parse(fs.readFileSync(inboxFile, 'utf8'));
      
      for (const card of inboxCards.slice(0, 100)) { // 최대 100개만 검색
        const titleMatch = card.title?.toLowerCase().includes(query);
        const summaryMatch = card.summary?.toLowerCase().includes(query);
        const tagsMatch = card.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const areaMatch = card.geo?.area?.toLowerCase().includes(query);
        
        if (titleMatch || summaryMatch || tagsMatch || areaMatch) {
          let relevance = 0;
          if (titleMatch) relevance += 50;
          if (summaryMatch) relevance += 30;
          if (areaMatch) relevance += 20;
          if (tagsMatch) relevance += 10;
          
          // 중복 제거 (이미 today-cards에 있는 것은 제외)
          const isDuplicate = results.some(r => r.title === card.title);
          if (!isDuplicate) {
            results.push({
              type: 'post',
              title: card.title,
              summary: (card.summary?.substring(0, 200) || '') + '...',
              url: `/real-korea-now/${card.id}`,
              category: 'real-korea-now',
              lastUpdated: card.lastUpdatedKST,
              relevance: relevance * 0.8, // inbox는 약간 낮은 우선순위
              i18n: card.i18n // i18n 데이터 포함
            });
          }
        }
      }
    }

    // 2. QnA 검색
    const qnaFile = path.join(process.cwd(), 'content', 'qna', 'sample-qna.json');
    if (fs.existsSync(qnaFile)) {
      const qnaItems = JSON.parse(fs.readFileSync(qnaFile, 'utf8'));
      
      for (const item of qnaItems) {
        const questionMatch = item.question?.toLowerCase().includes(query);
        const answerMatch = item.answer?.toLowerCase().includes(query);
        const tagsMatch = item.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        
        if (questionMatch || answerMatch || tagsMatch) {
          let relevance = 0;
          if (questionMatch) relevance += 60;
          if (answerMatch) relevance += 30;
          if (tagsMatch) relevance += 10;
          
          results.push({
            type: 'qna',
            title: item.question,
            summary: item.answer?.substring(0, 200) + '...',
            url: `/tools/qna?topic=${item.topic}#${item.id}`,
            category: 'qna',
            lastUpdated: item.lastUpdatedKST,
            relevance,
            i18n: item.i18n // i18n 데이터 포함
          });
        }
      }
    }

    // 3. 정적 페이지 검색 (제목과 설명 기반) - 확장된 콘텐츠
    const staticPages = [
      // Tools
      {
        title: 'Cost Estimator - Compare Canada vs Korea Living Costs',
        summary: 'Calculate and compare living costs between Canada and Korea with real exchange rates, rent, food, transportation costs.',
        url: '/tools/cost-estimator',
        category: 'tools',
        keywords: ['cost', 'money', 'budget', 'price', 'expense', 'living', 'comparison', 'rent', 'food', 'transport', 'calculator']
      },
      {
        title: 'Korea QnA - Frequently Asked Questions',
        summary: 'Find answers to common questions about life in Korea, visas, housing, work, study, and cultural adaptation.',
        url: '/tools/qna',
        category: 'qna',
        keywords: ['qna', 'questions', 'answers', 'visa', 'housing', 'work', 'study', 'culture', 'help', 'faq']
      },
      
      // Learn Korean
      {
        title: 'Learn Korean - Practical Phrases for Canadians',
        summary: 'Korean language learning resources designed specifically for Canadian learners with practical phrases, pronunciation guides.',
        url: '/learn',
        category: 'learn-korean',
        keywords: ['korean', 'language', 'learn', 'study', 'phrases', 'pronunciation', 'grammar', 'conversation', 'beginner']
      },
      
      // Travel & Food
      {
        title: 'Travel & Food Guide - Complete Korea Travel Guide',
        summary: 'Complete travel guide with local food recommendations, restaurant reviews, and practical tips for Canadians visiting Korea.',
        url: '/travel-food',
        category: 'travel-food',
        keywords: ['travel', 'food', 'restaurant', 'guide', 'tourism', 'eating', 'local', 'korean cuisine', 'street food', 'dining']
      },
      
      // Community
      {
        title: 'Community Groups and Events - Connect with Korean Communities',
        summary: 'Connect with Korean communities in Canada and find offline communities for foreigners in Korea.',
        url: '/community',
        category: 'community',
        keywords: ['community', 'group', 'event', 'meet', 'social', 'networking', 'expat', 'foreigner', 'korean canadian']
      },
      
      // K-Pop
      {
        title: 'K-Pop Culture and Artists - Korean Pop Music Guide',
        summary: 'Your gateway to Korean pop culture with artist profiles, official schedules, concert info, and Canadian K-pop connections.',
        url: '/k-pop',
        category: 'k-pop',
        keywords: ['kpop', 'k-pop', 'music', 'artist', 'idol', 'concert', 'culture', 'bts', 'blackpink', 'entertainment']
      },
      
      // City Guides
      {
        title: 'Seoul Living Guide - Complete Seoul City Guide',
        summary: 'Comprehensive guide for living in Seoul including neighborhoods, transportation, housing, and daily life tips for foreigners.',
        url: '/city/seoul',
        category: 'city-guide',
        keywords: ['seoul', 'living', 'city', 'neighborhood', 'transport', 'daily', 'life', 'housing', 'districts', 'subway']
      },
      
      // Specific Areas
      {
        title: 'Gangnam District Guide - Business and Shopping Hub',
        summary: 'Everything about Gangnam district: business centers, shopping, dining, and entertainment options.',
        url: '/city/seoul#gangnam',
        category: 'city-guide',
        keywords: ['gangnam', 'business', 'shopping', 'district', 'seoul', 'entertainment', 'luxury']
      },
      {
        title: 'Hongdae Nightlife and Student Area Guide',
        summary: 'Guide to Hongdae area: student life, nightlife, clubs, bars, and young culture in Seoul.',
        url: '/city/seoul#hongdae',
        category: 'city-guide',
        keywords: ['hongdae', 'nightlife', 'student', 'clubs', 'bars', 'young', 'university', 'party']
      },
      {
        title: 'Itaewon International District Guide',
        summary: 'Itaewon guide for foreigners: international restaurants, bars, shopping, and expat community.',
        url: '/city/seoul#itaewon',
        category: 'city-guide',
        keywords: ['itaewon', 'international', 'foreigner', 'expat', 'restaurants', 'bars', 'multicultural']
      },
      {
        title: 'Myeongdong Shopping and Tourist Guide',
        summary: 'Myeongdong shopping guide: cosmetics, fashion, street food, and tourist attractions.',
        url: '/city/seoul#myeongdong',
        category: 'city-guide',
        keywords: ['myeongdong', 'shopping', 'cosmetics', 'fashion', 'tourist', 'street food', 'beauty']
      }
    ];

    for (const page of staticPages) {
      const titleMatch = page.title.toLowerCase().includes(query);
      const summaryMatch = page.summary.toLowerCase().includes(query);
      const keywordMatch = page.keywords.some(keyword => keyword.includes(query) || query.includes(keyword));
      
      if (titleMatch || summaryMatch || keywordMatch) {
        let relevance = 0;
        if (titleMatch) relevance += 70;
        if (summaryMatch) relevance += 40;
        if (keywordMatch) relevance += 20;
        
        results.push({
          type: 'guide',
          title: page.title,
          summary: page.summary,
          url: page.url,
          category: page.category,
          lastUpdated: new Date().toISOString(),
          relevance
        });
      }
    }

    // 관련도 순으로 정렬
    results.sort((a, b) => b.relevance - a.relevance);

    // 카테고리 필터 적용
    const filteredResults = category === 'all' 
      ? results 
      : results.filter(result => result.category === category);

    // 제한 적용
    const limitedResults = filteredResults.slice(0, parseInt(limit as string, 10));

    return res.status(200).json({
      success: true,
      query: q,
      category,
      results: limitedResults,
      total: filteredResults.length,
      searchTime: Date.now()
    });

  } catch (error: any) {
    console.error('Search error:', error);
    return res.status(500).json({
      error: 'Search failed',
      details: error?.message || 'Unknown error'
    });
  }
}
