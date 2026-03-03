import { PLAN, type PlanType, type PricesType } from "../types";

const prices: PricesType = {
	[PLAN.MONTHLY]: {
		price: "$20/ Month/ Member",
		total: "$20 / Month",
	},
	[PLAN.ANNUAL]: {
		price: "$16/ Month/ Member",
		total: "$16 / Month",
	},
};

export function updatePrices(plan: PlanType): void {
	const planPrice = document.querySelector(".plan-price");
	const totalPrice = document.querySelector(".total-price");
	if (planPrice) planPrice.textContent = prices[plan].price;
	if (totalPrice) totalPrice.textContent = prices[plan].total;
}

export function initPlanToggle(): void {
	const planRadios = document.querySelectorAll('input[name="plan"]');

	planRadios.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			const target = e.target as HTMLInputElement;
			const plan = target.value as PlanType;
			if (plan === PLAN.MONTHLY || plan === PLAN.ANNUAL) {
				updatePrices(plan);
			}
		});
	});
}

export function resetPlanSelection(): void {
	const monthlyRadio = document.querySelector(
		`input[name="plan"][value="${PLAN.MONTHLY}"]`,
	) as HTMLInputElement | null;
	if (monthlyRadio) {
		monthlyRadio.checked = true;
	}
	updatePrices(PLAN.MONTHLY);
}

export { PLAN };
