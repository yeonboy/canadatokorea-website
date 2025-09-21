#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * 일일 데이터 수집 스크립트
 * 공개 RSS/오픈데이터에서 콘텐츠를 수집하여 JSON 파일로 저장
 */

class DailyDataCollector {
  constructor() {
    this.outputDir = path.join(__dirname, '../content/data');
    this.logFile = path.join(__dirname, '../logs/collection.log');
  }

  async ensureDirectories() {
    await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(message);
    
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  async collectRSSFeeds() {
    this.log('📡 Collecting RSS feeds...');
    
    // 실제 RSS 소스 목록 (환경에 따라 조정)
    const rssSources = [
      {
        name: 'seoul-city-news',
        url: 'https://example.seoul.go.kr/rss',
        publisher: 'Seoul City',
        type: 'news'
      },
      {
        name: 'korea-culture',
        url: 'https://example.mcst.go.kr/rss',
        publisher: 'Ministry of Culture',
        type: 'culture'
      }
    ];

    const results = [];

    for (const source of rssSources) {
      try {
        this.log(`  Fetching ${source.name} from ${source.url}`);
        
        // 실제로는 RSS 파서 사용 (rss-parser 등)
        // const feed = await parser.parseURL(source.url);
        
        // Mock 데이터
        const mockData = {
          source: source,
          items: [
            {
              title: `Latest from ${source.publisher}`,
              summary: 'Sample content summary',
              link: source.url,
              publishedAt: new Date().toISOString(),
              categories: [source.type]
            }
          ],
          collectedAt: new Date().toISOString()
        };

        results.push(mockData);
        this.log(`  ✅ Collected ${mockData.items.length} items from ${source.name}`);

      } catch (error) {
        this.log(`  ❌ Failed to collect from ${source.name}: ${error.message}`);
      }
    }

    // 결과 저장
    const outputPath = path.join(this.outputDir, 'rss-feeds.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    this.log(`💾 RSS data saved to ${outputPath}`);

    return results;
  }

  async collectOpenData() {
    this.log('🏛️ Collecting open data...');
    
    const results = {
      seoul: {
        events: [],
        traffic: [],
        cultural: []
      },
      collectedAt: new Date().toISOString()
    };

    try {
      // 서울시 문화행사 (Mock)
      this.log('  Fetching Seoul cultural events...');
      results.seoul.events = [
        {
          title: 'Seoul Pop-up Week',
          location: 'Various locations',
          startDate: '2025-09-10',
          endDate: '2025-09-16',
          category: 'popup',
          source: 'Seoul Open Data Portal'
        }
      ];

      // 교통 정보 (Mock)
      this.log('  Fetching traffic data...');
      results.seoul.traffic = [
        {
          line: 'Line 2',
          status: 'normal',
          message: 'Normal operation',
          updatedAt: new Date().toISOString(),
          source: 'Seoul TOPIS'
        }
      ];

      this.log('  ✅ Open data collection completed');

    } catch (error) {
      this.log(`  ❌ Open data collection failed: ${error.message}`);
    }

    // 결과 저장
    const outputPath = path.join(this.outputDir, 'open-data.json');
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    this.log(`💾 Open data saved to ${outputPath}`);

    return results;
  }

  async generateTodayCards() {
    this.log('🎴 Generating today cards...');

    const [rssData, openData] = await Promise.all([
      this.loadData('rss-feeds.json'),
      this.loadData('open-data.json')
    ]);

    const cards = [];

    // RSS 데이터에서 이슈 카드 생성
    if (rssData) {
      rssData.forEach(feed => {
        feed.items.forEach(item => {
          cards.push({
            id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            type: 'issue',
            title: item.title,
            summary: item.summary,
            tags: item.categories || [],
            sources: [{
              title: feed.source.name,
              url: item.link,
              publisher: feed.source.publisher
            }],
            lastUpdatedKST: new Date().toISOString()
          });
        });
      });
    }

    // 오픈데이터에서 팝업/교통 카드 생성
    if (openData?.seoul) {
      // 이벤트 → 팝업 카드
      openData.seoul.events.forEach(event => {
        cards.push({
          id: `popup-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'popup',
          title: event.title,
          summary: `${event.location}에서 진행되는 이벤트`,
          tags: [event.category, 'seoul'],
          geo: { area: event.location },
          period: { start: event.startDate, end: event.endDate },
          sources: [{
            title: 'Seoul Open Data',
            url: 'https://data.seoul.go.kr',
            publisher: 'Seoul City'
          }],
          lastUpdatedKST: new Date().toISOString()
        });
      });

      // 교통 → 혼잡 카드
      openData.seoul.traffic.forEach(traffic => {
        if (traffic.status !== 'normal') {
          cards.push({
            id: `traffic-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            type: 'congestion',
            title: `${traffic.line} ${traffic.status}`,
            summary: traffic.message,
            tags: ['subway', 'alert'],
            sources: [{
              title: 'Seoul TOPIS',
              url: 'https://topis.seoul.go.kr',
              publisher: 'Seoul TOPIS'
            }],
            lastUpdatedKST: traffic.updatedAt
          });
        }
      });
    }

    // 카드 저장
    const outputPath = path.join(this.outputDir, 'today-cards.json');
    await fs.writeFile(outputPath, JSON.stringify(cards, null, 2));
    this.log(`🎴 Generated ${cards.length} cards, saved to ${outputPath}`);

    return cards;
  }

  async loadData(filename) {
    try {
      const filePath = path.join(this.outputDir, filename);
      const content = await fs.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      this.log(`⚠️ Could not load ${filename}: ${error.message}`);
      return null;
    }
  }

  async run() {
    try {
      this.log('🚀 Starting daily data collection...');
      
      await this.ensureDirectories();
      
      // 데이터 수집
      await this.collectRSSFeeds();
      await this.collectOpenData();
      
      // 카드 생성
      await this.generateTodayCards();
      
      this.log('✅ Daily data collection completed successfully');
      
    } catch (error) {
      this.log(`❌ Daily data collection failed: ${error.message}`);
      throw error;
    }
  }
}

// 스크립트 실행
if (require.main === module) {
  const collector = new DailyDataCollector();
  
  collector.run()
    .then(() => {
      console.log('Data collection completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Data collection failed:', error);
      process.exit(1);
    });
}

module.exports = { DailyDataCollector };
