import { GetStaticProps } from 'next';
import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface TravelFoodProps {
  seoData: SEOData;
}

export default function TravelFood({ seoData }: TravelFoodProps) {
  const { locale } = useAppLocale();
  const [activeSection, setActiveSection] = useState('prep');

  const sections = [
    { key: 'prep', label: 'Trip Preparation' },
    { key: 'moving', label: 'Getting Around' },
    { key: 'seasonal', label: 'Seasonal Guide' },
    { key: 'restaurants', label: 'Food & Dining' }
  ];

  const tripPrep = [
    {
      category: 'Money & Payment',
      items: [
        {
          title: 'Exchange Money',
          details: 'Best rates at Myeongdong or banks. Avoid airport exchanges.',
          tip: 'Bring CAD cash, exchange in Korea for better rates'
        },
        {
          title: 'T-money Card',
          details: 'Buy at any subway station. Works for subway, bus, some taxis.',
          tip: 'Load ₩50,000 initially, refill as needed'
        },
        {
          title: 'Credit Cards',
          details: 'Visa/Mastercard widely accepted. Notify your bank before travel.',
          tip: 'Canadian cards work fine, but carry cash for small vendors'
        }
      ],
      i18n: { fr: {
        category: 'Argent et Paiement',
        items: [
            { title: 'Changer de l\'Argent', details: 'Meilleurs taux à Myeongdong ou dans les banques. Évitez les bureaux de change de l\'aéroport.', tip: 'Apportez des dollars canadiens en espèces, changez en Corée pour de meilleurs taux' },
            { title: 'Carte T-money', details: 'Achetez dans n\'importe quelle station de métro. Fonctionne pour le métro, le bus, certains taxis.', tip: 'Chargez 50 000 ₩ initialement, rechargez au besoin' },
            { title: 'Cartes de Crédit', details: 'Visa/Mastercard largement acceptées. Avertissez votre banque avant de voyager.', tip: 'Les cartes canadiennes fonctionnent bien, mais ayez de l\'argent liquide pour les petits vendeurs' }
        ]
      }},
      i18n_comm: { fr: {
        category: 'Communication',
        items: [
            { title: 'Pocket WiFi vs SIM', details: 'Pocket WiFi : 6 000 ₩/jour. SIM touriste : 15 000 ₩/semaine.', tip: 'Les cartes SIM sont meilleures pour les voyages en solo, le WiFi pour les groupes' },
            { title: 'Applications Essentielles', details: 'KakaoMap (navigation), Papago (traduction), Citymapper (métro)', tip: 'Téléchargez des cartes hors ligne avant d\'arriver' },
            { title: 'Numéros d\'Urgence', details: '112 (police), 119 (pompiers/ambulance), 1330 (Ligne d\'assistance touristique Corée)', tip: 'Enregistrez dans le téléphone avec des étiquettes en coréen et en anglais' }
        ]
      }}
    }
  ];

  const gettingAround = [
    {
      mode: 'Subway',
      icon: '🚇',
      tips: [
        'Rush hours: 7-9 AM, 6-8 PM - expect crowds',
        'Last trains: around midnight, first trains: 5:30 AM',
        'Priority seats: clearly marked, strictly enforced',
        'Exit numbers: memorize them, Korean addresses use exit numbers'
      ],
      apps: ['Citymapper', 'Subway Map', 'KakaoMap'],
      i18n: { fr: {
        mode: 'Métro',
        tips: [
            'Heures de pointe : 7-9h, 18-20h - attendez-vous à la foule',
            'Derniers trains : vers minuit, premiers trains : 5h30',
            'Sièges prioritaires : clairement indiqués, strictement respectés',
            'Numéros de sortie : mémorisez-les, les adresses coréennes les utilisent'
        ]
      }}
    },
    {
      mode: 'Bus',
      icon: '🚌',
      tips: [
        'Blue buses: main routes, Red buses: express',
        'Green buses: neighborhood circulators',
        'Pay with T-money or exact cash',
        'Ring bell before your stop'
      ],
      apps: ['Seoul Bus', 'KakaoMap'],
      i18n: { fr: {
        mode: 'Bus',
        tips: [
            'Bus bleus : itinéraires principaux, Bus rouges : express',
            'Bus verts : circulateurs de quartier',
            'Payez avec la T-money ou en espèces exactes',
            'Sonnez avant votre arrêt'
        ]
      }}
    },
    {
      mode: 'Taxi',
      icon: '🚕',
      tips: [
        'Regular taxis: orange/silver, Deluxe: black',
        'Base fare: ₩3,800 (first 2km)',
        'Show destination in Korean or use map',
        'Tipping not expected'
      ],
      apps: ['KakaoTaxi', 'Uber (limited areas)'],
      i18n: { fr: {
        mode: 'Taxi',
        tips: [
            'Taxis réguliers : orange/argent, Deluxe : noir',
            'Tarif de base : 3 800 ₩ (premiers 2 km)',
            'Montrez la destination en coréen ou utilisez une carte',
            'Le pourboire n\'est pas attendu'
        ]
      }}
    },
    {
      mode: 'Walking',
      icon: '🚶',
      tips: [
        'Underground passages connect major areas',
        'Pedestrian signals are short - walk quickly',
        'Download offline maps for backup',
        'Address system: dong (neighborhood) → street number'
      ],
      apps: ['Google Maps', 'KakaoMap'],
      i18n: { fr: {
        mode: 'Marche',
        tips: [
            'Les passages souterrains relient les zones principales',
            'Les feux pour piétons sont courts - marchez vite',
            'Téléchargez des cartes hors ligne en secours',
            'Système d\'adresse : dong (quartier) → numéro de rue'
        ]
      }}
    }
  ];

  const seasonalGuide = [
    {
      season: 'Spring (March-May)',
      weather: '10-20°C, cherry blossoms',
      clothing: 'Light jacket, layers',
      highlights: [
        'Cherry blossom festivals (Yeouido, Jinhae)',
        'Perfect hiking weather',
        'Outdoor markets and festivals'
      ],
      avoid: 'Yellow dust storms (check air quality)',
      i18n: { fr: {
        season: 'Printemps (Mars-Mai)',
        weather: '10-20°C, fleurs de cerisier',
        clothing: 'Veste légère, superpositions',
        highlights: [
          'Festivals de fleurs de cerisier (Yeouido, Jinhae)',
          'Météo parfaite pour la randonnée',
          'Marchés et festivals en plein air'
        ],
        avoid: 'Tempêtes de poussière jaune (vérifiez la qualité de l\'air)'
      }}
    },
    {
      season: 'Summer (June-August)', 
      weather: '25-35°C, humid, monsoon',
      clothing: 'Light, breathable fabrics, umbrella',
      highlights: [
        'Beach destinations (Busan, Jeju)',
        'Summer festivals and concerts',
        'Cold noodle season (naengmyeon)'
      ],
      avoid: 'Monsoon season (July), extreme humidity',
      i18n: { fr: {
        season: 'Été (Juin-Août)',
        weather: '25-35°C, humide, mousson',
        clothing: 'Tissus légers et respirants, parapluie',
        highlights: [
            'Destinations balnéaires (Busan, Jeju)',
            'Festivals et concerts d\'été',
            'Saison des nouilles froides (naengmyeon)'
        ],
        avoid: 'Saison de la mousson (juillet), humidité extrême'
      }}
    },
    {
      season: 'Fall (September-November)',
      weather: '10-25°C, crisp and clear',
      clothing: 'Layers, light jacket',
      highlights: [
        'Fall foliage (Seoraksan, Naejangsan)',
        'Perfect weather for sightseeing',
        'Harvest festivals and markets'
      ],
      avoid: 'Peak tourist season - book early',
      i18n: { fr: {
        season: 'Automne (Septembre-Novembre)',
        weather: '10-25°C, frais et clair',
        clothing: 'Superpositions, veste légère',
        highlights: [
            'Feuillage d\'automne (Seoraksan, Naejangsan)',
            'Météo parfaite pour le tourisme',
            'Fêtes des récoltes et marchés'
        ],
        avoid: 'Haute saison touristique - réservez tôt'
      }}
    },
    {
      season: 'Winter (December-February)',
      weather: '-10-5°C, dry cold',
      clothing: 'Heavy coat, thermal layers, good boots',
      highlights: [
        'Winter illuminations and markets',
        'Hot springs and spas',
        'Winter sports (skiing, ice fishing)'
      ],
      avoid: 'Lunar New Year crowds (late Jan/early Feb)',
      i18n: { fr: {
        season: 'Hiver (Décembre-Février)',
        weather: '-10-5°C, froid sec',
        clothing: 'Manteau épais, couches thermiques, bonnes bottes',
        highlights: [
            'Illuminations et marchés d\'hiver',
            'Sources chaudes et spas',
            'Sports d\'hiver (ski, pêche sur glace)'
        ],
        avoid: 'Foules du Nouvel An lunaire (fin janv./début fév.)'
      }}
    }
  ];

  const restaurantPlatforms = [
    {
      name: 'MangoPlate',
      description: 'Korean Yelp with foreigner-friendly reviews',
      pros: ['English interface', 'Photo-heavy reviews', 'Neighborhood discovery'],
      canadianTip: 'Filter by "foreigner-friendly" tags',
      i18n: { fr: {
          description: 'Le Yelp coréen avec des avis adaptés aux étrangers',
          pros: ['Interface en anglais', 'Avis riches en photos', 'Découverte de quartiers'],
          canadianTip: 'Filtrez par les tags "foreigner-friendly"'
      }}
    },
    {
      name: 'Foursquare',
      description: 'International platform with Korean venues',
      pros: ['Familiar interface', 'Check-in rewards', 'Canadian user reviews'],
      canadianTip: 'Look for reviews from other Canadians',
      i18n: { fr: {
          description: 'Plateforme internationale avec des lieux coréens',
          pros: ['Interface familière', 'Récompenses de check-in', 'Avis d\'utilisateurs canadiens'],
          canadianTip: 'Recherchez les avis d\'autres Canadiens'
      }}
    },
    {
      name: 'Google Maps',
      description: 'Reliable for basic restaurant info',
      pros: ['Familiar interface', 'Opening hours', 'Photos'],
      canadianTip: 'Cross-reference with Korean platforms',
      i18n: { fr: {
          description: 'Fiable pour les informations de base sur les restaurants',
          pros: ['Interface familière', 'Heures d\'ouverture', 'Photos'],
          canadianTip: 'Référence croisée avec les plateformes coréennes'
      }}
    },
    {
      name: 'Dining Code',
      description: 'Premium restaurant reservations',
      pros: ['High-end venues', 'English support', 'Reservation system'],
      canadianTip: 'For special occasions and fine dining',
      i18n: { fr: {
          description: 'Réservations de restaurants premium',
          pros: ['Lieux haut de gamme', 'Support en anglais', 'Système de réservation'],
          canadianTip: 'Pour les occasions spéciales et la haute cuisine'
      }}
    }
  ];

  const diningEtiquette = {
    dos: [
      'Wait for the eldest to start eating',
      'Use both hands when receiving/giving',
      'Try everything offered to you',
      'Share side dishes (banchan)',
      'Pour drinks for others, not yourself'
    ],
    donts: [
      "Don't stick chopsticks upright in rice",
      "Don't blow your nose at the table",
      "Don't tip (not customary in Korea)",
      "Don't refuse food/drink from elders",
      "Don't eat alone if invited to group meal"
    ],
    i18n: { fr: {
      dos: [
        "Attendre que l'aîné commence à manger",
        "Utiliser les deux mains pour recevoir/donner",
        "Goûter à tout ce qui vous est offert",
        "Partager les plats d'accompagnement (banchan)",
        "Verser à boire aux autres, pas à soi-même"
      ],
      donts: [
        "Ne pas planter ses baguettes droites dans le riz",
        "Ne pas se moucher à table",
        "Ne pas laisser de pourboire (pas coutumier en Corée)",
        "Ne pas refuser de la nourriture/boisson des aînés",
        "Ne pas manger seul si invité à un repas de groupe"
      ]
    }}
  };

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/Travel&food_header.png" alt="Travel & Food header" className="absolute inset-0 h-full w-full object-cover object-[center_40]" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('travel.page.title', locale)}</h1>
            <p className="text-xl text-green-100 max-w-3xl">
              {t('travel.page.tagline', locale)}
            </p>
          </div>
        </div>

        {/* 섹션 네비게이션 */}
        <div className="border-b border-gray-200">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 py-4" role="radiogroup">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  role="radio"
                  aria-checked={activeSection === section.key}
                  className={`voxy-button ${
                    activeSection === section.key
                      ? 'voxy-button--active'
                      : ''
                  }`}
                >
                  <span className="button_top">{t(`travel.tabs.${section.key}`, locale)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trip Preparation */}
          {activeSection === 'prep' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('travel.prep.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('travel.prep.desc', locale)}
                </p>
              </div>

              <div className="space-y-8">
                {tripPrep.map((category, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{locale === 'fr' ? category.i18n.fr.category : category.category}</h3>
                    
                    <div className="space-y-6">
                      {(locale === 'fr' ? category.i18n.fr.items : category.items).map((item, itemIndex) => (
                        <div key={itemIndex}>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-700 mb-3">{item.details}</p>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-800">
                              <span className="font-bold">Tip:</span> {item.tip}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Getting Around */}
          {activeSection === 'moving' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('travel.moving.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('travel.moving.desc', locale)}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gettingAround.map((mode, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{locale === 'fr' ? mode.i18n.fr.mode : mode.mode}</h3>

                    <div className="space-y-3 mb-4">
                      {(locale === 'fr' ? mode.i18n.fr.tips : mode.tips).map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start space-x-2">
                          <span className="text-gray-500 mt-1">-</span>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommended Apps:</h4>
                      <p className="text-sm text-gray-600">
                        {mode.apps.join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seasonal Guide */}
          {activeSection === 'seasonal' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('travel.seasonal.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('travel.seasonal.desc', locale)}
                </p>
              </div>

              <div className="space-y-6">
                {seasonalGuide.map((season, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{locale === 'fr' ? season.i18n.fr.season : season.season}</h3>
                        <p className="text-sm text-gray-600 mb-3">{locale === 'fr' ? season.i18n.fr.weather : season.weather}</p>
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">Pack: </span>
                          <span className="text-gray-700">{locale === 'fr' ? season.i18n.fr.clothing : season.clothing}</span>
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights</h4>
                        <ul className="space-y-1">
                          {(locale === 'fr' ? season.i18n.fr.highlights : season.highlights).map((highlight, hIndex) => (
                            <li key={hIndex} className="text-sm text-gray-700 flex items-start space-x-2">
                              <span className="text-gray-500 mt-1">-</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-red-600 mb-2">Avoid</h4>
                        <p className="text-sm text-gray-700">{locale === 'fr' ? season.i18n.fr.avoid : season.avoid}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Restaurant Platforms */}
          {activeSection === 'restaurants' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('travel.restaurants.title', locale)}</h2>
                <p className="text-gray-600">
                  {t('travel.restaurants.desc', locale)}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {restaurantPlatforms.map((platform, index) => (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{platform.name}</h3>
                    <p className="text-gray-600 mb-4">{locale === 'fr' ? platform.i18n.fr.description : platform.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Pros:</h4>
                      <p className="text-sm text-gray-700">
                        {(locale === 'fr' ? platform.i18n.fr.pros : platform.pros).join(', ')}
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Tip:</h4>
                      <p className="text-sm text-gray-800">{locale === 'fr' ? platform.i18n.fr.canadianTip : platform.canadianTip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 음식 문화 가이드 */}
              <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('travel.restaurants.etiquetteTitle', locale)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('travel.restaurants.dos', locale)}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {(locale === 'fr' ? diningEtiquette.i18n.fr.dos : diningEtiquette.dos).map((item, index) => (
                        <li key={index}>- {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">{t('travel.restaurants.donts', locale)}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                       {(locale === 'fr' ? diningEtiquette.i18n.fr.donts : diningEtiquette.donts).map((item, index) => (
                        <li key={index}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA 섹션 */}
        <div className="relative text-white py-32">
          <img src="/images/headers/Travel&food_footer.png" alt="Plan your adventure" className="absolute inset-0 h-full w-full object-cover object-[center_50%]" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('travel.cta.title', locale)}</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {t('travel.cta.desc', locale)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tools/cost-estimator"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('travel.cta.button1', locale)}
              </a>
              <a
                href="/tools/qna?topic=travel"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                {t('travel.cta.button2', locale)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const seoData: SEOData = {
    title: 'Korea Travel & Food Guide for Canadians',
    description: 'Complete travel guide for Canadians visiting Korea. Transportation tips, seasonal advice, restaurant recommendations, and cultural dining etiquette.',
    keywords: [
      'korea travel from canada',
      'seoul travel guide canadian',
      'korean food restaurants',
      'korea transportation tips',
      ...SEO_KEYWORDS.longTail
    ],
    structuredData: {
      "@type": "TravelGuide",
      "name": "Korea Travel Guide for Canadians",
      "description": "Comprehensive travel and food guide for Canadian visitors to Korea"
    }
  };

  return {
    props: {
      seoData
    }
  };
};
