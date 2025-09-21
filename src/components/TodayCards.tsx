import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import dynamic from 'next/dynamic';
import Badge from '@/components/ui/Badge';
import { RealKoreaCard } from '@/types';
import { CARD_TYPES } from '@/utils/constants';
import { formatDateKST, t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';
import FullMapModal from '@/components/FullMapModal';
import { renderSimpleMarkdown, stripMarkdown } from '@/utils/markdown';
import 'leaflet/dist/leaflet.css';

interface TodayCardsProps {
  cards: RealKoreaCard[];
  showMap?: boolean;
  mapWeatherClass?: string;
}

const LiveIssuesMap = dynamic(() => import('./LiveIssuesMap'), { ssr: false });

export default function TodayCards({ cards, showMap = true, mapWeatherClass }: TodayCardsProps) {
  const { locale } = useAppLocale();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [openFullMap, setOpenFullMap] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  
  const filteredCards = activeFilter === 'all' 
    ? cards 
    : cards.filter(card => card.type === activeFilter);

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // OG 이미지 추출 비활성화 - 기본 로고만 사용
  // useEffect(() => {
  //   const run = async () => {
  //     const tasks = cards.map(async (card) => {
  //       if (card.image?.src) return null;
  //       const primary = card.sources?.[0]?.url;
  //       if (!primary) return null;
  //       try {
  //         const res = await fetch(`/api/extract/og?url=${encodeURIComponent(primary)}`);
  //         const data = await res.json();
  //         if (data?.image) {
  //           // 구글 이미지가 아닌 신뢰할 수 있는 이미지만 사용
  //           const isGoodImage = !data.image.includes('google') && 
  //                              !data.image.includes('favicon') && 
  //                              data.image.includes('http');
  //           
  //           if (isGoodImage) {
  //             (card as any).image = { src: data.image, alt: card.title };
  //           }
  //         }
  //       } catch {}
  //     });
  //     await Promise.allSettled(tasks);
  //   };
  //   run();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const filters = [
    { key: 'all', label: t('cards.filters.all', locale), icon: '📋', color: 'bg-gray-100 hover:bg-gray-200' },
    { key: 'issue', label: t('cards.filters.issue', locale), icon: '📰', color: 'bg-red-100 hover:bg-red-200' },
    { key: 'popup', label: t('cards.filters.popup', locale), icon: '🎪', color: 'bg-purple-100 hover:bg-purple-200' },
    { key: 'congestion', label: t('cards.filters.congestion', locale), icon: '🚇', color: 'bg-orange-100 hover:bg-orange-200' },
    { key: 'tip', label: t('cards.filters.tip', locale), icon: '💡', color: 'bg-green-100 hover:bg-green-200' },
    { key: 'hotspot', label: t('cards.type.hotspot', locale), icon: '🔥', color: 'bg-pink-100 hover:bg-pink-200' },
    { key: 'weather', label: t('cards.type.weather', locale), icon: '🌤️', color: 'bg-blue-100 hover:bg-blue-200' },
    { key: 'population', label: t('cards.type.population', locale), icon: '👥', color: 'bg-indigo-100 hover:bg-indigo-200' }
  ];

  return (
    <div className="py-16">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 카드 리스트 */}
          <div className="lg:col-span-7">
            {/* 필터 버튼들 */}
            <div className="flex flex-wrap gap-3 mb-8" role="radiogroup" aria-label="Filter updates by type">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  role="radio"
                  aria-checked={activeFilter === filter.key}
                  className={`voxy-button ${activeFilter === filter.key ? 'voxy-button--active' : ''}`}
                >
                  <span className="button_top">{filter.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {filteredCards.map((card) => {
                const cardConfig = (CARD_TYPES as Record<
                  import('@/types').RealKoreaCard['type'],
                  { label: string; icon: string; color: string; gradient: string; bannerBg: string; iconUrl?: string }
                >)[card.type];

                return (
                  <div key={card.id} className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                    {/* Banner */}
                    <div className={`relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg ${cardConfig.bannerBg}`}>
                      {/* 모든 카드에 기본 로고 사용 */}
                      <img 
                        src="/logo.jpg" 
                        alt={card.title} 
                        className="h-full w-full object-cover"
                      />
                      {/* color tint overlay to enforce type color */}
                      <div className={`absolute inset-0 ${cardConfig.bannerBg} opacity-50`} />
                      {/* subtle overlay for readability */}
                      <div className="absolute inset-0 bg-black/20" />
                      {/* Big category text */}
                      <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                        {t(
                          card.type === 'issue' ? 'cards.type.issue' :
                          card.type === 'popup' ? 'cards.type.popup' :
                          card.type === 'congestion' ? 'cards.type.congestion' :
                          card.type === 'tip' ? 'cards.type.tip' : 'cards.type.issue',
                          locale
                        )}
                      </div>
                      {/* Location pill */}
                      {card.geo?.area && (
                        <div className="absolute bottom-4 right-4 bg-white text-gray-800 rounded-xl shadow-md px-4 py-2 flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-semibold">{card.geo.area}</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">{formatDateKST(card.lastUpdatedKST)}</span>
                      </div>
                      <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                        {(locale === 'fr' && (card as any).i18n?.fr?.title) ? (card as any).i18n.fr.title : card.title}
                      </h3>
                      <div 
                        className="text-[15px] md:text-[17px] leading-8 text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: renderSimpleMarkdown(
                            stripMarkdown((locale === 'fr' && (card as any).i18n?.fr?.summary) ? (card as any).i18n.fr.summary : card.summary)
                          )
                        }}
                      />


                      {/* Tags */}
                      {(locale === 'fr' && (card as any).i18n?.fr?.tags ? (card as any).i18n.fr.tags.length > 0 : card.tags.length > 0) && (
                        <div className="flex flex-wrap gap-2 mt-5">
                          {(locale === 'fr' && (card as any).i18n?.fr?.tags ? (card as any).i18n.fr.tags : card.tags).map((tag: string) => (
                            <span key={tag} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-700">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-0 flex items-center justify-between">
                      <div className="flex space-x-4">
                        {card.sources.slice(0, 2).map((source, index) => (
                          <a
                            key={index}
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                const r = await fetch(`/api/resolve?url=${encodeURIComponent(source.url)}`);
                                const data = await r.json();
                                const dest = data?.resolved || source.url;
                                window.open(dest, '_blank', 'noopener,noreferrer');
                              } catch {
                                window.open(source.url, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            href={source.url}
                            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-primary-600 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{source.publisher}</span>
                          </a>
                        ))}
                      </div>
                      <Link href={`/real-korea-now/${card.id}`} className="select-none rounded-xl bg-primary-600 py-3 px-6 text-center text-xs font-extrabold uppercase text-white shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:shadow-primary-500/40">
                        {t('cards.viewDetails', locale)}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('cards.none', locale)}</p>
              </div>
            )}
          </div>

          {/* 미니 맵 (우측) */}
          {showMap && (
            <div className="lg:col-span-5">
              <Card className="p-4 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('cards.liveMap.title', locale)}</h3>
                {/* 동적 import로 클라이언트에서만 렌더 */}
                <LiveIssuesMap items={cards} weatherClass={mapWeatherClass} />
                <button onClick={() => setOpenFullMap(true)} className="mt-4 block w-full text-center py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">{t('cards.liveMap.viewFull', locale)}</button>
              </Card>
              <FullMapModal open={openFullMap} onClose={() => setOpenFullMap(false)} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
