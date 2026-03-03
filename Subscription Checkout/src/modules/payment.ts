const paymentBtns = document.querySelectorAll(".payment-btn");

let selectedPaymentBtn: Element | null = paymentBtns[0] ?? null;

export function resetPaymentSelection(): void {
	if (selectedPaymentBtn) {
		selectedPaymentBtn.classList.remove("selected");
	}
	const firstBtn = paymentBtns[0];
	if (firstBtn) {
		firstBtn.classList.add("selected");
		selectedPaymentBtn = firstBtn;
	}
}

function selectPaymentButton(btn: Element): void {
	if (selectedPaymentBtn) {
		selectedPaymentBtn.classList.remove("selected");
	}
	btn.classList.add("selected");
	selectedPaymentBtn = btn;
}

export function initPaymentSelection(): void {
	paymentBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			selectPaymentButton(btn);
		});
	});
}

export function initDefaultPaymentSelection(): void {
	if (selectedPaymentBtn) {
		selectedPaymentBtn.classList.add("selected");
	}
}
