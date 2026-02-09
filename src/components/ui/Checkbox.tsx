import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="relative">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'w-6 h-6 rounded border-2 transition-all duration-200',
                'border-atlas-border bg-transparent',
                'peer-focus:ring-2 peer-focus:ring-atlas-accent peer-focus:ring-offset-2 peer-focus:ring-offset-atlas-bg',
                'peer-checked:bg-atlas-accent peer-checked:border-atlas-accent',
                'group-hover:border-atlas-text-secondary',
                error && 'border-atlas-error',
                className
              )}
            >
              <svg
                className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Checkmark overlay for checked state */}
            <svg
              className={cn(
                'absolute inset-0 w-6 h-6 text-white transition-opacity duration-200',
                props.checked ? 'opacity-100' : 'opacity-0'
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-base text-atlas-text leading-relaxed">{label}</span>
        </label>
        {error && (
          <p className="mt-2 text-sm text-atlas-error animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
