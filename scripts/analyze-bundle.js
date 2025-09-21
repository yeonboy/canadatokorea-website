#!/usr/bin/env node

/**
 * 번들 크기 분석 및 최적화 제안
 */

const fs = require('fs');
const path = require('path');

function analyzeBuildOutput() {
  const buildDir = path.join(process.cwd(), '.next');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Build directory not found. Run npm run build first.');
    return;
  }
  
  console.log('📊 Bundle Analysis Report\n');
  
  // 1. 페이지별 크기 분석
  const pagesDir = path.join(buildDir, 'static', 'chunks', 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = fs.readdirSync(pagesDir)
      .filter(f => f.endsWith('.js'))
      .map(f => {
        const filePath = path.join(pagesDir, f);
        const stats = fs.statSync(filePath);
        return { name: f, size: stats.size };
      })
      .sort((a, b) => b.size - a.size);
    
    console.log('📄 Largest Page Bundles:');
    pageFiles.slice(0, 10).forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      console.log(`   ${file.name}: ${sizeKB}KB`);
    });
  }
  
  // 2. 청크 분석
  const chunksDir = path.join(buildDir, 'static', 'chunks');
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir)
      .filter(f => f.endsWith('.js') && !f.includes('pages'))
      .map(f => {
        const filePath = path.join(chunksDir, f);
        const stats = fs.statSync(filePath);
        return { name: f, size: stats.size };
      })
      .sort((a, b) => b.size - a.size);
    
    console.log('\n📦 Largest Chunks:');
    chunkFiles.slice(0, 5).forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      console.log(`   ${file.name}: ${sizeKB}KB`);
    });
  }
  
  // 3. CSS 분석
  const cssDir = path.join(buildDir, 'static', 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir)
      .filter(f => f.endsWith('.css'))
      .map(f => {
        const filePath = path.join(cssDir, f);
        const stats = fs.statSync(filePath);
        return { name: f, size: stats.size };
      })
      .sort((a, b) => b.size - a.size);
    
    console.log('\n🎨 CSS Files:');
    cssFiles.forEach(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      console.log(`   ${file.name}: ${sizeKB}KB`);
    });
  }
  
  // 4. 최적화 제안
  console.log('\n💡 Optimization Suggestions:');
  
  const largePages = pageFiles?.filter(f => f.size > 50000) || [];
  if (largePages.length > 0) {
    console.log('   🔴 Large pages detected (>50KB):');
    largePages.forEach(page => {
      console.log(`      - ${page.name}: Consider code splitting or lazy loading`);
    });
  }
  
  const totalJS = (pageFiles?.reduce((sum, f) => sum + f.size, 0) || 0) + 
                  (chunkFiles?.reduce((sum, f) => sum + f.size, 0) || 0);
  const totalCSS = cssFiles?.reduce((sum, f) => sum + f.size, 0) || 0;
  
  console.log(`\n📊 Total Bundle Size:`);
  console.log(`   JavaScript: ${(totalJS / 1024).toFixed(1)}KB`);
  console.log(`   CSS: ${(totalCSS / 1024).toFixed(1)}KB`);
  console.log(`   Total: ${((totalJS + totalCSS) / 1024).toFixed(1)}KB`);
  
  if (totalJS > 500000) {
    console.log('   ⚠️  Large JavaScript bundle. Consider dynamic imports.');
  }
  
  if (totalCSS > 100000) {
    console.log('   ⚠️  Large CSS bundle. Consider CSS purging.');
  }
}

if (require.main === module) {
  analyzeBuildOutput();
}
