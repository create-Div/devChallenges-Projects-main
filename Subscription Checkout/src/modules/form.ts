import { resetPaymentSelection } from "./payment";
import { resetPlanSelection } from "./plan";
import { clearErrors, validateForm } from "./validation";

const form = document.getElementById("checkout-form") as HTMLFormElement | null;

function handleFormSubmit(e: Event): void {
	e.preventDefault();
	if (!form) return;

	const formData = new FormData(form);
	const data = Object.fromEntries(formData);

	if (validateForm(data)) {
		console.log("Form submitted:", data);
		alert("Subscription successful!");
	}
}

function handleCancelClick(): void {
	form?.reset();
	clearErrors();
	resetPlanSelection();
	resetPaymentSelection();
}

export function initFormHandlers(): void {
	form?.addEventListener("submit", handleFormSubmit);

	const cancelBtn = document.querySelector(".btn-cancel");
	cancelBtn?.addEventListener("click", handleCancelClick);
}
