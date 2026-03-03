import { z } from "zod";

export const checkoutSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.min(2, "Name must be at least 2 characters"),
	email: z
		.string()
		.min(1, "Email is required")
		.check(z.email("Please enter a valid email")),
	country: z.preprocess(
		(value) => (typeof value === "string" ? value : ""),
		z.string().min(1, "Please select a country"),
	),
	"postal-code": z
		.string()
		.min(1, "Postal code is required")
		.min(3, "Postal code must be at least 3 characters"),
});

export type FormDataType = z.infer<typeof checkoutSchema>;

export const formFields = ["name", "email", "country", "postal-code"] as const;
export type FormFieldType = (typeof formFields)[number];

export const PLAN = {
	MONTHLY: "monthly",
	ANNUAL: "annual",
} as const;

export type PlanType = (typeof PLAN)[keyof typeof PLAN];

export interface CountryType {
	name: {
		common: string;
	};
	cca2: string;
}

export interface PlanPriceType {
	price: string;
	total: string;
}

export type PricesType = Record<PlanType, PlanPriceType>;
