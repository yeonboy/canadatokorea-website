/** @type {import('next').NextConfig} */
const nextConfig = {
  // 동시 dev 서버 실행 시 빌드 디렉토리 분리 지원
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // 개발 환경에서는 API 라우트 사용을 위해 export 비활성화
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',
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
