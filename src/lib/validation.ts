import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(
    (val) => val.replace(/\D/g, '').length >= 10,
    'Please enter a valid phone number'
  );

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const ssnSchema = z
  .string()
  .min(1, 'Social Security Number is required')
  .refine(
    (val) => val.replace(/\D/g, '').length === 9,
    'Please enter a valid 9-digit SSN'
  );

export const dateOfBirthSchema = z
  .string()
  .min(1, 'Date of birth is required')
  .refine(
    (val) => {
      const digits = val.replace(/\D/g, '');
      if (digits.length !== 8) return false;
      const month = parseInt(digits.slice(0, 2));
      const day = parseInt(digits.slice(2, 4));
      const year = parseInt(digits.slice(4, 8));
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      if (year < 1900 || year > new Date().getFullYear()) return false;
      return true;
    },
    'Please enter a valid date (MM / DD / YYYY)'
  );

export const zipSchema = z
  .string()
  .min(1, 'ZIP code is required')
  .refine(
    (val) => /^\d{5}(-\d{4})?$/.test(val),
    'Please enter a valid ZIP code'
  );

export const inviteVerificationSchema = z.object({
  isDelegate: z.boolean(),
  invitedPhone: phoneSchema,
  invitedFirstName: z.string().optional(),
  invitedLastName: z.string().optional(),
  delegatePhone: z.string().optional(),
  delegateFirstName: z.string().optional(),
  delegateLastName: z.string().optional(),
  delegateRole: z.string().optional(),
}).refine(
  (data) => {
    if (data.isDelegate) {
      return (
        data.invitedFirstName &&
        data.invitedLastName &&
        data.delegatePhone &&
        data.delegatePhone.replace(/\D/g, '').length >= 10 &&
        data.delegateFirstName &&
        data.delegateLastName &&
        data.delegateRole
      );
    }
    return true;
  },
  {
    message: 'Please complete all delegate fields',
    path: ['delegateRole'],
  }
);

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  nameOnCard: z.string().min(1, 'Name on card is required'),
  dateOfBirth: dateOfBirthSchema,
  email: emailSchema,
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: zipSchema,
  country: z.string().min(1, 'Country is required'),
});

export const financialSchema = z.object({
  annualIncome: z.string().min(1, 'Please select your annual income range'),
  netWorth: z.string().min(1, 'Please select your net worth range'),
  monthlySpend: z.string().min(1, 'Please select your estimated monthly spend'),
});

export const reviewSchema = z.object({
  useHomeAddress: z.boolean(),
  shippingAddress: addressSchema.optional(),
  creditCheckAuthorized: z.literal(true, {
    errorMap: () => ({ message: 'You must authorize the credit check to continue' }),
  }),
});
