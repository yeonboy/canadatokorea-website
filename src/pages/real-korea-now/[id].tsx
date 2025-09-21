import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { RealKoreaCard, SEOData } from '@/types';
import { resolveAreaToCoord } from '@/utils/geo';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { useEffect, useMemo, useState } from 'react';

interface DetailProps {
  card: RealKoreaCard | null;
  seoData: SEOData;
}

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

export default function RealKoreaDetail({ card, seoData }: DetailProps) {
  const { locale } = useAppLocale();
  const [article, setArticle] = useState<{ images: Array<{src:string;alt?:string;caption?:string}>; textHtml: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function run() {
      if (!card?.sources?.[0]?.url) return;
      try {
        const r = await fetch(`/api/extract/article?url=${encodeURIComponent(card.sources[0].url)}`);
        if (!r.ok) return;
        const js = await r.json();
        setArticle(js);
      } catch {}
    }
    run();
  }, [card?.sources?.[0]?.url]);

  // 모든 Detail 페이지에서 기본 로고만 사용
  const heroImageSrc = '/logo.jpg';
  function resolvePosition(c: RealKoreaCard): [number, number] | null {
    const g: any = c.geo;
    if (g && typeof g.lat === 'number' && typeof g.lng === 'number' && Number.isFinite(g.lat) && Number.isFinite(g.lng)) {
      return [g.lat, g.lng];
    }
    const area: string | undefined = g?.area;
    if (area) {
      const c = resolveAreaToCoord(area);
      if (c) return c;
    }
    return null;
  }
  return (
    <Layout>
      <SEOHead data={seoData} />
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!card ? (
          <div className="text-center text-gray-500">No content</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                  {t(
                    card.type === 'issue' ? 'cards.type.issue' :
                    card.type === 'popup' ? 'cards.type.popup' :
                    card.type === 'congestion' ? 'cards.type.congestion' :
                    card.type === 'tip' ? 'cards.type.tip' : 'cards.type.issue',
                    locale
                  )}
                </span>
                <span className="text-xs text-gray-500">Last updated: {card.lastUpdatedKST}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{(locale === 'fr' && card.i18n?.fr?.title) ? card.i18n.fr.title : card.title}</h1>
              
              {/* GPT 생성된 긴 콘텐츠 표시 (사용자는 GPT 생성 여부를 모름) */}
              <div className="prose prose-lg max-w-none mb-6" suppressHydrationWarning>
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      let content = '';
                      
                      if ((card as any).fullContent) {
                        content = locale === 'fr' && (card as any).i18n?.fr?.fullContent ? 
                          (card as any).i18n.fr.fullContent : 
                          (card as any).fullContent;
                      } else {
                        content = locale === 'fr' && card.i18n?.fr?.summary ? 
                          card.i18n.fr.summary : 
                          card.summary;
                      }
                      
                      // 간단한 마크다운 렌더링
                      return content
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                        .replace(/### ([^\n]+)/g, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
                        .replace(/> ([^\n]+)/g, '<blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-600">$1</blockquote>')
                        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />')
                        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
                        .split('\n\n')
                        .map(paragraph => paragraph.trim() ? `<p class="mb-4">${paragraph}</p>` : '')
                        .join('');
                    })()
                  }}
                />
              </div>
              {/* 기본 로고 이미지만 사용 */}
              <img 
                src="/logo.jpg" 
                alt={card.title} 
                className="w-full rounded mb-6"
              />

              {/* Article images and body extracted from source */}
              {mounted && article?.images?.length ? (
                <div className="space-y-4 mb-6">
                  {article.images.slice(0, 4).map((img, i) => (
                    <figure key={i} className="">
                      <img src={img.src} alt={img.alt || card.title} className="w-full rounded" />
                      {img.caption && <figcaption className="text-xs text-gray-500 mt-1">{img.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
              ) : null}

              {mounted && article?.textHtml ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.textHtml }} />
              ) : null}

              {/* Tags */}
              {(locale === 'fr' && card.i18n?.fr?.tags ? card.i18n.fr.tags.length > 0 : card.tags?.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {(locale === 'fr' && card.i18n?.fr?.tags ? card.i18n.fr.tags : card.tags).map((t) => (
                    <span key={t} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">#{t}</span>
                  ))}
                </div>
              )}

              {/* Sources */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Sources</h2>
                <div className="flex flex-wrap gap-3">
                  {card.sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 underline">
                      {s.publisher}
                    </a>
                  ))}
                </div>
              </div>
            </article>

            {/* Right: Map & meta */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-0 border-0 bg-transparent">
                <div className="h-64 w-full rounded overflow-hidden relative">
                  {(() => {
                    const pos = card ? resolvePosition(card) : null;
                    if (pos) {
                      return (
                        <MapContainer center={pos as any} zoom={14} style={{ height: '100%', width: '100%' }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={pos as any}>
                            <Popup>{card.geo?.area || 'Location'}</Popup>
                          </Marker>
                        </MapContainer>
                      );
                    }
                    return <p className="text-sm text-gray-500">No location data{card?.geo?.area ? ` · ${card.geo.area}` : ''}</p>;
                  })()}
                </div>
              </div>

              {card.period && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Period</h3>
                  <div className="text-sm text-gray-700">{card.period.start} ~ {card.period.end}</div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">More</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/real-korea-now/map" className="text-sm text-primary-600 hover:text-primary-700 underline">View full live map</Link>
                  <Link href="/real-korea-now" className="text-sm text-primary-600 hover:text-primary-700 underline">Back to Real Korea Now</Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  let cards: RealKoreaCard[] = [];
  try {
    const raw = fs.readFileSync(file, 'utf8');
    cards = JSON.parse(raw);
  } catch {}
  return {
    paths: cards.slice(0, 20).map((c) => ({ params: { id: c.id } })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = String(params?.id || '');
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  let cards: RealKoreaCard[] = [];
  try {
    const raw = fs.readFileSync(file, 'utf8');
    cards = JSON.parse(raw);
  } catch {}
  const card = cards.find((c) => c.id === id) || null;
  const seoData: SEOData = {
    title: card ? `${card.title} - Real Korea Now` : 'Real Korea Now',
    description: card?.summary || 'Live updates from Korea',
    keywords: ['korea', 'seoul', 'live', 'updates']
  };
  return { props: { card, seoData } };
};


