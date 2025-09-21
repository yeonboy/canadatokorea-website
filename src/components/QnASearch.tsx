import { useState, useEffect } from 'react';
import { QnA } from '@/types';
import { QNA_TOPICS } from '@/utils/constants';
import { formatDateKST, t } from '@/utils/helpers';
import { useAppLocale } from '@/contexts/LocaleContext';

interface QnASearchProps {
  qnaItems: QnA[];
  initialQuery?: string;
  initialTopic?: string;
}

export default function QnASearch({ qnaItems, initialQuery = '', initialTopic = '' }: QnASearchProps) {
  const { locale } = useAppLocale();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [filteredItems, setFilteredItems] = useState<QnA[]>(qnaItems);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 검색 및 필터링
  useEffect(() => {
    let filtered = qnaItems;

    // 토픽 필터
    if (selectedTopic) {
      filtered = filtered.filter(item => item.topic === selectedTopic);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedTopic, qnaItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색은 실시간으로 이미 적용됨
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 검색 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('qna.search.title', locale)}</h1>
        
        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('qna.search.placeholder', locale)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* 토픽 필터 */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedTopic('')}
            role="radio"
            aria-checked={!selectedTopic}
            className={`voxy-button ${!selectedTopic ? 'voxy-button--active' : ''}`}
          >
            <span className="button_top">{t('qna.search.allTopics', locale)}</span>
          </button>
          
          {Object.entries(QNA_TOPICS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(selectedTopic === key ? '' : key)}
              role="radio"
              aria-checked={selectedTopic === key}
              className={`voxy-button ${selectedTopic === key ? 'voxy-button--active' : ''}`}
            >
              <span className="button_top">{config.label}</span>
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <div className="mt-4 text-sm text-gray-600">
          {t(`qna.search.resultsFound_other,${filteredItems.length}`, locale)}
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          const topicConfig = QNA_TOPICS[item.topic];
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-6"
            >
              {/* 질문 */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${topicConfig.color} bg-opacity-10 text-opacity-90`}>
                    {topicConfig.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    Updated {formatDateKST(item.lastUpdatedKST)}
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900">
                  {locale === 'fr' && item.i18n?.fr?.question ? item.i18n.fr.question : item.question}
                </h2>
              </div>

              {/* 답변 */}
              <div
                className="prose prose-sm max-w-none text-gray-700 mb-4"
                dangerouslySetInnerHTML={{
                  __html: (locale === 'fr' && item.i18n?.fr?.answer ? item.i18n.fr.answer : item.answer).replace(/\n/g, '<br />')
                }}
              />

              {/* 태그 */}
              {(item.tags.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(locale === 'fr' && item.i18n?.fr?.tags ? item.i18n.fr.tags : item.tags).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 출처 */}
              <div className="border-t border-gray-100 pt-4">
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {item.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        - {source.title}
                      </a>
                    ))}
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 결과 없음 */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/70 shadow-md p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('qna.search.noResults.title', locale)}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('qna.search.noResults.desc', locale)}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('');
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('qna.search.noResults.clear', locale)}
          </button>
        </div>
      )}

      {/* 관련 도구 */}
      <div className="bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Related Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/tools/cost-estimator"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="font-medium text-gray-900">Cost Estimator</div>
            <div className="text-sm text-gray-600">Compare living costs between Canada and Korea</div>
          </a>
          
          <a
            href="/city/seoul"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
          >
            <div className="font-medium text-gray-900">City Guides</div>
            <div className="text-sm text-gray-600">Comprehensive guides for Korean cities</div>
          </a>
        </div>
      </div>
    </div>
  );
}
