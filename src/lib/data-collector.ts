import { RealKoreaCard, Source } from '@/types';

// RSS 피드 수집기
export class RSSCollector {
  private sources: Source[] = [];

  constructor(sources: Source[]) {
    this.sources = sources;
  }

  async collectFeeds(): Promise<any[]> {
    const results = [];

    for (const source of this.sources) {
      try {
        // 실제로는 RSS 파서 사용
        console.log(`Collecting from ${source.url}`);
        
        // Mock 데이터 반환
        results.push({
          source: source,
          items: [
            {
              title: `Sample news from ${source.publisher}`,
              summary: 'Sample summary',
              link: source.url,
              publishedAt: new Date().toISOString()
            }
          ]
        });
      } catch (error) {
        console.error(`Failed to collect from ${source.url}:`, error);
      }
    }

    return results;
  }
}

// 지자체 오픈데이터 수집기
export class OpenDataCollector {
  private apiKeys: Record<string, string> = {};

  constructor(apiKeys: Record<string, string>) {
    this.apiKeys = apiKeys;
  }

  async collectSeoulEvents(): Promise<any[]> {
    try {
      // 실제로는 서울시 오픈데이터 API 호출
      console.log('Collecting Seoul events from open data API');
      
      // Mock 데이터
      return [
        {
          title: 'Seoul Pop-up Festival',
          location: 'Hongdae',
          startDate: '2025-09-10',
          endDate: '2025-09-15',
          category: 'popup'
        }
      ];
    } catch (error) {
      console.error('Failed to collect Seoul events:', error);
      return [];
    }
  }

  async collectTrafficData(): Promise<any[]> {
    try {
      // 실제로는 TOPIS API 호출
      console.log('Collecting traffic data from TOPIS');
      
      // Mock 데이터
      return [
        {
          line: 'Line 2',
          section: 'Hongik Univ - Sinchon',
          status: 'delay',
          message: '10-15 minute delays due to signal issues',
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to collect traffic data:', error);
      return [];
    }
  }
}

// 콘텐츠 변환기
export class ContentTransformer {
  static transformToRealKoreaCard(
    rawData: any, 
    type: 'issue' | 'popup' | 'congestion' | 'tip',
    sources: Source[]
  ): RealKoreaCard {
    return {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      title: rawData.title || 'Untitled',
      summary: rawData.summary || rawData.message || 'No summary available',
      tags: rawData.tags || [],
      geo: rawData.geo ? {
        lat: rawData.geo.lat,
        lng: rawData.geo.lng,
        area: rawData.geo.area
      } : undefined,
      period: rawData.period ? {
        start: rawData.period.start,
        end: rawData.period.end
      } : undefined,
      sources,
      lastUpdatedKST: new Date().toISOString()
    };
  }
}

// 메인 데이터 수집 오케스트레이터
export class DataCollectionOrchestrator {
  private rssCollector: RSSCollector;
  private openDataCollector: OpenDataCollector;

  constructor() {
    // 실제 RSS 소스 목록
    const rssSources: Source[] = [
      {
        title: 'Seoul City News RSS',
        url: 'https://example.seoul.go.kr/rss',
        publisher: 'Seoul Metropolitan Government'
      },
      {
        title: 'Korea Culture RSS',
        url: 'https://example.mcst.go.kr/rss',
        publisher: 'Ministry of Culture'
      }
    ];

    // 실제 API 키들 (환경변수에서 로드)
    const apiKeys = {
      seoulTopis: process.env.SEOUL_TOPIS_API_KEY || '',
      seoulOpenData: process.env.SEOUL_OPENDATA_API_KEY || ''
    };

    this.rssCollector = new RSSCollector(rssSources);
    this.openDataCollector = new OpenDataCollector(apiKeys);
  }

  async collectDailyUpdates(): Promise<RealKoreaCard[]> {
    console.log('🚀 Starting daily data collection...');
    
    try {
      const [rssData, eventsData, trafficData] = await Promise.all([
        this.rssCollector.collectFeeds(),
        this.openDataCollector.collectSeoulEvents(),
        this.openDataCollector.collectTrafficData()
      ]);

      const cards: RealKoreaCard[] = [];

      // RSS 데이터를 이슈 카드로 변환
      rssData.forEach(feed => {
        feed.items.forEach((item: any) => {
          const card = ContentTransformer.transformToRealKoreaCard(
            {
              title: item.title,
              summary: item.summary
            },
            'issue',
            [feed.source]
          );
          cards.push(card);
        });
      });

      // 이벤트 데이터를 팝업 카드로 변환
      eventsData.forEach(event => {
        const card = ContentTransformer.transformToRealKoreaCard(
          {
            title: event.title,
            summary: `${event.location}에서 ${event.startDate}부터 ${event.endDate}까지`,
            geo: { area: event.location },
            period: { start: event.startDate, end: event.endDate }
          },
          'popup',
          [
            {
              title: 'Seoul Open Data',
              url: 'https://data.seoul.go.kr',
              publisher: 'Seoul City'
            }
          ]
        );
        cards.push(card);
      });

      // 교통 데이터를 혼잡 카드로 변환
      trafficData.forEach(traffic => {
        const card = ContentTransformer.transformToRealKoreaCard(
          {
            title: `${traffic.line} ${traffic.status}`,
            summary: traffic.message
          },
          'congestion',
          [
            {
              title: 'Seoul TOPIS',
              url: 'https://topis.seoul.go.kr',
              publisher: 'Seoul TOPIS'
            }
          ]
        );
        cards.push(card);
      });

      console.log(`✅ Collected ${cards.length} cards`);
      return cards;

    } catch (error) {
      console.error('❌ Data collection failed:', error);
      throw error;
    }
  }

  async validateSources(): Promise<{ valid: Source[], invalid: Source[] }> {
    const valid: Source[] = [];
    const invalid: Source[] = [];

    for (const source of this.rssCollector['sources']) {
      try {
        // 실제로는 URL 접근 가능성 체크
        const response = await fetch(source.url, { method: 'HEAD' });
        if (response.ok) {
          valid.push(source);
        } else {
          invalid.push(source);
        }
      } catch (error) {
        invalid.push(source);
      }
    }

    return { valid, invalid };
  }
}

// 싱글톤 인스턴스
export const dataCollector = new DataCollectionOrchestrator();
