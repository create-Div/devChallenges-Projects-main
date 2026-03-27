import { couponConfig } from "./data";
import {
  syncAll,
  syncBadge,
  syncCouponFeedback,
  syncForm,
  syncSubmissionFeedback,
  syncTotals,
  renderCartItems,
} from "./render";
import {
  clearFieldError,
  createInitialState,
  removeCartItem,
  setCouponCode,
  setCouponResult,
  setFieldTouched,
  setFormErrors,
  setFormValue,
  setSubmissionResult,
  type AppState,
  type FormFieldName,
} from "./state";
import {
  normalizeCouponCode,
  validateCheckoutField,
  validateCheckoutForm,
  validateCouponCode,
} from "./validation";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let state: AppState = createInitialState();

const FIELD_NAMES: FormFieldName[] = ["name", "email", "country", "postalCode"];

// ---------------------------------------------------------------------------
// Validation sync
// ---------------------------------------------------------------------------

function syncFieldValidation(fieldName: FormFieldName, value: string): void {
  const values = { ...state.form.values, [fieldName]: value };
  const error = validateCheckoutField(fieldName, values);
  state = setFormValue(state, fieldName, value);
  if (error) {
    state = setFormErrors(state, { ...state.form.errors, [fieldName]: error });
  } else {
    state = clearFieldError(state, fieldName);
  }
}

function inputNameToFormField(name: string): FormFieldName | undefined {
  return FIELD_NAMES.includes(name as FormFieldName) ? (name as FormFieldName) : undefined;
}

// ---------------------------------------------------------------------------
// Listeners
// ---------------------------------------------------------------------------

function attachListeners(): void {
  // Remove-item buttons (delegated)
  document.querySelector(".cart-items")?.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest("[data-remove-id]");
    if (!button) return;
    const itemId = button.getAttribute("data-remove-id");
    if (!itemId) return;
    state = removeCartItem(state, itemId);
    syncBadge(state);
    renderCartItems(state);
    syncTotals(state);
  });

  // Coupon form
  const couponForm = document.querySelector<HTMLFormElement>(".coupon-form");
  couponForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const couponInput = couponForm.querySelector<HTMLInputElement>("[name='couponCode']");
    if (!couponInput) return;

    const rawCode = couponInput.value;
    const normalizedCode = normalizeCouponCode(rawCode);
    const error = validateCouponCode(rawCode);

    if (error) {
      state = setCouponCode(state, rawCode);
      state = setCouponResult(state, { status: "error", message: error, appliedCode: null });
    } else {
      state = setCouponCode(state, normalizedCode);
      state = setCouponResult(state, {
        status: "success",
        message: couponConfig.successMessage,
        appliedCode: couponConfig.code,
      });
    }
    syncCouponFeedback(state.coupon);
    syncTotals(state);
  });

  const couponInput = couponForm?.querySelector<HTMLInputElement>("[name='couponCode']");
  couponInput?.addEventListener("input", () => {
    state = setCouponCode(state, couponInput.value);
    if (state.coupon.status !== "idle") {
      state = setCouponResult(state, {
        status: "idle",
        message: null,
        appliedCode: state.coupon.appliedCode,
      });
      syncCouponFeedback(state.coupon);
    }
  });

  // Checkout form
  const checkoutForm = document.querySelector<HTMLFormElement>(".checkout-form");
  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const errors = validateCheckoutForm(state.form.values);
    const hasErrors = Object.keys(errors).length > 0;
    const touchedFields = Object.fromEntries(
      FIELD_NAMES.map((fieldName) => [fieldName, true]),
    ) as Partial<Record<FormFieldName, boolean>>;

    state = { ...state, form: { ...state.form, touched: touchedFields } };
    state = setFormErrors(state, errors);
    state = setSubmissionResult(
      state,
      hasErrors
        ? { status: "idle", message: null }
        : { status: "success", message: "Order placed successfully!" },
    );
    syncForm(state.form);
    syncSubmissionFeedback(state.submission);

    if (hasErrors) {
      const firstInvalidField = FIELD_NAMES.find((fieldName) => errors[fieldName]);
      if (firstInvalidField) document.getElementById(firstInvalidField)?.focus();
    }
  });

  // Input / select listeners
  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>(".checkout-form .input-field")
    .forEach((input) => {
      const fieldName = inputNameToFormField(input.name);
      if (!fieldName) return;

      input.addEventListener("blur", () => {
        state = setFieldTouched(state, fieldName);
        state = setSubmissionResult(state, { status: "idle", message: null });
        syncFieldValidation(fieldName, input.value);
        syncForm(state.form);
        syncSubmissionFeedback(state.submission);
      });

      const liveEvent = input instanceof HTMLSelectElement ? "change" : "input";
      input.addEventListener(liveEvent, () => {
        state = setFormValue(state, fieldName, input.value);
        state = setSubmissionResult(state, { status: "idle", message: null });

        if (fieldName === "country") {
          if (state.form.touched.postalCode) {
            syncFieldValidation("postalCode", state.form.values.postalCode);
          }
          syncForm(state.form);
          return;
        }

        if (!state.form.touched[fieldName]) return;
        syncFieldValidation(fieldName, input.value);
        syncForm(state.form);
      });
    });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

syncAll(state);
attachListeners();
