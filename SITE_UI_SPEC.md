# 사이트 UI 상세 스펙

## Home (/)
- Hero Quick Actions
  - buttons: Cost, Today’s Pop-ups, Congestion, QnA Search
- Today Section
  - cards: type(issue/popup/congestion/tip), title(≤60), summary(≤160), tags
  - validation: title required, summary optional, sources ≥2
- Map Block (Pop-ups)
  - filters: area, date range, theme
  - marker popup: title, period, link

## Real Korea Now (/real-korea-now)
- Tabs: today | week | tips
- Today: card list + mini map
- Week: timeline(list by day)
- Tips: QnA top + links

## Learn Korean (/learn)
- Tracks: situations, age expressions, literacy, resources
- Card: expression, example, note
- Validation: expression required; length ≤140 chars

## Travel & Food (/travel-food)
- Sections: prep, moving, seasonal, restaurants(link-out)
- Guide layout with checklists and related links

## Community (/community)
- Blocks: events(list), groups(link-out)

## K-Pop (/k-pop)
- Artist page: profile, official links, schedules

## Tools
### Cost Estimator (/tools/cost-estimator)
- Fields: city, currency, exchangeRate, exchangeRateAsOf
- Categories (table): food/transport/rent/utilities/mobile/misc
  - items: name, unit, krw, cad(auto)
- Scenarios: name, weights(0..1)
- Validation:
  - required: city, currency, exchangeRate, categories(food/transport/rent present)
  - if exchangeRate present → exchangeRateAsOf required

### QnA (/tools/qna)
- Search: q + topic filter
- Results: question/answer snippet, sources
- Validation: question ≥5, answer ≥20, sources ≥2
