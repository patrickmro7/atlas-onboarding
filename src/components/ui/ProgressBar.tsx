import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/lib/store';

const TOTAL_STEPS = 7;

export function ProgressBar() {
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-atlas-border">
      <motion.div
        className="h-full bg-atlas-accent"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
