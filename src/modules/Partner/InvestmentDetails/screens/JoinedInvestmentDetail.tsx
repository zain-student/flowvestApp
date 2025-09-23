// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'

// export const JoinedInvestmentDetail = () => {
//   return (
//     <View>
//       <Text>JoinedInvestmentDetail</Text>
//     </View>
//   )
// }

// export default JoinedInvestmentDetail

// const styles = StyleSheet.create({})
import Colors from "@/shared/colors/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export const JoinedInvestmentDetail: React.FC = ({ navigation }: any) => {
    // ⚡ Demo loading & data (replace with real props/store later)
    const [isLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const currentInvestment = {
        id: 1,
        name: "Tech Growth Fund",
        initial_amount: 25000,
        status: "active",
        type: "Equity",
        expected_return_rate: "12.5",
        start_date: "2025-02-01",
        end_date: "2026-02-01",
        recent_payouts: [
            { id: 1, payout_type: "monthly", amount: 500, due_date: "2025-10-01" },
            { id: 2, payout_type: "monthly", amount: 500, due_date: "2025-11-01" },
        ],
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
        );
    }

    if (!currentInvestment) {
        return (
            <View style={styles.centered}>
                <Text style={styles.notFound}>Investment not found.</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn}
                onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={27} />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>{currentInvestment.name}</Text>

                <View style={styles.summaryCard}>
                    {/* 3-Dots Menu
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setShowMenu((prev) => !prev)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity> */}

                    {/* {showMenu && (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.overlay}
              onPress={() => setShowMenu(false)}
            >
              <View style={styles.dropdown}>
                <TouchableOpacity
                  onPress={() => ToastAndroid.show("Duplicate tapped", ToastAndroid.SHORT)}
                  style={styles.dropdownItem}
                >
                  <Ionicons name="copy-outline" size={18} color="black" />
                  <Text style={styles.dropdownText}>Duplicate Investment</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )} */}

                    <LabelValue label="Amount Invested" value={`$${currentInvestment.initial_amount}`} />
                    <LabelValue
                        label="Status"
                        value={capitalize(currentInvestment.status)}
                        valueStyle={
                            currentInvestment.status === "active"
                                ? styles.statusActive
                                : styles.statusCompleted
                        }
                    />
                    <LabelValue label="Type" value={currentInvestment.type} />
                    <LabelValue
                        label="Returns"
                        value={`${parseFloat(currentInvestment.expected_return_rate).toFixed(1)}%`}
                    />
                    <LabelValue label="Start Date" value={currentInvestment.start_date} />
                    <LabelValue label="End Date" value={currentInvestment.end_date} />

                    {/* <View style={styles.footer}>
            <Button
              title="Update"
              icon={<Ionicons name="create-outline" size={20} color={Colors.white} />}
              onPress={() => ToastAndroid.show("Update tapped", ToastAndroid.SHORT)}
              style={styles.updateButton}
              textStyle={styles.footerButtonText}
              variant="primary"
            />
            <Button
              title="Delete"
              icon={<Ionicons name="trash-outline" size={20} color={Colors.white} />}
              onPress={() => ToastAndroid.show("Delete tapped", ToastAndroid.SHORT)}
              style={styles.deleteButton}
              textStyle={styles.footerButtonText}
              variant="primary"
            />
          </View> */}
                </View>

                <Text style={styles.sectionTitle}>Transactions</Text>
                {currentInvestment.recent_payouts.map((tx) => (
                    <View key={tx.id} style={styles.txCard}>
                        <Text style={styles.txType}>
                            {capitalize(tx.payout_type)}
                        </Text>
                        <Text style={styles.txAmount}>${tx.amount.toLocaleString()}</Text>
                        <Text style={styles.txDate}>Due: {tx.due_date}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

/* ------------ Helpers ------------ */
const LabelValue = ({
    label,
    value,
    valueStyle,
}: {
    label: string;
    value: string;
    valueStyle?: any;
}) => (
    <>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
    </>
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------ Styles ------------ */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingBottom: 100 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    notFound: { fontSize: 16, color: Colors.secondary },
    closeBtn: {
        position: "absolute",
        top: 32,
        right: 24,
        zIndex: 10,
        backgroundColor: Colors.white,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.secondary,
        marginBottom: 1,
    },
    summaryCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 14,
        padding: 18,
        marginBottom: 24,
    },
    menuBtn: { position: "absolute", top: 20, right: 20, padding: 8, zIndex: 20 },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
    dropdown: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: "white",
        borderRadius: 8,
        elevation: 5,
        paddingVertical: 5,
        width: 200,
    },
    dropdownItem: { flexDirection: "row", alignItems: "center", padding: 10 },
    dropdownText: { marginLeft: 8, fontSize: 16 },
    label: { fontSize: 13, color: Colors.gray, marginTop: 8 },
    value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
    statusActive: { color: Colors.green },
    statusCompleted: { color: Colors.gray },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.secondary,
        marginBottom: 10,
    },
    txCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    txType: { fontSize: 15, color: Colors.white, fontWeight: "600" },
    txAmount: { fontSize: 15, color: Colors.white, fontWeight: "500" },
    txDate: { fontSize: 13, color: Colors.gray },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        borderTopWidth: 0.2,
        borderTopColor: Colors.gray,
        paddingTop: 12,
    },
    updateButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "#3B82F6",
    },
    deleteButton: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "#EF4444",
    },
    footerButtonText: { color: "#fff", fontWeight: "bold" },
});
