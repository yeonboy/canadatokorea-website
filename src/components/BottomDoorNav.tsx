import Link from 'next/link';
import { useState } from 'react';
import { NAVIGATION } from '@/utils/constants';
import { cn } from '@/utils/helpers';

export default function BottomDoorNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center">
      {/* Door toggle */}
      <button
        aria-label="Open navigation"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'relative w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-200 flex items-center justify-center',
          'transition-transform duration-300',
          open ? 'scale-105' : ''
        )}
      >
        {/* Simple door icon (CSS lines) */}
        <span className="absolute block w-8 h-8 border-l-2 border-t-2 border-b-2 border-gray-800" style={{ transform: 'translateX(-6px)' }} />
        <span className="absolute block h-8 w-0.5 bg-gray-800" style={{ transform: 'translateX(6px) rotate(15deg)' }} />
        <span className="absolute block w-1 h-1 bg-gray-800 rounded" style={{ transform: 'translateX(6px)' }} />
      </button>

      {/* Bottom sheet */}
      {open && (
        <div className="absolute bottom-20 w-full max-w-md mx-auto bg-white/95 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


