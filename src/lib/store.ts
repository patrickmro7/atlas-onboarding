import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AtlasApplication,
  CardType,
  Delegate,
  Applicant,
  Financial,
  BankAccount,
  Shipping,
  Invite,
  Address,
} from '@/types/application';
import { generateId } from './utils';

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface OnboardingState {
  currentStep: OnboardingStep;
  application: AtlasApplication;
  isReturningUser: boolean;
  savedToast: boolean;

  // Actions
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  setInvitedPhone: (phone: string) => void;
  setDelegate: (delegate: Delegate | null) => void;
  setCardType: (cardType: CardType) => void;
  updateApplicant: (data: Partial<Applicant>) => void;
  updateFinancial: (data: Partial<Financial>) => void;
  setBankAccount: (data: BankAccount) => void;
  updateShipping: (data: Partial<Shipping>) => void;
  setShippingAddress: (address: Address) => void;
  setCreditCheckAuthorized: (authorized: boolean) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setMembershipTermsAccepted: (accepted: boolean) => void;
  submitApplication: () => void;
  approveApplication: () => void;
  addInvite: (invite: Invite) => void;

  setReturningUser: (returning: boolean) => void;
  showSavedToast: () => void;
  hideSavedToast: () => void;
  resetApplication: () => void;
}

const initialApplication: AtlasApplication = {
  id: generateId(),
  invitedPhone: '',
  cardType: null,
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  delegate: null,
  applicant: {},
  financial: {
    annualIncome: '',
    netWorth: '',
    monthlySpend: '',
  },
  bankAccount: {
    connected: false,
  },
  shipping: {
    useHomeAddress: true,
  },
  consent: {
    creditCheckAuthorized: false,
    termsAccepted: false,
    membershipTermsAccepted: false,
  },
  invites: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      application: { ...initialApplication },
      isReturningUser: false,
      savedToast: false,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 7) {
          set({ currentStep: (currentStep + 1) as OnboardingStep });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: (currentStep - 1) as OnboardingStep });
        }
      },

      setInvitedPhone: (phone) =>
        set((state) => ({
          application: {
            ...state.application,
            invitedPhone: phone,
            updatedAt: new Date().toISOString(),
          },
        })),

      setDelegate: (delegate) =>
        set((state) => ({
          application: {
            ...state.application,
            delegate,
            updatedAt: new Date().toISOString(),
          },
        })),

      setCardType: (cardType) =>
        set((state) => ({
          application: {
            ...state.application,
            cardType,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateApplicant: (data) =>
        set((state) => ({
          application: {
            ...state.application,
            applicant: { ...state.application.applicant, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      updateFinancial: (data) =>
        set((state) => ({
          application: {
            ...state.application,
            financial: { ...state.application.financial, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      setBankAccount: (data) =>
        set((state) => ({
          application: {
            ...state.application,
            bankAccount: data,
            updatedAt: new Date().toISOString(),
          },
        })),

      updateShipping: (data) =>
        set((state) => ({
          application: {
            ...state.application,
            shipping: { ...state.application.shipping, ...data },
            updatedAt: new Date().toISOString(),
          },
        })),

      setShippingAddress: (address) =>
        set((state) => ({
          application: {
            ...state.application,
            shipping: {
              ...state.application.shipping,
              useHomeAddress: false,
              address,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      setCreditCheckAuthorized: (authorized) =>
        set((state) => ({
          application: {
            ...state.application,
            consent: {
              ...state.application.consent,
              creditCheckAuthorized: authorized,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      setTermsAccepted: (accepted) =>
        set((state) => ({
          application: {
            ...state.application,
            consent: {
              ...state.application.consent,
              termsAccepted: accepted,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      setMembershipTermsAccepted: (accepted) =>
        set((state) => ({
          application: {
            ...state.application,
            consent: {
              ...state.application.consent,
              membershipTermsAccepted: accepted,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      submitApplication: () =>
        set((state) => ({
          application: {
            ...state.application,
            status: 'submitted',
            updatedAt: new Date().toISOString(),
          },
        })),

      approveApplication: () =>
        set((state) => ({
          application: {
            ...state.application,
            status: 'approved',
            updatedAt: new Date().toISOString(),
          },
        })),

      addInvite: (invite) =>
        set((state) => ({
          application: {
            ...state.application,
            invites: [...state.application.invites, invite],
            updatedAt: new Date().toISOString(),
          },
        })),

      setReturningUser: (returning) => set({ isReturningUser: returning }),

      showSavedToast: () => set({ savedToast: true }),

      hideSavedToast: () => set({ savedToast: false }),

      resetApplication: () =>
        set({
          currentStep: 1,
          application: { ...initialApplication, id: generateId() },
          isReturningUser: false,
        }),
    }),
    {
      name: 'atlas-onboarding',
      partialize: (state) => ({
        currentStep: state.currentStep,
        application: state.application,
      }),
    }
  )
);
