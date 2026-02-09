import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtlasLogo, Button, ToggleGroup } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { CardType } from '@/types/application';

interface MembershipCardProps {
  type: CardType;
  title: string;
  tagline: string;
  benefits: { title: string; description: string }[];
  selected: boolean;
  onSelect: () => void;
}

function MembershipCard({ type: _type, title, tagline, benefits, selected, onSelect }: MembershipCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative w-full text-left p-8 rounded-2xl transition-all duration-300',
        'border-2 focus:outline-none focus:ring-2 focus:ring-atlas-accent focus:ring-offset-4 focus:ring-offset-atlas-bg',
        selected
          ? 'bg-atlas-bg-elevated border-atlas-accent shadow-lg shadow-atlas-accent/10'
          : 'bg-atlas-bg-card border-atlas-border hover:border-atlas-text-tertiary'
      )}
      animate={{
        scale: selected ? 1.02 : 1,
        y: selected ? -4 : 0,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Card silhouette */}
      <div className="absolute top-6 right-6 w-16 h-10 rounded-md bg-gradient-to-br from-atlas-silver/20 to-atlas-silver/5 flex items-center justify-center">
        <AtlasLogo size="sm" className="opacity-60" />
      </div>

      <div className="pr-20">
        <h3 className="text-2xl font-semibold text-atlas-text mb-2">{title}</h3>
        <p className="text-base text-atlas-text-secondary mb-6">{tagline}</p>
      </div>

      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5">
              <svg
                className={cn(
                  'w-5 h-5 transition-colors',
                  selected ? 'text-atlas-accent' : 'text-atlas-text-secondary'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium text-atlas-text">{benefit.title}</p>
              <p className="text-sm text-atlas-text-secondary">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 w-6 h-6 rounded-full bg-atlas-accent flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

export function Step3MembershipSelection() {
  const { application, setCardType, nextStep } = useOnboardingStore();
  const [selectedType, setSelectedType] = useState<CardType | null>(application.cardType);
  const [view, setView] = useState<'personal' | 'business'>('personal');

  const personalBenefits = [
    {
      title: '24/7 travel & lifestyle concierge',
      description: 'Dedicated human support for reservations, travel, and whatever you need. No hold times. No transfers.',
    },
    {
      title: 'No pre-set spending limit',
      description: 'A charge card that moves as fast as you do.',
    },
    {
      title: 'Annual first-class flight upgrade',
      description: 'Once per year, Atlas upgrades a flight to business or first class on us.',
    },
  ];

  const businessBenefits = [
    {
      title: '2x points on all spending',
      description: 'Every dollar works harder. No category restrictions.',
    },
    {
      title: '24/7 travel & entertainment concierge',
      description: 'Dedicated support for team travel, client dinners, and events.',
    },
    {
      title: 'Smart virtual cards for your team',
      description: 'Issue configurable virtual cards with custom limits, merchant locks, and real-time controls.',
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      setCardType(selectedType);
      nextStep();
    }
  };

  const memberName = application.applicant.firstName || 'there';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <AtlasLogo size="md" className="mx-auto mb-8" />
          <h1 className="text-3xl sm:text-4xl font-semibold text-atlas-text mb-4">
            Welcome{application.applicant.firstName ? `, ${memberName}` : ''}. You've been selected for Atlas.
          </h1>
          <p className="text-lg text-atlas-text-secondary">
            Choose the membership that's right for you.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <ToggleGroup
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
            value={view}
            onChange={(v) => setView(v as 'personal' | 'business')}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {view === 'personal' ? (
            <MembershipCard
              type="personal"
              title="Atlas Personal"
              tagline="For individuals who expect more from their card — and their time."
              benefits={personalBenefits}
              selected={selectedType === 'personal'}
              onSelect={() => setSelectedType('personal')}
            />
          ) : (
            <MembershipCard
              type="business"
              title="Atlas Business"
              tagline="For family offices, firms, and operators who need power, control, and white-glove support."
              benefits={businessBenefits}
              selected={selectedType === 'business'}
              onSelect={() => setSelectedType('business')}
            />
          )}

          {/* Placeholder for second card on larger screens */}
          <div className="hidden md:block" />
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedType}
            className="min-w-[300px]"
          >
            Continue with Atlas {selectedType ? (selectedType === 'personal' ? 'Personal' : 'Business') : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
