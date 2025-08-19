/**
 * Button Component
 * Reusable button with different variants and states
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode; // <-- New
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const isDisabled = disabled || loading;

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.baseText,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#2563EB'}
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconWrapper}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconWrapper}>{icon}</View>
          )}
        </View>
        // <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  baseText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Variants
  primary: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  
  secondary: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  secondaryText: {
    color: '#374151',
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  outlineText: {
    color: '#374151',
  },
  
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  ghostText: {
    color: '#2563EB',
  },
  
  // Sizes
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  smallText: {
    fontSize: 14,
  },
  
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  mediumText: {
    fontSize: 16,
  },
  
  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  largeText: {
    fontSize: 18,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: 6,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  fullWidth: {
    width: '100%',
  },
}); 