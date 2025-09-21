import Head from 'next/head';
import { useRouter } from 'next/router';
import { SEOData } from '@/types';
import { SITE_CONFIG } from '@/utils/constants';

interface SEOHeadProps {
  data: SEOData;
  noIndex?: boolean;
  canadaSpecific?: boolean;
}

export default function SEOHead({ 
  data, 
  noIndex = false, 
  canadaSpecific = true 
}: SEOHeadProps) {
  const router = useRouter();
  const { locale = 'en' } = router;
  
  const canonicalUrl = data.canonicalUrl || `${SITE_CONFIG.url}${router.asPath}`;
  const altEn = `${SITE_CONFIG.url}${router.asPath}`.replace(/\/fr(\b|\/)/, '/');
  const altFr = `${SITE_CONFIG.url}/fr${router.asPath.replace(/^\/(fr)?/, '')}`;
  
  // 구조화된 데이터 기본값
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": data.title,
    "description": data.description,
    "url": canonicalUrl,
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url
    }
  };

  const structuredData = data.structuredData 
    ? { ...defaultStructuredData, ...data.structuredData }
    : defaultStructuredData;

  return (
    <Head>
      {/* 기본 SEO */}
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      {data.keywords && data.keywords.length > 0 && (
        <meta name="keywords" content={data.keywords.join(', ')} />
      )}
      
      {/* 캐나다 특화 메타 태그 */}
      {canadaSpecific && (
        <>
          <meta name="geo.region" content="CA" />
          <meta name="geo.country" content="Canada" />
          <meta property="og:locale" content={locale === 'fr' ? 'fr_CA' : 'en_CA'} />
        </>
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      {data.ogImage && <meta property="og:image" content={data.ogImage} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      {data.ogImage && <meta name="twitter:image" content={data.ogImage} />}
      
      {/* 정규 URL */}
      <link rel="canonical" href={canonicalUrl} />
      {/* hreflang (en/fr) */}
      <link rel="alternate" hrefLang="en" href={altEn} />
      <link rel="alternate" hrefLang="fr" href={altFr} />
      <link rel="alternate" hrefLang="x-default" href={altEn} />
      
      {/* 로봇 메타 */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </Head>
  );
}
