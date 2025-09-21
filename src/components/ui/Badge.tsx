import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'gradient';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: ReactNode;
  animated?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800 border border-primary-200',
  neutral: 'bg-gray-100 text-gray-800 border border-gray-200',
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  error: 'bg-red-100 text-red-800 border border-red-200',
  gradient: 'bg-gradient-to-r from-primary-500 to-blue-500 text-white border-0'
};

export default function Badge({
  children,
  variant = 'neutral',
  className,
  icon,
  animated = false
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200',
      variantClasses[variant],
      animated && 'animate-pulse',
      className
    )}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}


