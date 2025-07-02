/**
 * Select Component
 * Reusable dropdown/picker component
 */

import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option...',
  value,
  options,
  onSelect,
  error,
  required = false,
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const hasError = !!error;

  const containerStyle = [
    styles.container,
    style,
  ];

  const selectContainerStyle = [
    styles.selectContainer,
    hasError && styles.selectContainerError,
    disabled && styles.selectContainerDisabled,
  ];

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => handleSelect(item)}
    >
      <View>
        <Text style={styles.optionLabel}>{item.label}</Text>
        {item.description && (
          <Text style={styles.optionDescription}>{item.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={selectContainerStyle}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[
          styles.selectText,
          !selectedOption && styles.placeholder,
          disabled && styles.disabledText,
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Select Option'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  
  required: {
    color: '#EF4444',
  },
  
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
  },
  
  selectContainerError: {
    borderColor: '#EF4444',
  },
  
  selectContainerDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  
  placeholder: {
    color: '#9CA3AF',
  },
  
  disabledText: {
    color: '#9CA3AF',
  },
  
  arrow: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
  
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 20,
    maxHeight: '70%',
    minWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  
  closeButton: {
    padding: 4,
  },
  
  closeButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  optionsList: {
    maxHeight: 300,
  },
  
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  
  optionLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
}); 