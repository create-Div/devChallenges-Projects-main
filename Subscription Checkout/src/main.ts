import { initCountriesLazyLoading } from "./modules/countries";
import { initFormHandlers } from "./modules/form";
import { initPlanToggle } from "./modules/plan";
import {
	initDefaultPaymentSelection,
	initPaymentSelection,
} from "./modules/payment";
import { initValidationErrorClearing } from "./modules/validation";

function init(): void {
	initValidationErrorClearing();
	initCountriesLazyLoading();
	initPlanToggle();
	initPaymentSelection();
	initDefaultPaymentSelection();
	initFormHandlers();
}

init();
