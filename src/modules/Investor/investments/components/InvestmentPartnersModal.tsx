import { useAppDispatch, useAppSelector } from "@/shared/store";
import { fetchInvestmentPartners, resetPartner } from "@/shared/store/slices/investor/investments/investmentSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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

  const StatusFilters = ["active", "withdrawn", "suspended"];
  const InvitationFilters = ["pending", "accepted", "declined"];

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

          {/* 🔍 Search Bar */}
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

          {/* Filters */}
          <View style={styles.filtersRow}>
            {StatusFilters.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, status === s && styles.activeFilter]}
                onPress={() => setStatus(status === s ? undefined : s)}
              >
                <Text style={[styles.filterText, status === s && styles.activeFilterText]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filtersRow}>
            {InvitationFilters.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.filterChip, invitationStatus === s && styles.activeFilter]}
                onPress={() =>
                  setInvitationStatus(invitationStatus === s ? undefined : s)
                }
              >
                <Text
                  style={[styles.filterText, invitationStatus === s && styles.activeFilterText]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Loading / Error */}
          {isLoading && <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />}
          {error && <Text style={styles.error}>{error}</Text>}

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
    backgroundColor: "#111",
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
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    color: "#fff",
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterText: { color: "#ccc", fontSize: 13 },
  activeFilter: { backgroundColor: "#3b82f6" },
  activeFilterText: { color: "#fff" },

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

  error: { color: "red", marginVertical: 8 },
  empty: { color: "#888", textAlign: "center", marginTop: 30 },
});

export default InvestmentPartnersModal;
