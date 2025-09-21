import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { formatDateKST, t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';

const getResultIcon = (type: string) => {
  switch (type) {
    case 'post': return '📄';
    case 'qna': return '❓';
    case 'tool': return '🔧';
    case 'guide': return '📖';
    default: return '📋';
  }
};

export default function SearchPage() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { q } = router.query;

  useEffect(() => {
    if (q && typeof q === 'string') {
      setSearchQuery(q);
      performSearch(q, selectedCategory);
    }
  }, [q, selectedCategory]);

  const performSearch = async (query: string, category: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    
    try {
      // 실제 검색 API 호출
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}&limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        console.log(`🔍 검색 완료: "${query}" → ${data.results?.length || 0}개 결과`);
      } else {
        throw new Error('Search API failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if(q && typeof q === 'string') {
      performSearch(q, category);
    }
  }

  const categories = [
    { key: 'all', label: 'All Results' },
    { key: 'real-korea-now', label: 'Real Korea Now' },
    { key: 'learn-korean', label: 'Learn Korean' },
    { key: 'travel-food', label: 'Travel & Food' },
    { key: 'community', label: 'Community' },
    { key: 'k-pop', label: 'K-Pop' },
  ];

  const seoData: SEOData = {
    title: `Search Results${q ? ` for "${q}"` : ''} - ca.korea.com`,
    description: 'Search Korean insights, guides, QnA, and tools for Canadians interested in Korea.',
    keywords: ['korea search', 'korean information search', 'canada korea guide search'],
    noIndex: true
  };

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white min-h-screen">
        <div className="relative bg-gray-50">
            <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <h1 className="text-4xl font-bold mb-4 text-gray-900">
                   {locale === 'fr' ? 'Recherche' : 'Search'}
                 </h1>
                 <p className="text-xl text-gray-600 max-w-2xl">
                   {locale === 'fr' 
                     ? 'Recherchez dans notre base de données complète d\'informations coréennes, guides et conseils pratiques.'
                     : 'Search our comprehensive database of Korean insights, guides, and practical information.'
                   }
                 </p>
            </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="sticky top-20 bg-white py-4 z-10 border-b border-gray-200">
                <form onSubmit={handleSearch} className="mb-4">
                    <input
                      type="text"
                      placeholder="Search for Korean insights, tips, guides..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </form>

                <div className="flex flex-wrap gap-3" role="radiogroup">
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => handleCategoryChange(category.key)}
                      role="radio"
                      aria-checked={selectedCategory === category.key}
                      className={`voxy-button ${selectedCategory === category.key ? 'voxy-button--active' : ''}`}
                    >
                      <span className="button_top">{category.label}</span>
                    </button>
                  ))}
                </div>
            </div>

            <div className="mt-8">
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-6">
                        <p className="text-gray-600">
                          {locale === 'fr' 
                            ? `${results.length} résultats trouvés pour "${q}"`
                            : `${results.length} results found for "${q}"`
                          }
                        </p>
                         {results.map((result, index) => (
                             <a href={result.url} key={index} className="block bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 hover:shadow-lg transition-shadow">
                                 <div className="flex items-center gap-2 mb-3">
                                   <span className="text-lg">{getResultIcon(result.type)}</span>
                                   <span className="text-sm font-semibold text-primary-600 uppercase">{result.category.replace('-', ' ')}</span>
                                 </div>
                                 <h2 className="text-xl font-bold text-gray-900 mb-2">
                                   {(locale === 'fr' && result.i18n?.fr?.title) ? result.i18n.fr.title : result.title}
                                 </h2>
                                 <p className="text-gray-700 mb-4">
                                   {(locale === 'fr' && result.i18n?.fr?.summary) ? result.i18n.fr.summary : result.summary}
                                 </p>
                                 <p className="text-xs text-gray-500">Last updated: {formatDateKST(result.lastUpdated)}</p>
                             </a>
                         ))}
                    </div>
                ) : q ? (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {locale === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}
                        </h3>
                        <p className="text-gray-600">
                          {locale === 'fr' 
                            ? `Nous n'avons rien trouvé correspondant à "${q}". Essayez des mots-clés différents.`
                            : `We couldn't find anything matching "${q}". Try different keywords.`
                          }
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
      </div>
    </Layout>
  );
}
