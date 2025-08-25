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
    const payload = {
      ...data,
      is_shared: data.type === "shared", // true for shared, false for solo
    };
    console.log("Adding investment with data:", payload);
    dispatch(addInvestments(payload))
      .unwrap()
      .then(() => {
        ToastAndroid.show("Added Investment Successfully", ToastAndroid.SHORT);
        navigation.goBack();
      })
      .catch((err) => {
        // ToastAndroid.show("Failed to create investment", ToastAndroid.SHORT);
        console.log("Create investment error:", err);
        ToastAndroid.show("Failed: " + (err?.message || "Unknown error"), ToastAndroid.LONG);
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
