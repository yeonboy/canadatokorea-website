import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import CostEstimator from '@/components/CostEstimator';
import { CostEstimator as CostEstimatorType, SEOData } from '@/types';
import { SEO_KEYWORDS } from '@/utils/constants';
import { useAppLocale } from '@/contexts/LocaleContext';
import { t } from '@/utils/helpers';
import { useState } from 'react';

interface CostDataByCity {
  [city: string]: CostEstimatorType;
}

interface CostEstimatorPageProps {
  livingCostData: CostDataByCity;
  travelCostData: CostDataByCity;
  seoData: SEOData;
}

export default function CostEstimatorPage({ livingCostData, travelCostData, seoData }: CostEstimatorPageProps) {
  const { locale } = useAppLocale();
  const [activeCalculator, setActiveCalculator] = useState<'living' | 'travel'>('living');

  return (
    <Layout>
      <SEOHead data={seoData} />
      
      <div className="bg-white">
        {/* Header */}
        <div className="relative text-white">
          <img src="/images/headers/cost-hero.jpg" alt="Cost Estimator header" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/80 to-green-600/70" />
          <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">{t('cost.page.title', locale)}</h1>
            <p className="text-xl text-green-100 max-w-3xl">
              {t('cost.page.tagline', locale)}
            </p>
          </div>
        </div>

        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex justify-center flex-wrap gap-3 mb-8" role="radiogroup">
            <button
              onClick={() => setActiveCalculator('living')}
              role="radio"
              aria-checked={activeCalculator === 'living'}
              className={`voxy-button ${activeCalculator === 'living' ? 'voxy-button--active' : ''}`}
            >
              <span className="button_top">Living Cost Calculator</span>
            </button>
            <button
              onClick={() => setActiveCalculator('travel')}
              role="radio"
              aria-checked={activeCalculator === 'travel'}
              className={`voxy-button ${activeCalculator === 'travel' ? 'voxy-button--active' : ''}`}
            >
              <span className="button_top">Travel Cost Calculator</span>
            </button>
          </div>

          {activeCalculator === 'living' && <CostEstimator allData={livingCostData} calculatorType="living" />}
          {activeCalculator === 'travel' && <CostEstimator allData={travelCostData} calculatorType="travel" />}

          {/* Additional Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Cost-Saving Tips
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>- Use T-money card for 5-10% discount on transport</li>
                <li>- Shop at traditional markets for fresh groceries at lower prices</li>
                <li>- Consider goshiwon or sharehouse for budget accommodation</li>
                <li>- Use free WiFi widely available instead of expensive data plans</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Related Resources
              </h2>
              <div className="space-y-3">
                <a href="/tools/qna?topic=living-cost" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-bold text-gray-900">Living Cost QnA</div>
                  <div className="text-sm text-gray-600">Common questions about expenses in Korea</div>
                </a>
                <a href="/tools/qna?topic=housing" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-bold text-gray-900">Housing Guide</div>
                  <div className="text-sm text-gray-600">Find apartments and understand rental systems</div>
                </a>
                <a href="/city/seoul" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-bold text-gray-900">Seoul Living Guide</div>
                  <div className="text-sm text-gray-600">Comprehensive guide for living in Seoul</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const loadCostData = (fileName: string): CostDataByCity => {
    const filePath = path.join(process.cwd(), 'samples', fileName);
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const livingCostData = loadCostData('cost_estimator.sample.json');
  const travelCostData = loadCostData('travel_cost_estimator.sample.json');

  const seoData: SEOData = {
    title: 'Korea Cost Estimator - Living Expenses Calculator for Canadians',
    description: 'Calculate and compare living costs in Korean cities. Realistic estimates for rent, food, transport, and more. Updated exchange rates and local insights.',
    keywords: [
      'korea cost of living',
      'seoul living expenses',
      ...SEO_KEYWORDS.longTail
    ],
  };

  return {
    props: {
      livingCostData,
      travelCostData,
      seoData
    }
  };
};
