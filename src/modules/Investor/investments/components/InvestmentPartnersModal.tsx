import Colors from "@/shared/colors/Colors";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { approveInvestmentPartner, fetchInvestmentPartners, resetPartner } from "@/shared/store/slices/investor/investments/investmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { RemovePartnerButton } from "./RemovePartnerButton";
interface PartnersModalProps {
  visible: boolean;
  onClose: () => void;
  investmentId: number;
}

const InvestmentPartnersModal: React.FC<PartnersModalProps> = ({ visible, onClose, investmentId }) => {
  const dispatch = useAppDispatch();
  const { data: partners, isLoading, error } = useAppSelector((state) => state.investments.partners);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [invitationStatus, setInvitationStatus] = useState<string | undefined>();

  useEffect(() => {
    if (visible) {
      dispatch(fetchInvestmentPartners({ investmentId, status, invitation_status: invitationStatus, search }));
    } else {
      dispatch(resetPartner());
    }
  }, [visible, status, invitationStatus, search]);

  const StatusFilters = [
    { label: "Active", value: "active" },
    { label: "Withdrawn", value: "withdrawn" },
    { label: "Suspended", value: "suspended" },
  ];
  const InvitationFilters = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Declined", value: "declined" },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Partners</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
            <TextInput
              placeholder="Search by name or email"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          {/* Dropdown Filters */}
          <View style={styles.dropdownRow}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={StatusFilters}
              labelField="label"
              valueField="value"
              placeholder="Filter by Status"
              value={status}
              onChange={(item: any) => setStatus(item.value === status ? undefined : item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={InvitationFilters}
              labelField="label"
              valueField="value"
              placeholder="Filter by Invitation"
              value={invitationStatus}
              onChange={(item: any) =>
                setInvitationStatus(item.value === invitationStatus ? undefined : item.value)
              }
            />
          </View>

          {/* Partner List */}
          <FlatList
            data={partners}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.name}>{item.user?.name || "Unknown"}</Text>
                  <Text style={styles.amount}>${item.invested_amount}</Text>
                </View>
                <Text style={styles.email}>{item.user?.email}</Text>
                <View style={styles.cardRow}>
                  <Text style={styles.badge}>Status: {item.status}</Text>
                  <Text style={styles.badge}>Invitation: {item.invitation_status}</Text>
                </View>
                {item.invitation_status === "pending" && (
                  <TouchableOpacity
                    style={[styles.joinBtn, isLoading && { opacity: 0.6 }]}
                    disabled={isLoading}
                    onPress={() => {
                      dispatch(
                        approveInvestmentPartner({
                          investmentId: item.investment_id,
                          partnerId: item.user.id,
                        })
                      );
                    }}
                  >
                        <Ionicons name="person-add-outline" size={18} color={Colors.white} />
                        <Text style={styles.joinBtnText}>Approve</Text>
                  </TouchableOpacity>)}
                <RemovePartnerButton item={item} investmentId={investmentId}/>


              </View>
            )}
            ListEmptyComponent={
              !isLoading ? <Text style={styles.empty}>No partners found</Text> : null
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    color: Colors.secondary,
  },

  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dropdown: {
    flex: 1,
    height: 45,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  placeholderStyle: {
    color: "#888",
    fontSize: 13,
  },
  selectedTextStyle: {
    color: Colors.secondary,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#1e1e1e",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#fff" },
  amount: { fontSize: 14, fontWeight: "600", color: "#3b82f6" },
  email: { fontSize: 13, color: "#aaa", marginBottom: 6 },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  badge: { fontSize: 12, color: "#bbb" },
  joinBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  removeBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  error: { color: "red", marginVertical: 8 },
  empty: { color: "#888", textAlign: "center", marginTop: 30 },
});

export default InvestmentPartnersModal;
