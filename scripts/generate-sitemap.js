#!/usr/bin/env node

/**
 * 사이트맵 자동 생성 스크립트
 * SEO 최적화를 위한 XML 사이트맵 생성
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://canadatokorea.com';

// 정적 페이지들
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/learn/', priority: 0.9, changefreq: 'weekly' },
  { url: '/real-korea-now/', priority: 0.9, changefreq: 'daily' },
  { url: '/travel-food/', priority: 0.8, changefreq: 'weekly' },
  { url: '/community/', priority: 0.8, changefreq: 'weekly' },
  { url: '/k-pop/', priority: 0.8, changefreq: 'weekly' },
  { url: '/tools/cost-estimator/', priority: 0.7, changefreq: 'monthly' },
  { url: '/tools/qna/', priority: 0.7, changefreq: 'weekly' },
  { url: '/city/seoul/', priority: 0.6, changefreq: 'monthly' },
  { url: '/search/', priority: 0.5, changefreq: 'monthly' },
  { url: '/contact/', priority: 0.4, changefreq: 'monthly' },
  { url: '/legal/', priority: 0.3, changefreq: 'yearly' }
];

// 동적 페이지들 (카드 상세 페이지)
function getDynamicPages() {
  const pages = [];
  
  try {
    // Real Korea Now 카드들
    const todayCards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/data/today-cards.json'), 'utf8'));
    todayCards.forEach(card => {
      pages.push({
        url: `/real-korea-now/${card.id}/`,
        priority: 0.6,
        changefreq: 'weekly',
        lastmod: card.lastUpdatedKST
      });
    });
    
    // Week 카드들
    const weekCards = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content/data/week-cards.json'), 'utf8'));
    weekCards.forEach(card => {
      pages.push({
        url: `/real-korea-now/${card.id}/`,
        priority: 0.5,
        changefreq: 'monthly',
        lastmod: card.lastUpdatedKST
      });
    });
  } catch (error) {
    console.warn('Warning: Could not load card data for sitemap');
  }
  
  return pages;
}

function generateSitemap() {
  const allPages = [...staticPages, ...getDynamicPages()];
  
  // 중복 제거 (같은 URL이 있을 수 있음)
  const uniquePages = allPages.reduce((acc, page) => {
    const existing = acc.find(p => p.url === page.url);
    if (!existing) {
      acc.push(page);
    } else if (page.lastmod && (!existing.lastmod || page.lastmod > existing.lastmod)) {
      // 더 최신 데이터로 업데이트
      Object.assign(existing, page);
    }
    return acc;
  }, []);
  
  // 우선순위순 정렬
  uniquePages.sort((a, b) => b.priority - a.priority);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages.map(page => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // public 폴더에 저장
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated: ${sitemapPath}`);
  console.log(`📊 Total pages: ${uniquePages.length}`);
  console.log(`🔗 URL: ${DOMAIN}/sitemap.xml`);
  
  return uniquePages.length;
}

// robots.txt도 함께 최적화
function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${DOMAIN}/sitemap.xml

# Block admin and API routes (not needed for SEO)
Disallow: /admin/
Disallow: /review/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /learn/
Allow: /real-korea-now/
Allow: /travel-food/
Allow: /community/
Allow: /k-pop/
Allow: /tools/
Allow: /city/

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robots);
  
  console.log(`✅ Robots.txt updated: ${robotsPath}`);
}

if (require.main === module) {
  console.log('🗺️ Generating sitemap and robots.txt...\n');
  
  const pageCount = generateSitemap();
  generateRobotsTxt();
  
  console.log('\n✅ SEO files generation completed!');
  console.log(`📈 Ready for Google Search Console submission`);
  console.log(`🔍 Total indexed pages: ${pageCount}`);
}
