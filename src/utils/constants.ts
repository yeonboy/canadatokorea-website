import { LocaleConfig, NavItem, CostCategory, CostScenario, RealKoreaCard } from '@/types';

// 사이트 설정
export const SITE_CONFIG = {
  name: 'ca.korea.com',
  title: 'Real Korea Insights for Canadians',
  description: '캐나다인을 위한 한국 로컬 실시간 인사이트',
  url: 'https://ca.korea.com',
  author: 'ca.korea.com',
  keywords: ['korea', 'canada', 'korean culture', 'travel', 'language learning'],
  defaultLocale: 'en' as const,
  supportedLocales: ['en', 'fr'] as const
};

// 언어 설정
export const LOCALE_CONFIG: Record<string, LocaleConfig> = {
  en: {
    locale: 'en',
    label: 'English',
    flag: '🇨🇦'
  },
  fr: {
    locale: 'fr', 
    label: 'Français',
    flag: '🇫🇷'
  }
};

// 네비게이션 구조
export const NAVIGATION: NavItem[] = [
  {
    href: '/real-korea-now',
    label: 'Real Korea Now',
    labelFr: 'Corée en Temps Réel'
  },
  {
    href: '/learn',
    label: 'Learn Korean',
    labelFr: 'Apprendre le Coréen'
  },
  {
    href: '/travel-food',
    label: 'Travel & Food',
    labelFr: 'Voyage et Cuisine'
  },
  {
    href: '/k-pop',
    label: 'K-Pop',
    labelFr: 'K-Pop'
  },
  {
    href: '/community',
    label: 'Community',
    labelFr: 'Communauté'
  }
];

// 카테고리 설정
export const CATEGORIES = {
  'real-korea-now': {
    label: 'Real Korea Now',
    color: 'bg-primary-500',
    icon: '🇰🇷'
  },
  'learn-korean': {
    label: 'Learn Korean',
    color: 'bg-korean-blue',
    icon: '📚'
  },
  'travel-food': {
    label: 'Travel & Food',
    color: 'bg-green-500',
    icon: '✈️'
  },
  'community': {
    label: 'Community',
    color: 'bg-purple-500',
    icon: '👥'
  },
  'k-pop': {
    label: 'K-Pop',
    color: 'bg-pink-500',
    icon: '🎵'
  }
} as const;

// QnA 토픽 설정
export const QNA_TOPICS = {
  'living-cost': {
    label: 'Living Cost',
    icon: '💰',
    color: 'bg-yellow-500'
  },
  'housing': {
    label: 'Housing',
    icon: '🏠',
    color: 'bg-blue-500'
  },
  'visa': {
    label: 'Visa',
    icon: '📋',
    color: 'bg-red-500'
  },
  'transport': {
    label: 'Transport',
    icon: '🚇',
    color: 'bg-green-500'
  },
  'tips': {
    label: 'Tips',
    icon: '💡',
    color: 'bg-amber-500'
  },
  'other': {
    label: 'Other',
    icon: '❓',
    color: 'bg-gray-500'
  }
} as const;

// 한국 도시 설정
export const KOREAN_CITIES = {
  Seoul: { label: 'Seoul', coord: [37.5665, 126.9780] },
  Busan: { label: 'Busan', coord: [35.1796, 129.0756] },
  Incheon: { label: 'Incheon', coord: [37.4563, 126.7052] },
  Daejeon: { label: 'Daejeon', coord: [36.3504, 127.3845] },
  Daegu: { label: 'Daegu', coord: [35.8714, 128.6014] },
  Gwangju: { label: 'Gwangju', coord: [35.1595, 126.8526] },
  Jeju: { label: 'Jeju', coord: [33.4996, 126.5312] }
} as const;

// 카드 타입 설정
export const CARD_TYPES: Record<RealKoreaCard['type'], { label: string; icon: string; color: string; gradient: string; bannerBg: string; iconUrl?: string; iconUrlFlaticon?: string }> = {
  issue: {
    label: 'Today\'s Issue',
    icon: '📰',
    color: 'bg-red-100 border-red-300',
    gradient: 'from-rose-500 to-orange-500',
    bannerBg: 'bg-blue-600',
    iconUrl: '/icons/news.svg',
    iconUrlFlaticon: '/icons/flaticon/news.svg'
  },
  popup: {
    label: 'Pop-up Event',
    icon: '🎪',
    color: 'bg-purple-100 border-purple-300',
    gradient: 'from-violet-500 to-pink-500',
    bannerBg: 'bg-violet-600',
    iconUrl: '/icons/event.svg',
    iconUrlFlaticon: '/icons/flaticon/event.svg'
  },
  congestion: {
    label: 'Traffic Alert',
    icon: '🚇',
    color: 'bg-orange-100 border-orange-300',
    gradient: 'from-amber-500 to-rose-500',
    bannerBg: 'bg-green-600',
    iconUrl: '/icons/traffic.svg',
    iconUrlFlaticon: '/icons/flaticon/traffic.svg'
  },
  tip: {
    label: 'Life Tip',
    icon: '💡',
    color: 'bg-blue-100 border-blue-300',
    gradient: 'from-sky-500 to-cyan-500',
    bannerBg: 'bg-yellow-400',
    iconUrl: '/icons/tips.svg',
    iconUrlFlaticon: '/icons/flaticon/tips.svg'
  },
  weather: {
    label: 'Weather',
    icon: '🌦️',
    color: 'bg-blue-100 border-blue-300',
    gradient: 'from-sky-400 to-blue-500',
    bannerBg: 'bg-sky-500',
    iconUrl: '/icons/weather.svg'
  },
  hotspot: {
    label: 'Hotspot',
    icon: '📍',
    color: 'bg-pink-100 border-pink-300',
    gradient: 'from-rose-500 to-rose-600',
    bannerBg: 'bg-rose-600',
    iconUrl: '/icons/hotspot.svg'
  },
  population: {
    label: 'Population',
    icon: '👥',
    color: 'bg-green-100 border-green-300',
    gradient: 'from-emerald-500 to-teal-500',
    bannerBg: 'bg-emerald-600',
    iconUrl: '/icons/population.svg'
  }
} as const;

// 비용 카테고리 기본값
export const DEFAULT_COST_CATEGORIES: CostCategory[] = [
  {
    key: 'food',
    label: 'Food',
    items: [
      { name: 'Lunch set', unit: 'per meal', krw: 9000 },
      { name: 'Cafe latte', unit: 'cup', krw: 5500 },
      { name: 'Groceries', unit: 'per week', krw: 60000 }
    ]
  },
  {
    key: 'transport',
    label: 'Transport', 
    items: [
      { name: 'Subway fare', unit: 'trip', krw: 1450 },
      { name: 'T-money top-up', unit: 'per month', krw: 60000 }
    ]
  },
  {
    key: 'rent',
    label: 'Rent',
    items: [
      { name: 'Off-campus studio', unit: 'per month', krw: 800000 }
    ]
  },
  {
    key: 'utilities',
    label: 'Utilities',
    items: [
      { name: 'Electricity+Gas+Water', unit: 'per month', krw: 100000 }
    ]
  },
  {
    key: 'mobile',
    label: 'Mobile',
    items: [
      { name: 'Data plan (10GB)', unit: 'per month', krw: 35000 }
    ]
  },
  {
    key: 'misc',
    label: 'Misc',
    items: [
      { name: 'Gym', unit: 'per month', krw: 60000 }
    ]
  }
];

// 시나리오 기본값
export const DEFAULT_SCENARIOS: CostScenario[] = [
  {
    name: 'Student basic',
    weights: { food: 0.25, transport: 0.1, rent: 0.45, utilities: 0.1, mobile: 0.05, misc: 0.05 }
  },
  {
    name: 'Young professional',
    weights: { food: 0.3, transport: 0.1, rent: 0.4, utilities: 0.1, mobile: 0.05, misc: 0.05 }
  }
];

// SEO 키워드
export const SEO_KEYWORDS = {
  primary: ['korea live issue', 'seoul hotspot', 'korea visa from canada'],
  secondary: ['learn korean in context', 'korean transport tips'],
  longTail: ['korea real-time trends for canadians', 'seoul pop-up guide']
} as const;

// 환경 변수 키
export const ENV_KEYS = {
  NEXT_PUBLIC_GA_ID: 'NEXT_PUBLIC_GA_ID',
  NEXT_PUBLIC_SITE_URL: 'NEXT_PUBLIC_SITE_URL',
  SEOUL_TOPIS_API_KEY: 'SEOUL_TOPIS_API_KEY'
} as const;
