import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { SEOData } from '@/types';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

export default function LegalNoticePage() {
  const { locale } = useAppLocale();

  const seoData: SEOData = {
    title: t('legal.seo.title', locale),
    description: t('legal.seo.desc', locale),
    keywords: ['legal', 'privacy', 'cookies', 'copyright', 'PIPEDA'],
    noIndex: true,
  };

  return (
    <Layout>
      <SEOHead data={seoData} noIndex />
      <div className="bg-white">
        <div className="relative text-white bg-gray-800">
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('legal.title', locale)}</h1>
            <p className="text-xl text-gray-300 max-w-3xl">{t('legal.tagline', locale)}</p>
            <p className="text-sm text-gray-300 mt-2">{t('legal.lastUpdated.prefix', locale)} 2025-09-20</p>
          </div>
        </div>
        
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
          <h2>{t('legal.disclaimer.title', locale)}</h2>
          <p>{t('legal.disclaimer.p1', locale)}</p>
          <p>{t('legal.disclaimer.p2', locale)}</p>

          <h2>{t('legal.terms.title', locale)}</h2>
          <p>{t('legal.terms.p1', locale)}</p>
          <ul>
            <li>{t('legal.terms.l1', locale)}</li>
            <li>{t('legal.terms.l2', locale)}</li>
            <li>{t('legal.terms.l3', locale)}</li>
          </ul>

          <h2>{t('legal.privacy.title', locale)}</h2>
          <p>{t('legal.privacy.p1', locale)}</p>
          <p>{t('legal.privacy.p2', locale)}</p>
          <p>{t('legal.privacy.p3', locale)}</p>
          <p>{t('legal.privacy.p4', locale)}</p>

          <h2>{t('legal.cookies.title', locale)}</h2>
          <p>{t('legal.cookies.p1', locale)}</p>

          <h2>{t('legal.ads.title', locale)}</h2>
          <p>{t('legal.ads.p1', locale)}</p>
          <p>{t('legal.ads.p2', locale)}</p>

          <h2>{t('legal.sources.title', locale)}</h2>
          <p>{t('legal.sources.p1', locale)}</p>
          <p>{t('legal.sources.p2', locale)}</p>

          <h2>{t('legal.copyright.title', locale)}</h2>
          <p>{t('legal.copyright.p1', locale)}</p>
          <p>{t('legal.copyright.p2', locale)}</p>

          <h2>{t('legal.security.title', locale)}</h2>
          <p>{t('legal.security.p1', locale)}</p>

          <h2>{t('legal.children.title', locale)}</h2>
          <p>{t('legal.children.p1', locale)}</p>

          <h2>{t('legal.changes.title', locale)}</h2>
          <p>{t('legal.changes.p1', locale)}</p>

          <h2>{t('legal.contact.title', locale)}</h2>
          <p>
            {t('legal.contact.p1', locale)}{' '}
            <a href="/contact" className="text-primary-600 hover:text-primary-700">/contact</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
