import { useRef, useState, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OTPInput({ length = 4, onComplete, error, disabled }: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    const digit = value.replace(/\D/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    const code = newValues.join('');
    if (code.length === length && newValues.every(v => v)) {
      onComplete(code);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!values[index] && index > 0) {
        focusInput(index - 1);
      } else {
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
      }
    } else if (e.key === 'ArrowLeft') {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight') {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedData) {
      const newValues = [...values];
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setValues(newValues);

      if (pastedData.length === length) {
        onComplete(pastedData);
      } else {
        focusInput(pastedData.length);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="flex gap-4"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              'w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl sm:text-3xl font-semibold',
              'bg-atlas-bg-elevated rounded-xl',
              'border-2 transition-all duration-200',
              'focus:outline-none',
              error
                ? 'border-atlas-error'
                : 'border-atlas-border focus:border-atlas-accent',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            autoFocus={index === 0}
          />
        ))}
      </motion.div>
      {error && (
        <p className="mt-4 text-sm text-atlas-error animate-fade-in">{error}</p>
      )}
    </div>
  );
}
