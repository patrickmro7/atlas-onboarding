import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface StepContainerProps {
  children: ReactNode;
  stepKey: number | string;
}

export function StepContainer({ children, stepKey }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
