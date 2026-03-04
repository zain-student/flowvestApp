import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface DatePickerProps {
  type: "start" | "end";
  value: string;
  otherDate?: string;
  onChange: (date: string) => void;
  error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  type,
  value,
  otherDate,
  onChange,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const parseDate = (dateString?: string) => {
    if (!dateString) return new Date();
    const [y, m, d] = dateString.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const validateDate = (selectedDate: Date) => {
    if (type === "end" && otherDate) {
      if (selectedDate < parseDate(otherDate)) {
        Alert.alert("Invalid Date", "End date cannot be before start date.");
        return false;
      }
    }
    return true;
  };

  const handleAndroidChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (!selectedDate) return;

    if (!validateDate(selectedDate)) return;

    onChange(formatDate(selectedDate));
  };

  const handleIOSChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>
        {type === "start" ? "Start Date *" : "End Date (Optional)"}
      </Text>

      <Pressable
        style={[styles.dateBtn, error && { borderColor: "red" }]}
        onPress={() => {
          setTempDate(parseDate(value));
          setShowPicker(true);
        }}
      >
        <Ionicons name="calendar" size={20} color={Colors.gray} />
        <Text
          style={[styles.dateText, !value && styles.placeholder, { flex: 1 }]}
        >
          {value || (type === "start" ? "Start Date" : "End Date")}
        </Text>

        {value ? (
          <Pressable onPress={() => onChange("")} hitSlop={10}>
            <Ionicons
              name="close-circle-outline"
              size={17}
              color={Colors.gray}
            />
          </Pressable>
        ) : null}
      </Pressable>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* ANDROID PICKER */}
      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {/* IOS PICKER */}
      {showPicker && Platform.OS === "ios" && (
        <View style={styles.iosContainer}>
          <View style={styles.iosHeader}>
            <Pressable onPress={() => setShowPicker(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                if (!validateDate(tempDate)) return;
                onChange(formatDate(tempDate));
                setShowPicker(false);
              }}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>

          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={handleIOSChange}
            style={{ width: "100%" }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    fontWeight: "500",
    color: Colors.gray,
  },
  dateBtn: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.secondary,
  },
  placeholder: {
    color: Colors.gray,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  iosContainer: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 10,
  },
  iosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 16,
  },
  doneText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
