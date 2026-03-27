export type CartItem = {
  readonly id: string;
  readonly name: string;
  readonly variant: string;
  readonly price: number;
  readonly quantity: number;
  readonly description: string;
};

export type CountryOption = {
  readonly code: string;
  readonly name: string;
  readonly postalCodePlaceholder: string;
};

export type CouponConfig = {
  readonly code: string;
  readonly discountRate: number;
  readonly successMessage: string;
  readonly invalidMessage: string;
};

export type CheckoutFormValues = {
  readonly name: string;
  readonly email: string;
  readonly country: string;
  readonly postalCode: string;
};

export const demoCartItems: ReadonlyArray<CartItem> = [
  {
    id: "iphone-12-pro",
    name: "iPhone 12 Pro",
    variant: "Golden",
    price: 999,
    quantity: 1,
    description: "Gold iPhone 12 Pro front view",
  },
  {
    id: "apple-watch",
    name: "Apple Watch",
    variant: "Blue",
    price: 399,
    quantity: 1,
    description: "Apple Watch",
  },
  {
    id: "imac",
    name: "iMac",
    variant: "Green",
    price: 1199,
    quantity: 1,
    description: "Green iMac with a colorful pink, orange, and blue desktop wallpaper",
  },
];

export const taxRate = 0.05;

export const couponConfig: CouponConfig = {
  code: "SAVE10",
  discountRate: 0.1,
  successMessage: "Coupon applied successfully!",
  invalidMessage: "Invalid coupon code",
};

export const countryOptions: ReadonlyArray<CountryOption> = [
  { code: "FI", name: "Finland", postalCodePlaceholder: "00100" },
  { code: "US", name: "USA", postalCodePlaceholder: "10001" },
  { code: "GB", name: "UK", postalCodePlaceholder: "EC1A 1BB" },
];

export const defaultFormValues: CheckoutFormValues = {
  name: "",
  email: "",
  country: "FI",
  postalCode: "",
};
