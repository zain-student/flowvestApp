import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  type?: "text" | "email" | "password" | "phone" | "number";
  required?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  type = "text",
  required = false,
  disabled = false,
  style,
  leftIcon,
  rightIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isPassword = type === "password";

  // Configure text input props based on type
  const getInputProps = (): Partial<TextInputProps> => {
    switch (type) {
      case "email":
        return {
          keyboardType: "email-address",
          autoCapitalize: "none",
          autoCorrect: false,
        };
      case "password":
        return {
          secureTextEntry: !isPasswordVisible,
          autoCapitalize: "none",
          autoCorrect: false,
        };
      case "phone":
        return {
          keyboardType: "phone-pad",
        };
      case "number":
        return {
          keyboardType: "numeric",
        };
      default:
        return {};
    }
  };

  const containerStyle = [styles.container, style];

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    hasError && styles.inputContainerError,
    disabled && styles.inputContainerDisabled,
  ];

  const inputStyle = [
    styles.input,
    leftIcon ? styles.inputWithLeftIcon : null,
    rightIcon || isPassword ? styles.inputWithRightIcon : null,
    disabled ? styles.inputDisabled : null,
  ].filter(Boolean);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          key={isPassword ? (isPasswordVisible ? "visible" : "hidden") : "text"}
          style={[inputStyle, error && { borderColor: Colors.error }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          {...getInputProps()}
          {...textInputProps}
        />

        {(rightIcon || isPassword) && (
          <View style={styles.rightIconContainer}>
            {isPassword ? (
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.passwordToggle}
              >
                <Text style={styles.passwordToggleText}>
                  {isPasswordVisible ? (
                    <Ionicons name="eye-outline" size={20} />
                  ) : (
                    <Ionicons name="eye-off-outline" size={20} />
                  )}
                </Text>
              </TouchableOpacity>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray,
    marginBottom: 6,
  },

  required: {
    color: "#EF4444",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    minHeight: 44,
  },

  inputContainerFocused: {
    borderColor: "#18181B",
  },

  inputContainerError: {
    borderColor: "#EF4444",
    paddingHorizontal: 10,
  },

  inputContainerDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  inputWithLeftIcon: {
    paddingLeft: 0,
  },

  inputWithRightIcon: {
    paddingRight: 0,
  },

  inputDisabled: {
    // color: '#9CA3AF',
    color: Colors.primary,
  },

  leftIconContainer: {
    paddingLeft: 12,
    paddingRight: 8,
  },

  rightIconContainer: {
    paddingRight: 12,
    paddingLeft: 8,
  },

  passwordToggle: {
    padding: 4,
  },

  passwordToggleText: {
    fontSize: 16,
  },

  error: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },

  hint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 4,
  },
});
