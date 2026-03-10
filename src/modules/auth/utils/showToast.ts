import Toast from "react-native-toast-message";

export const showToast = (
  message: string,
  type: "success" | "error" = "success",
) => {
  Toast.show({
    type,
    text1: message,
    position: "bottom",
    visibilityTime: 2500,
  });
};
