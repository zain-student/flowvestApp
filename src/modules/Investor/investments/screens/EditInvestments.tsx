import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestmentsById, updateInvestment } from "@/shared/store/slices/investor/investments/investmentSlice";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
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
          ToastAndroid.show("Failed to load investment", ToastAndroid.SHORT);
        });
    }
  }, [id]);

  const handleUpdate = (data: any) => {
    // console.log("Updating Investment with ID:", id, "Data:", data);
    dispatch(updateInvestment({ id: (id), updatedData: data }))
      .unwrap()
      .then(() => {
        ToastAndroid.show("Investment updated successfully", ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch((error:any) => {
        ToastAndroid.show( error.message , ToastAndroid.SHORT);
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
