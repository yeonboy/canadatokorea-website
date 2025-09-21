# 🇰🇷 ca.korea.com - 캐나다 대상 한국 정보 포털 프로젝트

> 캐나다인을 위한 종합 한국 정보 웹사이트 구축 프로젝트

## 📋 프로젝트 개요

**ca.korea.com**은 캐나다인을 대상으로 "한국 로컬 실시간 인사이트"를 전달하는 정적 웹사이트입니다. 목적은 한국을 여행/체류/학습하려는 캐나다 이용자에게 로컬 한국인만 아는 생활 정보, 핫플/문화 흐름, 교통·인구 트래픽, 오늘의 이슈, 비자/유학 실전 가이드를 전달하는 것입니다. 초기 단계는 양보다 가치 전략으로, 자동화는 초안/요약 보조에 한정하고 에디터(관리자)가 직접 큐레이션/승인합니다.

### 🎯 핵심 목표
- **타겟 시장**: 캐나다 전국(18-30), 영어 기본 + 프랑스어 선택형
- **월간 목표(90일)**: 10,000 페이지뷰, 평균 체류 3분, 캐나다 비중 70%
- **수익 목표**: MVP 단계 AdSense만 (민감 섹션 상단 비노출)
- **기술 스택**: AWS S3 + CloudFront, Next.js, 로컬 OSS LLM(gpt-oss-20b), MCP Admin(무료)

## 🚀 주요 특징

### ✨ 운영 원칙 & 자동화
- **유료 AI/API 금지**: OpenAI/유료 API 미사용. 로컬 OSS LLM(gpt-oss-20b)만 사용
- **가치 우선**: 자동화는 초안/요약·메타데이터 보조, 최종은 에디터 수동 승인
- **데이터 소싱**: 합법적 공개소스·공식 RSS·오픈데이터 위주(링크/요약 중심)
- **자동 배포**: GitHub Actions 기반 CI/CD, S3+CloudFront 배포
- **MCP Admin(무료)**: 큐레이션/승인/스케줄링 관리자 페이지

### 🎨 캐나다 친화적 UI/UX
- **현지화 디자인**: 캐나다 사용자 선호도 반영
- **모바일 우선**: 반응형 디자인 및 PWA 지원
- **접근성**: WCAG 2.1 AA 수준 준수
- **성능 최적화**: Core Web Vitals 만점 목표

### 📝 차별화된 콘텐츠 전략 (초기 비중)
- **Real Korea Now (20%)**: 오늘의 이슈, 핫플/팝업, 교통·혼잡, QnA, 비용 추산 위젯
- **Learn Korean (10%)**: 기초·실전 표현, 연령대별 표현, 발음/문해력, 무료 리소스
- **Travel & 맛집 (20%)**: 여행 준비/이동/계절 추천, 외국인 리뷰 링크 중심 맛집
- **Community (20%)**: 한국 내 캐나다인 모임/행사, 연결 허브
- **K-Pop (30%)**: 아티스트/그룹 프로필, 공식 채널/일정, 최근 행보 요약

## 📁 프로젝트 구조

```
ca.korea/
├── 📋 기획 문서
│   ├── PROJECT_MASTER_PLAN.md          # 전체 프로젝트 마스터 플랜
│   ├── IMPLEMENTATION_ROADMAP.md       # 단계별 구현 로드맵
│   ├── CONTENT_AUTOMATION_SYSTEM.md    # 콘텐츠 자동화 시스템
│   └── COMPETITOR_ANALYSIS.md          # 경쟁사 분석
│
├── 🧭 정보구조/템플릿/소스
│   ├── IA_ROUTING.md                   # 네비/라우팅
│   ├── CONTENT_TEMPLATES.md            # 콘텐츠 템플릿
│   └── DATA_SOURCES.md                 # 무료 데이터 소스 리스트
│
├── ⚙️ Cursor Rules
│   ├── .cursor/rules/canada-ui-ux.mdc          # 캐나다 UI/UX 가이드라인
│   ├── .cursor/rules/korean-content-strategy.mdc # 콘텐츠 전략 가이드
│   ├── .cursor/rules/canada-ui-ux.mdc            # UI/UX 가이드
│   └── .cursor/rules/aws-deployment.mdc         # AWS 배포 가이드라인
│
└── 🔧 구현 예정 구조
    ├── src/                            # 소스 코드
    ├── content/                        # 콘텐츠 파일
    ├── scripts/                        # 자동화 스크립트
    └── .github/workflows/              # CI/CD 설정
```

## 📊 시장 분석 하이라이트

### 🎯 캐나다 한류 시장 현황
- **K-콘텐츠 폭발적 성장**: 넷플릭스 `오징어 게임` 2021년 구글 캐나다 검색어 10위
- **한국어 교육 열풍**: 토론토대학교 한국어 수업 수백 명 대기자
- **문화 교류 활성화**: 온타리오주 고등학교 한국어 수강생 3년간 3배 증가

### 💡 경쟁 환경 기회
- ✅ **종합적인 한국 정보 포털 부재**
- ✅ **캐나다 특화 콘텐츠 부족**
- ✅ **자동화된 콘텐츠 생성 시스템 부재**
- ✅ **모바일 최적화 미흡한 기존 사이트들**

## 🏗️ 기술 아키텍처

### 인프라 구성
```mermaid
graph LR
    A[사용자] --> B[CloudFront CDN]
    B --> C[S3 Static Website]
    D[GitHub Actions] --> C
    E[Local OSS LLM (gpt-oss-20b)] --> D
    F[Public RSS/Open Data + 지자체 무료 오픈 API] --> E
    G[MCP Admin (Free)] --> D
```

### 핵심 기술 스택
- **Frontend**: Next.js 13+ (Static Generation)
- **Hosting**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions
- **Content**: 로컬 LLM 초안 + 에디터 큐레이션 (Markdown)
- **Analytics**: Google Analytics 4 + Search Console

## 📈 12개월 로드맵

### Phase 1: Foundation (Month 1-2)
- 🎯 **목표**: MVP 런칭, 월 5,000 PV
- 🔧 **주요 작업**: AWS 인프라 구축, 자동화 시스템 개발, 초기 콘텐츠 20개

### Phase 2: Growth (Month 3-6)
- 🎯 **목표**: 월 20,000 PV, AdSense 승인
- 📊 **주요 작업**: SEO 최적화, 소셜 미디어 채널 구축, 백링크 구축

### Phase 3: Scale (Month 7-12)
- 🎯 **목표**: 월 50,000+ PV, 월 $500+ 수익
- 🚀 **주요 작업**: 수익 다각화, 커뮤니티 구축, 다국가 확장 준비

## 💰 예상 수익 모델

| 수익원 | 6개월 목표 | 12개월 목표 |
|--------|------------|-------------|
| Google AdSense | $150/월 | $400/월 |
| 제휴 마케팅 | $80/월 | $200/월 |
| 프리미엄 콘텐츠 | $50/월 | $300/월 |
| **총계** | **$280/월** | **$900/월** |

## 🛠️ 시작하기

### 필수 요구사항
- Node.js 18+
- AWS 계정
- GitHub 계정
- 로컬 LLM(gpt-oss-20b) 실행 환경
- 합법적 공개 RSS/오픈데이터/지자체 오픈 API 목록

### 빠른 시작 (예정)
```bash
# 리포지토리 클론
git clone https://github.com/your-username/ca.korea.git
cd ca.korea

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 API 키 설정

# 개발 서버 시작
npm run dev
```

## 📚 문서 가이드

### 📋 기획 문서
1. **[프로젝트 마스터 플랜](PROJECT_MASTER_PLAN.md)** - 전체 프로젝트 개요 및 전략
2. **[구현 로드맵](IMPLEMENTATION_ROADMAP.md)** - 단계별 구현 계획 및 일정
3. **[콘텐츠 자동화 시스템](CONTENT_AUTOMATION_SYSTEM.md)** - AI 기반 콘텐츠 생성 시스템
4. **[경쟁사 분석](COMPETITOR_ANALYSIS.md)** - 시장 분석 및 차별화 전략

### ⚙️ 개발 가이드라인
- **[캐나다 UI/UX 가이드](.cursor/rules/canada-ui-ux.mdc)** - 캐나다 사용자 친화적 디자인
- **[콘텐츠 전략 가이드](.cursor/rules/korean-content-strategy.mdc)** - 한국 로컬 인사이트·무료 소싱·로컬 LLM 전략
- **[AWS 배포 가이드](.cursor/rules/aws-deployment.mdc)** - 인프라 설정 및 배포 방법

## 🎯 핵심 성공 지표 (KPI)

### 트래픽 목표
- **Month 3**: 8,000 PV/월
- **Month 6**: 20,000 PV/월
- **Month 12**: 50,000+ PV/월

### 품질 지표
- **페이지 로딩 속도**: < 2초
- **모바일 최적화**: 90점+
- **SEO 점수**: 95점+
- **사용자 만족도**: 평균 세션 시간 4분+

### 수익 지표
- **AdSense RPM**: $8+ (캐나다 평균)
- **제휴 마케팅 전환율**: 3%+
- **프리미엄 콘텐츠 전환율**: 2%+

## 🤝 기여하기

이 프로젝트는 현재 기획 단계이며, 곧 개발을 시작할 예정입니다. 관심 있으신 분들의 의견과 제안을 환영합니다!

### 기여 방법
1. 이슈 등록을 통한 피드백 제공
2. 기획 문서 검토 및 개선 제안
3. 캐나다 시장에 대한 인사이트 공유

## 📞 연락처

프로젝트에 대한 문의나 협업 제안이 있으시면 언제든지 연락해 주세요.

- **프로젝트 관리자**: [GitHub Issues](https://github.com/your-username/ca.korea/issues)
- **이메일**: contact@ca.korea.com (예정)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<div align="center">
  <strong>🇰🇷 한국과 캐나다를 잇는 디지털 다리 🇨🇦</strong><br>
  <em>Connecting Korea and Canada through Digital Innovation</em>
</div>
