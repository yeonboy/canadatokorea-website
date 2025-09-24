import { GetStaticProps } from 'next';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface KPopProps {
  seoData: SEOData;
}

export default function KPop({ seoData }: KPopProps) {
  const { locale } = useAppLocale();
  const [activeTab, setActiveTab] = useState('artists');

  const tabs = [
    { key: 'artists', label: 'Artists & Groups' },
    { key: 'schedules', label: 'Schedules & Events' },
    { key: 'canada', label: 'Canada Connection' },
    { key: 'demon', label: 'K-pop Demon Hunters' }
  ];

  const featuredArtists = [
    {
      name: 'BTS',
      type: 'Group',
      debut: '2013',
      members: 7,
      agency: 'HYBE Corporation',
      description: 'Global superstars who broke barriers for K-pop in the West.',
      recentNews: [
        'Jin completes military service (June 2025)',
        'Group reunion concert announced for 2025',
        'Individual solo projects continue to top charts'
      ],
      officialLinks: {
        Website: 'https://bts.ibighit.com',
        YouTube: 'https://youtube.com/c/BANGTANTV',
        Spotify: 'https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX'
      },
      canadaConnection: 'Multiple sold-out tours in Toronto and Vancouver, huge dedicated fanbase (ARMY) in Canada.',
      i18n: { fr: {
        description: 'Superstars mondiaux qui ont brisé les barrières pour la K-pop en Occident.',
        recentNews: [
          'Jin termine son service militaire (juin 2025)',
          'Concert de réunion du groupe annoncé pour 2025',
          'Les projets solo individuels continuent de dominer les classements'
        ],
        canadaConnection: 'Plusieurs tournées à guichets fermés à Toronto et Vancouver, immense base de fans dévoués (ARMY) au Canada.'
      }}
    },
    {
      name: 'BLACKPINK',
      type: 'Group',
      debut: '2016',
      members: 4,
      agency: 'YG Entertainment',
      description: 'Global girl group with massive international following and high-fashion appeal.',
      recentNews: [
        'Rosé\'s "APT." collaboration with Bruno Mars hits #1 globally',
        'Members focusing on individual brand ambassadorships',
        'Group comeback anticipated for late 2025'
      ],
      officialLinks: {
        Website: 'https://blackpinkofficial.com',
        YouTube: 'https://youtube.com/c/BLACKPINKOFFICIAL',
        Spotify: 'https://open.spotify.com/artist/41MozSoPIsD1dJM0CLPjZF'
      },
      canadaConnection: 'Coachella performances were a major streaming event for Canadian fans (Blinks).',
      i18n: { fr: {
        description: 'Groupe de filles mondial avec un énorme succès international et un attrait pour la haute couture.',
        recentNews: [
          'La collaboration "APT." de Rosé avec Bruno Mars atteint la première place mondiale',
          'Les membres se concentrent sur les ambassades de marques individuelles',
          'Retour du groupe prévu pour fin 2025'
        ],
        canadaConnection: 'Les performances à Coachella ont été un événement de streaming majeur pour les fans canadiens (Blinks).'
      }}
    },
    {
      name: 'Stray Kids',
      type: 'Group',
      debut: '2018',
      members: 8,
      agency: 'JYP Entertainment',
      description: 'Known for their self-produced music and powerful, high-energy performances.',
      recentNews: [
        'New album "ATE" released to critical acclaim',
        'World tour announced, including dates in Toronto and Vancouver',
        '3RACHA production team continues to gain recognition'
      ],
      officialLinks: {
        Website: 'https://straykids.jype.com/',
        YouTube: 'https://www.youtube.com/c/StrayKids',
        Spotify: 'https://open.spotify.com/artist/4KftltlsCKHeU तिवारी'
      },
      canadaConnection: 'Strong and growing fanbase (STAY) in Canada, known for active online communities.',
      i18n: { fr: {
        description: 'Connu pour sa musique autoproduite et ses performances puissantes et énergiques.',
        recentNews: [
          'Le nouvel album "ATE" est acclamé par la critique',
          'Tournée mondiale annoncée, incluant des dates à Toronto et Vancouver',
          'L\'équipe de production 3RACHA continue de gagner en reconnaissance'
        ],
        canadaConnection: 'Base de fans (STAY) solide et croissante au Canada, connue pour ses communautés en ligne actives.'
      }}
    },
    {
      name: 'TWICE',
      type: 'Group',
      debut: '2015',
      members: 9,
      agency: 'JYP Entertainment',
      description: 'Beloved for their catchy discography and vibrant concepts, known as "The Nation\'s Girl Group".',
      recentNews: [
        'Successful "Ready to Be" world tour concluded',
        'Members Nayeon and Jihyo released successful solo albums',
        'New Japanese single announced for winter 2025'
      ],
      officialLinks: {
        Website: 'https://twice.jype.com/',
        YouTube: 'https://www.youtube.com/c/TWICE',
        Spotify: 'https://open.spotify.com/artist/7n2Ycct7Beij7Dj7meI4X0'
      },
      canadaConnection: 'Sold-out shows in Toronto prove their significant Canadian fanbase (ONCE).',
      i18n: { fr: {
        description: 'Adoré pour sa discographie entraînante et ses concepts vibrants, connu comme "Le Groupe de Filles de la Nation".',
        recentNews: [
          'La tournée mondiale "Ready to Be" s\'est terminée avec succès',
          'Les membres Nayeon et Jihyo ont sorti des albums solo à succès',
          'Nouveau single japonais annoncé pour l\'hiver 2025'
        ],
        canadaConnection: 'Les concerts à guichets fermés à Toronto prouvent leur importante base de fans canadiens (ONCE).'
      }}
    },
    {
        name: 'SEVENTEEN',
        type: 'Group',
        debut: '2015',
        members: 13,
        agency: 'PLEDIS Entertainment',
        description: 'The "self-producing idols" acclaimed for their synchronized choreography and involvement in their music.',
        recentNews: [
          'Unit comebacks from Vocal, Performance, and Hip-Hop teams',
          'Successfully completed their "Follow" Tour to Japan',
          'Members S.Coups and Jeonghan preparing for military enlistment'
        ],
        officialLinks: {
          Website: 'https://www.seventeen-17.com/',
          YouTube: 'https://www.youtube.com/user/pledis17',
          Spotify: 'https://open.spotify.com/artist/7nqOGRxlXj7N2PJe_CoB3e'
        },
        canadaConnection: 'Online concerts and fan meetings have high participation from Canadian fans (CARATs).',
        i18n: { fr: {
            description: 'Les "idoles auto-productrices" acclamées pour leur chorégraphie synchronisée et leur implication dans leur musique.',
            recentNews: [
              'Retours des unités Vocal, Performance et Hip-Hop',
              'Tournée "Follow" au Japon terminée avec succès',
              'Les membres S.Coups et Jeonghan se préparent pour leur enrôlement militaire'
            ],
            canadaConnection: 'Les concerts en ligne et les fan meetings ont une forte participation des fans canadiens (CARATs).'
        }}
    },
    {
      name: 'NewJeans',
      type: 'Group',
      debut: '2022',
      members: 5,
      agency: 'ADOR',
      description: 'Rising 4th generation group with a unique Y2K aesthetic and easy-listening sound.',
      recentNews: [
        '"How Sweet" and "Bubble Gum" singles achieve global success',
        'Named brand ambassadors for several international fashion houses',
        'First official fan meeting "Bunnies Camp" was a huge success'
      ],
      officialLinks: {
        Website: 'https://newjeans.kr',
        YouTube: 'https://youtube.com/@NewJeans_official',
        Spotify: 'https://open.spotify.com/artist/6HvZYsbFfjnjFrWF950C9d'
      },
      canadaConnection: 'Rapidly growing fanbase among Canadian Gen Z, high streams on Canadian platforms.',
      i18n: { fr: {
        description: 'Groupe montant de la 4ème génération avec une esthétique Y2K unique et un son facile à écouter.',
        recentNews: [
          'Les singles "How Sweet" et "Bubble Gum" connaissent un succès mondial',
          'Nommées ambassadrices de plusieurs maisons de mode internationales',
          'Le premier fan meeting officiel "Bunnies Camp" a été un énorme succès'
        ],
        canadaConnection: 'Base de fans en croissance rapide parmi la Gen Z canadienne, nombreux streams sur les plateformes canadiennes.'
      }}
    }
  ];

  const upcomingEvents = [
    {
      date: '2025-09-15',
      event: 'MAMA Awards 2025',
      location: 'Seoul Olympic Park',
      description: 'Annual music awards ceremony',
      canadianInterest: 'Live stream available, Canadian fan voting',
      i18n: { fr: {
          event: 'MAMA Awards 2025',
          description: 'Cérémonie annuelle de remise de prix musicaux',
          canadianInterest: 'Diffusion en direct disponible, vote des fans canadiens'
      }}
    },
    {
      date: '2025-10-01',
      event: 'Seoul Music Festival',
      location: 'Various venues in Seoul',
      description: 'Week-long music festival featuring K-pop and indie artists',
      canadianInterest: 'Many artists popular with Canadian audiences',
      i18n: { fr: {
          event: 'Festival de Musique de Séoul',
          description: 'Festival de musique d\'une semaine avec des artistes K-pop et indépendants',
          canadianInterest: 'De nombreux artistes populaires auprès du public canadien'
      }}
    },
    {
      date: '2025-10-20',
      event: 'K-Pop World Festival Finals',
      location: 'Changwon',
      description: 'Global K-pop cover dance competition',
      canadianInterest: 'Canadian teams often participate',
      i18n: { fr: {
          event: 'Finales du K-Pop World Festival',
          description: 'Compétition mondiale de danse de reprise K-pop',
          canadianInterest: 'Les équipes canadiennes participent souvent'
      }}
    }
  ];

  const canadaConnections = [
    {
      title: 'K-Pop Concerts in Canada',
      description: 'Major venues and upcoming shows',
      items: [
        'Rogers Centre, Toronto - BTS (2019), BLACKPINK (2022)',
        'BC Place, Vancouver - Regular K-pop concerts',
        'Bell Centre, Montreal - Growing K-pop venue'
      ],
      i18n: { fr: {
          title: 'Concerts de K-Pop au Canada',
          description: 'Principales salles et concerts à venir',
          items: [
            'Rogers Centre, Toronto - BTS (2019), BLACKPINK (2022)',
            'BC Place, Vancouver - Concerts K-pop réguliers',
            'Centre Bell, Montréal - Salle K-pop en pleine croissance'
          ]
      }}
    },
    {
      title: 'Canadian K-Pop Charts',
      description: 'K-pop performance on Canadian music charts',
      items: [
        'Billboard Canada Hot 100 regularly features K-pop',
        'Spotify Canada K-pop playlists',
        'Canadian radio stations adding K-pop content'
      ],
      i18n: { fr: {
          title: 'Classements K-Pop Canadiens',
          description: 'Performance de la K-pop dans les classements musicaux canadiens',
          items: [
            'Le Billboard Canada Hot 100 présente régulièrement de la K-pop',
            'Playlists K-pop de Spotify Canada',
            'Les stations de radio canadiennes ajoutent du contenu K-pop'
          ]
      }}
    },
    {
      title: 'Fan Communities',
      description: 'Active K-pop fan groups across Canada',
      items: [
        'Toronto K-pop Dance Crews',
        'Vancouver BTS Army Chapter',
        'Montreal K-pop Meetups'
      ],
      i18n: { fr: {
          title: 'Communautés de Fans',
          description: 'Groupes de fans de K-pop actifs à travers le Canada',
          items: [
            'Équipes de danse K-pop de Toronto',
            'Chapitre de l\'Army BTS de Vancouver',
            'Meetups K-pop de Montréal'
          ]
      }}
    }
  ];

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/K-pop header.png" alt="K-Pop header" className="absolute inset-0 h-full w-full object-cover object-[center_62%]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('kpop.page.title', locale)}</h1>
            <p className="text-xl text-pink-100 max-w-3xl">
              {t('kpop.page.tagline', locale)}
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
                    onClick={() => setActiveTab(tab.key)}
                    role="radio"
                    aria-checked={activeTab === tab.key}
                    className={`voxy-button ${
                      activeTab === tab.key ? 'voxy-button--active' : ''
                    }`}
                  >
                    <span className="button_top">{t(`kpop.tabs.${tab.key}`, locale)}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Artists & Groups */}
          {activeTab === 'artists' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('kpop.artists.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('kpop.artists.desc', locale)}
                </p>
              </div>

              <div className="space-y-8">
                {featuredArtists.map((artist, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* 기본 정보 */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div><span className="font-semibold text-gray-800">Type:</span> {artist.type}</div>
                          <div><span className="font-semibold text-gray-800">Debut:</span> {artist.debut}</div>
                          <div><span className="font-semibold text-gray-800">Members:</span> {artist.members}</div>
                          <div><span className="font-semibold text-gray-800">Agency:</span> {artist.agency}</div>
                        </div>
                        <p className="text-gray-700 mt-4 text-sm">{locale === 'fr' && artist.i18n?.fr.description ? artist.i18n.fr.description : artist.description}</p>
                      </div>

                      {/* 최근 소식 */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{t('kpop.artists.recentUpdates', locale)}</h4>
                        <ul className="space-y-2">
                          {(locale === 'fr' && artist.i18n?.fr.recentNews ? artist.i18n.fr.recentNews : artist.recentNews).map((news, newsIndex) => (
                            <li key={newsIndex} className="flex items-start space-x-2">
                              <span className="text-gray-400 mt-1">-</span>
                              <span className="text-sm text-gray-700">{news}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 공식 링크 */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{t('kpop.artists.officialLinks', locale)}</h4>
                        <div className="space-y-4">
                          {Object.entries(artist.officialLinks).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full"
                            >
                               <button className="learn-more w-full" style={{fontSize: '12px', padding: '1em 1.5em'}}>
                                {platform}
                              </button>
                            </a>
                          ))}
                        </div>
                         <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <h5 className="text-sm font-semibold text-gray-800 mb-1">{t('kpop.artists.canadaConnection', locale)}</h5>
                          <p className="text-sm text-gray-700">{locale === 'fr' && artist.i18n?.fr.canadaConnection ? artist.i18n.fr.canadaConnection : artist.canadaConnection}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedules & Events */}
          {activeTab === 'schedules' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('kpop.schedules.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('kpop.schedules.desc', locale)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                      <p className="text-sm font-semibold text-primary-600 mb-2">{event.date}</p>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{locale === 'fr' && event.i18n?.fr.event ? event.i18n.fr.event : event.event}</h3>
                      <p className="text-sm text-gray-500 mb-3">{event.location}</p>
                      <p className="text-gray-700 text-sm mb-4">{locale === 'fr' && event.i18n?.fr.description ? event.i18n.fr.description : event.description}</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-800">{t('kpop.schedules.canadianInterest', locale)}</span> {locale === 'fr' && event.i18n?.fr.canadianInterest ? event.i18n.fr.canadianInterest : event.canadianInterest}
                        </p>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canada Connection */}
          {activeTab === 'canada' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('kpop.canada.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('kpop.canada.desc', locale)}
                </p>
              </div>

              <div className="space-y-6">
                {canadaConnections.map((section, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{locale === 'fr' && section.i18n?.fr.title ? section.i18n.fr.title : section.title}</h3>
                    <p className="text-gray-600 mb-4">{locale === 'fr' && section.i18n?.fr.description ? section.i18n.fr.description : section.description}</p>
                    <ul className="space-y-2">
                      {(locale === 'fr' && section.i18n?.fr.items ? section.i18n.fr.items : section.items).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">-</span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* K-pop Demon Hunters (external test) */}
          {activeTab === 'demon' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">K-pop Demon Hunters</h2>
                <p className="text-gray-600">External demo embedded below</p>
              </div>
              <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <iframe
                  src={`/k-pop-demon-hunters/index.html?lang=${locale === 'fr' ? 'fr' : 'en'}`}
                  title="K-pop Demon Hunters"
                  className="w-full"
                  style={{ height: '80vh' }}
                />
              </div>
              <p className="mt-3 text-xs text-gray-500">Static files served from /public/k-pop-demon-hunters/</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const seoData: SEOData = {
    title: 'K-Pop Guide for Canadian Fans - Artists, Schedules, Events',
    description: 'Complete K-pop guide for Canadian fans. Artist profiles, concert schedules, official links, and connections to the Canadian K-pop scene.',
    keywords: [
      'kpop canada',
      'korean music artists',
      'kpop concerts canada',
      'bts blackpink canada',
      'korean music schedule',
      ...SEO_KEYWORDS.primary
    ],
    structuredData: {
      "@type": "MusicGroup",
      "genre": "K-Pop",
      "description": "Korean pop music artists and events guide for Canadian fans"
    }
  };

  return {
    props: {
      seoData
    }
  };
};
