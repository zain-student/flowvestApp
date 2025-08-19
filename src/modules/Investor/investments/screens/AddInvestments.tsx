import { useAppDispatch, useAppSelector } from "@/shared/store";
import { addInvestments } from "@/shared/store/slices/investmentSlice";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ToastAndroid } from "react-native";
import { InvestmentForm } from "../components/InvestmentForm";

export const AddInvestments = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading } = useAppSelector((s) => s.investments);

  const handleAdd = (data: any) => {
    
    dispatch(addInvestments(data))
      .unwrap()
      .then(() => {
        ToastAndroid.show("Added Investment Successfully", ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch(() => {
        ToastAndroid.show("Failed to create investment", ToastAndroid.SHORT);
      });
  };

  return (
    <InvestmentForm
      mode="add"
      isLoading={isLoading}
      onSubmit={handleAdd}
    />
  );
};

export default AddInvestments;
