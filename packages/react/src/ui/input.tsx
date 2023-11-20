import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'tb-flex tb-h-10 tb-w-full tb-rounded-md tb-border tb-border-input tb-bg-background tb-px-3 tb-py-2 tb-text-sm tb-ring-offset-background file:tb-border-0 file:tb-bg-transparent file:tb-text-sm file:tb-font-medium placeholder:tb-text-muted-foreground focus-visible:tb-outline-none focus-visible:tb-ring-2 focus-visible:tb-ring-ring focus-visible:tb-ring-offset-2 disabled:tb-cursor-not-allowed disabled:tb-opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
