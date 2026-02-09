import { useState, useEffect } from 'react';
import { AtlasLogo, Button, OTPInput } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import { delay, maskPhone } from '@/lib/utils';

export function Step2PhoneVerification() {
  const { application, nextStep, setReturningUser, isReturningUser, currentStep } = useOnboardingStore();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifying, setVerifying] = useState(false);

  // Get the phone number that receives the OTP
  const otpPhone = application.delegate?.phone || application.invitedPhone;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleComplete = async (code: string) => {
    if (verifying) return;

    setVerifying(true);
    setError(null);

    await delay(600);

    // Stub: Accept "1234" as valid code
    if (code === '1234') {
      // Check if this is a returning user (has existing application data)
      const hasExistingData = application.applicant.firstName || application.cardType;
      if (hasExistingData && currentStep === 2) {
        setReturningUser(true);
      }
      nextStep();
    } else {
      setAttempts((prev) => prev + 1);
      if (attempts >= 2) {
        setError('Too many attempts. Please request a new code.');
      } else {
        setError("That code didn't match. Please try again.");
      }
    }

    setVerifying(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError(null);
    setAttempts(0);
    setResendCooldown(30);

    // Stub: Simulate sending new code
    await delay(500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col items-center mb-12">
          <AtlasLogo size="lg" className="mb-8" />
          <h1 className="text-3xl sm:text-4xl font-semibold text-atlas-text mb-4">
            Enter your verification code
          </h1>
          <p className="text-lg text-atlas-text-secondary">
            We sent a 4-digit code to {maskPhone(otpPhone)}
          </p>
        </div>

        <div className="mb-8">
          <OTPInput
            length={4}
            onComplete={handleComplete}
            error={error ?? undefined}
            disabled={attempts >= 3 || verifying}
          />
        </div>

        <div className="space-y-4">
          {attempts >= 3 ? (
            <Button onClick={handleResend} variant="secondary" className="w-full">
              Request a new code
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className="text-atlas-text-secondary hover:text-atlas-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn't receive it?{' '}
              <span className="text-atlas-accent font-medium">
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code'}
              </span>
            </button>
          )}
        </div>

        {isReturningUser && (
          <div className="mt-8 p-4 bg-atlas-bg-elevated rounded-lg border border-atlas-border animate-fade-in">
            <p className="text-sm text-atlas-text">
              Welcome back. We saved your progress.
            </p>
          </div>
        )}

        <p className="mt-8 text-sm text-atlas-text-tertiary">
          For testing, use code: <span className="font-mono text-atlas-text-secondary">1234</span>
        </p>
      </div>
    </div>
  );
}
