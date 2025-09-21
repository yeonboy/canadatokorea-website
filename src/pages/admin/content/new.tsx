import { useState } from 'react';
import { useRouter } from 'next/router';
import { Save, Eye, Send, Plus, X } from 'lucide-react';
import Layout from '@/components/Layout';
import { Post, Source } from '@/types';
import { CATEGORIES } from '@/utils/constants';
import { generateSlug, validatePost } from '@/utils/helpers';

export default function NewContent() {
  const router = useRouter();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    slug: '',
    category: 'real-korea-now',
    language: 'en',
    tags: [],
    seo: {
      description: '',
      keywords: []
    },
    adsPolicy: {
      isSensitiveSection: false,
      topAdDisabled: false
    },
    sources: [],
    body: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newSource, setNewSource] = useState<Partial<Source>>({
    title: '',
    url: '',
    publisher: ''
  });

  // 제목 변경 시 슬러그 자동 생성
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // 소스 추가
  const addSource = () => {
    if (newSource.title && newSource.url && newSource.publisher) {
      setFormData(prev => ({
        ...prev,
        sources: [...(prev.sources || []), newSource as Source]
      }));
      setNewSource({ title: '', url: '', publisher: '' });
    }
  };

  // 소스 제거
  const removeSource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sources: prev.sources?.filter((_, i) => i !== index) || []
    }));
  };

  // 민감 섹션 체크박스 변경
  const handleSensitiveSectionChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      adsPolicy: {
        ...prev.adsPolicy!,
        isSensitiveSection: checked,
        topAdDisabled: checked // 민감 섹션이면 자동으로 상단 광고 비활성화
      }
    }));
  };

  // 저장 함수
  const handleSave = async (status: 'Draft' | 'Needs-Source' | 'Approved') => {
    const validation = validatePost(formData);
    
    if (!validation.isValid) {
      alert('Validation errors:\n' + validation.errors.join('\n'));
      return;
    }

    const postData: Post = {
      ...formData,
      id: `post-${Date.now()}`,
      status,
      lastUpdatedKST: new Date().toISOString(),
      readingTimeMin: Math.ceil((formData.body?.split(' ').length || 0) / 200)
    } as Post;

    try {
      // 실제로는 API 호출
      console.log('Saving post:', postData);
      alert(`Content saved as ${status}`);
      router.push('/admin/content');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save content');
    }
  };

  return (
    <Layout title="New Content" noIndex={true}>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 에디터 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 기본 정보 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter article title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="url-friendly-slug"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        {Object.entries(CATEGORIES).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.icon} {config.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language *
                      </label>
                      <select
                        value={formData.language || 'en'}
                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'en' | 'fr' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="en">🇨🇦 English</option>
                        <option value="fr">🇫🇷 Français</option>
                      </select>
                    </div>
                  </div>

                  {/* 민감 섹션 체크 */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sensitive-section"
                      checked={formData.adsPolicy?.isSensitiveSection || false}
                      onChange={(e) => handleSensitiveSectionChange(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="sensitive-section" className="text-sm text-gray-700">
                      This is a sensitive section (visa/education) - top ads will be disabled
                    </label>
                  </div>
                </div>
              </div>

              {/* 콘텐츠 에디터 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
                  </button>
                </div>

                {isPreviewMode ? (
                  <div className="prose max-w-none p-4 border border-gray-200 rounded-md bg-gray-50 min-h-96">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formData.body?.replace(/\n/g, '<br />') || '<p class="text-gray-500">No content to preview</p>'
                      }}
                    />
                  </div>
                ) : (
                  <textarea
                    value={formData.body || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                    rows={20}
                    placeholder="Write your content in Markdown format..."
                    required
                  />
                )}
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* SEO */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo?.description || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, description: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      maxLength={160}
                      placeholder="Brief description for search engines..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {(formData.seo?.description || '').length}/160 characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.seo?.keywords?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo!, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* 태그 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add tag..."
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 소스 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Sources *
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (minimum 2 required)
                  </span>
                </h2>

                {/* 소스 추가 폼 */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Source title"
                    value={newSource.title || ''}
                    onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={newSource.url || ''}
                    onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Publisher/Organization"
                    value={newSource.publisher || ''}
                    onChange={(e) => setNewSource(prev => ({ ...prev, publisher: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={addSource}
                    className="w-full px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Add Source
                  </button>
                </div>

                {/* 소스 목록 */}
                <div className="space-y-2">
                  {formData.sources?.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {source.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {source.publisher} • {source.url}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSource(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 소스 부족 경고 */}
                {(formData.sources?.length || 0) < 2 && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      ⚠️ At least 2 sources are required before publishing
                    </p>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleSave('Draft')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    onClick={() => handleSave('Needs-Source')}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    disabled={(formData.sources?.length || 0) >= 2}
                  >
                    <Send className="h-4 w-4" />
                    <span>Request Sources</span>
                  </button>

                  <button
                    onClick={() => handleSave('Approved')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    disabled={(formData.sources?.length || 0) < 2}
                  >
                    <Send className="h-4 w-4" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 미리보기 패널 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                
                {formData.title && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Title</div>
                      <div className="text-sm text-gray-900">{formData.title}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Category</div>
                      <div className="text-sm text-gray-900">
                        {formData.category && CATEGORIES[formData.category as keyof typeof CATEGORIES]?.label}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Word Count</div>
                      <div className="text-sm text-gray-900">
                        {formData.body?.split(' ').length || 0} words
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Reading Time</div>
                      <div className="text-sm text-gray-900">
                        {Math.ceil((formData.body?.split(' ').length || 0) / 200)} min
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Sources</div>
                      <div className="text-sm text-gray-900">
                        {formData.sources?.length || 0}/2 minimum
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
