/**
 * 간단한 마크다운 렌더링 유틸리티
 */

export function renderSimpleMarkdown(text: string): string {
  if (!text) return '';
  
  let html = preprocessMarkdown(text);
  
  // 이미지 렌더링: ![alt](url) → <img>
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (m, alt, url) => {
      // Imgur page URL 보호: https://imgur.com/ID → https://i.imgur.com/ID.jpg
      // Also repair malformed urls like "![Imgur](https:/i.imgur.com/ID.jpg"
      url = String(url).replace(/^https:\/i\.imgur\.com\//i, 'https://i.imgur.com/');
      const match = String(url).match(/^https?:\/\/(?:www\.)?imgur\.com\/([A-Za-z0-9]+)(?:\.(png|jpe?g|gif|webp))?(?:\?.*)?$/i);
      if (match && match[1]) {
        const id = match[1];
        const ext = match[2] ? match[2].toLowerCase() : 'jpg';
        url = `https://i.imgur.com/${id}.${ext}`;
      }
      // Fallback: if url still looks like a markdown fragment (starts with ![ ), drop it
      if (/^!\[/.test(url)) {
        return '';
      }
      return `<img src="${url}" alt="${alt}" class="max-w-full h-auto rounded-lg my-4" style="max-height: 200px; object-fit: cover;" />`;
    }
  );
  
  // 링크 렌더링: [text](url) → <a>
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
  );
  
  // 굵은 텍스트: **text** → <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 기울임 텍스트: *text* → <em>
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 소제목: ### text → <h3>
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  
  // 인용문: > text → <blockquote>
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">$1</blockquote>');
  
  // 줄바꿈 처리
  html = html.replace(/\n\n/g, '</p><p class="mb-4">');
  html = html.replace(/\n/g, '<br />');
  
  // 단락 래핑
  if (!html.startsWith('<')) {
    html = '<p class="mb-4">' + html + '</p>';
  }
  
  return html;
}

/**
 * 마크다운에서 이미지만 추출
 */
export function extractImagesFromMarkdown(text: string): string[] {
  if (!text) return [];
  
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: string[] = [];
  let match;
  
  while ((match = imageRegex.exec(text)) !== null) {
    images.push(match[2]); // URL 부분만 추출
  }
  
  return images;
}

/**
 * 마크다운에서 이미지 제거 (텍스트만 추출)
 */
export function removeImagesFromMarkdown(text: string): string {
  if (!text) return '';
  
  return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim();
}

/**
 * 요약용: 마크다운 제거하고 플레인 텍스트만
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  
  let plain = preprocessMarkdown(text);
  
  // 이미지 제거
  plain = plain.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
  
  // 링크 → 텍스트만
  plain = plain.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  
  // 굵은 텍스트 → 텍스트만
  plain = plain.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // 기울임 텍스트 → 텍스트만
  plain = plain.replace(/\*(.*?)\*/g, '$1');
  
  // 소제목 → 텍스트만
  plain = plain.replace(/^### (.+)$/gm, '$1');
  
  // 인용문 → 텍스트만
  plain = plain.replace(/^> (.+)$/gm, '$1');
  
  // 여러 줄바꿈 정리
  plain = plain.replace(/\n\s*\n/g, '\n').trim();
  
  return plain;
}

function preprocessMarkdown(input: string): string {
  let s = input || '';
  // Remove script tags entirely
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  // Remove style tags
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '');
  // Case: markdown image wrapping an Imgur embed block → flatten to a single markdown image
  s = s.replace(/!\[[^\]]*\]\(\s*<blockquote[^>]*class=\"imgur-embed-pub\"[^>]*data-id=\"([A-Za-z0-9]+)\"[^>]*>[\s\S]*?<\/blockquote>\s*(?:<script[\s\S]*?imgur\.com[\s\S]*?<\/script>)?\s*\)/gi,
    (_m, id) => `![Imgur](https://i.imgur.com/${id}.jpg)`);
  // Replace Imgur embed block with a direct image markdown
  s = s.replace(/<blockquote[^>]*class=\"imgur-embed-pub\"[^>]*data-id=\"([A-Za-z0-9]+)\"[^>]*>[\s\S]*?<\/blockquote>\s*(?:<script[\s\S]*?imgur\.com[\s\S]*?<\/script>)?/gi, (_m, id) => `![Imgur](https://i.imgur.com/${id}.jpg)`);
  // Drop any remaining HTML tags except a few safe ones (handled by negative lookahead)
  s = s.replace(/<(?!\/?(b|strong|em|i|u|br)\b)[^>]*>/gi, '');
  // Nested image markdown like ![x](![y](url) ... ) → ![y](url)
  s = s.replace(/!\[[^\]]*\]\(\s*!\[[\s\S]*?\]\(([^)\s]+)\)[\s\S]*?\)/g, (_m, url) => `![Image](${url})`);
  // Remove broken image markdown that was not closed
  s = s.replace(/!\[[^\]]*\]\([^\)]*$/gm, '');
  return s;
}
