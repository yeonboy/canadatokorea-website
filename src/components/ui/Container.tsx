import { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}


