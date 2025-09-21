import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface LearnKoreanProps {
  seoData: SEOData;
}

export default function LearnKorean({ seoData }: LearnKoreanProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('materials');
  const { locale } = useAppLocale();
  
  const tabs = [
    { key: 'materials', label: 'Educational Materials', icon: '/icons/tips.svg' },
    { key: 'videos', label: 'Video Resources', icon: '/icons/event.svg' },
    { key: 'translator', label: 'Translation Tools', icon: '/icons/traffic.svg' }
  ];

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/learn?tab=${tabKey}`, undefined, { shallow: true });
  };

  // 초기 진입 시 URL 쿼리로 탭 복원
  useEffect(() => {
    const q = router.query.tab;
    if (typeof q === 'string' && ['materials','videos','translator'].includes(q)) {
      setActiveTab(q);
    }
  }, [router.query.tab]);

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/LearnKorea_header.png" alt="Learn Korean header" className="absolute inset-0 h-full w-full object-cover object-[center_35%]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">
              {locale === 'fr' ? 'Ressources d\'Apprentissage Coréen' : 'Korean Learning Resources'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              {locale === 'fr' 
                ? 'Ressources officielles et outils pratiques pour apprendre le coréen au Canada'
                : 'Official resources and practical tools for learning Korean in Canada'
              }
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 py-4" role="radiogroup">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  role="radio"
                  aria-checked={activeTab === tab.key}
                  className={`voxy-button ${
                    activeTab === tab.key
                      ? 'voxy-button--active'
                      : ''
                  }`}
                >
                  <span className="button_top">
                  {locale === 'fr' ? 
                    (tab.key === 'materials' ? 'Matériaux Éducatifs' :
                     tab.key === 'videos' ? 'Ressources Vidéo' :
                     'Outils de Traduction') :
                    tab.label
                  }
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Educational Materials 탭 */}
          {activeTab === 'materials' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Matériaux Éducatifs Officiels' : 'Official Educational Materials'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'fr' 
                    ? 'Ressources d\'apprentissage officielles du gouvernement coréen'
                    : 'Official Korean government learning resources'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 캐나다한국교육원 공식 자료 */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-red-500 to-rose-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Official
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      {locale === 'fr' 
                        ? 'Centre d\'Éducation Coréenne du Canada'
                        : 'Canada Korean Education Centre'
                      }
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Matériaux d\'apprentissage officiels fournis par le Consulat général de la République de Corée à Toronto.'
                        : 'Official learning materials provided by the Consulate General of the Republic of Korea in Toronto.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">맞춤한국어 (Customized Korean)</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Niveaux 1-6 disponibles' : 'Levels 1-6 available'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">한글학교 한국어 (Korean School Korean)</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Matériel spécialisé pour les écoles' : 'Specialized materials for schools'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://www.cakec.com/teachingnlearning" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Accéder aux Matériaux →' : 'Access Materials →'}
                    </a>
                  </div>
                </div>

                {/* King Sejong Institute */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Sejong
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      King Sejong Institute
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Plateforme d\'apprentissage en ligne officielle avec cours interactifs et certification.'
                        : 'Official online learning platform with interactive courses and certification.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Online Courses</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Cours interactifs gratuits' : 'Free interactive courses'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Certification</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Certificats officiels disponibles' : 'Official certificates available'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://www.ksif.or.kr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Visiter le Site →' : 'Visit Site →'}
                    </a>
                  </div>
                </div>

                {/* Talk To Me In Korean */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      TTMIK
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Talk To Me In Korean
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Ressources d\'apprentissage populaires avec approche pratique et conversationnelle.'
                        : 'Popular learning resources with practical and conversational approach.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Audio Lessons</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Leçons audio gratuites' : 'Free audio lessons'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Workbooks</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Cahiers d\'exercices pratiques' : 'Practical exercise books'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://talktomeinkorean.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Explorer TTMIK →' : 'Explore TTMIK →'}
                    </a>
                  </div>
                </div>

                 {/* HowtoStudyKorean */}
                 <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                   <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-violet-600">
                     <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                       Grammar
                     </div>
                   </div>
                   <div className="px-6 pt-6 pb-4">
                     <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                       HowtoStudyKorean
                     </h3>
                     <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                       {locale === 'fr' 
                         ? 'Site web complet avec leçons structurées de grammaire coréenne et explications détaillées pour tous les niveaux.'
                         : 'Comprehensive website with structured Korean grammar lessons and detailed explanations for all levels.'
                       }
                     </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Grammar Lessons</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Leçons de grammaire structurées' : 'Structured grammar lessons'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Vocabulary Building</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Construction du vocabulaire' : 'Vocabulary development'}
                         </span>
                       </div>
                     </div>
                     <a 
                       href="https://www.howtostudykorean.com/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                     >
                       {locale === 'fr' ? 'Visiter le Site →' : 'Visit Website →'}
                     </a>
                   </div>
                 </div>

                 {/* 재외교육기관포털 */}
                 <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                   <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-amber-500 to-orange-600">
                     <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                       Portal
                     </div>
                   </div>
                   <div className="px-6 pt-6 pb-4">
                     <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                       {locale === 'fr' 
                         ? 'Portail des Institutions Éducatives Coréennes'
                         : 'Overseas Korean Education Portal'
                       }
                     </h3>
                     <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                       {locale === 'fr' 
                         ? 'Portail officiel du ministère de l\'Éducation coréen pour les institutions éducatives coréennes à l\'étranger.'
                         : 'Official Korean Ministry of Education portal for overseas Korean educational institutions.'
                       }
                     </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Educational Resources</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Ressources pédagogiques officielles' : 'Official educational resources'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Institutional Support</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Soutien aux institutions éducatives' : 'Support for educational institutions'}
                         </span>
                       </div>
                     </div>
                     <a 
                       href="http://okep.moe.go.kr/root/index.do" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                     >
                       {locale === 'fr' ? 'Visiter le Portail →' : 'Visit Portal →'}
                     </a>
                   </div>
                 </div>

                 {/* TOPIK Preparation */}
                 <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                   <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                     <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                       TOPIK
                     </div>
                   </div>
                   <div className="px-6 pt-6 pb-4">
                     <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                       TOPIK Preparation
                     </h3>
                     <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                       {locale === 'fr' 
                         ? 'Ressources de préparation pour le Test de Compétence en Coréen (TOPIK).'
                         : 'Preparation resources for the Test of Proficiency in Korean (TOPIK).'
                       }
                     </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Practice Tests</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Tests d\'entraînement officiels' : 'Official practice tests'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Test Dates</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Calendrier des examens au Canada' : 'Test schedule in Canada'}
                         </span>
                       </div>
                     </div>
                     <a 
                       href="https://www.topik.go.kr/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-block w-full text-center bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                     >
                       {locale === 'fr' ? 'Site Officiel TOPIK →' : 'Official TOPIK Site →'}
                     </a>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {/* Video Resources 탭 */}
          {activeTab === 'videos' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Ressources Vidéo' : 'Video Resources'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'fr' 
                    ? 'Chaînes YouTube et plateformes vidéo pour l\'apprentissage du coréen'
                    : 'YouTube channels and video platforms for Korean learning'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GO! Billy Korean */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-red-500 to-pink-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Billy
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      GO! Billy Korean
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Leçons de grammaire claire et explications détaillées par un instructeur expérimenté.'
                        : 'Clear grammar lessons and detailed explanations by experienced instructor.'
                      }
                    </p>
                    <a 
                      href="https://www.youtube.com/@GoBillyKorean" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Chaîne YouTube →' : 'YouTube Channel →'}
                    </a>
                  </div>
                </div>

                {/* Korean Unnie */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-purple-500 to-pink-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Unnie
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Korean Unnie
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Coréen conversationnel et expressions de la vie quotidienne avec une approche amusante.'
                        : 'Conversational Korean and daily expressions with fun approach.'
                      }
                    </p>
                    <a 
                      href="https://www.youtube.com/@KoreanUnnie" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Chaîne YouTube →' : 'YouTube Channel →'}
                    </a>
                  </div>
                </div>

                {/* KoreanClass101 */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Class101
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      KoreanClass101
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Leçons structurées du débutant à l\'avancé avec contenu audio et vidéo.'
                        : 'Structured lessons from beginner to advanced with audio and video content.'
                      }
                    </p>
                    <a 
                      href="https://www.koreanclass101.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Visiter le Site →' : 'Visit Site →'}
                    </a>
                  </div>
                </div>

                {/* Hyunwoo Sun */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-teal-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Hyunwoo
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Hyunwoo Sun
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Fondateur de TTMIK avec des explications approfondies de la culture coréenne.'
                        : 'TTMIK founder with in-depth Korean culture explanations.'
                      }
                    </p>
                    <a 
                      href="https://www.youtube.com/@hyunwoosun" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Chaîne YouTube →' : 'YouTube Channel →'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Translation Tools 탭 */}
          {activeTab === 'translator' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {locale === 'fr' ? 'Outils de Traduction' : 'Translation Tools'}
                </h2>
                <p className="text-gray-600">
                  {locale === 'fr' 
                    ? 'Outils de traduction et dictionnaires pour l\'apprentissage du coréen'
                    : 'Translation tools and dictionaries for Korean learning'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Papago */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Papago
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Naver Papago
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Meilleur traducteur pour le coréen avec compréhension du contexte et de l\'argot.'
                        : 'Best translator for Korean with context and slang understanding.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Image Translation</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Traduire du texte dans les images' : 'Translate text in images'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Voice Translation</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Traduction vocale en temps réel' : 'Real-time voice translation'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://papago.naver.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Utiliser Papago →' : 'Use Papago →'}
                    </a>
                  </div>
                </div>

                {/* Google Translate */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Google
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Google Translate
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Traducteur universel avec support hors ligne et intégration mobile.'
                        : 'Universal translator with offline support and mobile integration.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Mobile App</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Application mobile avec caméra' : 'Mobile app with camera'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Offline Mode</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Mode hors ligne disponible' : 'Offline mode available'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://translate.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Utiliser Google Translate →' : 'Use Google Translate →'}
                    </a>
                  </div>
                </div>

                {/* Naver Dictionary */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      Dictionary
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      Naver Dictionary
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Dictionnaire coréen complet avec exemples et prononciation.'
                        : 'Comprehensive Korean dictionary with examples and pronunciation.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Pronunciation</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Audio de prononciation native' : 'Native pronunciation audio'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Examples</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Phrases d\'exemple contextuelles' : 'Contextual example sentences'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://dict.naver.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Utiliser le Dictionnaire →' : 'Use Dictionary →'}
                    </a>
                  </div>
                </div>

                {/* HiNative */}
                <div className="relative flex w-full flex-col rounded-2xl bg-white text-gray-700 shadow-md border border-gray-200/70">
                  <div className="relative mx-5 -mt-7 h-44 md:h-52 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-orange-500 to-red-600">
                    <div className="absolute top-5 left-7 text-white/95 font-extrabold tracking-tight text-3xl md:text-4xl capitalize">
                      HiNative
                    </div>
                  </div>
                  <div className="px-6 pt-6 pb-4">
                    <h3 className="mb-3 text-[22px] md:text-[26px] font-extrabold leading-snug tracking-tight text-gray-900">
                      HiNative
                    </h3>
                    <p className="text-[15px] md:text-[17px] leading-8 text-gray-700 mb-4">
                      {locale === 'fr' 
                        ? 'Posez des questions à des locuteurs natifs coréens pour des réponses authentiques.'
                        : 'Ask questions to native Korean speakers for authentic answers.'
                      }
                    </p>
                     <div className="space-y-3 mb-4">
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Q&A</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Questions et réponses communautaires' : 'Community Q&A'}
                         </span>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <strong className="text-gray-800">Native Speakers</strong><br />
                         <span className="text-sm text-gray-600">
                           {locale === 'fr' ? 'Réponses de locuteurs natifs' : 'Native speaker responses'}
                         </span>
                       </div>
                     </div>
                    <a 
                      href="https://hinative.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                    >
                      {locale === 'fr' ? 'Rejoindre HiNative →' : 'Join HiNative →'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const seoData: SEOData = {
    title: 'Korean Learning Resources for Canadians',
    description: 'Comprehensive collection of Korean learning materials, video resources, and translation tools specifically curated for Canadian learners.',
    keywords: [
      'korean learning resources canada',
      'korean education materials',
      'korean language tools',
      'topik preparation canada',
      'korean translation tools',
      'korean video lessons',
      'canada korean education centre',
      'korean learning apps',
      'korean dictionary online',
      'learn korean free resources',
      ...SEO_KEYWORDS.secondary
    ],
    structuredData: {
      "@type": "EducationalOrganization",
      "name": "Korean Learning Resources",
      "description": "Comprehensive Korean learning resources for Canadians",
      "url": "https://ca.korea.com/learn"
    }
  };

  return {
    props: {
      seoData
    }
  };
};