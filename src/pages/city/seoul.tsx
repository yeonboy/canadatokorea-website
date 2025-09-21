import { GetStaticProps } from 'next';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface SeoulGuideProps {
  seoData: SEOData;
}

export default function SeoulGuide({ seoData }: SeoulGuideProps) {
  const { locale } = useAppLocale();
  const [activeDistrict, setActiveDistrict] = useState('gangnam');

  const districts = [
    { key: 'gangnam', label: 'Gangnam' },
    { key: 'hongdae', label: 'Hongdae' },
    { key: 'myeongdong', label: 'Myeongdong' },
    { key: 'seongsu', label: 'Seongsu' },
    { key: 'itaewon', label: 'Itaewon' }
  ];

  const districtInfo = {
    gangnam: {
      description: 'Seoul\'s business and luxury district, made famous by PSY\'s song',
      vibe: 'Modern, upscale, busy',
      bestFor: ['Shopping', 'Fine dining', 'Nightlife', 'Business'],
      keySpots: [
        { name: 'COEX Mall', type: 'Shopping', note: 'Asia\'s largest underground mall' },
        { name: 'Bongeunsa Temple', type: 'Culture', note: 'Buddhist temple in the city center' },
        { name: 'Garosu-gil', type: 'Street', note: 'Tree-lined street with boutiques and cafes' }
      ],
      transport: 'Lines 2, 3, 7, 9 - excellent connectivity',
      budget: 'High (₩50,000-100,000/day)',
      canadianTip: 'Similar to downtown Toronto - expect higher prices but premium experience',
      i18n: { fr: {
        description: "Le quartier des affaires et du luxe de Séoul, rendu célèbre par la chanson de PSY",
        vibe: 'Moderne, haut de gamme, animé',
        bestFor: ['Shopping', 'Haute cuisine', 'Vie nocturne', 'Affaires'],
        keySpots: [
          { name: 'Centre commercial COEX', type: 'Shopping', note: 'Le plus grand centre commercial souterrain d\'Asie' },
          { name: 'Temple Bongeunsa', type: 'Culture', note: 'Temple bouddhiste au centre-ville' },
          { name: 'Garosu-gil', type: 'Rue', note: 'Rue bordée d\'arbres avec boutiques et cafés' }
        ],
        transport: 'Lignes 2, 3, 7, 9 - excellente connectivité',
        canadianTip: 'Similaire au centre-ville de Toronto - attendez-vous à des prix plus élevés mais à une expérience premium'
      }}
    },
    hongdae: {
      description: 'University area known for nightlife, indie music, and young energy',
      vibe: 'Youthful, creative, energetic',
      bestFor: ['Nightlife', 'Live music', 'Student culture', 'Street food'],
      keySpots: [
        { name: 'Hongik Playground', type: 'Area', note: 'Central party district' },
        { name: 'Trick Eye Museum', type: 'Attraction', note: 'Interactive art museum' },
        { name: 'Club Octagon', type: 'Nightlife', note: 'World-famous EDM club' }
      ],
      transport: 'Line 2, 6 - Hongik Univ Station',
      budget: 'Medium (₩30,000-60,000/day)',
      canadianTip: 'Like Montreal\'s Plateau - alternative culture and affordable fun',
      i18n: { fr: {
        description: 'Quartier universitaire connu pour sa vie nocturne, sa musique indépendante et son énergie jeune',
        vibe: 'Jeune, créatif, énergique',
        bestFor: ['Vie nocturne', 'Musique live', 'Culture étudiante', 'Cuisine de rue'],
        keySpots: [
            { name: 'Cour de récréation de Hongik', type: 'Zone', note: 'Quartier central de la fête' },
            { name: 'Musée Trick Eye', type: 'Attraction', note: 'Musée d\'art interactif' },
            { name: 'Club Octagon', type: 'Vie nocturne', note: 'Club EDM de renommée mondiale' }
        ],
        transport: 'Ligne 2, 6 - Station Université de Hongik',
        canadianTip: 'Comme le Plateau de Montréal - culture alternative et plaisir abordable'
      }}
    },
    myeongdong: {
        description: 'Tourist shopping paradise with Korean cosmetics and street food',
        vibe: 'Touristy, commercial, crowded',
        bestFor: ['Shopping', 'Street food', 'Cosmetics', 'Currency exchange'],
        keySpots: [
            { name: 'Myeongdong Cathedral', type: 'Landmark', note: 'Gothic cathedral in shopping district' },
            { name: 'Lotte Department Store', type: 'Shopping', note: 'Luxury shopping with tax refund' },
            { name: 'Namdaemun Market', type: 'Market', note: 'Traditional market nearby' }
        ],
        transport: 'Line 4 - Myeongdong Station',
        budget: 'Medium (₩40,000-70,000/day)',
        canadianTip: 'Like Vancouver\'s Robson Street - tourist-friendly but crowded',
        i18n: { fr: {
            description: 'Paradis du shopping touristique avec cosmétiques coréens et cuisine de rue',
            vibe: 'Touristique, commercial, bondé',
            bestFor: ['Shopping', 'Cuisine de rue', 'Cosmétiques', 'Change de devises'],
            keySpots: [
                { name: 'Cathédrale de Myeongdong', type: 'Repère', note: 'Cathédrale gothique dans le quartier commerçant' },
                { name: 'Grand magasin Lotte', type: 'Shopping', note: 'Shopping de luxe avec détaxe' },
                { name: 'Marché de Namdaemun', type: 'Marché', note: 'Marché traditionnel à proximité' }
            ],
            transport: 'Ligne 4 - Station Myeongdong',
            canadianTip: 'Comme Robson Street à Vancouver - convivial pour les touristes mais bondé'
        }}
    },
    seongsu: {
        description: 'Trendy industrial area turned hipster paradise with artisan cafes',
        vibe: 'Artsy, trendy, Instagram-worthy',
        bestFor: ['Cafes', 'Art galleries', 'Pop-up stores', 'Photography'],
        keySpots: [
            { name: 'Seoul Forest', type: 'Park', note: 'Large park with deer and walking trails' },
            { name: 'Common Ground', type: 'Shopping', note: 'Container shopping mall' },
            { name: 'Cafe Street', type: 'Area', note: 'Dozens of unique cafes' }
        ],
        transport: 'Line 2 - Seongsu Station',
        budget: 'Medium-High (₩40,000-80,000/day)',
        canadianTip: 'Like Toronto\'s Distillery District - industrial chic with artisan vibes',
        i18n: { fr: {
            description: 'Zone industrielle branchée devenue paradis hipster avec des cafés artisanaux',
            vibe: 'Artistique, branché, digne d\'Instagram',
            bestFor: ['Cafés', 'Galeries d\'art', 'Magasins éphémères', 'Photographie'],
            keySpots: [
                { name: 'Forêt de Séoul', type: 'Parc', note: 'Grand parc avec des cerfs et des sentiers de randonnée' },
                { name: 'Common Ground', type: 'Shopping', note: 'Centre commercial en conteneurs' },
                { name: 'Rue des cafés', type: 'Zone', note: 'Des dizaines de cafés uniques' }
            ],
            transport: 'Ligne 2 - Station Seongsu',
            canadianTip: 'Comme le Distillery District de Toronto - chic industriel avec une ambiance artisanale'
        }}
    },
    itaewon: {
        description: 'International district with diverse food and English-speaking businesses',
        vibe: 'International, diverse, foreigner-friendly',
        bestFor: ['International food', 'English services', 'Expat community', 'Nightlife'],
        keySpots: [
            { name: 'Itaewon Street', type: 'Street', note: 'Main international dining street' },
            { name: 'War Memorial', type: 'Museum', note: 'Korean War history museum' },
            { name: 'Namsan Tower', type: 'Landmark', note: 'Seoul\'s iconic tower nearby' }
        ],
        transport: 'Line 6 - Itaewon Station',
        budget: 'High (₩50,000-90,000/day)',
        canadianTip: 'Most foreigner-friendly area - like having a piece of international Toronto in Seoul',
        i18n: { fr: {
            description: 'Quartier international avec une cuisine diversifiée et des commerces anglophones',
            vibe: 'International, diversifié, accueillant pour les étrangers',
            bestFor: ['Cuisine internationale', 'Services en anglais', 'Communauté d\'expatriés', 'Vie nocturne'],
            keySpots: [
                { name: 'Rue d\'Itaewon', type: 'Rue', note: 'Principale rue de restauration internationale' },
                { name: 'Mémorial de la guerre', type: 'Musée', note: 'Musée d\'histoire de la guerre de Corée' },
                { name: 'Tour Namsan', type: 'Repère', note: 'Tour emblématique de Séoul à proximité' }
            ],
            transport: 'Ligne 6 - Station Itaewon',
            canadianTip: 'Le quartier le plus accueillant pour les étrangers - comme avoir un morceau de Toronto international à Séoul'
        }}
    }
  };

  const currentDistrict = districtInfo[activeDistrict as keyof typeof districtInfo];

  const transportTips = [
    {
      tip: 'Download Citymapper',
      reason: 'Best English subway app with real-time updates'
    },
    {
      tip: 'Buy T-money card at station',
      reason: 'Works for subway, bus, and some taxis. 5-10% discount.'
    },
    {
      tip: 'Avoid rush hours (7-9 AM, 6-8 PM)',
      reason: 'Extremely crowded, especially Lines 2, 4, 7'
    },
    {
      tip: 'Learn exit numbers',
      reason: 'Korean addresses reference subway exit numbers'
    },
    {
      tip: 'Last train around midnight',
      reason: 'Plan your night out accordingly, taxis expensive after midnight'
    }
  ];

  const monthlyLivingGuide = {
    housing: [
      { type: 'Goshiwon', cost: '₩400,000-600,000', description: 'Tiny private room, shared facilities' },
      { type: 'Sharehouse', cost: '₩600,000-900,000', description: 'Private room, shared common areas' },
      { type: 'Studio', cost: '₩800,000-1,500,000', description: 'Private studio apartment' }
    ],
    food: [
      { type: 'Home cooking', cost: '₩200,000-300,000', description: 'Groceries and cooking at home' },
      { type: 'Mixed (home + eating out)', cost: '₩400,000-600,000', description: 'Balanced approach' },
      { type: 'Eating out mostly', cost: '₩600,000-900,000', description: 'Restaurant meals and delivery' }
    ],
    transport: [
      { type: 'T-money monthly', cost: '₩60,000-80,000', description: 'Unlimited subway/bus within Seoul' },
      { type: 'Occasional taxi', cost: '₩20,000-40,000', description: 'Late night or convenience rides' }
    ]
  };

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/Seoul living_header.png" alt="Seoul Guide header" className="absolute inset-0 h-full w-full object-cover object-[center_40%]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('seoul.page.title', locale)}</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              {t('seoul.page.tagline', locale)}
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 지역별 가이드 */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Districts & Neighborhoods</h2>
            
            {/* 지역 탭 */}
            <div className="flex flex-wrap gap-3 mb-8" role="radiogroup" aria-label="Filter districts by name">
              {districts.map((district) => (
                <button
                  key={district.key}
                  onClick={() => setActiveDistrict(district.key)}
                  role="radio"
                  aria-checked={activeDistrict === district.key}
                  className={`voxy-button ${
                    activeDistrict === district.key
                      ? 'voxy-button--active'
                      : ''
                  }`}
                >
                  <span className="button_top">{district.label}</span>
                </button>
              ))}
            </div>

            {/* 선택된 지역 정보 */}
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {districts.find(d => d.key === activeDistrict)?.label}
                  </h3>
                  <p className="text-gray-700 mb-6">{locale === 'fr' ? currentDistrict.i18n.fr.description : currentDistrict.description}</p>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vibe</h4>
                      <p className="text-gray-600">{locale === 'fr' ? currentDistrict.i18n.fr.vibe : currentDistrict.vibe}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Daily Budget</h4>
                      <p className="text-gray-600">{currentDistrict.budget}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {(locale === 'fr' ? currentDistrict.i18n.fr.bestFor : currentDistrict.bestFor).map((item, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Canadian Comparison:</h4>
                    <p className="text-sm text-blue-800">{locale === 'fr' ? currentDistrict.i18n.fr.canadianTip : currentDistrict.canadianTip}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Key Spots</h4>
                  <div className="space-y-3">
                    {(locale === 'fr' ? currentDistrict.i18n.fr.keySpots : currentDistrict.keySpots).map((spot, index) => (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{spot.name}</h5>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {spot.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{spot.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Transport</h5>
                    <p className="text-sm text-gray-600">{locale === 'fr' ? currentDistrict.i18n.fr.transport : currentDistrict.transport}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 교통 팁 */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Seoul Transportation Tips</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h4 className="font-bold text-gray-900 mb-2">{tip.tip}</h4>
                  <p className="text-sm text-gray-600">{tip.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 월간 생활비 가이드 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Monthly Living Costs</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(monthlyLivingGuide).map(([category, options]) => (
                <div key={category} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 capitalize mb-4">{category}</h3>
                  
                  <div className="space-y-4">
                    {options.map((option, index) => (
                      <div key={index} className="border-l-4 border-gray-200 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{option.type}</h4>
                          <span className="text-sm font-bold text-primary-600">{option.cost}</span>
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 비용 계산기 링크 */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Personalized Cost Estimates
              </h3>
              <p className="text-gray-600 mb-4">
                Use our cost calculator to estimate your monthly expenses based on your lifestyle
              </p>
              <a
                href="/tools/cost-estimator?city=Seoul"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Calculate My Costs
              </a>
            </div>
          </div>
        </div>

        {/* 실용 정보 */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Essential Seoul Survival Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600">Most shops open from 10 AM to 10 PM. Many restaurants and cafes, especially in busy districts, are open 24/7, reflecting Korea's dynamic culture.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Tipping</h3>
                  <p className="text-gray-600">Tipping is not customary or expected in Korea. Service charges are typically included in the bill. Attempting to tip can sometimes cause confusion.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Photography</h3>
                  <p className="text-gray-600">Always ask for permission before taking photos of people. Photography may be restricted in some religious sites or private properties. Check for signs.</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Language</h3>
                  <p className="text-gray-600">English is commonly understood in major tourist areas, but less so in local neighborhoods. It's highly recommended to download the Papago translation app.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const seoData: SEOData = {
    title: 'Seoul Living Guide for Canadians - Districts, Costs, Transportation',
    description: 'Comprehensive Seoul guide for Canadians. District comparisons, monthly living costs, transportation tips, and practical advice for living in Seoul.',
    keywords: [
      'seoul living guide canadian',
      'seoul districts comparison',
      'seoul monthly costs',
      'seoul transportation tips',
      'gangnam hongdae myeongdong guide',
      ...SEO_KEYWORDS.longTail
    ],
    structuredData: {
      "@type": "TravelGuide",
      "name": "Seoul Living Guide for Canadians",
      "description": "Complete guide to living in Seoul for Canadian residents"
    }
  };

  return {
    props: {
      seoData
    }
  };
};
