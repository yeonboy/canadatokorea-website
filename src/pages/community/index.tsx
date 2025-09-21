import { GetStaticProps } from 'next';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface CommunityProps {
  seoData: SEOData;
}

export default function Community({ seoData }: CommunityProps) {
  const { locale } = useAppLocale();
  const [activeTab, setActiveTab] = useState('events');

  const offlineCommunities = [
    {
      name: 'Seoul Global Center',
      location: 'Jung-gu, Seoul (City Hall area)',
      type: 'Government Center',
      description: 'Official support center for international residents with events, consultations, and networking',
      services: ['Visa consultation', 'Job fair', 'Cultural events', 'Language exchange'],
      website: 'https://global.seoul.go.kr',
      meetingTime: 'Daily 9AM-6PM',
      i18n: {
        fr: {
          name: 'Centre Global de Séoul',
          description: 'Centre de soutien officiel pour les résidents internationaux avec événements, consultations et réseautage',
          services: ['Consultation visa', 'Salon de l\'emploi', 'Événements culturels', 'Échange linguistique']
        }
      }
    },
    {
      name: 'Itaewon Global Village Center',
      location: 'Itaewon, Yongsan-gu, Seoul',
      type: 'Community Center',
      description: 'International community hub in the heart of Seoul\'s foreigner district',
      services: ['Korean classes', 'Cultural programs', 'Networking events', 'Support services'],
      website: 'https://www.itaewongvc.or.kr',
      meetingTime: 'Mon-Fri 9AM-6PM',
      i18n: {
        fr: {
          name: 'Centre du Village Global d\'Itaewon',
          description: 'Hub communautaire international au cœur du quartier des étrangers de Séoul',
          services: ['Cours de coréen', 'Programmes culturels', 'Événements de réseautage', 'Services de soutien']
        }
      }
    },
    {
      name: 'Hongdae Foreigner Meetup',
      location: 'Hongik University area, Seoul',
      type: 'Weekly Meetup',
      description: 'Weekly gathering of international students and expats for language exchange and socializing',
      services: ['Language exchange', 'Bar hopping', 'Cultural activities', 'Friendship building'],
      website: 'https://www.meetup.com/seoul-international',
      meetingTime: 'Every Friday 7PM',
      i18n: {
        fr: {
          name: 'Rencontre d\'Étrangers de Hongdae',
          description: 'Rassemblement hebdomadaire d\'étudiants internationaux et d\'expatriés pour l\'échange linguistique',
          services: ['Échange linguistique', 'Tournée des bars', 'Activités culturelles', 'Construction d\'amitié']
        }
      }
    },
    {
      name: 'Gangnam International Business Network',
      location: 'Gangnam-gu, Seoul',
      type: 'Professional Network',
      description: 'Monthly networking events for international professionals working in Korea',
      services: ['Business networking', 'Career development', 'Industry talks', 'Mentorship'],
      website: 'https://www.kotra.or.kr',
      meetingTime: 'Last Thursday of month 6PM',
      i18n: {
        fr: {
          name: 'Réseau d\'Affaires International de Gangnam',
          description: 'Événements de réseautage mensuels pour les professionnels internationaux travaillant en Corée',
          services: ['Réseautage d\'affaires', 'Développement de carrière', 'Conférences industrielles', 'Mentorat']
        }
      }
    },
    {
      name: 'Busan International Community',
      location: 'Haeundae-gu, Busan',
      type: 'Community Group',
      description: 'Active expat community in Korea\'s second largest city with regular meetups and events',
      services: ['Beach activities', 'Cultural tours', 'Language practice', 'Social events'],
      website: 'https://www.busan.go.kr/english',
      meetingTime: 'Weekends various times',
      i18n: {
        fr: {
          name: 'Communauté Internationale de Busan',
          description: 'Communauté d\'expatriés active dans la deuxième plus grande ville de Corée',
          services: ['Activités de plage', 'Tours culturels', 'Pratique linguistique', 'Événements sociaux']
        }
      }
    },
    {
      name: 'Jeju International Residents',
      location: 'Jeju Island',
      type: 'Island Community',
      description: 'Close-knit community of international residents and digital nomads on Jeju Island',
      services: ['Outdoor activities', 'Co-working spaces', 'Cultural immersion', 'Island tours'],
      website: 'https://www.jeju.go.kr/english',
      meetingTime: 'Monthly gatherings',
      i18n: {
        fr: {
          name: 'Résidents Internationaux de Jeju',
          description: 'Communauté soudée de résidents internationaux et nomades numériques sur l\'île de Jeju',
          services: ['Activités de plein air', 'Espaces de coworking', 'Immersion culturelle', 'Tours de l\'île']
        }
      }
    }
  ];

  const communityGroups = [
    {
      name: 'Canadians in Korea Facebook Group',
      members: '15,000+',
      type: 'Facebook Group',
      description: 'Active community of Canadians living, working, or studying in Korea',
      topics: ['Visa help', 'Job hunting', 'Apartment hunting', 'Cultural adjustment'],
      link: 'https://www.consulate-korea.ca', // 주캐나다 한국총영사관
      i18n: {
        fr: {
            name: 'Groupe Facebook des Canadiens en Corée',
            description: 'Communauté active de Canadiens vivant, travaillant ou étudiant en Corée',
            topics: ['Aide visa', 'Recherche d\'emploi', 'Recherche d\'appartement', 'Ajustement culturel']
        }
      }
    },
    {
      name: 'Toronto Korean Language Meetup',
      members: '800+',
      type: 'Meetup.com',
      description: 'Weekly Korean language practice sessions in Toronto',
      topics: ['Language exchange', 'Cultural events', 'Study groups'],
      link: 'https://www.toronto.ca/explore-enjoy/festivals-events/', // 토론토시 공식 이벤트 페이지
      i18n: {
        fr: {
            name: 'Meetup de Langue Coréenne de Toronto',
            description: 'Sessions hebdomadaires de pratique du coréen à Toronto',
            topics: ['Échange linguistique', 'Événements culturels', 'Groupes d\'étude']
        }
      }
    },
    {
      name: 'Vancouver Korea Connection',
      members: '1,200+',
      type: 'Facebook Group',
      description: 'Vancouver-based Korean cultural and business network',
      topics: ['Business networking', 'Cultural events', 'Food recommendations'],
      link: 'https://vancouver.ca/parks-recreation-culture/multicultural-events.aspx', // 밴쿠버시 다문화 이벤트
      i18n: {
        fr: {
            name: 'Connexion Corée de Vancouver',
            description: 'Réseau culturel et commercial coréen basé à Vancouver',
            topics: ['Réseautage d\'affaires', 'Événements culturels', 'Recommandations culinaires']
        }
      }
    },
    {
      name: 'Montreal Korean Students',
      members: '600+',
      type: 'Discord',
      description: 'Students studying Korean language and culture in Montreal',
      topics: ['Study groups', 'University programs', 'Exchange opportunities'],
      link: 'https://www.montreal.ca/en/topics/culture-and-recreation', // 몬트리올시 문화 레크리에이션
      i18n: {
        fr: {
            name: 'Étudiants Coréens de Montréal',
            description: 'Étudiants en langue et culture coréennes à Montréal',
            topics: ['Groupes d\'étude', 'Programmes universitaires', 'Opportunités d\'échange']
        }
      }
    }
  ];

  const otherResources = [
    { 
        title: 'University Programs', 
        description: 'Korean language and cultural studies programs at Canadian universities.', 
        link: '/tools/qna?topic=education',
        i18n: { fr: { title: 'Programmes Universitaires', description: 'Programmes de langue et d\'études culturelles coréennes dans les universités canadiennes.' } }
    },
    { 
        title: 'Business Networks', 
        description: 'Professional associations and business groups connecting Canada and Korea.', 
        link: '/tools/qna?topic=business',
        i18n: { fr: { title: 'Réseaux d\'Affaires', description: 'Associations professionnelles et groupes d\'affaires reliant le Canada et la Corée.' } }
    },
    { 
        title: 'Cultural Centers', 
        description: 'Korean cultural centers and institutes across Canada.', 
        link: '/tools/qna?topic=culture',
        i18n: { fr: { title: 'Centres Culturels', description: 'Centres et instituts culturels coréens à travers le Canada.' } }
    },
  ];

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* Header */}
        <div className="relative text-white">
          <img src="/images/headers/Cummunity_header.png" alt="Community header" className="absolute inset-0 h-full w-full object-cover object-[center_38%]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('community.page.title', locale)}</h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {t('community.page.tagline', locale)}
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="flex justify-center flex-wrap gap-3 mb-8" role="radiogroup">
            <button
              onClick={() => setActiveTab('events')}
              role="radio"
              aria-checked={activeTab === 'events'}
              className={`voxy-button ${activeTab === 'events' ? 'voxy-button--active' : ''}`}
            >
              <span className="button_top">Offline Communities in Korea</span>
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              role="radio"
              aria-checked={activeTab === 'groups'}
              className={`voxy-button ${activeTab === 'groups' ? 'voxy-button--active' : ''}`}
            >
              <span className="button_top">{t('community.tabs.groups', locale)}</span>
            </button>
          </div>

          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offlineCommunities.map((community, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
                      {community.type}
                    </span>
                    <span className="text-xs text-gray-500">{community.location}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {locale === 'fr' && community.i18n?.fr.name ? community.i18n.fr.name : community.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3">{community.meetingTime}</p>
                  
                  <p className="text-gray-700 mb-4 flex-grow">
                    {locale === 'fr' && community.i18n?.fr.description ? community.i18n.fr.description : community.description}
                  </p>
                  
                  {/* 서비스 태그 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(locale === 'fr' && community.i18n?.fr.services ? community.i18n.fr.services : community.services).map((service, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                  
                  <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-auto text-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityGroups.map((group, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 flex flex-col">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{locale === 'fr' && group.i18n?.fr.name ? group.i18n.fr.name : group.name}</h3>
                      <div className="flex items-center space-x-3 mt-1 mb-4">
                        <span className="text-sm text-gray-600 font-semibold">{group.type}</span>
                        <span className="text-sm font-bold text-primary-600">{group.members} members</span>
                      </div>
                    </div>
                  <p className="text-gray-700 mb-4 flex-grow">{locale === 'fr' && group.i18n?.fr.description ? group.i18n.fr.description : group.description}</p>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Popular Topics:</p>
                    <p className="text-sm text-gray-600">
                      {(locale === 'fr' && group.i18n?.fr.topics ? group.i18n.fr.topics : group.topics).join(', ')}
                    </p>
                  </div>
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-auto text-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('community.groups.join', locale)}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('community.resources.title', locale)}</h2>
              <p className="text-lg text-gray-600">
                {t('community.resources.desc', locale)}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherResources.map((resource, index) => (
                 <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 text-center flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{locale === 'fr' && resource.i18n?.fr.title ? resource.i18n.fr.title : resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{locale === 'fr' && resource.i18n?.fr.description ? resource.i18n.fr.description : resource.description}</p>
                  <a href={resource.link} className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-auto">
                    {t('community.resources.findOutMore', locale)}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const seoData: SEOData = {
    title: 'Korean Community Events and Groups in Canada',
    description: 'Connect with Korean culture through events, festivals, and community groups across Canada. Find Korean cultural activities in Toronto, Vancouver, and Montreal.',
    keywords: [
      'korean community canada',
      'korean events toronto',
      'korean cultural festival canada',
      'korean groups vancouver',
      ...SEO_KEYWORDS.secondary
    ],
    structuredData: {
      "@type": "EventSeries",
      "name": "Korean Cultural Events in Canada",
      "description": "Regular Korean cultural events and community activities across Canada"
    }
  };

  return {
    props: {
      seoData
    }
  };
};
