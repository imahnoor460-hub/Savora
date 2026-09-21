// Prices are stored as plain numbers and shown in Pakistani rupees.
export function formatPrice(value) {
  const amount = Number(value);
  if (value === null || value === undefined || value === "" || !Number.isFinite(amount)) {
    return "Rs. --";
  }
  return `Rs. ${amount.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}
