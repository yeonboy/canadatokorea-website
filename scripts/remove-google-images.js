#!/usr/bin/env node

/**
 * Google 뉴스 이미지 및 저작권 문제 이미지 제거 스크립트
 */

const fs = require('fs');
const path = require('path');

function removeGoogleImages(data) {
  return data.map(item => {
    // 이미지 관련 필드 완전 제거
    const cleanItem = { ...item };
    
    // 이미지 필드들 제거
    delete cleanItem.image;
    delete cleanItem.images;
    delete cleanItem.ogImage;
    delete cleanItem.thumbnail;
    delete cleanItem.photo;
    delete cleanItem.picture;
    
    // i18n에서도 이미지 제거
    if (cleanItem.i18n) {
      Object.keys(cleanItem.i18n).forEach(lang => {
        if (cleanItem.i18n[lang]) {
          delete cleanItem.i18n[lang].image;
          delete cleanItem.i18n[lang].images;
          delete cleanItem.i18n[lang].ogImage;
        }
      });
    }
    
    // Google 뉴스 관련 소스 정리
    if (cleanItem.sources) {
      cleanItem.sources = cleanItem.sources.map(source => ({
        title: source.title?.replace(/- Google News$/, '').trim() || source.title,
        url: source.url,
        publisher: source.publisher?.replace(/- Google News$/, '').replace(/Google News/, 'News').trim() || source.publisher
      }));
    }
    
    return cleanItem;
  });
}

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const cleanData = Array.isArray(data) ? removeGoogleImages(data) : data;
    
    // 백업 생성
    const backupPath = filePath.replace('.json', '.backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
    
    // 정리된 데이터 저장
    fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2));
    
    console.log(`✅ Cleaned: ${filePath}`);
    console.log(`📦 Backup: ${backupPath}`);
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
  }
}

// 정리할 파일들
const filesToClean = [
  'content/data/today-cards.json',
  'content/data/week-cards.json',
  'content/data/inbox.json',
  'content/posts/sample-posts.json',
  'content/qna/sample-qna.json'
];

console.log('🧹 Starting Google Images cleanup...\n');

filesToClean.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  cleanFile(fullPath);
});

console.log('\n✅ Google Images cleanup completed!');
console.log('📦 Backup files created with .backup.json extension');
console.log('🚀 Ready for safe deployment!');
