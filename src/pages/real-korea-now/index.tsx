import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import TodayCards from '@/components/TodayCards';
import { RealKoreaCard, SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

// --- Custom Icons ---
const LivingGuideIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4,26 L32,10 L60,26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10,23 V54 H54 V23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22,54 V42 C22,39.7909 23.7909,38 26,38 H38 C40.2091,38 42,39.7909 42,42 V54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const QnaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M24 10H16C13.7909 10 12 11.7909 12 14V50C12 52.2091 13.7909 54 16 54H48C50.2091 54 52 52.2091 52 50V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20,20 H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20,28 H36" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20,36 H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="42" cy="22" r="8" stroke="currentColor" strokeWidth="3"/>
        <path d="M47 27L52 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);
const CostEstimatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="14" y="10" width="36" height="44" rx="4" stroke="currentColor" strokeWidth="3"/>
        <path d="M22,20 H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M26,28 H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26,34 H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26,40 H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26,46 H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

interface RealKoreaNowProps {
  cards: RealKoreaCard[];
  seoData: SEOData;
}

export default function RealKoreaNow({ cards, seoData }: RealKoreaNowProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('today');
  const [weatherClass, setWeatherClass] = useState<string>('');
  const [mapWeatherClass, setMapWeatherClass] = useState<string>('');
  const [weekCards, setWeekCards] = useState<RealKoreaCard[] | null>(null);
  const [updates, setUpdates] = useState<any | null>(null);
  const [weekFilter, setWeekFilter] = useState<'all'|'issue'|'popup'|'congestion'|'tip'|'hotspot'|'weather'|'population'>('all');
  const { locale } = useAppLocale();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const [liveCards, setLiveCards] = useState<RealKoreaCard[]>(cards || []);
  
  const tabs = [
    { key: 'today', label: 'Today', icon: '/icons/flaticon/today.svg' },
    { key: 'tips', label: 'Tips & QnA', icon: '/icons/tips.svg' }
  ];

  const toolCards = [
    {
      href: '/city/seoul',
      title: t('rkn.tips.card.livingGuide.title', locale),
      description: t('rkn.tips.card.livingGuide.desc', locale),
      icon: <LivingGuideIcon className="h-32 w-32 mx-auto text-white" />,
      bgClass: 'bg-blue-500',
    },
    {
      href: '/tools/qna',
      title: t('rkn.tips.card.qna.title', locale),
      description: t('rkn.tips.card.qna.desc', locale),
      icon: <QnaIcon className="h-32 w-32 mx-auto text-white" />,
      bgClass: 'bg-green-400',
    },
    {
      href: '/tools/cost-estimator',
      title: t('rkn.tips.card.costEstimator.title', locale),
      description: t('rkn.tips.card.costEstimator.desc', locale),
      icon: <CostEstimatorIcon className="h-32 w-32 mx-auto text-white" />,
      bgClass: 'bg-red-400',
    }
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/real-korea-now?tab=${tabKey}`, undefined, { shallow: true });
  };

  // 초기 진입 시 URL 쿼리로 탭 복원
  useEffect(() => {
    const q = router.query.tab;
    if (typeof q === 'string' && ['today','tips'].includes(q)) setActiveTab(q);
  }, [router.query.tab]);

  // 컴포넌트 마운트 시 최신 Today 데이터 로드 (API_BASE가 있으면 외부 API에서, 없으면 동일 오리진 시도)
  useEffect(() => {
    let canceled = false;
    (async () => {
      const endpoint = `${API_BASE || ''}/api/review/today-items`;
      try {
        const res = await fetch(endpoint);
        if (!res.ok) return;
        const js = await res.json();
        if (!canceled && Array.isArray(js.items)) setLiveCards(js.items);
      } catch {}
    })();
    return () => { canceled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 실시간 날씨 효과 적용 (페이지 전체 + 맵 로컬 오버레이 분리)
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch('/api/rkn/weather');
        const data = await res.json();
        const ttype = data?.type || 'sun';
        if (ttype === 'rain' || ttype === 'snow' || ttype === 'clouds') {
          setWeatherClass('');
          setMapWeatherClass('weather-rkn-local');
        } else {
          setWeatherClass('');
          setMapWeatherClass('');
        }
      } catch {
        setWeatherClass('');
        setMapWeatherClass('');
      }
    }
    loadWeather();
  }, []);

  // 집계 업데이트 로드 (traffic/weather/hotspots)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/rkn/updates');
        const data = await res.json();
        setUpdates(data);
      } catch {}
    };
    run();
  }, []);

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className={`bg-white ${weatherClass}`}>
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/rkn-hero.jpg" alt="Seoul night header" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('rkn.page.title', locale)}</h1>
            <p className="text-xl text-blue-100 max-w-2xl">{t('rkn.page.tagline', locale)}</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2 inline-block align-middle">
                    <img src={tab.icon} alt="tab icon" className="h-4 w-4 inline" />
                  </span>
                  {tab.key === 'today' ? t('rkn.tabs.today', locale) : t('rkn.tabs.tips', locale)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'today' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('rkn.section.today.title', locale)}</h2>
                <p className="text-gray-600">{t('rkn.section.today.desc', locale)}</p>
              </div>
              <TodayCards cards={liveCards} showMap={true} mapWeatherClass={mapWeatherClass} />
            </div>
          )}


          {activeTab === 'tips' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('rkn.section.tips.title', locale)}</h2>
                <p className="text-gray-600">{t('rkn.section.tips.desc', locale)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {toolCards.map((card) => (
                  <Link href={card.href} key={card.href}>
                    <div className={`flex flex-col h-72 rounded-3xl p-6 text-white text-center justify-between ${card.bgClass} transition-transform hover:scale-105 hover:shadow-xl`}>
                      <h3 className="text-3xl font-bold">{card.title}</h3>
                      <div className="flex-grow flex items-center justify-center">
                        {card.icon}
                      </div>
                      <p className="text-sm">{card.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  // content/data/today-cards.json에서 카드 로드 (성능 최적화: 상위 12개만)
  const file = path.join(process.cwd(), 'content', 'data', 'today-cards.json');
  let cards: RealKoreaCard[] = [];
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const allCards = JSON.parse(raw);
    // 최신순으로 정렬 후 상위 12개만 (페이지 크기 최적화)
    cards = allCards
      .sort((a: any, b: any) => new Date(b.lastUpdatedKST).getTime() - new Date(a.lastUpdatedKST).getTime())
      .slice(0, 12);
  } catch {
    cards = [];
  }

  const seoData: SEOData = {
    title: 'Real Korea Now - Live Updates and Insights',
    description: 'Get real-time updates on Korean culture, pop-ups, traffic, and local insights that only locals know.',
    keywords: ['korea live updates', 'seoul real time', 'korean culture today', ...SEO_KEYWORDS.primary]
  };

  return {
    props: {
      cards,
      seoData
    }
  };
};
