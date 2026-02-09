import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, Checkbox, ToggleGroup } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import { delay } from '@/lib/utils';
import { DELEGATE_ROLE_LABELS } from '@/types/application';

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

interface ShippingFormData {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function Step5ReviewConfirm() {
  const {
    application,
    updateShipping,
    setShippingAddress,
    setCreditCheckAuthorized,
    setTermsAccepted,
    submitApplication,
    nextStep,
    setStep,
  } = useOnboardingStore();

  const [useHomeAddress, setUseHomeAddress] = useState(application.shipping.useHomeAddress);
  const [creditAuthorized, setCreditAuthorized] = useState(application.consent.creditCheckAuthorized);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    defaultValues: {
      street: application.shipping.address?.street || '',
      unit: application.shipping.address?.unit || '',
      city: application.shipping.address?.city || '',
      state: application.shipping.address?.state || '',
      zip: application.shipping.address?.zip || '',
      country: application.shipping.address?.country || 'US',
    },
  });

  const applicant = application.applicant;
  const delegate = application.delegate;
  const homeAddress = applicant.homeAddress;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const digits = dateStr.replace(/\D/g, '');
    if (digits.length !== 8) return dateStr;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const formatAddress = (addr: typeof homeAddress) => {
    if (!addr) return '';
    const parts = [addr.street];
    if (addr.unit) parts.push(addr.unit);
    parts.push(`${addr.city}, ${addr.state} ${addr.zip}`);
    return parts.join(', ');
  };

  const onSubmit = async (shippingData: ShippingFormData) => {
    if (!creditAuthorized) {
      setError('You must authorize the credit check to continue');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (useHomeAddress) {
        updateShipping({ useHomeAddress: true });
      } else {
        setShippingAddress({
          street: shippingData.street,
          unit: shippingData.unit,
          city: shippingData.city,
          state: shippingData.state,
          zip: shippingData.zip,
          country: shippingData.country,
        });
      }

      setCreditCheckAuthorized(true);
      setTermsAccepted(true);
      submitApplication();

      // Stub: Simulate credit check processing
      await delay(3000);

      // Always approve for MVP (could check for test phone numbers to decline)
      nextStep();
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-atlas-text mb-4">
          Review your application
        </h1>
        <p className="text-lg text-atlas-text-secondary mb-12">
          Please confirm your information before we process your application.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Summary Block */}
          <section className="bg-atlas-bg-elevated rounded-xl p-6 border border-atlas-border">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-atlas-text-secondary">Name</p>
                  <p className="text-lg text-atlas-text">{applicant.firstName} {applicant.lastName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-sm text-atlas-accent hover:text-atlas-accent-hover transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-atlas-text-secondary">Name on card</p>
                  <p className="text-lg text-atlas-text font-medium">{applicant.nameOnCard}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-sm text-atlas-accent hover:text-atlas-accent-hover transition-colors"
                >
                  Edit
                </button>
              </div>

              <div>
                <p className="text-sm text-atlas-text-secondary">Date of birth</p>
                <p className="text-lg text-atlas-text">{formatDateDisplay(applicant.dateOfBirth || '')}</p>
              </div>

              <div>
                <p className="text-sm text-atlas-text-secondary">Email</p>
                <p className="text-lg text-atlas-text">{applicant.email}</p>
              </div>

              <div>
                <p className="text-sm text-atlas-text-secondary">Home address</p>
                <p className="text-lg text-atlas-text">{formatAddress(homeAddress)}</p>
              </div>

              <div>
                <p className="text-sm text-atlas-text-secondary">Card type</p>
                <p className="text-lg text-atlas-text">
                  Atlas {application.cardType === 'personal' ? 'Personal' : 'Business'}
                </p>
              </div>

              {delegate && (
                <div className="pt-4 mt-4 border-t border-atlas-border">
                  <p className="text-sm text-atlas-text-secondary">
                    Submitted by {delegate.firstName} {delegate.lastName}, {DELEGATE_ROLE_LABELS[delegate.role]}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Card Shipping */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-4">
              Where should we send your Atlas card?
            </h2>

            <div className="mb-6">
              <ToggleGroup
                options={[
                  { value: 'home', label: 'Ship to my home address' },
                  { value: 'other', label: 'Ship to a different address' },
                ]}
                value={useHomeAddress ? 'home' : 'other'}
                onChange={(v) => setUseHomeAddress(v === 'home')}
              />
            </div>

            {useHomeAddress ? (
              <div className="p-4 bg-atlas-bg-card rounded-xl border border-atlas-border">
                <p className="text-atlas-text">{formatAddress(homeAddress)}</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <Controller
                  name="street"
                  control={control}
                  rules={{ required: 'Street address is required' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Street address"
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
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="City"
                        error={errors.city?.message}
                      />
                    )}
                  />
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: 'State is required' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="State"
                        options={US_STATES}
                        placeholder="Select"
                        error={errors.state?.message}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="zip"
                  control={control}
                  rules={{ required: 'ZIP code is required' }}
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
              </div>
            )}

            <p className="mt-4 text-sm text-atlas-text-secondary">
              Cards typically arrive within 7-10 business days via secure courier.
            </p>
          </section>

          {/* Credit Check Authorization */}
          <section>
            <h2 className="text-2xl font-semibold text-atlas-text mb-4">
              One last step before we review your application.
            </h2>

            <div className="space-y-4 text-atlas-text-secondary mb-6">
              <p>
                To complete your application, we'll perform a credit check through TransUnion.
                This is a hard inquiry and may temporarily affect your credit score.
              </p>
              <p>
                If your TransUnion credit report is currently frozen, unfreeze it before submitting.
                Your application is saved automatically — you can close this page and come back anytime.
              </p>
            </div>

            <Checkbox
              checked={creditAuthorized}
              onChange={(e) => {
                setCreditAuthorized(e.target.checked);
                if (error) setError(null);
              }}
              label={
                <span>
                  I authorize Atlas Financial to perform a credit inquiry and agree to the{' '}
                  <a href="#" className="text-atlas-accent hover:underline">Privacy Policy</a>
                  {' '}and{' '}
                  <a href="#" className="text-atlas-accent hover:underline">Terms of Service</a>.
                </span>
              }
              error={error && !creditAuthorized ? error : undefined}
            />
          </section>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={submitting}
              disabled={!creditAuthorized}
            >
              {submitting ? 'Processing...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
