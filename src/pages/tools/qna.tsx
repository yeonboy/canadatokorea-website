import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import QnASearch from '@/components/QnASearch';
import { QnA, SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';

interface QnAPageProps {
  qnaItems: QnA[];
  seoData: SEOData;
}

export default function QnAPage({ qnaItems, seoData }: QnAPageProps) {
  const { locale } = useAppLocale();
  const router = useRouter();
  const { q: initialQuery = '', topic: initialTopic = '' } = router.query;

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* 헤더 */}
        <div className="relative text-white">
          <img src="/images/headers/qna-hero.jpg" alt="QnA header" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/80 to-blue-600/70" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('qna.page.title', locale)}</h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              {t('qna.page.tagline', locale)}
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* QnA 검색 컴포넌트 */}
          <QnASearch 
            qnaItems={qnaItems}
            initialQuery={String(initialQuery)}
            initialTopic={String(initialTopic)}
          />
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  // content/qna/sample-qna.json에서 QnA 데이터 로드
  const qnaFile = path.join(process.cwd(), 'content', 'qna', 'sample-qna.json');
  let qnaItems: QnA[] = [];
  try {
    const raw = fs.readFileSync(qnaFile, 'utf8');
    qnaItems = JSON.parse(raw);
  } catch {
    qnaItems = [];
  }

  const seoData: SEOData = {
    title: 'Korea QnA - Questions and Answers for Canadians',
    description: 'Find answers to common questions about living, studying, and traveling in Korea. Practical advice from local experiences and official sources.',
    keywords: [
      'korea questions answers',
      'living in korea guide',
      'korea student visa',
      'seoul housing tips',
      ...SEO_KEYWORDS.secondary
    ],
    structuredData: {
      "@type": "FAQPage",
      "mainEntity": qnaItems.slice(0, 5).map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  };

  return {
    props: {
      qnaItems,
      seoData
    }
  };
};
