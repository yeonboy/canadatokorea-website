import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: boolean;
  badge?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  center = false,
  action,
  className,
  size = 'lg',
  gradient = false,
  badge
}: SectionHeaderProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl md:text-5xl',
    xl: 'text-5xl md:text-6xl'
  };

  return (
    <div className={cn('mb-12', center ? 'text-center' : '', className)}>
      {/* 배지 */}
      {badge && (
        <div className={cn('mb-4', center ? 'justify-center' : '')}>
          {badge}
        </div>
      )}

      {/* 타이틀 */}
      <h2 className={cn(
        sizeClasses[size],
        'font-bold leading-tight mb-4',
        gradient
          ? 'bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 bg-clip-text text-transparent'
          : 'text-gray-900'
      )}>
        {title}
      </h2>

      {/* 서브타이틀 */}
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* 액션 */}
      {action && (
        <div className={cn('mt-6', center ? 'justify-center' : '')}>
          {action}
        </div>
      )}

      {/* 데코레이션 라인 */}
      {center && (
        <div className="mt-6 flex justify-center">
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full"></div>
        </div>
      )}
    </div>
  );
}


