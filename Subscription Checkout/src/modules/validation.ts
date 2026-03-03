import {
	checkoutSchema,
	formFields,
	type FormDataType,
	type FormFieldType,
} from "../types";

function isFormField(value: string): value is FormFieldType {
	return formFields.includes(value as FormFieldType);
}

export function clearErrors(): void {
	formFields.forEach((field) => {
		const errorEl = document.getElementById(`${field}-error`);
		const inputEl = document.getElementById(field);
		if (errorEl) errorEl.textContent = "";
		if (inputEl) inputEl.classList.remove("input-error");
	});
}

export function showError(field: FormFieldType, message: string): void {
	const errorEl = document.getElementById(`${field}-error`);
	const inputEl = document.getElementById(field);
	if (errorEl) errorEl.textContent = message;
	if (inputEl) inputEl.classList.add("input-error");
}

export function validateForm(
	data: Record<string, unknown>,
): data is FormDataType {
	clearErrors();

	const result = checkoutSchema.safeParse(data);

	if (result.success) {
		return true;
	}

	result.error.issues.forEach((issue) => {
		const fieldPath = issue.path[0];
		if (typeof fieldPath === "string" && isFormField(fieldPath)) {
			showError(fieldPath, issue.message);
		}
	});

	return false;
}

export function initValidationErrorClearing(): void {
	formFields.forEach((field) => {
		const inputEl = document.getElementById(field);
		inputEl?.addEventListener("input", () => {
			const errorEl = document.getElementById(`${field}-error`);
			if (errorEl) errorEl.textContent = "";
			inputEl.classList.remove("input-error");
		});
	});
}
