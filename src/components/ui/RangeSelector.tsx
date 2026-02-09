import { cn } from '@/lib/utils';

interface RangeSelectorOption {
  value: string;
  label: string;
}

interface RangeSelectorProps {
  label?: string;
  options: RangeSelectorOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RangeSelector({ label, options, value, onChange, error }: RangeSelectorProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm text-atlas-text-secondary">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
              'border-2 focus:outline-none focus:ring-2 focus:ring-atlas-accent focus:ring-offset-2 focus:ring-offset-atlas-bg',
              value === option.value
                ? 'bg-atlas-accent border-atlas-accent text-white'
                : 'bg-atlas-bg-elevated border-atlas-border text-atlas-text hover:border-atlas-text-tertiary',
              error && value !== option.value && 'border-atlas-error'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-atlas-error animate-fade-in">{error}</p>
      )}
    </div>
  );
}
