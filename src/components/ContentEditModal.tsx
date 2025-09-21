import React, { useState, useRef, useEffect } from 'react';
import { X, Image, Bold, Italic, Link, Bot, Send, Loader2 } from 'lucide-react';

interface SourceItem { title: string; url: string; publisher: string }
interface GeoInfo { lat?: number; lng?: number; area?: string }

interface ContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: { title: string; fullContent: string; images?: string[]; i18n?: any; tags?: string[]; geo?: GeoInfo | null; sources?: SourceItem[]; type?: string }) => void;
  initialTitle: string;
  initialContent: string;
  initialImages?: string[];
  // i18n 데이터 (있는 경우)
  initialI18n?: {
    en?: { title: string; summary: string; fullContent?: string };
    fr?: { title: string; summary: string; fullContent?: string };
  };
  initialTags?: string[];
  initialGeo?: GeoInfo | null;
  initialSources?: SourceItem[];
  initialType?: string;
}

export default function ContentEditModal({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
  initialImages = [],
  initialI18n,
  initialTags = [],
  initialGeo = null,
  initialSources = [],
  initialType = 'issue'
}: ContentEditModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imagePosition, setImagePosition] = useState<'top' | 'middle' | 'bottom'>('middle');
  const [aiRequest, setAiRequest] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'fr'>('en');
  
  // 다국어 콘텐츠 상태
  const [enTitle, setEnTitle] = useState('');
  const [enContent, setEnContent] = useState('');
  const [frTitle, setFrTitle] = useState('');
  const [frContent, setFrContent] = useState('');

  // 태그/위치/출처/카테고리 상태
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [geo, setGeo] = useState<GeoInfo | null>(initialGeo);
  const [geoArea, setGeoArea] = useState<string>(initialGeo?.area || '');
  const [geoLat, setGeoLat] = useState<string>(initialGeo?.lat !== undefined ? String(initialGeo.lat) : '');
  const [geoLng, setGeoLng] = useState<string>(initialGeo?.lng !== undefined ? String(initialGeo.lng) : '');
  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [newSource, setNewSource] = useState<SourceItem>({ title: '', url: '', publisher: '' });
  const [selectedType, setSelectedType] = useState<string>(initialType);

  // 카테고리 옵션들
  const categoryOptions = [
    { key: 'issue', label: '📰 News & Issues', description: '한국의 최신 뉴스와 이슈' },
    { key: 'popup', label: '🎪 Pop-ups', description: '팝업스토어, 전시, 이벤트' },
    { key: 'congestion', label: '🚇 Traffic', description: '교통정보, 혼잡도, 대중교통' },
    { key: 'tip', label: '💡 Local Tips', description: '현지인 꿀팁, 생활 정보' },
    { key: 'hotspot', label: '🔥 Hotspot', description: '핫플레이스, 트렌드 장소' },
    { key: 'weather', label: '🌤️ Weather', description: '날씨 정보, 기후 팁' },
    { key: 'population', label: '👥 Population', description: '인구 밀도, 혼잡 정보' }
  ];
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 모달이 열릴 때마다 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
      setImages(initialImages);
      setAiRequest('');
      setShowAiPanel(false);
      setIsAiProcessing(false);
      setActiveLanguage('en');
      setTags(initialTags);
      setGeo(initialGeo);
      setGeoArea(initialGeo?.area || '');
      setGeoLat(initialGeo?.lat !== undefined ? String(initialGeo.lat) : '');
      setGeoLng(initialGeo?.lng !== undefined ? String(initialGeo.lng) : '');
      setSources(initialSources);
      setSelectedType(initialType);
      
      // i18n 데이터 초기화
      if (initialI18n) {
        setEnTitle(initialI18n.en?.title || initialTitle);
        setEnContent(initialI18n.en?.fullContent || initialI18n.en?.summary || initialContent);
        setFrTitle(initialI18n.fr?.title || '');
        setFrContent(initialI18n.fr?.fullContent || initialI18n.fr?.summary || '');
      } else {
        // i18n 데이터가 없으면 초기값을 영어로 설정
        setEnTitle(initialTitle);
        setEnContent(initialContent);
        setFrTitle('');
        setFrContent('');
      }
    }
  }, [isOpen, initialTitle, initialContent, initialImages, initialI18n]);

  if (!isOpen) return null;

  // 현재 언어에 따른 제목과 내용 가져오기
  const getCurrentTitle = () => {
    return activeLanguage === 'fr' ? frTitle : enTitle;
  };

  const getCurrentContent = () => {
    return activeLanguage === 'fr' ? frContent : enContent;
  };

  // 현재 언어에 따른 제목과 내용 설정
  const setCurrentTitle = (value: string) => {
    if (activeLanguage === 'fr') {
      setFrTitle(value);
    } else {
      setEnTitle(value);
    }
  };

  const setCurrentContent = (value: string) => {
    if (activeLanguage === 'fr') {
      setFrContent(value);
    } else {
      setEnContent(value);
    }
  };

  const handleSave = () => {
    if (!enTitle.trim() || !enContent.trim()) {
      alert('영어 제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 다국어 콘텐츠와 함께 저장
    onSave({
      title: enTitle.trim(), // 기본 제목은 영어
      fullContent: enContent.trim(), // 기본 내용은 영어
      images: images.filter(Boolean),
      tags: tags.map(t => t.trim()).filter(Boolean),
      geo: (geoArea.trim() || geoLat || geoLng) ? {
        area: geoArea.trim() || undefined,
        lat: geoLat ? Number(geoLat) : undefined,
        lng: geoLng ? Number(geoLng) : undefined
      } : null,
      sources: sources.filter(s => s && s.url),
      type: selectedType,
      i18n: {
        en: {
          title: enTitle.trim(),
          summary: enContent.trim().substring(0, 200) + '...',
          fullContent: enContent.trim()
        },
        fr: {
          title: frTitle.trim() || enTitle.trim(),
          summary: (frContent.trim() || enContent.trim()).substring(0, 200) + '...',
          fullContent: frContent.trim() || enContent.trim()
        }
      }
    });
    
    onClose();
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const base = getCurrentContent();
    const selectedText = base.substring(start, end);
    
    const newContent = 
      base.substring(0, start) + 
      before + selectedText + after + 
      base.substring(end);
    
    setCurrentContent(newContent);
    
    // 커서 위치 복원
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      const imageUrl = newImageUrl.trim();
      setNewImageUrl('');
      
      // 배치 위치에 따라 이미지 마크다운 삽입
      const imageMarkdown = `![Image](${imageUrl})`;
      
      // 현재 활성 언어에 따라 해당 콘텐츠에 이미지 추가
      const addImageToContent = (currentContent: string) => {
        switch (imagePosition) {
          case 'top':
            return `${imageMarkdown}\n\n${currentContent}`;
          case 'bottom':
            return `${currentContent}\n\n${imageMarkdown}`;
          case 'middle':
          default:
            // 현재 커서 위치에 삽입하거나 중간에 삽입
            const textarea = textareaRef.current;
            if (textarea) {
              const cursorPos = textarea.selectionStart;
              return currentContent.substring(0, cursorPos) + `\n\n${imageMarkdown}\n\n` + currentContent.substring(cursorPos);
            } else {
              // 텍스트의 중간 지점에 삽입
              const midPoint = Math.floor(currentContent.length / 2);
              const beforeMid = currentContent.substring(0, midPoint);
              const afterMid = currentContent.substring(midPoint);
              return `${beforeMid}\n\n${imageMarkdown}\n\n${afterMid}`;
            }
        }
      };

      // 모든 언어 버전에 이미지 추가
      setEnContent(prev => addImageToContent(prev));
      setFrContent(prev => addImageToContent(prev));
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    setImages(images.filter((_, i) => i !== index));
    
    // 모든 언어 버전에서 해당 이미지 제거
    const imageMarkdown = `![Image](${imageToRemove})`;
    setEnContent(prev => prev.replace(new RegExp(imageMarkdown.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ''));
    setFrContent(prev => prev.replace(new RegExp(imageMarkdown.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ''));
  };

  // AI 수정 요청 처리
  const handleAiRequest = async () => {
    if (!aiRequest.trim() || isAiProcessing) return;

    setIsAiProcessing(true);
    try {
      const currentTitle = getCurrentTitle();
      const currentContent = getCurrentContent();
      
      const response = await fetch('/api/ai/modify-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentTitle,
          content: currentContent,
          request: aiRequest.trim(),
          language: activeLanguage === 'fr' ? 'french' : 'english'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI 요청 실패 (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // AI가 수정한 내용으로 현재 언어 탭에 업데이트
        if (result.modifiedTitle) {
          setCurrentTitle(result.modifiedTitle);
        }
        if (result.modifiedContent) {
          setCurrentContent(result.modifiedContent);
        }
        
        // 성공 메시지 표시
        alert(`✅ AI 수정이 완료되었습니다!\n언어: ${activeLanguage === 'en' ? 'English' : 'Français'}`);
        setAiRequest(''); // 요청 텍스트 초기화
      } else {
        throw new Error(result.message || 'AI 수정 실패');
      }
    } catch (error: any) {
      console.error('AI 수정 오류:', error);
      alert(`❌ AI 수정 중 오류가 발생했습니다: ${error.message}\n\n💡 팁: "프랑스어로 번역해줘", "제목을 더 흥미롭게 만들어줘" 등 구체적으로 요청해보세요.`);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      
      <div className="relative bg-white w-full max-w-7xl h-[90vh] rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">콘텐츠 편집</h2>
            
            {/* 언어 탭 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeLanguage === 'en' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇨🇦 English
              </button>
              <button
                onClick={() => setActiveLanguage('fr')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  activeLanguage === 'fr' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇫🇷 Français
              </button>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 툴바 */}
        <div className="border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => insertText('**', '**')}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                <Bold className="h-4 w-4" />
                Bold
              </button>
              <button
                type="button"
                onClick={() => insertText('*', '*')}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                <Italic className="h-4 w-4" />
                Italic
              </button>
              <button
                type="button"
                onClick={() => insertText('[링크 텍스트](', ')')}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                <Link className="h-4 w-4" />
                Link
              </button>
              <button
                type="button"
                onClick={() => insertText('\n\n### ', '\n\n')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertText('\n\n> ', '\n\n')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Quote
              </button>
            </div>

            {/* AI 수정 요청 버튼 */}
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showAiPanel 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Bot className="h-4 w-4" />
              AI 수정 요청
            </button>
          </div>

          {/* AI 요청 패널 */}
          {showAiPanel && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-900 mb-2">
                    🤖 AI에게 수정 요청하기 
                    <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {activeLanguage === 'en' ? '🇨🇦 영어로' : '🇫🇷 프랑스어로'} 수정됨
                    </span>
                  </label>
                  <textarea
                    value={aiRequest}
                    onChange={(e) => setAiRequest(e.target.value)}
                    placeholder="예: '프랑스어로 완전히 번역해줘', '제목을 더 흥미롭게 만들어줘', '본문을 더 캐나다인 친화적으로 수정해줘'"
                    className="w-full h-20 px-3 py-2 border border-blue-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* 빠른 요청 버튼들 */}
                  <div className="mt-3">
                    <div className="text-xs text-blue-700 mb-2">💡 빠른 요청:</div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setAiRequest('이 글을 프랑스어로 완전히 번역해줘. 제목과 본문 모두 자연스러운 캐나다식 프랑스어로 만들어줘.')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                      >
                        🇫🇷 프랑스어 번역
                      </button>
                      <button
                        onClick={() => setAiRequest('이 글을 영어로 번역해줘. 캐나다인들이 이해하기 쉬운 영어로 만들어줘.')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                      >
                        🇨🇦 영어 번역
                      </button>
                      <button
                        onClick={() => setAiRequest('제목을 더 흥미롭고 클릭하고 싶게 만들어줘. 캐나다인들의 관심을 끌 수 있도록 수정해줘.')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                      >
                        ✨ 제목 개선
                      </button>
                      <button
                        onClick={() => setAiRequest('본문을 더 친근하고 캐주얼하게 만들어줘. 캐나다 젊은이들이 좋아할 만한 톤으로 수정해줘.')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                      >
                        😊 친근한 톤
                      </button>
                      <button
                        onClick={() => setAiRequest('오타와 문법 오류를 찾아서 수정해줘. 자연스러운 문장으로 다듬어줘.')}
                        className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                      >
                        📝 오타 수정
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-blue-600">
                      💡 구체적인 요청일수록 더 좋은 결과를 얻을 수 있습니다
                    </div>
                    <button
                      onClick={handleAiRequest}
                      disabled={!aiRequest.trim() || isAiProcessing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAiProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isAiProcessing ? '처리 중...' : '수정 요청'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 메인 에디터 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {/* 카테고리 선택 */}
              <div className="p-6 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📂 카테고리 선택
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categoryOptions.map((option) => (
                    <label
                      key={option.key}
                      className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedType === option.key
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={option.key}
                        checked={selectedType === option.key}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          selectedType === option.key ? 'text-primary-700' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-xs mt-1 ${
                          selectedType === option.key ? 'text-primary-600' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                      {selectedType === option.key && (
                        <div className="ml-2 text-primary-500">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* 제목 입력 */}
              <div className="p-6 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 {activeLanguage === 'en' && '(English)'} {activeLanguage === 'fr' && '(Français)'}
                </label>
                <input
                  type="text"
                  value={getCurrentTitle()}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={
                    activeLanguage === 'en' ? "Enter title in English..." :
                    "Entrez le titre en français..."
                  }
                />
                {activeLanguage === 'fr' && (
                  <div className="mt-2 text-xs text-gray-500">
                    💡 영어 원본: {enTitle || '없음'}
                  </div>
                )}
              </div>

              {/* 본문 입력 */}
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  본문 내용 (Markdown 지원) {activeLanguage === 'en' && '(English)'} {activeLanguage === 'fr' && '(Français)'}
                </label>
                <textarea
                  ref={textareaRef}
                  value={getCurrentContent()}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="w-full h-96 resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                  placeholder={
                    activeLanguage === 'en' ? `Enter content in English...

Canadian tone example:
Hey fellow Canadians! 

So I just discovered something pretty cool happening in Seoul...

### What's the Deal?

Trust me, this is the kind of insider info you won't find in typical travel guides, eh!` :
                    activeLanguage === 'fr' ? `Entrez le contenu en français...

Exemple de ton canadien:
Salut les amis canadiens!

Je viens de découvrir quelque chose de vraiment cool qui se passe à Séoul...

### De quoi s'agit-il?

Croyez-moi, c'est le genre d'info privilégiée que vous ne trouverez pas dans les guides touristiques typiques!` :
                    `본문 내용을 입력하세요...

캐나다인 톤 예시:
Hey fellow Canadians! 

So I just discovered something pretty cool happening in Seoul...

### What's the Deal?

Trust me, this is the kind of insider info you won't find in typical travel guides, eh!`
                  }
                />
                {activeLanguage === 'fr' && (
                  <div className="mt-2 text-xs text-gray-500">
                    💡 영어 원본 길이: {enContent.length}자 | 프랑스어 길이: {frContent.length}자
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 - 이미지 관리 */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image className="h-5 w-5" />
                이미지 관리
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  {activeLanguage === 'en' ? '🇨🇦' : '🇫🇷'} 기준
                </span>
              </h3>

              {/* 이미지 추가 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">이미지 URL 추가</label>
                
                {/* 배치 위치 선택 */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">배치 위치</label>
                  <select
                    value={imagePosition}
                    onChange={(e) => setImagePosition(e.target.value as 'top' | 'middle' | 'bottom')}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="top">📄 상단 (글 맨 위)</option>
                    <option value="middle">📝 중간 (커서 위치/글 중앙)</option>
                    <option value="bottom">📋 하단 (글 맨 아래)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="https://example.com/image.jpg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                  />
                  <button
                    onClick={addImage}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm hover:bg-primary-700"
                  >
                    추가
                  </button>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {imagePosition === 'top' && '💡 이미지가 모든 언어 버전의 글 맨 위에 추가됩니다'}
                  {imagePosition === 'middle' && '💡 이미지가 모든 언어 버전의 현재 커서 위치 또는 글 중앙에 추가됩니다'}
                  {imagePosition === 'bottom' && '💡 이미지가 모든 언어 버전의 글 맨 아래에 추가됩니다'}
                </div>
              </div>

              {/* 이미지 목록 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">추가된 이미지</label>
                {images.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    추가된 이미지가 없습니다
                  </div>
                ) : (
                  images.map((imageUrl, index) => {
                    // 현재 활성 언어의 텍스트에서 이미지 위치 파악
                    const imageMarkdown = `![Image](${imageUrl})`;
                    const currentContent = getCurrentContent();
                    const imageIndex = currentContent.indexOf(imageMarkdown);
                    let position = '중간';
                    
                    if (imageIndex === -1) {
                      position = '없음';
                    } else if (imageIndex < currentContent.length * 0.3) {
                      position = '상단';
                    } else if (imageIndex > currentContent.length * 0.7) {
                      position = '하단';
                    }
                    
                    return (
                      <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700">이미지 #{index + 1}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            position === '상단' ? 'bg-blue-100 text-blue-700' :
                            position === '하단' ? 'bg-green-100 text-green-700' :
                            position === '중간' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {position === '상단' && '📄'} 
                            {position === '하단' && '📋'} 
                            {position === '중간' && '📝'} 
                            {position === '없음' && '❌'} 
                            {position}
                          </span>
                        </div>
                        <img
                          src={imageUrl}
                          alt={`Image ${index + 1}`}
                          className="w-full h-20 object-cover rounded mb-2"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo.jpg';
                          }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate flex-1">
                            {imageUrl.substring(0, 25)}...
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                // 현재 활성 언어의 텍스트에서 이미지를 찾아서 커서 위치로 이동
                                const textarea = textareaRef.current;
                                if (textarea) {
                                  const currentContent = getCurrentContent();
                                  const imagePos = currentContent.indexOf(imageMarkdown);
                                  if (imagePos !== -1) {
                                    textarea.focus();
                                    textarea.setSelectionRange(imagePos, imagePos + imageMarkdown.length);
                                  }
                                }
                              }}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                              title={`${activeLanguage === 'en' ? '영어' : '프랑스어'} 텍스트에서 찾기`}
                            >
                              🔍
                            </button>
                            <button
                              onClick={() => removeImage(index)}
                              className="text-red-600 hover:text-red-700 text-xs ml-1"
                              title="삭제"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 태그 관리 */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2"># 해시태그</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((t, i) => (
                    <span key={i} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded inline-flex items-center gap-1">
                      #{t}
                      <button className="text-red-600" onClick={() => setTags(tags.filter((_, idx) => idx !== i))}>×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newTag} onChange={(e)=>setNewTag(e.target.value)} className="flex-1 px-2 py-1 border rounded text-sm" placeholder="ex) seongsu, popup" onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault(); if(newTag.trim()){setTags(Array.from(new Set([...tags, newTag.trim()]))); setNewTag('');}}}} />
                  <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm" onClick={()=>{ if(newTag.trim()){setTags(Array.from(new Set([...tags, newTag.trim()]))); setNewTag('');}}}>추가</button>
                </div>
              </div>

              {/* 위치 정보 */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">📍 위치 정보</h3>
                <label className="block text-xs text-gray-600 mb-1">지역명</label>
                <input value={geoArea} onChange={(e)=>setGeoArea(e.target.value)} className="w-full px-2 py-1 border rounded text-sm mb-2" placeholder="성수동 / Seongsu" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">위도(lat)</label>
                    <input value={geoLat} onChange={(e)=>setGeoLat(e.target.value)} className="w-full px-2 py-1 border rounded text-sm" placeholder="37.54" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">경도(lng)</label>
                    <input value={geoLng} onChange={(e)=>setGeoLng(e.target.value)} className="w-full px-2 py-1 border rounded text-sm" placeholder="127.05" />
                  </div>
                </div>
              </div>

              {/* 출처 관리 */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">🔗 출처 링크</h3>
                <div className="space-y-2">
                  {sources.map((s, i) => (
                    <div key={i} className="bg-white border rounded p-2 text-xs flex items-center gap-2">
                      <input value={s.title} onChange={(e)=>{ const copy=[...sources]; copy[i]={...copy[i], title:e.target.value}; setSources(copy); }} className="flex-1 px-2 py-1 border rounded" placeholder="Title" />
                      <input value={s.publisher} onChange={(e)=>{ const copy=[...sources]; copy[i]={...copy[i], publisher:e.target.value}; setSources(copy); }} className="w-28 px-2 py-1 border rounded" placeholder="Publisher" />
                      <input value={s.url} onChange={(e)=>{ const copy=[...sources]; copy[i]={...copy[i], url:e.target.value}; setSources(copy); }} className="flex-1 px-2 py-1 border rounded" placeholder="https://..." />
                      <button className="text-red-600" onClick={()=> setSources(sources.filter((_,idx)=>idx!==i))}>삭제</button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 bg-gray-100 rounded p-2 text-xs space-y-2">
                  <input value={newSource.title} onChange={(e)=>setNewSource({...newSource, title: e.target.value})} className="w-full px-2 py-1 border rounded" placeholder="Title" />
                  <div className="flex gap-2">
                    <input value={newSource.publisher} onChange={(e)=>setNewSource({...newSource, publisher: e.target.value})} className="w-32 px-2 py-1 border rounded" placeholder="Publisher" />
                    <input value={newSource.url} onChange={(e)=>setNewSource({...newSource, url: e.target.value})} className="flex-1 px-2 py-1 border rounded" placeholder="https://..." />
                    <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={()=>{ if(newSource.url){ setSources([...sources, newSource]); setNewSource({ title:'', url:'', publisher:''}); } }}>추가</button>
                  </div>
                </div>
              </div>

              {/* 마크다운 가이드 */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">📝 마크다운 가이드</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>**굵게** - 굵은 텍스트</div>
                  <div>*기울임* - 기울임 텍스트</div>
                  <div>### 제목 - 소제목</div>
                  <div>&gt; 인용 - 인용문</div>
                  <div>![이미지](URL) - 이미지</div>
                  <div>[링크](URL) - 링크</div>
                </div>
                
                <h4 className="text-sm font-medium text-blue-900 mb-1 mt-3">🖼️ 이미지 배치 팁</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>📄 상단: 글의 첫인상을 결정하는 헤더 이미지</div>
                  <div>📝 중간: 본문 내용과 관련된 설명 이미지</div>
                  <div>📋 하단: 마무리나 요약을 위한 이미지</div>
                  <div>🔍 찾기: 현재 언어 버전에서 이미지 위치 확인</div>
                  <div>🌐 공통: 모든 언어 버전에 동일하게 적용</div>
                </div>

                <h4 className="text-sm font-medium text-blue-900 mb-1 mt-3">🤖 AI 수정 요청 예시</h4>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• "프랑스어로 완전히 번역해줘"</div>
                  <div>• "제목을 더 흥미롭게 만들어줘"</div>
                  <div>• "캐나다인 관점으로 다시 써줘"</div>
                  <div>• "본문을 더 친근하게 수정해줘"</div>
                  <div>• "오타와 문법 오류를 수정해줘"</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 - 고정 */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-500 flex items-center gap-4">
            <span>
              {activeLanguage === 'en' && `English: ${enContent.length} chars`}
              {activeLanguage === 'fr' && `Français: ${frContent.length} chars`}
            </span>
            <span>이미지: {images.length}개</span>
            <span className="text-xs">
              {activeLanguage === 'en' ? '🇨🇦' : '🇫🇷'} 편집 중
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

