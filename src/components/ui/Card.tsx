import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  glass?: boolean;
  gradient?: boolean;
  interactive?: boolean;
}

export default function Card({
  children,
  className,
  hoverable = true,
  glass = false,
  gradient = false,
  interactive = false
}: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl transition-all duration-300',
        glass && 'backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        !glass && !gradient && 'bg-white border border-gray-100 shadow-sm',
        hoverable && 'hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1',
        interactive && 'cursor-pointer hover:scale-105',
        className
      )}
    >
      {/* 서브틀 효과 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 컨텐츠 */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}


