import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Search, Globe } from 'lucide-react';
import { NAVIGATION, LOCALE_CONFIG } from '@/utils/constants';
import dynamic from 'next/dynamic';
const StaggeredMenu = dynamic(() => import('./StaggeredMenu'), { ssr: false });
import { cn, t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { locale, toggleLocale, setLocale } = useAppLocale();

  const handleLanguageChange = (newLocale: string) => {
    setLocale((newLocale as 'en'|'fr'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className="relative z-50 bg-white/95 backdrop-blur-lg supports-[backdrop-filter]:bg-white/90 shadow-lg border-b border-gray-100 sticky top-0">
        <div className="max-w-content mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-20">
            {/* 로고 */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div>
                  <span className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors font-handwriting">
                    Canada to Korea
                  </span>
                  <div className="text-xs font-medium text-gray-500 -mt-1">.com</div>
                </div>
              </Link>
            </div>

            {/* 검색, 언어 설정, 메뉴 (우측 정렬) */}
            <div className="hidden md:flex items-center space-x-3">
              {/* 검색 */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={t('search.placeholder', locale as 'en'|'fr')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-300 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
              </form>

              {/* 언어 선택 */}
              <div className="relative">
                <button
                  onClick={() => handleLanguageChange(locale === 'en' ? 'fr' : 'en')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-primary-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <Globe className="h-4 w-4" />
                  <span>{LOCALE_CONFIG[locale].flag}</span>
                  <span>{LOCALE_CONFIG[locale].label}</span>
                </button>
              </div>

              {/* StaggeredMenu (우측 끝) */}
              <StaggeredMenu
                position="right"
                items={NAVIGATION.map(n => ({ 
                  label: locale === 'fr' && n.labelFr ? n.labelFr : n.label, 
                  ariaLabel: n.label, 
                  link: n.href 
                }))}
                socialItems={[{ label: 'Twitter', link: 'https://twitter.com' }, { label: 'GitHub', link: 'https://github.com' }]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor="#111"
                openMenuButtonColor="#111"
                changeMenuColorOnOpen={true}
                colors={["#B19EEF","#5227FF"]}
                logoUrl="/favicon.ico"
                accentColor="#2B5CE6"
              />
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-3 rounded-xl text-gray-700 hover:text-primary-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gray-200">
              <div className="px-6 py-6 space-y-6">
                {/* 모바일 검색 */}
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={locale === 'fr' 
                      ? 'Rechercher des informations coréennes...'
                      : 'Search Korean insights...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-300 transition-all duration-200"
                  />
                  <Search className="absolute left-4 top-5 h-5 w-5 text-gray-400" />
                </form>

                {/* 모바일 네비게이션 */}
                <div className="space-y-2">
                  {NAVIGATION.map((item) => {
                    const isActive = router.pathname.startsWith(item.href);

                    return (
                      <div key={item.href} className="space-y-2">
                        <Link
                          href={item.href}
                          className={cn(
                            'block px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200',
                            isActive
                              ? 'text-primary-700 bg-primary-50 shadow-sm'
                              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {locale === 'fr' && item.labelFr ? item.labelFr : item.label}
                        </Link>

                        {/* 서브메뉴 */}
                        {item.children && (
                          <div className="ml-6 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2 text-base text-gray-600 hover:text-primary-700 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {locale === 'fr' && child.labelFr ? child.labelFr : child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 모바일 언어 선택 */}
                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => handleLanguageChange(locale === 'en' ? 'fr' : 'en')}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-primary-700 rounded-xl hover:bg-gray-50 transition-all duration-200 w-full"
                  >
                    <Globe className="h-5 w-5" />
                    <span>{LOCALE_CONFIG[locale].flag}</span>
                    <span>{LOCALE_CONFIG[locale].label}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 모바일 하단 고정 탭 제거 */}
    </>
  );
}