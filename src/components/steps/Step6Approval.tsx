import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtlasLogo, Button, Checkbox } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';

export function Step6Approval() {
  const { approveApplication, nextStep } = useOnboardingStore();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!termsAccepted) return;

    setActivating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    approveApplication();
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)',
      }}
    >
      <div className="w-full max-w-lg text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mb-12"
        >
          <AtlasLogo size="xl" className="mx-auto" animate />
        </motion.div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-atlas-text mb-4">
            You're in.
          </h1>
          <p className="text-lg text-atlas-text-secondary mb-12">
            Your Atlas membership has been approved. Accept the terms below to activate your account.
          </p>
        </motion.div>

        {/* Membership terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-atlas-bg-elevated rounded-xl p-6 border border-atlas-border mb-8 text-left"
        >
          <h2 className="text-lg font-semibold text-atlas-text mb-4">Membership Terms</h2>
          <ul className="space-y-3 text-atlas-text-secondary">
            <li className="flex items-start gap-3">
              <span className="text-atlas-accent mt-1">•</span>
              <span>
                <strong className="text-atlas-text">Annual membership fee:</strong> $1,000/year
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-atlas-accent mt-1">•</span>
              <span>
                <strong className="text-atlas-text">Dining concierge access:</strong> Requires $25,000/month minimum spend
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Accept terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          <Checkbox
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            label={
              <span>
                I accept the{' '}
                <a href="#" className="text-atlas-accent hover:underline">
                  Atlas Membership Agreement
                </a>
              </span>
            }
          />
        </motion.div>

        {/* Activate button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            size="lg"
            className="w-full"
            disabled={!termsAccepted}
            loading={activating}
            onClick={handleActivate}
          >
            Activate My Membership
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
