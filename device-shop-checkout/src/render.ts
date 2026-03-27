import { countryOptions } from "./data";
import { formatCurrency, formatDiscountLabel, formatItemCount, formatQuantity } from "./format";
import type { AppState } from "./state";
import { getPricingSummary } from "./state";

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

function cloneTemplate(id: string): DocumentFragment {
  const tpl = document.getElementById(id) as HTMLTemplateElement | null;
  if (!tpl) throw new Error(`Template '#${id}' not found.`);
  return tpl.content.cloneNode(true) as DocumentFragment;
}

// ---------------------------------------------------------------------------
// Render: cart items
// ---------------------------------------------------------------------------

export function renderCartItems(state: AppState): void {
  const container = document.querySelector(".cart-items");
  if (!container) return;

  container.replaceChildren();

  for (const item of state.cart) {
    const frag = cloneTemplate(`tpl-${item.id}`);
    const img = frag.querySelector(".product-image-frame img") as HTMLImageElement;
    img.alt = item.description;
    (frag.querySelector("[data-field='name']") as HTMLElement).textContent = item.name;
    (frag.querySelector("[data-field='variant']") as HTMLElement).textContent = item.variant;
    (frag.querySelector("[data-field='price']") as HTMLElement).textContent = formatCurrency(
      item.price,
    );
    (frag.querySelector("[data-field='quantity']") as HTMLElement).textContent = formatQuantity(
      item.quantity,
    );
    const btn = frag.querySelector(".remove-btn") as HTMLButtonElement;
    btn.dataset.removeId = item.id;
    btn.setAttribute("aria-label", `Remove ${item.name}`);
    container.appendChild(frag);
  }

  const emptyMsg = document.querySelector(".cart-empty") as HTMLElement | null;
  if (emptyMsg) {
    emptyMsg.hidden = state.cart.length > 0;
  }
}

// ---------------------------------------------------------------------------
// Render: country options
// ---------------------------------------------------------------------------

export function renderCountryOptions(selectedCode: string): void {
  const select = document.getElementById("country") as HTMLSelectElement | null;
  if (!select) return;

  select.replaceChildren();

  for (const opt of countryOptions) {
    const optionEl = document.createElement("option");
    optionEl.value = opt.code;
    optionEl.textContent = opt.name;
    if (selectedCode === opt.code) optionEl.selected = true;
    select.appendChild(optionEl);
  }
}

// ---------------------------------------------------------------------------
// Sync: badge
// ---------------------------------------------------------------------------

export function syncBadge(state: AppState): void {
  const { itemCount } = getPricingSummary(state);
  const label = formatItemCount(itemCount);
  const badge = document.querySelector(".badge");
  if (!badge) return;
  badge.textContent = label;
  badge.setAttribute("aria-label", label);
}

// ---------------------------------------------------------------------------
// Sync: totals
// ---------------------------------------------------------------------------

export function syncTotals(state: AppState): void {
  const pricing = getPricingSummary(state);
  const set = (sel: string, text: string): void => {
    const el = document.querySelector(sel);
    if (el) el.textContent = text;
  };

  set("[data-field='subtotal']", formatCurrency(pricing.subtotal));
  set("[data-field='tax']", formatCurrency(pricing.tax));
  set("[data-field='discount-label']", formatDiscountLabel(state.coupon.appliedCode));

  const discountText =
    pricing.discount > 0
      ? `-${formatCurrency(pricing.discount)}`
      : formatCurrency(pricing.discount);
  set("[data-field='discount']", discountText);
  set("[data-field='total']", formatCurrency(pricing.total));
}

// ---------------------------------------------------------------------------
// Sync: coupon feedback
// ---------------------------------------------------------------------------

export function syncCouponFeedback(coupon: AppState["coupon"]): void {
  const feedbackEl = document.querySelector<HTMLElement>(".coupon-feedback");
  if (!feedbackEl) return;

  feedbackEl.classList.remove("is-success", "is-error");
  if (coupon.status === "success") feedbackEl.classList.add("is-success");
  else if (coupon.status === "error") feedbackEl.classList.add("is-error");
  feedbackEl.textContent = coupon.message ?? "";
  feedbackEl.hidden = !coupon.message;
}

// ---------------------------------------------------------------------------
// Sync: form fields, errors, postal placeholder
// ---------------------------------------------------------------------------

export function syncForm(form: AppState["form"]): void {
  const v = form.values;
  const e = form.errors;

  const nameInput = document.getElementById("name") as HTMLInputElement | null;
  if (nameInput) nameInput.value = v.name;

  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  if (emailInput) emailInput.value = v.email;

  renderCountryOptions(v.country);

  const postalInput = document.getElementById("postalCode") as HTMLInputElement | null;
  if (postalInput) {
    postalInput.value = v.postalCode;
    const selectedCountry = countryOptions.find((c) => c.code === v.country);
    postalInput.placeholder = selectedCountry?.postalCodePlaceholder ?? "00000";
  }

  document
    .querySelectorAll<HTMLInputElement | HTMLSelectElement>(".checkout-form .input-field")
    .forEach((input) => {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    });

  document.querySelectorAll<HTMLElement>(".checkout-form .field-message").forEach((messageEl) => {
    messageEl.textContent = "";
    messageEl.hidden = true;
  });

  // Apply current errors
  for (const [fieldId, message] of Object.entries(e)) {
    if (!message) continue;
    const input = document.getElementById(fieldId);
    if (!input) continue;
    input.setAttribute("aria-describedby", `${fieldId}-error`);
    input.setAttribute("aria-invalid", "true");
    const messageEl = document.getElementById(`${fieldId}-error`);
    if (!(messageEl instanceof HTMLElement)) continue;
    messageEl.textContent = message;
    messageEl.hidden = false;
  }
}

// ---------------------------------------------------------------------------
// Sync: submission feedback
// ---------------------------------------------------------------------------

export function syncSubmissionFeedback(submission: AppState["submission"]): void {
  const el = document.querySelector<HTMLElement>(".checkout-feedback");
  if (!el) return;

  el.textContent = submission.message ?? "";
  el.hidden = !submission.message;
}

// ---------------------------------------------------------------------------
// Sync: all
// ---------------------------------------------------------------------------

export function syncAll(state: AppState): void {
  syncBadge(state);
  renderCartItems(state);
  syncTotals(state);
  syncCouponFeedback(state.coupon);
  syncForm(state.form);
  syncSubmissionFeedback(state.submission);
}
