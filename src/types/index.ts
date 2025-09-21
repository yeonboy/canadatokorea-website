// 기본 타입 정의
export interface Post {
  id: string;
  title: string;
  slug: string;
  category: 'real-korea-now' | 'learn-korean' | 'travel-food' | 'community' | 'k-pop';
  language: 'en' | 'fr';
  tags: string[];
  lastUpdatedKST: string;
  readingTimeMin: number;
  seo: {
    description: string;
    keywords: string[];
  };
  status: 'Draft' | 'Needs-Source' | 'Approved' | 'Scheduled' | 'Published';
  schedule?: {
    publishAtKST: string;
  };
  sources: Source[];
  adsPolicy: {
    isSensitiveSection: boolean;
    topAdDisabled: boolean;
  };
  body: string;
}

export interface QnA {
  id: string;
  question: string;
  answer: string;
  topic: 'living-cost' | 'housing' | 'visa' | 'transport' | 'tips' | 'other';
  language: 'en' | 'fr';
  tags: string[];
  i18n?: {
    fr?: {
      question?: string;
      answer?: string;
      tags?: string[];
    }
  };
  lastUpdatedKST: string;
  sources: Source[];
  status: 'Draft' | 'Approved' | 'Published';
}

export interface Source {
  title: string;
  url: string;
  publisher: string;
  publishedAt?: string;
  note?: string;
}

export interface CostEstimator {
  id: string;
  city: 'Seoul' | 'Busan' | 'Incheon' | 'Daejeon' | 'Daegu' | 'Gwangju' | 'Jeju';
  currency: 'CAD' | 'KRW';
  exchangeRateKRWPerCAD: number;
  exchangeRateAsOf: string;
  categories: CostCategory[];
  scenarios: CostScenario[];
  lastUpdatedKST: string;
}

export interface CostCategory {
  key: 'food' | 'transport' | 'rent' | 'utilities' | 'mobile' | 'misc' | 'flight' | 'accommodation' | 'activities';
  label: string;
  items: CostItem[];
  calculationStrategy?: 'sum' | 'pick_one';
  calculationType?: 'per_day' | 'one_time';
}

export interface CostItem {
  name: string;
  unit: string;
  krw: number;
  cad?: number;
  defaultFor?: string[];
}

export interface CostScenario {
  name: string;
  weights?: Record<string, number>;
}

export interface Schedule {
  id: string;
  contentId: string;
  publishAtKST: string;
  createdAt: string;
  status: 'Scheduled' | 'Published' | 'Cancelled';
  notes?: string;
}

// 카드 타입 정의
export interface RealKoreaCard {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  tags: string[];
  i18n?: {
    fr?: {
      title?: string;
      summary?: string;
      tags?: string[];
      geoArea?: string;
    }
  };
  image?: { src: string; alt?: string };
  geo?: {
    lat: number;
    lng: number;
    area: string;
  };
  period?: {
    start: string;
    end: string;
  };
  sources: Source[];
  lastUpdatedKST: string;
}

// 언어/지역 타입
export type Locale = 'en' | 'fr';

export interface LocaleConfig {
  locale: Locale;
  label: string;
  flag: string;
}

// 네비게이션 타입
export interface NavItem {
  href: string;
  label: string;
  labelFr?: string;
  children?: NavItem[];
}

// SEO 타입
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
  noIndex?: boolean;
}
