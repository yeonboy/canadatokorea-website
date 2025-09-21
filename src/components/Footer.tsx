import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SITE_CONFIG } from '@/utils/constants';
import { formatDateKST, t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);

export default function Footer() {
  const router = useRouter();
  const { locale } = useAppLocale();
  const currentYear = new Date().getFullYear();
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(formatDateKST(new Date().toISOString()));
  }, []);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-primary-600">
                canada to korea.com
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              {t('footer.description', locale)}
            </p>
            <div className="text-sm text-gray-500">
              {lastUpdated && <p>Last updated: {lastUpdated}</p>}
              <p>
                {t('footer.rights', locale).replace('{year}', String(currentYear)).replace('{siteName}', SITE_CONFIG.name)}
                <Link href="/legal" className="ml-2 hover:text-primary-600 underline">
                  {t('footer.legal', locale)}
                </Link>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.quickLinks', locale)}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/real-korea-now" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('rkn.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/tools/cost-estimator" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('cost.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/tools/qna" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('qna.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/city/seoul" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('seoul.page.title', locale)}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              {t('footer.categories', locale)}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('learn.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/travel-food" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('travel.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('community.page.title', locale)}
                </Link>
              </li>
              <li>
                <Link href="/k-pop" className="text-gray-600 hover:text-primary-600 text-sm">
                  {t('kpop.page.title', locale)}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-6 text-sm text-gray-500 mb-4 sm:mb-0">
              <Link href="/about" className="hover:text-primary-600">
                {t('footer.links.about', locale)}
              </Link>
              <Link href="/contact" className="hover:text-primary-600">
                {t('footer.links.contact', locale)}
              </Link>
              <Link href="/sitemap" className="hover:text-primary-600">
                {t('footer.links.sitemap', locale)}
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{t('footer.madeWith', locale)}</span>
              <LinkIcon className="h-4 w-4 text-gray-700" />
              <span>{t('footer.forConnection', locale)}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
