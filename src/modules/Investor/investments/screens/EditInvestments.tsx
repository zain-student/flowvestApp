import { showToast } from "@/modules/auth/utils/showToast";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { updateInvestment } from "@/shared/store/slices/investor/investments/investmentSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { InvestmentForm } from "../components/InvestmentForm";

export const EditInvestments = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading } = useAppSelector((s) => s.investments);
  const route = useRoute<any>();
  const { investmentDet } = route.params;

  const formattedInvestment = {
    ...investmentDet,
    currency_id: investmentDet.currency?.id,
  };
  const handleUpdate = (data: any, setError: any) => {
    dispatch(updateInvestment({ id: investmentDet.id, updatedData: data }))
      .unwrap()
      .then(() => {
        showToast("Investment updated successfully");
        navigation.goBack();
      })
      .catch((err: any) => {
        if (err?.data) {
          Object.keys(err.data).forEach((field) => {
            setError(field as any, {
              type: "server",
              message: err.data[field][0], // first validation message
            });
          });
        } else {
          showToast(err?.message || "Something went wrong", "error");
        }
      });
  };
  // if (!investment) return null;

  return (
    <InvestmentForm
      mode="edit"
      isLoading={isLoading}
      defaultValues={formattedInvestment}
      onSubmit={handleUpdate}
    />
  );
};

export default EditInvestments;
