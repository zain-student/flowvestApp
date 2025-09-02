import Colors from "@/shared/colors/Colors";
import { Partner } from "@/shared/store/slices/addPartnerSlice"; // ✅ Single source of truth
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
interface PartnerDropdownProps {
  label?: string;
  partners: Partner[]; // comes from slice
  selectedPartner?: Partner;
  placeholder?: string;
  onSelect: (partner: Partner) => void;
  required?: boolean;
  error?: string;
}
export const PartnerDropdown: React.FC<PartnerDropdownProps> = ({
  label,
  placeholder = "Select a Partner",
  partners,
  selectedPartner,
  onSelect,
  required,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Filter by name (case insensitive)
  const filteredPartners = partners
    .filter((partner) =>
      partner.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.dropdown, error && styles.errorBorder]}
      >
        <Text
          style={selectedPartner ? styles.selectedText : styles.placeholder}
        >
          {selectedPartner ? selectedPartner.name : placeholder}
        </Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Dropdown Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Search */}
            <TextInput
              placeholder="Search partner..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              autoFocus
            />

            {/* Partner List */}
            <FlatList
              data={filteredPartners}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                    setSearch("");
                    console.log("Selected: ", { partners: item })
                  }}
                  style={styles.option}
                >
                 <View style={{flexDirection:'row'}}>
                  <Text style={styles.partnerName}>{item.name}</Text>{selectedPartner?.id === item.id && (
                    <Text style={styles.SelectedTick}> ✓</Text>
                  )}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <Text style={styles.subText}>{item.email}</Text>
                    {/* <Text style={styles.subText}>Company: {item.company?.name ?? "N/A"}</Text> */}
                    <Text
                      style={[styles.statusText, item.status === "active" ? styles.statusActive : styles.statusClosed,]}> {item.status?.charAt(0).toUpperCase()}{item.status?.slice(1)}</Text>
                  </View>
                    <Text style={styles.subText}>Phone: {item.phone ?? "N/A"}</Text>
                  
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No matching partners</Text>
              }
              style={{ flexGrow: 0 }}
            />


            {/* Close Button */}
            <Pressable
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.secondary,
    marginBottom: 6,
  },
  required: {
    color: Colors.secondary,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.white,
  },
  selectedText: {
    color: Colors.gray,
  },
  partnerName: {
    fontWeight: "600",
    color: Colors.secondary,
  },
  subText: {
    fontSize: 12,
    color: Colors.gray,
  },
  statusText:
    { fontSize: 13, fontWeight: "500", marginBottom: 2 },
  statusActive: { color: Colors.green },
  statusClosed: { color: "#6B7280" },
  SelectedTick: {
    color: Colors.gray,
  },
  placeholder: {
    color: "#9CA3AF",
  },
  error: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 16,
    maxHeight: "60%",
  },
  searchInput: {
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray,
    paddingVertical: 20,
  },
  closeBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  closeText: {
    color: Colors.secondary,
    fontWeight: "500",
  },
});
