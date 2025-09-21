import { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { useAppLocale } from '@/contexts/LocaleContext';

interface AboutProps {
  seoData: SEOData;
}

export default function About({ seoData }: AboutProps) {
  const { locale } = useAppLocale();

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">
              {locale === 'fr' ? 'À Propos' : 'About Us'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              {locale === 'fr' 
                ? 'Connecter les Canadiens à la vraie Corée'
                : 'Connecting Canadians to the real Korea'
              }
            </p>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'fr' ? 'Notre Mission' : 'Our Mission'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {locale === 'fr' 
                    ? 'canadatokorea.com est votre passerelle vers des insights coréens authentiques. Nous fournissons des informations locales en temps réel, des conseils culturels et des guides pratiques spécialement conçus pour les Canadiens.'
                    : 'canadatokorea.com is your gateway to authentic Korean insights. We provide real-time local information, cultural tips, and practical guides specifically designed for Canadians.'
                  }
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {locale === 'fr' ? 'Ce Qui Nous Rend Uniques' : 'What Makes Us Unique'}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {locale === 'fr' 
                      ? 'Contenu en temps réel mis à jour quotidiennement'
                      : 'Real-time content updated daily'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {locale === 'fr' 
                      ? 'Perspective canadienne sur la culture coréenne'
                      : 'Canadian perspective on Korean culture'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {locale === 'fr' 
                      ? 'Informations locales que seuls les Coréens connaissent'
                      : 'Local insights only Koreans know'
                    }
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {locale === 'fr' 
                      ? 'Support bilingue (anglais et français)'
                      : 'Bilingual support (English and French)'
                    }
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {locale === 'fr' ? 'Notre Approche' : 'Our Approach'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {locale === 'fr' 
                    ? 'Nous combinons la technologie moderne avec des insights culturels authentiques pour créer une expérience d\'apprentissage unique.'
                    : 'We combine modern technology with authentic cultural insights to create a unique learning experience.'
                  }
                </p>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {locale === 'fr' ? 'Nos Valeurs' : 'Our Values'}
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-800">
                        {locale === 'fr' ? 'Authenticité' : 'Authenticity'}
                      </strong> - {locale === 'fr' 
                        ? 'Informations vérifiées de sources officielles'
                        : 'Verified information from official sources'
                      }
                    </div>
                    <div>
                      <strong className="text-gray-800">
                        {locale === 'fr' ? 'Accessibilité' : 'Accessibility'}
                      </strong> - {locale === 'fr' 
                        ? 'Contenu accessible à tous les Canadiens'
                        : 'Content accessible to all Canadians'
                      }
                    </div>
                    <div>
                      <strong className="text-gray-800">
                        {locale === 'fr' ? 'Innovation' : 'Innovation'}
                      </strong> - {locale === 'fr' 
                        ? 'Technologie moderne pour une meilleure expérience'
                        : 'Modern technology for better experience'
                      }
                    </div>
                  </div>
                </div>
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
    title: 'About Us - canadatokorea.com',
    description: 'Learn about our mission to connect Canadians with authentic Korean culture, language, and local insights.',
    keywords: [
      'about canadatokorea',
      'korean culture canada',
      'korea information portal',
      'canadian korean connection'
    ]
  };

  return {
    props: {
      seoData
    }
  };
};
