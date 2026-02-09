import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
      <div className="relative">
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'peer w-full h-14 px-0 pt-5 pb-2 bg-transparent text-atlas-text text-lg',
              'border-b-2 border-atlas-border',
              'transition-colors duration-200',
              'focus:outline-none focus:border-atlas-accent',
              'placeholder-transparent',
              error && 'border-atlas-error focus:border-atlas-error',
              className
            )}
            placeholder={label}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {label && (
            <label
              className={cn(
                'absolute left-0 transition-all duration-200 pointer-events-none',
                'text-atlas-text-secondary',
                isFocused || hasValue
                  ? 'top-0 text-sm'
                  : 'top-4 text-lg',
                isFocused && !error && 'text-atlas-accent',
                error && 'text-atlas-error'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'mt-2 text-sm animate-fade-in',
              error ? 'text-atlas-error' : 'text-atlas-text-secondary'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
