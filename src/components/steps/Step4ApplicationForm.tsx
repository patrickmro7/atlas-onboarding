import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, RangeSelector } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import {
  personalInfoSchema,
  addressSchema,
  ssnSchema,
  financialSchema,
} from '@/lib/validation';
import { formatPhoneNumber, formatSSN, formatDate, maskSSN, delay } from '@/lib/utils';
import {
  INCOME_RANGE_LABELS,
  NET_WORTH_LABELS,
  MONTHLY_SPEND_LABELS,
  DELEGATE_ROLE_LABELS,
  type IncomeRange,
  type NetWorthRange,
  type MonthlySpendRange,
} from '@/types/application';

const applicationFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
  ssn: ssnSchema,
  ...financialSchema.shape,
});

type FormData = z.infer<typeof applicationFormSchema>;

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'OTHER', label: 'Other' },
];

export function Step4ApplicationForm() {
  const {
    application,
    updateApplicant,
    updateFinancial,
    setBankAccount,
    nextStep,
    showSavedToast,
  } = useOnboardingStore();

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: application.applicant.firstName || '',
      lastName: application.applicant.lastName || '',
      nameOnCard: application.applicant.nameOnCard || '',
      dateOfBirth: application.applicant.dateOfBirth || '',
      email: application.applicant.email || '',
      street: application.applicant.homeAddress?.street || '',
      unit: application.applicant.homeAddress?.unit || '',
      city: application.applicant.homeAddress?.city || '',
      state: application.applicant.homeAddress?.state || '',
      zip: application.applicant.homeAddress?.zip || '',
      country: application.applicant.homeAddress?.country || 'US',
      ssn: application.applicant.ssn || '',
      annualIncome: application.financial.annualIncome || '',
      netWorth: application.financial.netWorth || '',
      monthlySpend: application.financial.monthlySpend || '',
    },
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');

  // Auto-populate name on card
  useEffect(() => {
    if (firstName && lastName) {
      const currentNameOnCard = watch('nameOnCard');
      if (!currentNameOnCard || currentNameOnCard === `${application.applicant.firstName} ${application.applicant.lastName}`.toUpperCase()) {
        setValue('nameOnCard', `${firstName} ${lastName}`.toUpperCase());
      }
    }
  }, [firstName, lastName, setValue, watch, application.applicant.firstName, application.applicant.lastName]);

  // Auto-save with debounce
  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      showSavedToast();
    }, 2000);
  }, [showSavedToast]);

  // Watch all form values for auto-save
  const formValues = watch();
  useEffect(() => {
    autoSave();
  }, [formValues, autoSave]);

  const [connectingBank, setConnectingBank] = useState(false);
  const [bankConnected, setBankConnectedState] = useState(application.bankAccount.connected);

  const handleConnectBank = async () => {
    setConnectingBank(true);
    // Stub: Simulate Plaid connection
    await delay(2000);
    setBankAccount({
      connected: true,
      institutionName: 'Chase',
      accountMask: '4829',
    });
    setBankConnectedState(true);
    setConnectingBank(false);
  };

  const onSubmit = (data: FormData) => {
    updateApplicant({
      firstName: data.firstName,
      lastName: data.lastName,
      nameOnCard: data.nameOnCard,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      homeAddress: {
        street: data.street,
        unit: data.unit,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
      ssn: data.ssn,
    });

    updateFinancial({
      annualIncome: data.annualIncome as IncomeRange,
      netWorth: data.netWorth as NetWorthRange,
      monthlySpend: data.monthlySpend as MonthlySpendRange,
    });

    nextStep();
  };

  const delegate = application.delegate;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {/* Delegate Info Block */}
          {delegate && (
            <div className="bg-atlas-bg-elevated rounded-xl p-6 border border-atlas-border">
              <p className="text-atlas-text">
                You're completing this application on behalf of{' '}
                <span className="font-semibold">
                  {application.applicant.firstName} {application.applicant.lastName}
                </span>
              </p>
              <p className="text-atlas-text-secondary mt-1">
                Logged in as{' '}
                <span className="font-medium text-atlas-text">
                  {delegate.firstName} {delegate.lastName}
                </span>
                , {DELEGATE_ROLE_LABELS[delegate.role]}
              </p>
            </div>
          )}

          {/* Section: Personal Information */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-8">Personal Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="First name"
                      error={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Last name"
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="nameOnCard"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Preferred name on card"
                    helperText="This is how your name will appear on your Atlas card."
                    error={errors.nameOnCard?.message}
                  />
                )}
              />

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Date of birth"
                    inputMode="numeric"
                    placeholder="MM / DD / YYYY"
                    value={formatDate(field.value)}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    error={errors.dateOfBirth?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Email address"
                    type="email"
                    inputMode="email"
                    helperText="We'll send your membership confirmation and account access here."
                    error={errors.email?.message}
                  />
                )}
              />
            </div>
          </section>

          {/* Section: Home Address */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-8">Home Address</h2>
            <div className="space-y-6">
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Street address"
                    autoComplete="street-address"
                    error={errors.street?.message}
                  />
                )}
              />

              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Apt / Suite / Unit (optional)"
                    autoComplete="address-line2"
                    error={errors.unit?.message}
                  />
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="City"
                      autoComplete="address-level2"
                      error={errors.city?.message}
                    />
                  )}
                />
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="State"
                      options={US_STATES}
                      placeholder="Select state"
                      error={errors.state?.message}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="zip"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="ZIP code"
                      inputMode="numeric"
                      maxLength={5}
                      error={errors.zip?.message}
                    />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Country"
                      options={COUNTRIES}
                      error={errors.country?.message}
                    />
                  )}
                />
              </div>
            </div>
          </section>

          {/* Section: Identity Verification */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-8">Identity Verification</h2>
            <Controller
              name="ssn"
              control={control}
              render={({ field }) => {
                const digits = field.value.replace(/\D/g, '');
                const displayValue = digits.length === 9 ? maskSSN(digits) : formatSSN(field.value);

                return (
                  <Input
                    {...field}
                    label="Social Security Number or ITIN"
                    inputMode="numeric"
                    value={displayValue}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    helperText="Your SSN is encrypted and transmitted securely. We use it solely for identity verification and credit evaluation."
                    error={errors.ssn?.message}
                  />
                );
              }}
            />
          </section>

          {/* Section: Financial Profile */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-8">Financial Profile</h2>
            <div className="space-y-8">
              <Controller
                name="annualIncome"
                control={control}
                render={({ field }) => (
                  <RangeSelector
                    label="Total annual income"
                    options={Object.entries(INCOME_RANGE_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.annualIncome?.message}
                  />
                )}
              />

              <Controller
                name="netWorth"
                control={control}
                render={({ field }) => (
                  <RangeSelector
                    label="Total net worth"
                    options={Object.entries(NET_WORTH_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.netWorth?.message}
                  />
                )}
              />

              <Controller
                name="monthlySpend"
                control={control}
                render={({ field }) => (
                  <RangeSelector
                    label="Estimated monthly credit card spend"
                    options={Object.entries(MONTHLY_SPEND_LABELS).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.monthlySpend?.message}
                  />
                )}
              />
            </div>
          </section>

          {/* Section: Bank Account */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-4">Bank Account</h2>
            <p className="text-atlas-text-secondary mb-2">
              This is the account you'll pay your Atlas balance from and helps us size your credit line.
              You can update this anytime.
            </p>
            <p className="text-sm text-atlas-text-tertiary mb-8">
              We also accept payments via wire transfer or cryptocurrency.
            </p>

            {bankConnected ? (
              <div className="flex items-center gap-4 p-4 bg-atlas-bg-elevated rounded-xl border border-atlas-border">
                <div className="w-12 h-12 rounded-lg bg-atlas-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-atlas-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-atlas-text font-medium">
                    {application.bankAccount.institutionName} Checking ****{application.bankAccount.accountMask}
                  </p>
                  <p className="text-sm text-atlas-text-secondary">Connected successfully</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBankAccount({ connected: false });
                    setBankConnectedState(false);
                  }}
                  className="ml-auto text-sm text-atlas-text-secondary hover:text-atlas-text transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  loading={connectingBank}
                  onClick={handleConnectBank}
                >
                  {connectingBank ? 'Connecting...' : 'Connect with Plaid'}
                </Button>
                <button
                  type="button"
                  className="text-sm text-atlas-text-secondary hover:text-atlas-text transition-colors"
                  onClick={handleConnectBank}
                >
                  Prefer to connect manually?
                </button>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-8">
            <Button type="submit" size="lg" className="w-full">
              Continue to Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

