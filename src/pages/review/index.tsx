import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import ContentEditModal from '@/components/ContentEditModal';

type Source = { title: string; url: string; publisher: string };
type Card = {
  id: string;
  type: 'issue' | 'popup' | 'congestion' | 'tip' | 'weather' | 'hotspot' | 'population';
  title: string;
  summary: string;
  tags: string[];
  geo?: { lat?: number; lng?: number; area?: string } | null;
  period?: { start: string; end: string } | null;
  sources: Source[];
  lastUpdatedKST: string;
};

const TYPES: Array<{ key: Card['type'] | 'all'; label: string }> = [
  { key: 'all', label: '모두' },
  { key: 'popup', label: '팝업' },
  { key: 'tip', label: '팁' },
  { key: 'hotspot', label: '핫스팟' },
  { key: 'weather', label: '날씨' },
  { key: 'population', label: '인구' },
  { key: 'congestion', label: '교통' },
  { key: 'issue', label: '뉴스/이슈' }
];

export default function ReviewPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('all');
  const [tab, setTab] = useState<'inbox'|'manage'|'contact'>('inbox');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [todayItems, setTodayItems] = useState<Card[]>([]);
  const [todayLoading, setTodayLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Card | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [contactLoading, setContactLoading] = useState(false);

  const maxPage = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function fetchList(curPage = page) {
    try {
      setLoading(true); setError(null);
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('type', type);
      params.set('page', String(curPage));
      params.set('pageSize', String(pageSize));
      // legacy: thisweek 탭은 제거됨
      const url = `${API_BASE}/api/review/list?${params.toString()}`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(() => { 
    if (tab === 'inbox') {
      fetchList(1); 
    } else if (tab === 'manage') {
      fetchTodayItems();
    } else if (tab === 'contact') {
      fetchContactMessages();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */ 
  }, [type, pageSize, tab]);

  async function fetchContactMessages() {
    try {
      setContactLoading(true);
      const response = await fetch(`${API_BASE}/api/contact/list`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setContactMessages(data.messages || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load contact messages');
    } finally {
      setContactLoading(false);
    }
  }

  async function fetchTodayItems() {
    try {
      setTodayLoading(true);
      const response = await fetch(`${API_BASE}/api/review/today-items`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setTodayItems(data.items || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load today items');
    } finally {
      setTodayLoading(false);
    }
  }

  async function updateTodayItem(id: string, updates: Partial<Card>) {
    try {
      const response = await fetch(`${API_BASE}/api/review/update-today`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API not found (정적 배포에서는 /api 라우트가 비활성화됩니다).\n로컬 개발 서버에서 /review 페이지를 열거나 NEXT_PUBLIC_API_BASE를 서버 주소로 설정하세요.');
        }
        throw new Error('Update failed');
      }
      
      // 로컬 상태 업데이트
      setTodayItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      
      alert('✅ 업데이트 완료!');
    } catch (error: any) {
      alert('❌ 업데이트 실패: ' + error.message);
    }
  }

  function openEditModal(item: Card) {
    setEditingItem(item);
    setEditModalOpen(true);
  }

  async function openComposeModal() {
    setEditingItem({
      id: `draft-${Date.now()}`,
      type: 'issue',
      title: '',
      summary: '',
      tags: [],
      sources: [],
      lastUpdatedKST: new Date().toISOString()
    } as any);
    setComposeOpen(true);
  }

  function handleModalSave(content: { title: string; fullContent: string; images?: string[]; i18n?: any; tags?: string[]; geo?: any; sources?: any[]; type?: string }) {
    if (!editingItem) return;

    // compose 모드: today에 바로 생성
    if (composeOpen) {
      (async () => {
        try {
          const r = await fetch(`${API_BASE}/api/review/create-today`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: content.title,
              fullContent: content.fullContent,
              images: content.images || [],
              i18n: (content as any).i18n,
              tags: (content as any).tags || [],
              geo: (content as any).geo || null,
              sources: (content as any).sources || [],
              type: content.type || (editingItem as any).type || 'issue'
            })
          });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          alert('✅ Today에 게시되었습니다. (Manage Today 탭과 프런트에 즉시 반영)');
          setComposeOpen(false);
          setEditingItem(null);
          // Manage Today 목록 갱신
          fetchTodayItems();
        } catch (e: any) {
          alert('❌ 저장 실패: ' + (e?.message || e));
        }
      })();
      return;
    }

    // manage 모드: today 업데이트
    const updates: any = {
      title: content.title,
      fullContent: content.fullContent
    };
    if (content.images && content.images.length > 0) updates.images = content.images;
    if (content.i18n) updates.i18n = content.i18n;
    if ((content as any).tags) updates.tags = (content as any).tags;
    if ((content as any).geo) updates.geo = (content as any).geo;
    if ((content as any).sources) updates.sources = (content as any).sources;
    if (content.type) updates.type = content.type;

    updateTodayItem(editingItem.id, updates);
    setEditModalOpen(false); setComposeOpen(false);
    setEditingItem(null);
  }

  async function deleteTodayItem(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/review/delete-today`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setTodayItems(prev => prev.filter(item => item.id !== id));
      alert('✅ 삭제 완료!');
    } catch (error: any) {
      alert('❌ 삭제 실패: ' + error.message);
    }
  }

  async function moveTodayItem(id: string, direction: 'up' | 'down') {
    try {
      const response = await fetch(`${API_BASE}/api/review/move-today`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, direction })
      });
      
      if (!response.ok) throw new Error('Move failed');
      
      // 새로고침하여 순서 업데이트
      fetchTodayItems();
    } catch (error: any) {
      alert('❌ 이동 실패: ' + error.message);
    }
  }

  async function approve(id: string) {
    const r = await fetch(`${API_BASE}/api/review/approve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    });
    if (!r.ok) {
      const tx = await r.text();
      alert('Approve failed: ' + tx);
      return;
    }
    const js = await r.json();
    // 승인 완료 안내
    alert(`승인 완료!\n${js.message || ''}\n이제 🤖 Generate 버튼을 클릭하여 GPT 콘텐츠를 생성하세요.`);
    
    // 아이템을 승인된 상태로 업데이트 (제거하지 않음)
    setItems((cur) => cur.map((c) => 
      c.id === id ? { ...c, approved: true, approvedAt: new Date().toISOString() } : c
    ));
  }

  async function generateContent(id: string) {
    if (!confirm('로컬 GPT-20B로 콘텐츠를 재작성하시겠습니까? (저작권 문제 해결용)')) return;
    
    try {
      const r = await fetch(`${API_BASE}/api/review/generate-content`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id })
      });
      
      const js = await r.json();
      
      if (js.success) {
        alert(`✅ 콘텐츠 생성 완료!\n독창성 점수: ${(js.originalityScore * 100).toFixed(1)}%\n새 제목: ${js.card.title}\n새 요약: ${js.card.summary.substring(0, 100)}...`);
        setItems((cur) => cur.filter((c) => c.id !== id));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        alert(`❌ 생성 실패: ${js.message}\n수동 검토가 필요합니다.`);
        // 페이지 새로고침하여 상태 업데이트
        window.location.reload();
      }
    } catch (error: any) {
      alert('생성 중 오류 발생: ' + (error?.message || error));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Review Inbox</title>
      </Head>
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Review Inbox</h1>
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-6">
            {(['inbox','manage','contact'] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`py-2 px-1 border-b-2 text-sm ${tab===k?'border-primary-600 text-primary-700':'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                {k==='inbox'?'📥 Inbox':k==='manage'?'⚙️ Manage Today':'📧 Contact Messages'}
              </button>
            ))}
          </nav>
        </div>
        {/* Inbox 탭 */}
        {tab === 'inbox' && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') fetchList(1); }}
                placeholder="제목/태그/출처 검색"
                className="border border-gray-300 rounded-md px-3 py-2 w-64"
              />
              <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2">
                {TYPES.map((t) => (<option key={t.key} value={t.key}>{t.label}</option>))}
              </select>
              <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value, 10))} className="border border-gray-300 rounded-md px-3 py-2">
                {[25,50,100,150,200].map((n) => (<option key={n} value={n}>{n}/page</option>))}
              </select>
              <button onClick={() => fetchList(1)} className="bg-primary-600 text-white rounded-md px-4 py-2">Search</button>
              <button onClick={openComposeModal} className="bg-emerald-600 text-white rounded-md px-4 py-2">+ 글쓰기</button>
              {loading && <span className="text-gray-500">Loading...</span>}
              {error && <span className="text-red-600">{error}</span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map((c) => (
                <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{c.type} · {new Date(c.lastUpdatedKST).toLocaleString()}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{c.title}</h3>
                      <p className="text-sm text-gray-700 mb-2">{c.summary}</p>
                      {c.tags?.length ? (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {c.tags.map((t, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">#{t}</span>
                          ))}
                        </div>
                      ) : null}
                      {c.sources?.length ? (
                        <div className="flex flex-wrap gap-3">
                          {c.sources.slice(0,3).map((s, i) => (
                            <a key={i} className="text-xs text-primary-600 hover:text-primary-700 underline" href={s.url} target="_blank" rel="noreferrer">{s.publisher}</a>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="shrink-0">
                      <div className="flex flex-col space-y-2">
                        {(c as any).approved ? (
                          <button 
                            onClick={() => generateContent(c.id)} 
                            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                            title="로컬 GPT-20B로 저작권 안전한 콘텐츠 재작성"
                          >
                            🤖 Generate
                          </button>
                        ) : (
                          <button onClick={() => approve(c.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-md px-3 py-2">
                            Approve
                          </button>
                        )}
                        {(c as any).approved && (
                          <div className="text-xs text-green-600 font-medium">✓ Approved</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Manage Today 탭 */}
        {tab === 'manage' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Today 페이지 게시물 관리</h2>
                <button 
                  onClick={fetchTodayItems} 
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  🔄 새로고침
                </button>
              </div>
              <div className="text-sm text-gray-600">총 {todayItems.length}개 게시물</div>
            </div>

            {todayLoading && <div className="text-center py-8 text-gray-500">로딩 중...</div>}
            
            <div className="space-y-4">
              {todayItems.map((item, index) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    {/* 순서 조정 버튼 */}
                    <div className="flex flex-col space-y-1">
                      <button 
                        onClick={() => moveTodayItem(item.id, 'up')}
                        disabled={index === 0}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        ↑
                      </button>
                      <span className="text-xs text-gray-500 text-center">{index + 1}</span>
                      <button 
                        onClick={() => moveTodayItem(item.id, 'down')}
                        disabled={index === todayItems.length - 1}
                        className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        ↓
                      </button>
                    </div>

                    {/* 콘텐츠 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">{item.type}</span>
                        <span className="text-xs text-gray-500">{new Date(item.lastUpdatedKST).toLocaleString()}</span>
                        {(item as any).generated && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">🤖 AI Generated</span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-700 mb-2">{item.summary.substring(0, 150)}...</p>
                      
                      {item.tags?.length ? (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">#{tag}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        ✏️ 편집
                      </button>
                      
                      <button 
                        onClick={() => deleteTodayItem(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        🗑️ 삭제
                      </button>
                      
                      <a 
                        href={`/real-korea-now/${item.id}`}
                        target="_blank"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 text-center"
                      >
                        👁️ 미리보기
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {todayItems.length === 0 && !todayLoading && (
              <div className="text-center py-12 text-gray-500">
                Today 페이지에 게시된 콘텐츠가 없습니다.
              </div>
            )}
          </>
        )}

        {/* Contact Messages 탭 */}
        {tab === 'contact' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Contact Messages</h2>
                <button 
                  onClick={fetchContactMessages} 
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  🔄 새로고침
                </button>
              </div>
              <div className="text-sm text-gray-600">총 {contactMessages.length}개 메시지</div>
            </div>

            {contactLoading && <div className="text-center py-8 text-gray-500">로딩 중...</div>}
            
            <div className="space-y-4">
              {contactMessages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          message.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          message.status === 'reviewed' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {message.status === 'new' ? '🆕 새 메시지' : 
                           message.status === 'reviewed' ? '👀 검토됨' : '✅ 응답 완료'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          message.type === 'correction' ? 'bg-red-100 text-red-700' :
                          message.type === 'suggestion' ? 'bg-green-100 text-green-700' :
                          message.type === 'source' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {message.type === 'correction' ? '🔧 수정' :
                           message.type === 'suggestion' ? '💡 제안' :
                           message.type === 'source' ? '📰 소스' :
                           message.type === 'feedback' ? '💬 피드백' : '기타'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.submittedAt).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.locale === 'fr' ? '🇫🇷' : '🇨🇦'}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {message.subject || 'No Subject'}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        From: <strong>{message.name}</strong> ({message.email})
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {message.message.length > 200 
                          ? message.message.substring(0, 200) + '...' 
                          : message.message
                        }
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => {
                          // 메시지 상태를 'reviewed'로 변경
                          // TODO: API 구현
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        disabled={message.status !== 'new'}
                      >
                        👀 검토됨
                      </button>
                      
                      <button 
                        onClick={() => {
                          // 메시지 삭제
                          // TODO: API 구현
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                      >
                        🗑️ 삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {contactMessages.length === 0 && !contactLoading && (
              <div className="text-center py-12 text-gray-500">
                Contact 메시지가 없습니다.
              </div>
            )}
          </>
        )}

        {/* Pagination (Inbox 탭에만) */}
        {tab === 'inbox' && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="flex items-center gap-2">
              <button disabled={page<=1} onClick={() => fetchList(page-1)} className="px-3 py-2 rounded border disabled:opacity-50">Prev</button>
              <span className="text-sm">{page} / {maxPage}</span>
              <button disabled={page>=maxPage} onClick={() => fetchList(page+1)} className="px-3 py-2 rounded border disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {/* 콘텐츠 편집 모달 */}
        <ContentEditModal
          isOpen={editModalOpen || composeOpen}
          onClose={() => {
            setEditModalOpen(false); setComposeOpen(false);
            setEditingItem(null);
          }}
          onSave={handleModalSave}
          initialTitle={editingItem?.title || ''}
          initialContent={(editingItem as any)?.fullContent || editingItem?.summary || ''}
          initialImages={(editingItem as any)?.images || []}
          initialI18n={(editingItem as any)?.i18n}
          initialType={editingItem?.type || 'issue'}
          initialTags={(editingItem as any)?.tags || []}
          initialGeo={(editingItem as any)?.geo || null}
          initialSources={(editingItem as any)?.sources || []}
        />
      </div>
    </div>
  );
}


