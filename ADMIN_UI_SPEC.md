# MCP 관리자 화면 상세 UI 명세

## 공통
- 언어: en, fr (UI 토글)
- 검증 배지: VerifyChecklist(출처2, Last updated KST, 민감 섹션 광고 규칙)
- 컴포넌트: MarkdownEditor, PreviewPane, MetaEditor, SourceListEditor, SchedulePicker(KST), DiffViewer

## /admin/dashboard
- KPI Cards: pageviews(7d), published(7d), pendingApprovals, failures
- Tables:
  - Pending approvals: id, title, type, updatedAtKST, actions(approve/schedule)
  - Today’s schedule: contentId, publishAtKST, status

## /admin/content/list
- Filters: status[multi], type[multi], language, q (title/tags)
- Columns: id, title, type, status, lastUpdatedKST, sourcesCount, actions(edit/diff/schedule)

## /admin/content/new
- Fields (frontmatter):
  - title (text, required, min 5)
  - slug (auto from title, editable, kebab-case)
  - category (select: real-korea-now | learn-korean | travel-food | community | k-pop)
  - language (radio: en | fr)
  - tags (chips, optional)
  - adsPolicy.isSensitiveSection (checkbox)
- Body: MarkdownEditor (min 50 chars)
- Sources: SourceListEditor (min 2, url/title/publisher)
- Meta: description(max 160), keywords(array)
- Actions: saveDraft, requestSources(→Needs-Source), approve, schedule
- Validation rules:
  - title ≥ 5, body ≥ 50, sources ≥ 2, lastUpdatedKST auto now()
  - if isSensitiveSection == true → topAdDisabled must be true

## /admin/content/:id/edit
- Same as new, plus:
  - lastUpdatedKST autoupdate on save
  - status transitions: Draft↔Needs-Source→Approved→Scheduled→Published
  - topAdDisabled (checkbox) visible if isSensitiveSection

## /admin/content/:id/diff
- Left: last Published version
- Right: current Draft/Needs-Source
- Highlights: changed paragraphs, added/removed sources
- Actions: accept changes → Approved, or revert to last Published

## /admin/content/:id/schedule
- Field: publishAtKST (datetime, required, future only)
- List: existing schedules (status, notes)
- Guard: status must be Approved before scheduling

## /admin/qna/list
- Filters: topic, language, status
- Columns: id, question, topic, lastUpdatedKST, sourcesCount, status, actions

## /admin/qna/new
- Fields:
  - question (required ≥ 5)
  - answer (required ≥ 20, Markdown)
  - topic (select: living-cost | housing | visa | transport | tips | other)
  - language (en | fr)
  - sources (min 2)
- Validation: same source rules; lastUpdatedKST auto

## /admin/widgets/cost-estimator
- Fields:
  - city (select: Seoul | Busan | Incheon | Daejeon | Daegu | Gwangju | Jeju)
  - currency (CAD | KRW)
  - exchangeRateKRWPerCAD (number ≥ 100), exchangeRateAsOf (date)
  - categories (dynamic table)
    - key(label) = food/transport/rent/utilities/mobile/misc
    - items: name, unit, krw, cad (cad auto = krw / exchangeRateKRWPerCAD)
  - scenarios: name + weights(0..1 per category)
- Actions: save draft, publish widget config
- Validation:
  - at least food, transport, rent present
  - exchangeRateAsOf required if exchangeRateKRWPerCAD provided

## /admin/sources
- List: id, type(rss/opendata/openapi/official-page), title, url, publisher, lastFetchedAt
- New: type, title, url, publisher, license(optional), notes
- Validation: https URL only

## /admin/settings
- i18n: enable fr (toggle)
- Ads policy: sensitive sections topAdDisabled default true
- Access: basic auth users list, IP allowlist (optional)
