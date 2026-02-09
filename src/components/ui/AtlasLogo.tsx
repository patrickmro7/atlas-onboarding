import { cn } from '@/lib/utils';

interface AtlasLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export function AtlasLogo({ size = 'md', className, animate = false }: AtlasLogoProps) {
  return (
    <div className={cn('relative', sizes[size], className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'w-full h-full',
          animate && 'animate-pulse-subtle'
        )}
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="50%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#A0A0A0" />
          </linearGradient>
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Globe outer circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#silverGradient)"
          strokeWidth="2"
          fill="none"
        />

        {/* Horizontal latitude lines */}
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="15"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="45"
          ry="30"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Vertical longitude lines */}
        <ellipse
          cx="50"
          cy="50"
          rx="15"
          ry="45"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse
          cx="50"
          cy="50"
          rx="30"
          ry="45"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Center vertical line */}
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
        />

        {/* Center horizontal line */}
        <line
          x1="5"
          y1="50"
          x2="95"
          y2="50"
          stroke="url(#silverGradient)"
          strokeWidth="1.5"
        />

        {/* Shimmer effect overlay */}
        {animate && (
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="url(#shimmerGradient)"
            strokeWidth="4"
            fill="none"
            className="animate-shimmer"
            style={{
              strokeDasharray: '30 200',
              animation: 'spin 3s linear infinite',
            }}
          />
        )}
      </svg>

      {/* Subtle glow effect */}
      {animate && (
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(192,192,192,0.4) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
}

export function AtlasWordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <AtlasLogo size="md" />
      <span
        className="text-3xl font-semibold tracking-wider"
        style={{
          background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        ATLAS
      </span>
    </div>
  );
}
