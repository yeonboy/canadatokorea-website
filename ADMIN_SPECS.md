# MCP 관리자 스펙 (무료 플랜, 정적/서버리스 우선)

## 1) 목적
- 콘텐츠 초안의 큐레이션/승인/스케줄링/출처 관리/초안 비교를 한 곳에서 수행
- 로컬 LLM(gpt-oss-20b)의 초안 생성·요약·메타 보조 결과를 안전하게 검토 후 발행

## 2) 역할/권한 (초기 단일 관리자)
- Admin: CRUD 전권, 상태 변경(Draft→Published), 스케줄링, 출처 관리, 롤백

## 3) 상태 머신 (콘텐츠 공통)
- Draft → Needs-Source → Approved → Scheduled → Published → (Rollback: Draft)
- Guard: 출처 2개 이상, Last updated(KST) 표기, 민감 섹션 광고 규칙 충족

## 4) 정보 아키텍처/라우팅
- /admin
  - /dashboard
    - KPI(최근 7일 PV, 발행수, 승인대기, 실패 로그)
    - 오늘 일정(스케줄링, 만료, 재검토)
  - /content
    - /content/list?status=&type=&q=
    - /content/new (템플릿 선택)
    - /content/:id/edit (에디터, 출처, 메타, 미리보기)
    - /content/:id/diff (초안 비교: 이전 승인본 vs 현재 초안)
    - /content/:id/schedule (게시 일정/타임존 KST)
  - /qna
    - /qna/list
    - /qna/new
    - /qna/:id/edit
  - /widgets
    - /widgets/cost-estimator (입력 파라미터, 가중치, 환율 기준일)
  - /sources
    - /sources/list (RSS/오픈데이터/오픈API)
    - /sources/new (검증/허용 도메인)
  - /settings
    - i18n(en, fr) 토글, 광고 정책, 접근 권한

## 5) 와이어프레임(텍스트)
- Dashboard: KPI 4카드 + 테이블(승인대기/스케줄) + 에러 알럿
- Content List: 필터(상태/타입) + 검색 + 배치 승인/스케줄
- Content Edit: 좌측 Markdown/MDX 에디터, 우측 미리보기 + 메타/출처 패널
- Diff View: 좌측 이전 승인본, 우측 현재 초안, 출처 변동 하이라이트
- Cost Widget: 입력폼(도시, 식비, 교통, 월세, 환율일) + 미리보기 차트

## 6) 핵심 컴포넌트
- SourceBadge(기관/도메인/발행일), VerifyChecklist(출처2+KST+광고규칙)
- SchedulePicker(KST 고정), DiffViewer(markdown), MetaEditor(frontmatter)
- QnAEditor(질문/답변/근거/링크), CostEstimatorEditor(파라미터/시나리오)

## 7) 데이터 스키마 (요약)
- Post(frontmatter+body): see schemas/post.schema.json
- QnA: see schemas/qna.schema.json
- CostEstimator: see schemas/cost_estimator.schema.json
- Source: see schemas/source.schema.json
- Schedule: see schemas/schedule.schema.json

## 8) 검증/출시 규칙
- Pre-publish validate: 출처2, KST lastUpdated, 민감 섹션 상단 광고 비노출
- 링크/임베드: 공식/공개만, 무단 크롤링/복제 금지
- 롤백 전략: 승인본 유지, 초안만 되돌리기

## 9) 비기능 요구사항
- 정적/서버리스, 무료 플랜 우선(GitHub Pages 또는 S3+CF)
- 접근 제한: Basic Auth 또는 CF Function Gate, IP 제한(선택)
- 로깅: 승인/스케줄/게시 이력 JSON append-only
