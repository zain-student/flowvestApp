import Colors from "@/shared/colors/Colors";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

interface Partner {
  id: string;

  name: string;
}

interface PartnerDropdownProps {
  label?: string;
  placeholder?: string;
  partners: Partner[];
  selectedPartner?: Partner;
  onSelect: (partner: Partner) => void;
  error?: string;
  required?: boolean;
}

export const PartnerDropdown: React.FC<PartnerDropdownProps> = ({
  label,
  placeholder = "Select an existing Partner",
  partners: initialPartners,
  selectedPartner,
  onSelect,
  error,
  required,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [partners, setPartners] = useState<Partner[]>(initialPartners);

  const filteredPartners = [...initialPartners].filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const canAddNew =
    searchQuery.trim().length > 0 &&
    !initialPartners.some(
      (p) => p.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );

  // const handleAddNewPartner = () => {
  //   const newPartner: Partner = {
  //     id: Date.now().toString(),
  //     name: searchQuery.trim(),
  //   };
  //   const updatedList = [...partners, newPartner];
  //   setPartners(updatedList);
  //   onSelect(newPartner);
  //   setModalVisible(false);
  //   setSearchQuery("");
  // };

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={styles.label}>
          {label}
          {/* {required && <Text style={styles.required}> *</Text>} */}
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
      <Modal
  visible={modalVisible}
  animationType="fade"
  transparent
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <TextInput
        placeholder="Search partner..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        autoFocus
      />

      <FlatList
        data={filteredPartners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              onSelect(item);
              setModalVisible(false);
              setSearchQuery("");
            }}
            style={styles.option}
          >
            <Text>
              {item.name}
              {selectedPartner?.id === item.id && (
                <Text style={styles.SelectedTick}> ✓</Text>
              )}
            </Text>
            <Text style={styles.selectedText}>{item.id}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matching partners</Text>
        }
        style={{ flexGrow: 0 }}
      />

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
  addNewBtn: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 8,
  },
  addNewText: {
    color: "#0369A1",
    fontWeight: "500",
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
