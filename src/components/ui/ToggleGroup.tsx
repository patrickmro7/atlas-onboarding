import { cn } from '@/lib/utils';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToggleGroup({ options, value, onChange, className }: ToggleGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg p-1 bg-atlas-bg-elevated border border-atlas-border',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-6 py-2.5 rounded-md text-base font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-atlas-accent focus:ring-offset-2 focus:ring-offset-atlas-bg-elevated',
            value === option.value
              ? 'bg-atlas-accent text-white shadow-sm'
              : 'text-atlas-text-secondary hover:text-atlas-text'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
