import { useState } from 'react';
import { motion } from 'framer-motion';
import { AtlasLogo, Button, Input, Select } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { InviteType } from '@/types/application';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  primary?: boolean;
}

function ActionCard({ icon, title, description, cta, onClick, primary }: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'p-6 rounded-xl border transition-all duration-200 cursor-pointer',
        primary
          ? 'bg-atlas-accent/10 border-atlas-accent hover:bg-atlas-accent/15'
          : 'bg-atlas-bg-elevated border-atlas-border hover:border-atlas-text-tertiary'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            primary ? 'bg-atlas-accent/20 text-atlas-accent' : 'bg-atlas-bg-card text-atlas-text-secondary'
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-atlas-text mb-1">{title}</h3>
          <p className="text-sm text-atlas-text-secondary mb-4">{description}</p>
          <button
            type="button"
            className={cn(
              'text-sm font-medium transition-colors',
              primary
                ? 'text-atlas-accent hover:text-atlas-accent-hover'
                : 'text-atlas-text-secondary hover:text-atlas-text'
            )}
          >
            {cta} &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface InviteModalProps {
  type: InviteType;
  title: string;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; contact: string; role?: string }) => void;
}

function InviteModal({ type, title, onClose, onSubmit }: InviteModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSubmit({ firstName, lastName, contact, role: role || undefined });
    setSubmitting(false);
  };

  const showRoleSelect = type === 'assistant' || type === 'family_office';

  const roleOptions =
    type === 'assistant'
      ? [
          { value: 'executive_assistant', label: 'Executive Assistant' },
          { value: 'personal_assistant', label: 'Personal Assistant' },
        ]
      : [
          { value: 'family_office', label: 'Family Office' },
          { value: 'wealth_manager', label: 'Wealth Manager' },
          { value: 'business_manager', label: 'Business Manager' },
          { value: 'accountant', label: 'Accountant' },
          { value: 'other', label: 'Other' },
        ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-atlas-bg-elevated rounded-2xl p-8 border border-atlas-border"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-atlas-text mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <Input
            label="Email or phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          {showRoleSelect && (
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={roleOptions}
              placeholder="Select role"
            />
          )}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={submitting}>
              Send Invite
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function Step7Welcome() {
  const { application, addInvite } = useOnboardingStore();
  const [inviteModal, setInviteModal] = useState<{ type: InviteType; title: string } | null>(null);
  const [applePayAdded, setApplePayAdded] = useState(false);
  const [invitesSent, setInvitesSent] = useState<InviteType[]>([]);

  const firstName = application.applicant.firstName || 'Member';

  const handleApplePay = () => {
    // Stub: Show Apple Pay success
    setApplePayAdded(true);
  };

  const handleInvite = (type: InviteType, title: string) => {
    setInviteModal({ type, title });
  };

  const handleInviteSubmit = (data: { firstName: string; lastName: string; contact: string; role?: string }) => {
    if (inviteModal) {
      addInvite({
        type: inviteModal.type,
        firstName: data.firstName,
        lastName: data.lastName,
        contact: data.contact,
        role: data.role,
      });
      setInvitesSent([...invitesSent, inviteModal.type]);
      setInviteModal(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <AtlasLogo size="md" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-semibold text-atlas-text mb-4">
            Welcome to Atlas, {firstName}.
          </h1>
          <p className="text-lg text-atlas-text-secondary">
            Your card is being prepared and will arrive shortly. While you wait, set up your membership
            to get the most from Atlas from day one.
          </p>
        </motion.div>

        {/* Action Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-2 gap-4 mb-12"
        >
          <ActionCard
            primary
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            }
            title="Start using Atlas now"
            description="Add your Atlas card to Apple Pay and start spending before your physical card arrives."
            cta={applePayAdded ? 'Added to Wallet' : 'Add to Wallet'}
            onClick={handleApplePay}
          />

          <ActionCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="Add your assistant"
            description="Let them book travel, make reservations, and manage your concierge requests."
            cta={invitesSent.includes('assistant') ? 'Invite Sent' : 'Send Invite'}
            onClick={() => handleInvite('assistant', 'Add Your Assistant')}
          />

          <ActionCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            title="Add your spouse or partner"
            description="They get full concierge access and their own card. Your transactions stay private."
            cta={invitesSent.includes('spouse') ? 'Invite Sent' : 'Send Invite'}
            onClick={() => handleInvite('spouse', 'Add Your Partner')}
          />

          <ActionCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Add your kids"
            description="Consolidated household spending, one statement, full visibility. Set individual limits."
            cta={invitesSent.includes('kids') ? 'Invite Sent' : 'Send Invite'}
            onClick={() => handleInvite('kids', 'Add Family Members')}
          />

          <ActionCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="Connect your financial team"
            description="Give your family office, wealth manager, or accountant access to manage payments."
            cta={invitesSent.includes('family_office') ? 'Invite Sent' : 'Send Invite'}
            onClick={() => handleInvite('family_office', 'Add Financial Team')}
          />
        </motion.div>

        {/* Concierge Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-atlas-bg-elevated rounded-xl p-8 border border-atlas-border mb-12"
        >
          <h2 className="text-2xl font-semibold text-atlas-text mb-2">
            Make your concierge yours.
          </h2>
          <p className="text-atlas-text-secondary mb-6">
            Tell us how you travel, where you like to eat, and what matters to you — so when you call, we already know.
          </p>
          <Button variant="secondary">
            Complete Your Profile &rarr;
          </Button>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <Button size="lg" className="min-w-[280px]">
            Go to Your Dashboard &rarr;
          </Button>
        </motion.div>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <InviteModal
          type={inviteModal.type}
          title={inviteModal.title}
          onClose={() => setInviteModal(null)}
          onSubmit={handleInviteSubmit}
        />
      )}
    </motion.div>
  );
}
