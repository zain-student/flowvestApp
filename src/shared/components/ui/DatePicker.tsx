import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface DatePickerProps {
    startDate: string;
    endDate: string;
    onChange: (start: string, end: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ startDate, endDate, onChange }) => {
    const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);

    const parseDate = (dateString: string) => {
        if (!dateString) return new Date(); // default to today if empty
        const parts = dateString.split("-");
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    };

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const handleDateChange = (_: any, selectedDate?: Date) => {
        if (Platform.OS === "android") setShowPicker(null);
        if (!selectedDate) return;

        if (showPicker === "start") {
            // If start date > end date, reset end date
            if (endDate && selectedDate > parseDate(endDate)) {
                onChange(formatDate(selectedDate), "");
            } else {
                onChange(formatDate(selectedDate), endDate);
            }
        } else if (showPicker === "end") {
            // Prevent end date before start date
            if (startDate && selectedDate < parseDate(startDate)) {
                Alert.alert("Invalid Date", "End date cannot be before start date.");
                return;
            }
            onChange(startDate, formatDate(selectedDate));
        }
    };

    return (
        <View style={styles.container}>
            {/* Start Date */}
            <Text style={styles.label}>Start Date</Text>
            <Pressable style={styles.dateBtn} onPress={() => setShowPicker("start")}>
                <Ionicons name="calendar" size={22} color="#555" />
                <Text style={[styles.dateText, !startDate && styles.placeholder]}>
                    {startDate || "Select Start Date"}
                </Text>
            </Pressable>

            {/* End Date */}
            <Text style={styles.label}>End Date</Text>
            <Pressable style={styles.dateBtn} onPress={() => setShowPicker("end")}>
                <Ionicons name="calendar" size={22} color="#555" />
                <Text style={[styles.dateText, !endDate && styles.placeholder]}>
                    {endDate || "Select End Date"}
                </Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={showPicker === "start" ? parseDate(startDate) : parseDate(endDate)}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    dateBtn: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        minHeight: 44,
    },
    dateText: {
        marginLeft: 6,
        fontSize: 16,
        color: "#333",
    },
    placeholder: {
        color: "#9CA3AF", // gray for placeholder
    },
});
