import { useAppDispatch, useAppSelector } from "@/shared/store";
import { addInvestments } from "@/shared/store/slices/investor/investments/investmentSlice";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ToastAndroid } from "react-native";
import { InvestmentForm } from "../components/InvestmentForm";

export const AddInvestments = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading } = useAppSelector((s) => s.investments);
  const handleAdd = (data: any, setError: any) => {
    const payload = {
      ...data,
      is_shared: data.type === "shared",
    };

    dispatch(addInvestments(payload))
      .unwrap()
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => {
        console.log("Backend error:", err);

        if (err?.data) {
          Object.keys(err.data).forEach((field) => {
            setError(field as any, {
              type: "server",
              message: err.data[field][0], // first validation message
            });
          });
        } else {
          ToastAndroid.show(
            err?.message || "Something went wrong",
            ToastAndroid.LONG,
          );
        }
      });
  };
  return (
    <InvestmentForm mode="add" isLoading={isLoading} onSubmit={handleAdd} />
  );
};

export default AddInvestments;
