import { useState } from 'react';
import { useRouter } from 'next/router';
import { Bricolage_Grotesque } from 'next/font/google';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import type { SEOData } from '@/types';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';
// import BottomDoorNav from '@/components/BottomDoorNav';
// import BubbleMenu from '@/components/BubbleMenu';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const FlowingMenu = dynamic(() => import('@/components/FlowingMenu'), { ssr: false });

// Font loader must be at module scope
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: '700' });

export default function Home() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const seoData: SEOData = {
    title: locale === 'fr' ? 'Recherche Corée — ca.korea.com' : 'Search Korea — ca.korea.com',
    description: locale === 'fr' 
      ? 'Recherchez des informations coréennes, pop-ups, trafic, conseils, coûts et plus encore.'
      : 'Search any Korean insights, pop-ups, traffic, tips, costs, and more.',
    keywords: ['korea', 'seoul', 'popup', 'traffic', 'cost', 'tips', 'learn korean']
  };

  return (
    <Layout wrapperClassName="bg-[#eeeeee]">
      <SEOHead data={seoData} />
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center bg-[#eeeeee] px-4">
        <div className="w-full max-w-6xl text-center pt-10 relative z-10">
          <h1 className={["text-gray-800 text-4xl md:text-5xl mb-8 font-bold", bricolage.className].join(' ')}>
            {locale === 'fr' ? 'Découvrez la Vraie Corée' : 'Find Real Korea Insights'}
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              autoComplete="off"
              name="text"
              className="input flex-1"
              placeholder={locale === 'fr' 
                ? 'Essayez: popup seongsu, retard ligne2, conseils visa, coût loyer'
                : 'Try: seongsu popup, line2 delay, visa tips, cost of rent'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-secondary px-6">
              {locale === 'fr' ? 'Rechercher' : 'Search'}
            </button>
          </form>
          {/* Usage 블록 제거 */}
        </div>
        {/* 네 가지 토글을 화면 양옆으로 최대한 넓게: 히어로 섹션 내 전체 폭 */}
        <div className="w-full mt-10 relative z-10">
          <div className="w-full max-w-[1600px] mx-auto" style={{ height: '620px', position: 'relative' }}>
            <FlowingMenu
              items={[
                { 
                  link: '/real-korea-now', 
                  text: locale === 'fr' ? 'Corée en Temps Réel' : 'Real Korea Now', 
                  image: '/images/headers/rkn-hero.jpg' 
                },
                { 
                  link: '/learn', 
                  text: locale === 'fr' ? 'Apprendre le Coréen' : 'Learn Korean', 
                  image: 'https://picsum.photos/600/400?random=11' 
                },
                { 
                  link: '/travel-food', 
                  text: locale === 'fr' ? 'Voyage et Cuisine' : 'Travel & Food', 
                  image: 'https://picsum.photos/600/400?random=12' 
                },
                { 
                  link: '/k-pop', 
                  text: 'K-Pop', 
                  image: 'https://picsum.photos/600/400?random=14' 
                },
                { 
                  link: '/community', 
                  text: locale === 'fr' ? 'Communauté' : 'Community', 
                  image: 'https://picsum.photos/600/400?random=13' 
                }
              ]}
            />
          </div>
        </div>
        {/* 배경 워터마크: 좌측 하단 정렬 (실제 로고 제공 시 교체) */}
        <div className="absolute -bottom-4 left-7 pointer-events-none select-none z-0" aria-hidden="true">
          <div className="text-gray-900 opacity-[0.09] text-[10vw] leading-[0.9] font-black tracking-tight whitespace-nowrap">
            Canada to Korea
          </div>
        </div>
      </section>
      {/* <BottomDoorNav /> */}
    </Layout>
  );
}
