const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatItemCount(quantity: number): string {
  return quantity === 1 ? "1 ITEM" : `${quantity} ITEMS`;
}

export function formatQuantity(quantity: number): string {
  return `x ${quantity}`;
}

export function formatDiscountLabel(code: string | null): string {
  return code ? `Discount (${code})` : "Discount";
}
