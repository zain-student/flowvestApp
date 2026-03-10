import { showToast } from "@/modules/auth/utils/showToast";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import {
  fetchInvestmentsById,
  updateInvestment,
} from "@/shared/store/slices/investor/investments/investmentSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { InvestmentForm } from "../components/InvestmentForm";

export const EditInvestments = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading } = useAppSelector((s) => s.investments);
  const route = useRoute<any>();
  const { id } = route.params || {};
  const [investment, setInvestment] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvestmentsById(id))
        .unwrap()
        .then((data) => setInvestment(data))
        .catch(() => {
          showToast("Failed to load investment");
        });
    }
  }, [id]);

  const handleUpdate = (data: any) => {
    dispatch(updateInvestment({ id: id, updatedData: data }))
      .unwrap()
      .then(() => {
        showToast("Investment updated successfully");
        navigation.goBack();
      })
      .catch((error: any) => {
        showToast(error.message);
      });
  };
  if (!investment) return null;

  return (
    <InvestmentForm
      mode="edit"
      isLoading={isLoading}
      defaultValues={investment}
      onSubmit={handleUpdate}
    />
  );
};

export default EditInvestments;
