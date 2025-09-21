import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  items?: Array<{ label: string; ariaLabel?: string; link: string }>;
  socialItems?: Array<{ label: string; link: string }>;
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  colors?: string[];
  logoUrl?: string;
  accentColor?: string;
}

export default function StaggeredMenu({ 
  items = [],
  menuButtonColor = "#111",
  openMenuButtonColor = "#111"
}: StaggeredMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 메뉴 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        style={{ color: isOpen ? openMenuButtonColor : menuButtonColor }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 메뉴 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-48 z-50">
          {items.map((item, index) => (
            <a
              key={item.link}
              href={item.link}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xs text-gray-400 mr-2">0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
