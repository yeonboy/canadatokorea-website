import Link from 'next/link';

type DoorItem = {
  href: string;
  label: string;
};

const ITEMS: DoorItem[] = [
  { href: '/real-korea-now', label: 'Real korea now' },
  { href: '/k-pop', label: 'K-POP' },
  { href: '/travel-food', label: 'Travel&Food' },
  { href: '/learn', label: 'Learn Korean' }
];

function DoorIcon() {
  return (
    <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 mx-auto">
      {/* 기본 상태 (위 이미지) */}
      <g className="door-state-closed" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="square">
        {/* frame */}
        <path d="M40 160 L40 40 L180 40" />
        <path d="M40 160 L100 160" />
        <path d="M180 40 L180 160" />
        <path d="M180 160 L220 160" />
        {/* door panel (hinged at right jamb) */}
        <path d="M180 40 L180 160 L120 152 L120 56 L180 40" />
        {/* knob */}
        <rect x="140" y="92" width="6" height="18" fill="currentColor" rx="2" />
      </g>

      {/* 호버 상태 (아래 이미지) */}
      <g className="door-state-open" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="square">
        {/* frame */}
        <path d="M40 160 L40 40 L180 40" />
        <path d="M40 160 L100 160" />
        <path d="M180 40 L180 160" />
        <path d="M180 160 L230 160" />
        {/* rotated door look as triangle/wedge */}
        <path d="M180 48 L180 160 L205 175 L205 60 Z" />
        {/* knob farther right */}
        <rect x="192" y="108" width="6" height="20" fill="currentColor" rx="2" />
      </g>
    </svg>
  );
}

export default function DoorNavGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className="door-card group">
          <div className="p-6 text-center rounded-xl" style={{ background: 'transparent' }}>
            <DoorIcon />
            <div className="mt-4 text-gray-900 font-semibold">{item.label}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}


