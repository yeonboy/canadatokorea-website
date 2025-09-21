# 비용추산 위젯 기본셋 & 환율 처리 로직 (초안)

## 1) 기본 카테고리 및 항목(권장)
- food
  - Lunch set (per meal)
  - Cafe latte (cup)
  - Groceries (per week)
- transport
  - Subway fare (trip)
  - T-money top-up (per month)
- rent
  - Off-campus studio (per month)
- utilities
  - Electricity+Gas+Water (per month)
- mobile
  - Data plan (10GB, per month)
- misc
  - Gym (per month)

원칙: 가격은 KRW 기준으로 관리, CAD는 실시간 환율로 변환 표시

## 2) 환율 처리 로직
- 입력: exchangeRateKRWPerCAD (예: 1000 KRW/CAD), exchangeRateAsOf (YYYY-MM-DD)
- 변환: cad = krw / exchangeRateKRWPerCAD (소수점 둘째 자리 반올림)
- 표기: "KRW 9,000 (CAD$ 9.00, as of 2025-09-08)"
- 업데이트: 환율 기준일이 7일 초과 시 관리자 대시보드에 업데이트 배지 표시

## 3) 합계 및 시나리오 계산
- 월간 합계(카테고리): 각 카테고리 내 항목의 월 환산값 합
  - 주 단위 항목은 × 4.3, 1회 항목은 예상 월횟수(관리자 설정) 곱
- 시나리오 합계: Σ(categoryTotal × weight)
- 출력: KRW/CAD 동시 표기, breakdown 표/차트 제공

## 4) 검증/표시 규칙
- 필수 카테고리: food, transport, rent (없으면 저장 불가)
- 환율 기준일 필수, 과거일 가능(명시)
- 출처: 생활물가/공식 데이터 출처 2개 이상 연결 권장

## 5) UI 상호작용
- 환율 입력 시 CAD 실시간 재계산
- 카테고리 토글로 포함/제외
- 시나리오 드롭다운으로 가중치 프리셋 변경

## 6) 접근성/표기
- 숫자 서식: 지역 무관 표준(천단위 구분), 통화 기호 CAD$, KRW 붙임
- 컬러 대비 4.5:1 이상, 표 헤더 스크린리더 레이블 제공
