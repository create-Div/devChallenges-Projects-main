import {
  demoCartItems,
  defaultFormValues,
  couponConfig,
  taxRate,
  type CartItem,
  type CheckoutFormValues,
} from "./data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormFieldName = keyof CheckoutFormValues;
export type CouponStatus = "idle" | "success" | "error";
export type SubmissionStatus = "idle" | "success";
export type FormErrors = Partial<Record<FormFieldName, string>>;

export interface PricingSummary {
  readonly itemCount: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
}

export interface AppState {
  readonly cart: ReadonlyArray<CartItem>;
  readonly form: {
    readonly values: CheckoutFormValues;
    readonly touched: Partial<Record<FormFieldName, boolean>>;
    readonly errors: FormErrors;
  };
  readonly coupon: {
    readonly code: string;
    readonly appliedCode: string | null;
    readonly status: CouponStatus;
    readonly message: string | null;
  };
  readonly submission: {
    readonly status: SubmissionStatus;
    readonly message: string | null;
  };
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export function createInitialState(): AppState {
  return {
    cart: [...demoCartItems],
    form: {
      values: { ...defaultFormValues },
      touched: {},
      errors: {},
    },
    coupon: {
      code: "",
      appliedCode: null,
      status: "idle",
      message: null,
    },
    submission: {
      status: "idle",
      message: null,
    },
  };
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export function getPricingSummary(state: AppState): PricingSummary {
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;

  const discount =
    state.coupon.appliedCode === couponConfig.code ? subtotal * couponConfig.discountRate : 0;

  const total = Math.max(0, subtotal + tax - discount);

  return { itemCount, subtotal, tax, discount, total };
}

// ---------------------------------------------------------------------------
// Cart helpers
// ---------------------------------------------------------------------------

export function removeCartItem(state: AppState, itemId: string): AppState {
  return {
    ...state,
    cart: state.cart.filter((item) => item.id !== itemId),
  };
}

// ---------------------------------------------------------------------------
// Form helpers
// ---------------------------------------------------------------------------

export function setFormValue(state: AppState, field: FormFieldName, value: string): AppState {
  return {
    ...state,
    form: {
      ...state.form,
      values: { ...state.form.values, [field]: value },
    },
  };
}

export function setFieldTouched(state: AppState, field: FormFieldName, touched = true): AppState {
  return {
    ...state,
    form: {
      ...state.form,
      touched: { ...state.form.touched, [field]: touched },
    },
  };
}

export function setFormErrors(state: AppState, errors: FormErrors): AppState {
  return {
    ...state,
    form: { ...state.form, errors },
  };
}

export function clearFieldError(state: AppState, field: FormFieldName): AppState {
  if (!(field in state.form.errors)) return state;

  const { [field]: _, ...rest } = state.form.errors;
  return {
    ...state,
    form: { ...state.form, errors: rest },
  };
}

// ---------------------------------------------------------------------------
// Coupon helpers
// ---------------------------------------------------------------------------

export function setCouponCode(state: AppState, code: string): AppState {
  return {
    ...state,
    coupon: { ...state.coupon, code },
  };
}

export function setCouponResult(
  state: AppState,
  result: {
    readonly status: CouponStatus;
    readonly message: string | null;
    readonly appliedCode: string | null;
  },
): AppState {
  return {
    ...state,
    coupon: {
      ...state.coupon,
      status: result.status,
      message: result.message,
      appliedCode: result.appliedCode,
    },
  };
}

// ---------------------------------------------------------------------------
// Submission helpers
// ---------------------------------------------------------------------------

export function setSubmissionResult(
  state: AppState,
  result: { readonly status: SubmissionStatus; readonly message: string | null },
): AppState {
  return {
    ...state,
    submission: { ...state.submission, ...result },
  };
}
