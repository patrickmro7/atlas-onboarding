import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/lib/store';

export function SavedToast() {
  const { savedToast, hideSavedToast } = useOnboardingStore();

  useEffect(() => {
    if (savedToast) {
      const timer = setTimeout(() => {
        hideSavedToast();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [savedToast, hideSavedToast]);

  return (
    <AnimatePresence>
      {savedToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-atlas-bg-elevated border border-atlas-border rounded-lg shadow-lg">
            <svg
              className="w-4 h-4 text-atlas-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm text-atlas-text-secondary">Saved</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
