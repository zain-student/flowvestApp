// import { store } from "@/shared/store";
  
// export const formatCurrency = (amount: number) => {
//   const state = store.getState();
//   const currency = state.profile.preferences?.display?.currency || "USD";

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: currency,
//   }).format(amount);
// };
import { useAppSelector } from "@shared/store";

export const useCurrencyFormatter = () => {
  const currency = useAppSelector(
    (state) => state.profile.preferences?.display?.currency || "USD"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return { currency, formatCurrency };
};
