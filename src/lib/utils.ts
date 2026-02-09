import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 5) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
}

export function maskSSN(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 9) {
    // Still typing - show masked version of what's entered
    const masked = '\u2022'.repeat(Math.min(digits.length, 3));
    if (digits.length <= 3) return masked;
    const masked2 = '\u2022'.repeat(Math.min(digits.length - 3, 2));
    if (digits.length <= 5) return `${masked}-${masked2}`;
    const masked3 = '\u2022'.repeat(digits.length - 5);
    return `${masked}-${masked2}-${masked3}`;
  }
  // Complete - show last 4
  return `\u2022\u2022\u2022-\u2022\u2022-${digits.slice(5, 9)}`;
}

export function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)} / ${digits.slice(2, 4)} / ${digits.slice(4, 8)}`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    return `(${digits.slice(0, 3)}) XXX-${digits.slice(6, 10)}`;
  }
  return phone;
}
