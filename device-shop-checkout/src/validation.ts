import { z } from "zod";
import { countryOptions, couponConfig, type CheckoutFormValues } from "./data";

// ── Schemas ────────────────────────────────────────────────────────────────

const countryCodes = countryOptions.map((c) => c.code);

export const checkoutFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email address"),
  country: z.string().refine((val) => countryCodes.includes(val), {
    message: "Select a valid country",
  }),
  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required")
    .min(3, "Postal code must be at least 3 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Enter a valid postal code"),
});

export const couponSchema = z.string().trim().min(1, "Coupon code is required");

// ── Helpers ────────────────────────────────────────────────────────────────

export function normalizeCouponCode(value: string): string {
  return value.trim().toUpperCase();
}

// ── Validators ─────────────────────────────────────────────────────────────

export type FormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export function validateCheckoutForm(values: CheckoutFormValues): FormErrors {
  const result = checkoutFormSchema.safeParse(values);
  if (result.success) return {};

  const errors: FormErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof CheckoutFormValues;
    if (field && !(field in errors)) {
      errors[field] = issue.message;
    }
  }
  return errors;
}

export function validateCheckoutField(
  field: keyof CheckoutFormValues,
  values: CheckoutFormValues,
): string | undefined {
  const result = checkoutFormSchema.safeParse(values);
  if (result.success) return undefined;

  for (const issue of result.error.issues) {
    if (issue.path[0] === field) {
      return issue.message;
    }
  }
  return undefined;
}

export function validateCouponCode(value: string): string | undefined {
  const parsed = couponSchema.safeParse(value);
  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  if (normalizeCouponCode(parsed.data) !== couponConfig.code.toUpperCase()) {
    return "Invalid coupon code";
  }

  return undefined;
}
