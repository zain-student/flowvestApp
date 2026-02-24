// import { useAppSelector } from "@shared/store";

// export const useCurrencyFormatter = () => {
//   const currency = useAppSelector(
//     (state) => state.profile.preferences?.display?.currency || "USD",
//   );

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency,
//       currencyDisplay: "symbol",
//     }).format(amount);
//   };

//   return { currency, formatCurrency };
// };
import { useAppSelector } from "@shared/store";

export const useCurrencyFormatter = () => {
  const { currencies, preferences } = useAppSelector((state) => state.profile);

  const selectedCode = preferences?.display?.currency || "USD";

  // 🔎 Find full currency object from API list
  const selectedCurrency =
    currencies.find((c) => c.code === selectedCode) ||
    currencies.find((c) => c.code === "USD");

  const formatCurrency = (amount: number | string | null | undefined) => {
    const value =
      typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);

    const normalized = isNaN(value as number) ? 0 : (value as number);

    if (!selectedCurrency) return normalized.toString();

    const formattedNumber = new Intl.NumberFormat(
      `${selectedCurrency.locale}-u-nu-latn`,
      {
        minimumFractionDigits: selectedCurrency.decimal_places,
        maximumFractionDigits: selectedCurrency.decimal_places,
      },
    ).format(normalized);

    return `${selectedCurrency.symbol} ${formattedNumber}`;
  };

  return {
    currency: selectedCurrency,
    formatCurrency,
  };
};
