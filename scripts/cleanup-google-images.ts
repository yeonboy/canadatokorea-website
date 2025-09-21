#!/usr/bin/env ts-node

/**
 * 기존 데이터에서 구글 이미지 제거 스크립트
 */

import fs from 'fs';
import path from 'path';

type Card = {
  id: string;
  type: string;
  title: string;
  summary: string;
  tags: string[];
  sources: any[];
  lastUpdatedKST: string;
  image?: { src: string; alt?: string };
  [key: string]: any;
};

const dataFile = path.join(process.cwd(), 'content', 'data', 'today-cards.json');

function loadJson<T>(file: string, defaultValue: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return defaultValue;
  }
}

function saveJson(file: string, data: any) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function isGoogleImage(imageUrl?: string): boolean {
  if (!imageUrl) return false;
  
  return imageUrl.includes('google') ||
         imageUrl.includes('gstatic') ||
         imageUrl.includes('googleapis') ||
         imageUrl.includes('googleusercontent') ||
         imageUrl.includes('news.google.com') ||
         imageUrl.includes('favicon') ||
         imageUrl.includes('logo') ||
         imageUrl.includes('sprite');
}

async function cleanupGoogleImages() {
  console.log('🧹 Cleaning up Google images from today-cards.json...');
  
  const todayCards: Card[] = loadJson(dataFile, []);
  let cleanedCount = 0;
  
  const cleanedCards = todayCards.map(card => {
    if (card.image?.src && isGoogleImage(card.image.src)) {
      console.log(`🗑️ Removing Google image from: ${card.title.substring(0, 50)}...`);
      const { image, ...cardWithoutImage } = card;
      cleanedCount++;
      return cardWithoutImage;
    }
    return card;
  });
  
  if (cleanedCount > 0) {
    saveJson(dataFile, cleanedCards);
    console.log(`✅ Cleaned ${cleanedCount} Google images from ${todayCards.length} cards`);
  } else {
    console.log('✅ No Google images found to clean');
  }
  
  console.log('🎉 Cleanup completed!');
}

// 스크립트 실행
cleanupGoogleImages();


