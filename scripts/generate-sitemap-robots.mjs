#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'out');
const publicDir = path.join(process.cwd(), 'public');

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; }
}

function collectPaths() {
  const today = readJSON(path.join(process.cwd(), 'content', 'data', 'today-cards.json'), []);
  const base = ['/', '/real-korea-now', '/learn', '/travel-food', '/community', '/k-pop', '/contact', '/sitemap'];
  const detail = today.slice(0, 500).map(c => `/real-korea-now/${c.id}`);
  return [...new Set([...base, ...detail])];
}

function generateSitemap(urlBase) {
  const urls = collectPaths();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${urlBase}${u.replace(/\/$/, '')}</loc></url>`).join('\n') +
  `\n</urlset>`;
  return xml;
}

function generateRobots(urlBase) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${urlBase}/sitemap.xml\n`;
}

function main() {
  const urlBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://ca.korea.com';
  const outDir = fs.existsSync(distDir) ? distDir : publicDir;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), generateSitemap(urlBase));
  fs.writeFileSync(path.join(outDir, 'robots.txt'), generateRobots(urlBase));
  console.log('✅ Generated sitemap.xml and robots.txt in', outDir);
}

main();


