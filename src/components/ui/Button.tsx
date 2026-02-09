import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-atlas-accent focus:ring-offset-2 focus:ring-offset-atlas-bg disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-atlas-accent text-white hover:bg-atlas-accent-hover active:scale-[0.98]',
      secondary:
        'bg-atlas-bg-elevated text-atlas-text border border-atlas-border hover:border-atlas-text-tertiary active:scale-[0.98]',
      ghost:
        'bg-transparent text-atlas-text hover:bg-atlas-bg-elevated active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-10 px-4 text-sm rounded-lg',
      md: 'h-12 px-6 text-base rounded-lg',
      lg: 'h-14 px-8 text-lg rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="opacity-0">{children}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </div>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
