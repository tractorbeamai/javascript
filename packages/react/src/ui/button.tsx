import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'tb-inline-flex tb-items-center tb-justify-center tb-whitespace-nowrap tb-rounded-md tb-text-sm tb-font-medium tb-ring-offset-background tb-transition-colors focus-visible:tb-outline-none focus-visible:tb-ring-2 focus-visible:tb-ring-ring focus-visible:tb-ring-offset-2 disabled:tb-pointer-events-none disabled:tb-opacity-50',
  {
    variants: {
      variant: {
        default:
          'tb-bg-primary tb-text-primary-foreground hover:tb-bg-primary/90',
        destructive:
          'tb-bg-destructive tb-text-destructive-foreground hover:tb-bg-destructive/90',
        outline:
          'tb-border tb-border-input tb-bg-background hover:tb-bg-accent hover:tb-text-accent-foreground',
        secondary:
          'tb-bg-secondary tb-text-secondary-foreground hover:tb-bg-secondary/80',
        ghost: 'hover:tb-bg-accent hover:tb-text-accent-foreground',
        link: 'tb-text-primary tb-underline-offset-4 hover:tb-underline',
      },
      size: {
        default: 'tb-h-10 tb-px-4 tb-py-2',
        sm: 'tb-h-9 tb-rounded-md tb-px-3',
        lg: 'tb-h-11 tb-rounded-md tb-px-8',
        icon: 'tb-h-10 tb-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
