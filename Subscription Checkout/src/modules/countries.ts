import ky from "ky";
import type { CountryType } from "../types";

let countriesLoaded = false;
let countriesLoading = false;

async function fetchCountries(): Promise<CountryType[]> {
	try {
		const countries = await ky
			.get("https://restcountries.com/v3.1/all", {
				searchParams: {
					fields: "name,cca2",
				},
			})
			.json<CountryType[]>();
		return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
	} catch (error) {
		console.error("Failed to fetch countries:", error);
		return [];
	}
}

export async function populateCountries(
	countrySelect: HTMLSelectElement | null,
): Promise<void> {
	if (!countrySelect || countriesLoaded || countriesLoading) return;
	countriesLoading = true;

	const defaultOption = countrySelect.querySelector('option[value=""]');
	if (defaultOption) {
		defaultOption.textContent = "Loading countries...";
	}

	try {
		const countries = await fetchCountries();
		if (countries.length === 0) {
			if (defaultOption) {
				defaultOption.textContent = "Select country";
			}
			return;
		}

		const fragment = document.createDocumentFragment();

		const placeholderOption = document.createElement("option");
		placeholderOption.value = "";
		placeholderOption.textContent = "Select country";
		fragment.appendChild(placeholderOption);

		for (const country of countries) {
			const option = document.createElement("option");
			option.value = country.cca2;
			option.textContent = country.name.common;
			fragment.appendChild(option);
		}

		countrySelect.innerHTML = "";
		countrySelect.appendChild(fragment);
		countriesLoaded = true;
	} finally {
		countriesLoading = false;
	}
}

export function initCountriesLazyLoading(): void {
	const countrySelect = document.getElementById(
		"country",
	) as HTMLSelectElement | null;
	countrySelect?.addEventListener("focus", () =>
		populateCountries(countrySelect),
	);
}
