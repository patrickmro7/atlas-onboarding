import { forwardRef, type SelectHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, onFocus, onBlur, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== '';

    return (
      <div className="relative">
        <div className="relative">
          <select
            ref={ref}
            value={value}
            className={cn(
              'peer w-full h-14 px-0 pt-5 pb-2 bg-transparent text-atlas-text text-lg',
              'border-b-2 border-atlas-border',
              'transition-colors duration-200',
              'focus:outline-none focus:border-atlas-accent',
              'cursor-pointer appearance-none',
              !hasValue && 'text-atlas-text-secondary',
              error && 'border-atlas-error focus:border-atlas-error',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-atlas-bg text-atlas-text-secondary">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-atlas-bg text-atlas-text"
              >
                {option.label}
              </option>
            ))}
          </select>
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
          {/* Dropdown arrow */}
          <svg
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors',
              isFocused ? 'text-atlas-accent' : 'text-atlas-text-secondary'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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

Select.displayName = 'Select';
