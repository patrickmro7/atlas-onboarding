import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AtlasLogo, Button, Input, Select, ToggleGroup } from '@/components/ui';
import { useOnboardingStore } from '@/lib/store';
import { inviteVerificationSchema } from '@/lib/validation';
import { formatPhoneNumber, delay } from '@/lib/utils';
import { DELEGATE_ROLE_LABELS, type DelegateRole } from '@/types/application';

interface FormData {
  isDelegate: boolean;
  invitedPhone: string;
  invitedFirstName: string;
  invitedLastName: string;
  delegatePhone: string;
  delegateFirstName: string;
  delegateLastName: string;
  delegateRole: DelegateRole | '';
}

export function Step1InviteVerification() {
  const { setInvitedPhone, setDelegate, nextStep, updateApplicant } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showRequirements, setShowRequirements] = useState(true);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(inviteVerificationSchema),
    defaultValues: {
      isDelegate: false,
      invitedPhone: '',
      invitedFirstName: '',
      invitedLastName: '',
      delegatePhone: '',
      delegateFirstName: '',
      delegateLastName: '',
      delegateRole: '',
    },
  });

  const isDelegate = watch('isDelegate');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setApiError(null);

    try {
      // Stub: Validate phone against invite list
      // Accept any number starting with 555 or any 10+ digit number for testing
      const phoneDigits = data.invitedPhone.replace(/\D/g, '');
      const isValidInvite = phoneDigits.startsWith('555') || phoneDigits.length >= 10;

      await delay(800);

      if (!isValidInvite) {
        setApiError("We couldn't find an invitation for this number. Double-check and try again, or contact your Atlas representative.");
        setLoading(false);
        return;
      }

      setInvitedPhone(data.invitedPhone);

      if (data.isDelegate) {
        setDelegate({
          firstName: data.delegateFirstName,
          lastName: data.delegateLastName,
          phone: data.delegatePhone,
          role: data.delegateRole as DelegateRole,
        });
        updateApplicant({
          firstName: data.invitedFirstName,
          lastName: data.invitedLastName,
        });
      } else {
        setDelegate(null);
      }

      nextStep();
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = Object.entries(DELEGATE_ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-12">
          <AtlasLogo size="lg" className="mb-8" />
          <h1 className="text-3xl sm:text-4xl font-semibold text-atlas-text text-center mb-4">
            You've been invited to Atlas.
          </h1>
          <p className="text-lg text-atlas-text-secondary text-center">
            To get started, enter the phone number of the person invited to become an Atlas member.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-center mb-6">
            <Controller
              name="isDelegate"
              control={control}
              render={({ field }) => (
                <ToggleGroup
                  options={[
                    { value: 'self', label: "I'm applying for myself" },
                    { value: 'delegate', label: "I'm applying for someone else" },
                  ]}
                  value={field.value ? 'delegate' : 'self'}
                  onChange={(value) => field.onChange(value === 'delegate')}
                />
              )}
            />
          </div>

          <div className="space-y-6">
            <Controller
              name="invitedPhone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={isDelegate ? "Invited member's phone number" : "Phone number"}
                  type="tel"
                  inputMode="numeric"
                  value={formatPhoneNumber(field.value)}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={errors.invitedPhone?.message}
                  helperText={isDelegate ? "Enter the phone number associated with their Atlas invitation" : undefined}
                />
              )}
            />

            {isDelegate && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="invitedFirstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Their first name"
                        error={errors.invitedFirstName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="invitedLastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Their last name"
                        error={errors.invitedLastName?.message}
                      />
                    )}
                  />
                </div>

                <div className="border-t border-atlas-border pt-6 mt-6">
                  <p className="text-sm text-atlas-text-secondary mb-4">Your information</p>
                </div>

                <Controller
                  name="delegatePhone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Your phone number"
                      type="tel"
                      inputMode="numeric"
                      value={formatPhoneNumber(field.value)}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      error={errors.delegatePhone?.message}
                      helperText="We'll send a verification code here"
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="delegateFirstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Your first name"
                        error={errors.delegateFirstName?.message}
                      />
                    )}
                  />
                  <Controller
                    name="delegateLastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Your last name"
                        error={errors.delegateLastName?.message}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="delegateRole"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Your role"
                      options={roleOptions}
                      placeholder="Select your role"
                      error={errors.delegateRole?.message}
                    />
                  )}
                />
              </div>
            )}

            {apiError && (
              <p className="text-atlas-error text-sm animate-fade-in">{apiError}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Continue
          </Button>
        </form>

        {/* Requirements section */}
        <div className="mt-12 pt-8 border-t border-atlas-border">
          <button
            type="button"
            onClick={() => setShowRequirements(!showRequirements)}
            className="flex items-center gap-2 text-atlas-text-secondary hover:text-atlas-text transition-colors w-full"
          >
            <svg
              className={`w-5 h-5 transition-transform ${showRequirements ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-sm font-medium">What you'll need</span>
          </button>

          {showRequirements && (
            <div className="mt-4 space-y-4 text-sm text-atlas-text-secondary animate-fade-in">
              <div>
                <p className="text-atlas-text font-medium mb-1">1. Primary applicant details</p>
                <p>Full legal name, date of birth, SSN or ITIN, email, and home address for the person who will be the Atlas member.</p>
              </div>
              <div>
                <p className="text-atlas-text font-medium mb-1">2. Financial information</p>
                <p>Annual income, total net worth, and estimated monthly card spend.</p>
              </div>
              <div>
                <p className="text-atlas-text font-medium mb-1">3. Unfrozen credit report</p>
                <p>We perform a hard credit check through TransUnion. If your report is frozen, please unfreeze it before submitting.</p>
              </div>
              <div>
                <p className="text-atlas-text font-medium mb-1">4. Bank account</p>
                <p>Your primary bank account for payments and credit line sizing.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
