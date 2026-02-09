export type DelegateRole =
  | 'executive_assistant'
  | 'personal_assistant'
  | 'wealth_manager'
  | 'business_manager'
  | 'family_office'
  | 'accountant'
  | 'attorney'
  | 'other';

export type CardType = 'personal' | 'business';

export type ApplicationStatus = 'draft' | 'submitted' | 'approved' | 'declined';

export type IncomeRange = '250k_500k' | '500k_1m' | '1m_5m' | '5m_10m' | '10m_plus';

export type NetWorthRange = '1m_5m' | '5m_10m' | '10m_50m' | '50m_100m' | '100m_plus';

export type MonthlySpendRange = '10k_25k' | '25k_50k' | '50k_100k' | '100k_250k' | '250k_plus';

export type InviteType = 'assistant' | 'spouse' | 'kids' | 'family_office' | 'other';

export interface Address {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Delegate {
  firstName: string;
  lastName: string;
  phone: string;
  role: DelegateRole;
}

export interface Applicant {
  firstName: string;
  lastName: string;
  nameOnCard: string;
  dateOfBirth: string;
  email: string;
  homeAddress: Address;
  ssn: string;
}

export interface Financial {
  annualIncome: IncomeRange | '';
  netWorth: NetWorthRange | '';
  monthlySpend: MonthlySpendRange | '';
}

export interface BankAccount {
  connected: boolean;
  institutionName?: string;
  accountMask?: string;
  plaidToken?: string;
}

export interface Shipping {
  useHomeAddress: boolean;
  address?: Address;
}

export interface Consent {
  creditCheckAuthorized: boolean;
  termsAccepted: boolean;
  membershipTermsAccepted: boolean;
}

export interface Invite {
  type: InviteType;
  firstName: string;
  lastName: string;
  contact: string;
  role?: string;
}

export interface AtlasApplication {
  id: string;
  invitedPhone: string;
  cardType: CardType | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  delegate: Delegate | null;
  applicant: Partial<Applicant>;
  financial: Financial;
  bankAccount: BankAccount;
  shipping: Shipping;
  consent: Consent;
  invites: Invite[];
}

export const DELEGATE_ROLE_LABELS: Record<DelegateRole, string> = {
  executive_assistant: 'Executive Assistant',
  personal_assistant: 'Personal Assistant',
  wealth_manager: 'Wealth Manager',
  business_manager: 'Business Manager',
  family_office: 'Family Office',
  accountant: 'Accountant',
  attorney: 'Attorney',
  other: 'Other',
};

export const INCOME_RANGE_LABELS: Record<IncomeRange, string> = {
  '250k_500k': '$250K - $500K',
  '500k_1m': '$500K - $1M',
  '1m_5m': '$1M - $5M',
  '5m_10m': '$5M - $10M',
  '10m_plus': '$10M+',
};

export const NET_WORTH_LABELS: Record<NetWorthRange, string> = {
  '1m_5m': '$1M - $5M',
  '5m_10m': '$5M - $10M',
  '10m_50m': '$10M - $50M',
  '50m_100m': '$50M - $100M',
  '100m_plus': '$100M+',
};

export const MONTHLY_SPEND_LABELS: Record<MonthlySpendRange, string> = {
  '10k_25k': '$10K - $25K',
  '25k_50k': '$25K - $50K',
  '50k_100k': '$50K - $100K',
  '100k_250k': '$100K - $250K',
  '250k_plus': '$250K+',
};
