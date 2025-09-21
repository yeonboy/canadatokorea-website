import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { useAppLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';

interface SitemapProps {
  seoData: SEOData;
}

export default function Sitemap({ seoData }: SitemapProps) {
  const { locale } = useAppLocale();

  const siteStructure = [
    {
      title: locale === 'fr' ? 'Pages Principales' : 'Main Pages',
      links: [
        { href: '/', label: locale === 'fr' ? 'Accueil' : 'Home' },
        { href: '/real-korea-now', label: 'Real Korea Now' },
        { href: '/learn', label: locale === 'fr' ? 'Apprendre le Coréen' : 'Learn Korean' },
        { href: '/travel-food', label: locale === 'fr' ? 'Voyage & Cuisine' : 'Travel & Food' },
        { href: '/community', label: locale === 'fr' ? 'Communauté' : 'Community' },
        { href: '/k-pop', label: 'K-Pop' }
      ]
    },
    {
      title: locale === 'fr' ? 'Outils' : 'Tools',
      links: [
        { href: '/tools/cost-estimator', label: locale === 'fr' ? 'Calculateur de Coûts' : 'Cost Estimator' },
        { href: '/tools/qna', label: locale === 'fr' ? 'Recherche Q&R' : 'QnA Search' }
      ]
    },
    {
      title: locale === 'fr' ? 'Guides de Ville' : 'City Guides',
      links: [
        { href: '/city/seoul', label: locale === 'fr' ? 'Guide de Séoul' : 'Seoul Guide' }
      ]
    },
    {
      title: locale === 'fr' ? 'Cartes Interactives' : 'Interactive Maps',
      links: [
        { href: '/real-korea-now/map', label: locale === 'fr' ? 'Carte en Temps Réel' : 'Real-time Map' }
      ]
    },
    {
      title: locale === 'fr' ? 'Informations' : 'Information',
      links: [
        { href: '/about', label: locale === 'fr' ? 'À Propos' : 'About' },
        { href: '/contact', label: locale === 'fr' ? 'Contact' : 'Contact' },
        { href: '/search', label: locale === 'fr' ? 'Recherche' : 'Search' }
      ]
    }
  ];

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">
              {locale === 'fr' ? 'Plan du Site' : 'Sitemap'}
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl">
              {locale === 'fr' 
                ? 'Explorez toutes nos pages et fonctionnalités'
                : 'Explore all our pages and features'
              }
            </p>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteStructure.map((section, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 추가 정보 */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'fr' ? 'Informations Supplémentaires' : 'Additional Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {locale === 'fr' ? 'Contenu Dynamique' : 'Dynamic Content'}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    {locale === 'fr' 
                      ? '• Mises à jour quotidiennes des insights coréens'
                      : '• Daily updates of Korean insights'
                    }
                  </li>
                  <li>
                    {locale === 'fr' 
                      ? '• Nouveaux pop-ups et événements'
                      : '• New pop-ups and events'
                    }
                  </li>
                  <li>
                    {locale === 'fr' 
                      ? '• Informations de trafic en temps réel'
                      : '• Real-time traffic information'
                    }
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {locale === 'fr' ? 'Ressources' : 'Resources'}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    {locale === 'fr' 
                      ? '• Ressources d\'apprentissage coréen officielles'
                      : '• Official Korean learning resources'
                    }
                  </li>
                  <li>
                    {locale === 'fr' 
                      ? '• Outils de traduction et dictionnaires'
                      : '• Translation tools and dictionaries'
                    }
                  </li>
                  <li>
                    {locale === 'fr' 
                      ? '• Guides de voyage pratiques'
                      : '• Practical travel guides'
                    }
                  </li>
                </ul>
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
    title: 'Sitemap - canadatokorea.com',
    description: 'Complete sitemap of all pages and features on canadatokorea.com. Find Korean insights, learning resources, and tools.',
    keywords: [
      'canadatokorea sitemap',
      'korean information pages',
      'site navigation',
      'korean resources directory'
    ]
  };

  return {
    props: {
      seoData
    }
  };
};
