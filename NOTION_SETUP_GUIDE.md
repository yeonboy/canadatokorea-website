# Notion 연동 설정 가이드

## 1단계: Notion Integration 생성

1. **Notion 개발자 페이지 접속**
   - https://www.notion.so/my-integrations 방문
   - "New integration" 클릭

2. **Integration 설정**
   - Name: `ca.korea.com Data Sync`
   - Associated workspace: 본인 워크스페이스 선택
   - Type: Internal integration
   - Capabilities: Read content, Update content, Insert content

3. **토큰 복사**
   - Integration 생성 후 "Internal Integration Token" 복사
   - 형태: `secret_...` (50자 정도)

## 2단계: Notion 페이지 및 데이터베이스 준비

1. **작업 페이지 생성**
   - Notion에서 새 페이지 생성: "ca.korea.com 데이터 관리"
   - 페이지 URL에서 ID 복사 (32자 해시)
   - 예: `https://notion.so/Data-Management-abc123...` → `abc123...`

2. **Integration 권한 부여**
   - 생성한 페이지에서 우측 상단 "..." → "Add connections"
   - 위에서 만든 integration 선택

## 3단계: 환경변수 설정

`.env.local` 파일에 추가:
```env
# Notion Integration
NOTION_TOKEN=secret_your_integration_token_here
NOTION_PARENT_PAGE_ID=your_page_id_here
```

## 4단계: 데이터베이스 자동 생성

```bash
# 의존성 설치
npm install

# Notion 데이터베이스 생성 및 샘플 데이터 추가
npm run setup-notion
```

성공 시 출력:
```
✅ Database created successfully!
📋 Database ID: abc123...
🔗 Database URL: https://notion.so/...
```

## 5단계: GitHub 설정 (자동화용)

1. **Repository Secrets 추가**
   - GitHub 저장소 → Settings → Secrets and variables → Actions
   - New repository secret 클릭하여 추가:
     - `NOTION_TOKEN`: Integration 토큰
     - `NOTION_DB_ID`: 4단계에서 출력된 Database ID

2. **Actions 권한 확인**
   - Settings → Actions → General
   - "Allow GitHub Actions to create and approve pull requests" 체크

## 6단계: 테스트 및 운영

### 수동 동기화 테스트
```bash
npm run sync-notion
```

### 자동화 확인
- GitHub → Actions 탭에서 "Sync Data from Notion" 워크플로우 확인
- 2시간마다 자동 실행됨
- 수동 실행: "Run workflow" 버튼 클릭

### Notion에서 카드 관리
1. 생성된 데이터베이스에서 "New" 클릭
2. 필수 필드 입력:
   - **Title**: 카드 제목
   - **Summary**: 카드 요약
   - **Type**: Issue/Popup/Congestion/Tip 중 선택
   - **Status**: Published (실제 사이트 반영용)
   - **Source1**: 출처 URL

3. 선택 필드:
   - **Area**: 지역명 (Seoul, Gangnam, Hongdae 등)
   - **Coordinates**: 좌표 (37.5665, 126.9780 형태)
   - **Period**: 이벤트 기간
   - **Tags**: 태그 선택
   - **FR Title/Summary**: 프랑스어 번역

4. 저장 후 2시간 내 자동 동기화됨

## 데이터베이스 필드 가이드

### 필수 필드
- **Title**: 영어 제목 (5자 이상)
- **Summary**: 영어 요약 (10자 이상)  
- **Type**: 카드 타입
- **Status**: Published (사이트 반영용)
- **Source1**: 첫 번째 출처 URL

### 지역 설정
- **Area**: 텍스트로 입력 (Seoul, Gangnam, Hongdae, Seongsu 등)
- **Coordinates**: "위도, 경도" 형태 (37.5665, 126.9780)
- 둘 중 하나만 있어도 지도에 표시됨

### 다국어 지원
- **FR Title**: 프랑스어 제목
- **FR Summary**: 프랑스어 요약
- **FR Tags**: 프랑스어 태그 (쉼표 구분)

### 품질 관리
- **Status**를 "Published"로 설정해야 사이트에 표시
- **Approver**에 승인자 지정 권장
- **Priority**로 중요도 관리

## 운영 가이드

### 일일 워크플로우
1. Notion에서 새 카드 작성
2. Status를 "Published"로 변경
3. 2시간 내 자동 동기화 대기
4. 사이트에서 확인

### 월별 API 사용량 관리
- **현재 사용량**: Notion Settings → Usage에서 확인
- **예상 사용량**: 일 50개 카드 = 월 1500 API 호출
- **한도 초과 시**: 중요 카드만 Published로 설정

### 긴급 업데이트
```bash
# 즉시 동기화
npm run sync-notion

# GitHub Actions 수동 실행
# Repository → Actions → "Sync Data from Notion" → "Run workflow"
```

### 백업 및 복구
- 모든 데이터는 Git에 저장됨
- `content/data/today-cards.json` 파일로 백업
- Notion 장애 시 로컬 파일로 운영 가능

## 문제 해결

### 동기화 실패
1. GitHub Actions 로그 확인
2. Notion 권한 재확인
3. API 한도 확인
4. 수동 동기화 테스트

### 데이터 불일치
1. `npm run sync-notion` 실행
2. Git diff로 변경사항 확인
3. 필요 시 수동 수정 후 커밋

이 가이드대로 설정하면 Notion에서 직관적으로 카드를 관리하면서 자동으로 사이트에 반영됩니다.
