'use client';

import dynamic from 'next/dynamic';

const Lanyard = dynamic(() => import('./Lanyard'), { ssr: false });

type LanyardItem = {
  href: string;
  label: string;
};

interface LanyardGridProps {
  items?: LanyardItem[];
}

const DEFAULT_ITEMS: LanyardItem[] = [
  { href: '/real-korea-now', label: 'Real Korea Now' },
  { href: '/k-pop', label: 'K-POP' },
  { href: '/travel-food', label: 'Travel & Food' },
  { href: '/learn', label: 'Learn Korean' },
  { href: '/community', label: 'Community' },
  { href: '/tools/cost-estimator', label: 'Tools' }
];

export default function LanyardGrid({ items = DEFAULT_ITEMS }: LanyardGridProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-6 lg:gap-8">
        {items.map((item, idx) => (
          <a
            key={item.href}
            href={item.href}
            className={[
              'block group',
              idx % 6 === 0 ? 'sm:col-span-6 lg:col-span-8' :
              idx % 6 === 1 ? 'sm:col-span-3 lg:col-span-4' :
              idx % 6 === 2 ? 'sm:col-span-3 lg:col-span-4' :
              idx % 6 === 3 ? 'sm:col-span-6 lg:col-span-8' :
              idx % 6 === 4 ? 'sm:col-span-3 lg:col-span-6' :
              /* 5 */          'sm:col-span-3 lg:col-span-6'
            ].join(' ')}
            aria-label={item.label}
          >
            <div className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200/50 bg-white/30 backdrop-blur">
              <Lanyard
                className="h-56 sm:h-64 lg:h-72"
                position={[0, 0, 10] as any}
                fov={24}
                transparent
                label={item.label}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}



