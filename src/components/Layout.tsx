import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { SITE_CONFIG } from '@/utils/constants';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
  hideNavigation?: boolean;
  wrapperClassName?: string;
}

export default function Layout({
  children,
  title,
  description,
  keywords = [],
  canonicalUrl,
  structuredData,
  noIndex = false,
  hideNavigation = false,
  wrapperClassName
}: LayoutProps) {
  const router = useRouter();
  const { locale = 'en' } = router;
  
  const pageTitle = title 
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.title;
  
  const pageDescription = description || SITE_CONFIG.description;
  
  const fullCanonicalUrl = canonicalUrl || `${SITE_CONFIG.url}${router.asPath}`;
  
  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  return (
    <>
      <Head>
        {/* 기본 메타 태그 */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={allKeywords.join(', ')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={SITE_CONFIG.author} />
        
        {/* 캐나다 특화 메타 태그 */}
        <meta property="og:locale" content={locale === 'fr' ? 'fr_CA' : 'en_CA'} />
        <meta name="geo.region" content="CA" />
        <meta name="geo.country" content="Canada" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:site_name" content={SITE_CONFIG.name} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* 정규 URL */}
        <link rel="canonical" href={fullCanonicalUrl} />
        
        {/* 언어 대체 */}
        <link rel="alternate" hrefLang="en" href={`${SITE_CONFIG.url}/en${router.asPath}`} />
        <link rel="alternate" hrefLang="fr" href={`${SITE_CONFIG.url}/fr${router.asPath}`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_CONFIG.url}${router.asPath}`} />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* 로봇 메타 */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* 구조화된 데이터 */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        )}
        
        {/* 성능 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </Head>
      
      <div className={["min-h-screen flex flex-col", wrapperClassName || 'bg-white'].join(' ')}>
        {!hideNavigation && <Navigation />}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
