/** @type {import('next').NextConfig} */
const isAdminSSR = process.env.ADMIN_SSR === '1';
// Amplify Hosting 환경에서는 AMPLIFY_APP_ID가 자동으로 주입됨.
// Amplify에서는 SSR을 강제하여 정적 export로 잘못 빌드되어 /admin 404가 나는 문제를 방지
const isAmplifyEnv = !!process.env.AMPLIFY_APP_ID;
const forceSSR = isAdminSSR || isAmplifyEnv;
const nextConfig = {
  // 동시 dev 서버 실행 시 빌드 디렉토리 분리 지원
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Admin(SSR) 또는 Amplify 환경에서는 정적 export 비활성화
  // (Amplify에서 SSR이 아닌 정적 export로 빌드되면 /admin이 404가 날 수 있음)
  output: forceSSR || process.env.NODE_ENV === 'development' ? undefined : 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif']
  },
  // i18n은 정적 export와 호환되지 않으므로 수동 구현
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Cloudflare + S3 최적화 (assetPrefix 제거 - 상대 경로 사용)
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'http://canadatokorea.com' : '',
  // lucide-react 아이콘 경로를 ESM .mjs로 명시적으로 모듈화하여 Next 변환 충돌 방지
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}.mjs'
    }
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/review',
        permanent: false
      },
      {
        source: '/admin/',
        destination: '/review/',
        permanent: false
      }
    ];
  },
  // exclude admin/review from export
  exportPathMap: async (defaultPathMap) => {
    const pathMap = { ...defaultPathMap };
    delete pathMap['/admin'];
    delete pathMap['/review'];
    return pathMap;
  }
  // headers와 redirects는 정적 export와 호환되지 않음
};

module.exports = nextConfig;
