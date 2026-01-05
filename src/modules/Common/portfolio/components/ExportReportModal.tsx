import Colors from "@/shared/colors/Colors";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface ExportReportModalProps {
    visible: boolean;
    onClose: () => void;
    onExport: (reportType: string, fileType: "pdf" | "csv") => void;
}

const ExportReportModal: React.FC<ExportReportModalProps> = ({
    visible,
    onClose,
    onExport,
}) => {
    const [reportType, setReportType] = useState<string | null>(null);
    const [fileType, setFileType] = useState<"pdf" | "csv" | null>(null);
    useEffect(() => {
        if (visible) {
            setReportType(null);
            setFileType(null);
        }
    }, [visible]);
    const reportTypes = [
        { label: "Dashboard Summary", value: "dashboard_summary" },
        { label: "Investment Summary", value: "investment_summary" },
        { label: "Partner Performance", value: "partner_performance" },
        { label: "ROI Analysis", value: "roi_analysis" },
        { label: "Payout Summary", value: "payout_summary" },
        { label: "Audit Trail", value: "audit_trail" },
    ];

    const fileTypes = [
        { label: "PDF", value: "pdf" },
        { label: "CSV", value: "csv" },
    ];

    const handleExport = () => {
        if (reportType && fileType) {
            onExport(reportType, fileType);
            onClose();
            setReportType(null);
            setFileType(null);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Export Report</Text>

                    {/* Report Type */}
                    <Text style={styles.label}>Select Report Type</Text>
                    <Dropdown
                        data={reportTypes}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Report Type"
                        value={reportType}
                        onChange={(item) => setReportType(item.value)}
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownText}
                        selectedTextStyle={styles.dropdownText}
                    />

                    {/* File Type */}
                    <Text style={styles.label}>Select File Type</Text>
                    <Dropdown
                        data={fileTypes}
                        labelField="label"
                        valueField="value"
                        placeholder="Select File Type"
                        value={fileType}
                        onChange={(item) => setFileType(item.value as "pdf" | "csv")}
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownText}
                        selectedTextStyle={styles.dropdownText}
                    />

                    {/* Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                (!reportType || !fileType) && { opacity: 0.6 },
                            ]}
                            disabled={!reportType || !fileType}
                            onPress={handleExport}
                        >
                            <Text style={styles.buttonText}>Export</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ExportReportModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        width: "85%",
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.secondary,
        marginBottom: 16,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.secondary,
        marginBottom: 6,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 14,
        height: 45,
    },
    dropdownText: {
        fontSize: 14,
        color: Colors.secondary,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    button: {
        backgroundColor: Colors.green,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: "#aaa",
    },
    buttonText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: "600",
    },
});
