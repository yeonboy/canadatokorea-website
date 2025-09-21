# 자동화 데이터 파이프라인 도구 제안서

## 현재 상황 분석

### 기존 시스템
- `src/lib/data-collector.ts`: RSS/오픈데이터 수집 오케스트레이터 (Mock 상태)
- 수동 관리: `content/data/today-cards.json` 직접 편집
- API 엔드포인트: `/api/rkn/*` (실시간 조회용)

### 제약사항
- 유료 API 금지 (OpenAI, 상용 서비스)
- 로컬 LLM(gpt-oss-20b) 사용 권장
- 무료/오픈소스 도구만 사용
- 캐나다 법규(PIPEDA) 준수

## 도구 비교 분석

### 1. Notion 연동 방식
**장점:**
- 직관적 UI로 에디터가 쉽게 관리
- 무료 API 제공 (월 1000회 호출)
- 데이터베이스 구조화 지원
- 팀 협업 기능

**단점:**
- API 호출 제한 (월 1000회)
- 복잡한 자동화에는 부족
- 실시간 업데이트 어려움

### 2. Airtable 연동 방식
**장점:**
- 강력한 데이터베이스 기능
- 무료 플랜 제공
- 자동화 기능 (Zapier 연동)

**단점:**
- 복잡한 설정
- 무료 플랜 제약

### 3. 로컬 파일 기반 + GitHub Actions
**장점:**
- 완전 무료
- 버전 관리 통합
- 유연한 자동화
- 데이터 소유권 완전 보장

**단점:**
- 초기 설정 복잡
- 비개발자에게 어려움

### 4. 제안: 하이브리드 접근법

## 권장 아키텍처: Notion + 로컬 파이프라인

```
[Notion DB] → [Sync Script] → [Local JSON] → [Build Process] → [Static Site]
     ↑              ↓              ↑              ↓
[에디터 관리]    [자동 변환]     [Git 저장]    [배포 자동화]
```

### 핵심 컴포넌트

#### 1. Notion 데이터베이스 구조
```
📊 Real Korea Cards DB
├── 제목 (Title) - 텍스트
├── 요약 (Summary) - 긴 텍스트  
├── 타입 (Type) - 선택 (Issue/Popup/Traffic/Tip)
├── 상태 (Status) - 선택 (Draft/Review/Approved/Published)
├── 지역 (Area) - 텍스트
├── 좌표 (Coordinates) - 텍스트 (lat,lng)
├── 기간 (Period) - 날짜 범위
├── 태그 (Tags) - 다중선택
├── 출처1 (Source1) - URL
├── 출처2 (Source2) - URL
├── 마지막 업데이트 (Last Updated) - 날짜
├── 프랑스어 제목 (FR Title) - 텍스트
├── 프랑스어 요약 (FR Summary) - 긴 텍스트
└── 승인자 (Approver) - 사용자
```

#### 2. 자동화 스크립트 (`scripts/sync-notion.js`)
```javascript
// Notion API로 데이터 가져오기
async function fetchNotionData() {
  const response = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    },
    method: 'POST',
    body: JSON.stringify({
      filter: {
        property: 'Status',
        select: { equals: 'Published' }
      }
    })
  });
  return response.json();
}

// RealKoreaCard 형태로 변환
function transformNotionToCards(notionData) {
  return notionData.results.map(page => ({
    id: page.id,
    type: page.properties.Type.select?.name?.toLowerCase() || 'issue',
    title: page.properties.Title.title[0]?.plain_text || '',
    summary: page.properties.Summary.rich_text[0]?.plain_text || '',
    tags: page.properties.Tags.multi_select.map(tag => tag.name),
    geo: parseCoordinates(page.properties.Coordinates.rich_text[0]?.plain_text),
    period: parsePeriod(page.properties.Period.date),
    sources: [
      { url: page.properties.Source1.url, publisher: 'Source 1' },
      { url: page.properties.Source2.url, publisher: 'Source 2' }
    ].filter(s => s.url),
    lastUpdatedKST: page.last_edited_time,
    i18n: {
      fr: {
        title: page.properties['FR Title'].rich_text[0]?.plain_text,
        summary: page.properties['FR Summary'].rich_text[0]?.plain_text
      }
    }
  }));
}
```

#### 3. GitHub Actions 워크플로우 (`.github/workflows/sync-data.yml`)
```yaml
name: Sync Data from Notion

on:
  schedule:
    - cron: '0 */2 * * *'  # 2시간마다
  workflow_dispatch:  # 수동 실행

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Sync from Notion
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DB_ID: ${{ secrets.NOTION_DB_ID }}
        run: node scripts/sync-notion.js
        
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add content/data/
          git diff --staged --quiet || git commit -m "Auto-sync: Update data from Notion"
          git push
```

#### 4. 로컬 LLM 통합 (`scripts/content-enhancer.js`)
```javascript
// gpt-oss-20b 로컬 모델 사용
async function enhanceContent(rawText) {
  const response = await fetch('http://localhost:8080/v1/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-oss-20b',
      prompt: `다음 한국 뉴스를 캐나다인 관점에서 요약하고 실용적 팁을 추가하세요:\n\n${rawText}\n\n요약:`,
      max_tokens: 200,
      temperature: 0.3
    })
  });
  return response.json();
}
```

## 구현 계획

### Phase 1: Notion 기본 연동 (1-2일)
1. Notion 데이터베이스 템플릿 생성
2. 기본 sync 스크립트 구현
3. 수동 실행으로 테스트

### Phase 2: 자동화 파이프라인 (2-3일)
1. GitHub Actions 워크플로우 설정
2. 에러 핸들링 및 로깅
3. 데이터 검증 로직

### Phase 3: 콘텐츠 향상 (3-4일)
1. 로컬 LLM 서버 설정
2. 자동 요약/번역 파이프라인
3. 품질 검증 시스템

### Phase 4: 고급 기능 (1주)
1. 이미지 자동 수집 (OG 태그)
2. 지오코딩 자동화
3. 중복 제거 로직

## 보안 및 품질 관리

### 1. 데이터 검증
- 필수 필드 체크
- URL 유효성 검증
- 좌표 범위 확인
- 출처 최소 2개 보장

### 2. 승인 워크플로우
- Notion: Draft → Review → Approved → Published
- 자동 발행은 Approved 상태만
- 에디터 최종 승인 필수

### 3. 에러 처리
- API 실패 시 이전 데이터 유지
- 로그 수집 및 알림
- 롤백 메커니즘

## 비용 분석

### 무료 리소스 사용
- **Notion**: 무료 플랜 (월 1000 API 호출)
- **GitHub Actions**: 무료 플랜 (월 2000분)
- **로컬 LLM**: 완전 무료 (서버 리소스만)
- **오픈데이터**: 무료 (공공 API)

### 예상 사용량
- Notion API: 일 50회 호출 (월 1500회) → **유료 플랜 필요**
- GitHub Actions: 일 10분 실행 (월 300분) → **무료 범위**

## 대안 제안

### Option A: Notion Pro ($8/월)
- 무제한 API 호출
- 고급 데이터베이스 기능
- 팀 협업 최적화

### Option B: 완전 로컬 (무료)
- Markdown 파일 기반 관리
- Git 기반 버전 관리
- VS Code 확장으로 UI 제공

### Option C: 하이브리드 (추천)
- 핵심 데이터만 Notion (무료 한도 내)
- 대량 데이터는 로컬 스크립트
- 점진적 확장

## 다음 단계

1. **도구 선택 결정**: Notion vs 로컬 vs 하이브리드
2. **파일럿 구현**: 선택된 방식으로 기본 파이프라인 구축
3. **테스트 및 최적화**: 실제 데이터로 검증
4. **문서화**: 운영 가이드 작성

어떤 방식을 선호하시나요?
