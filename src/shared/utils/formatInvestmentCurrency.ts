import { useAppSelector } from "../store";
export const useInvestmentCurrencyFormatter = () => {
  const { currencies } = useAppSelector((state) => state.profile);

  const formatInvestmentCurrency = (
    amount: number | string | null | undefined,
    currency: string | { code: string },
  ) => {
    const currencyCode =
      typeof currency === "string" ? currency : currency?.code;

    const selectedCurrency =
      currencies.find((c) => c.code === currencyCode) ||
      currencies.find((c) => c.code === "USD");

    const value =
      typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);

    const normalized = isNaN(value) ? 0 : value;

    if (!selectedCurrency) return normalized.toString();

    // ✅ Force Latin digits for iOS compatibility
    const locale = selectedCurrency.locale?.startsWith("ar")
      ? "en"
      : selectedCurrency.locale || "en";
    const formattedNumber = new Intl.NumberFormat(
      locale,
      // `${selectedCurrency.locale}-u-nu-latn`,
      {
        minimumFractionDigits: selectedCurrency.decimal_places,
        maximumFractionDigits: selectedCurrency.decimal_places,
      },
    ).format(normalized);

    return `${selectedCurrency.symbol} ${formattedNumber}`;
  };

  return { formatInvestmentCurrency };
};
