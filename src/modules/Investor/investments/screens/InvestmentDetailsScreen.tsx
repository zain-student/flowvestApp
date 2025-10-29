import { InvestmentStackParamList } from "@/navigation/InvestorStacks/InvestmentStack";
import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { deleteInvestment, duplicateInvestment, fetchInvestmentsById } from "@/shared/store/slices/investor/investments/investmentSlice";
import { joinInvestment } from "@/shared/store/slices/partner/investments/partnerInvestmentSlice";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
type Props = NativeStackScreenProps<
  InvestmentStackParamList,
  "InvestmentDetails"
>;
type RouteProps = RouteProp<InvestmentStackParamList, "InvestmentDetails">;
export const InvestmentDetailsScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProps>();
  const { showJoinForm } = route.params;
  const { id } =
    useRoute<RouteProp<InvestmentStackParamList, "InvestmentDetails">>().params;
  const dispatch = useAppDispatch();
  const { currentInvestment, isLoading } = useAppSelector(
    (state) => state.investments
  );
  const { isJoining, error: joinError } = useAppSelector(
    (state) => state.userInvestments.join
  );
  const [showMenu, setShowMenu] = useState(false);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  useEffect(() => {
    dispatch(fetchInvestmentsById(id));
  }, [id]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#131314ff" />;
  }
  if (!currentInvestment) {
    return (
      <View>
        <Text>Investment not found.</Text>
      </View>
    );
  }
  const handleDelete = () => {
    Alert.alert(
      "Delete Investment",
      "Are you sure you want to delete this investment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteInvestment({ investmentId: Number(currentInvestment.id) }))
              .unwrap()
              .then(() => {
                navigation.goBack();
              })
              .catch((error) => {
                console.log("Failed to delete investment:", error.message);
                ToastAndroid.show(
                  "Delete failed! " +
                  error.message,
                  ToastAndroid.SHORT
                );
              });
          }
        }
      ]
    )
  }
  const handleDuplicate = () => {
    // console.log("Duplicate investment:", currentInvestment);
    setShowMenu(false);
    dispatch(duplicateInvestment({
      investmentId: currentInvestment.id
    }))
      .catch((error) => {
        console.log("Failed to duplicate investment:", error.message);
        ToastAndroid.show(
          "Duplication failed! " +
          error.message,
          ToastAndroid.SHORT
        );
      });
  };
  // using same thunk from partner slice for joining shared investment
  const handleJoinInvestment = async () => {
    if (!amount) return setFormError('Amount is required');
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return setFormError('Enter a valid positive amount');

    setFormError('');
    try {
      await dispatch(
        joinInvestment({
          investmentId: currentInvestment!.id,
          amount: Number(amount),
          notes: notes.trim(),
        })
      ).unwrap();
      navigation.goBack();
    } catch (err) {
      // Error toast already handled inside thunk
      console.log('Join failed', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={27} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>{currentInvestment.name}</Text>
        {/* <Text style={styles.descriptionText}>{currentInvestment.description}</Text> */}

        <View style={styles.summaryCard}>
          {/* 3 Dots Button */}
          {!showJoinForm && <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setShowMenu((prev) => !prev)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
          }
          {/* Simple Dropdown */}
          {showMenu && (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.overlay}
              onPress={() => setShowMenu(false)} // close menu when tapping outside
            >
              <View style={styles.dropdown}>
                <TouchableOpacity onPress={handleDuplicate} style={styles.dropdownItem}>
                  <Ionicons name="copy-outline" size={18} color="black" />
                  <Text style={styles.dropdownText}>Duplicate Investment</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.label}>Amount Invested</Text>
          <Text style={styles.value}>
            ${currentInvestment.type.toLowerCase() === "shared" ? currentInvestment.current_total_invested : currentInvestment.initial_amount}
          </Text>
          {currentInvestment.type === "shared" && (<Text style={styles.value}>
            Min: ${currentInvestment.min_investment_amount} - Max: ${currentInvestment.max_investment_amount}
          </Text>)}
          <Text style={styles.label}>Status</Text>
          <Text
            style={[
              styles.status,
              currentInvestment.status === "active"
                ? styles.statusActive
                : styles.statusCompleted,
            ]}
          >
            {currentInvestment.status.charAt(0).toUpperCase() +
              currentInvestment.status.slice(1)}
          </Text>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.returns}>{currentInvestment.type.charAt(0).toUpperCase() + currentInvestment.type.slice(1)}</Text>
          <Text style={styles.label}>Returns</Text>
          <Text style={styles.returns}>
            {currentInvestment.expected_return_rate != null
              ? parseFloat(currentInvestment.expected_return_rate).toFixed(1)
              : "--"}
            %
          </Text>
          <Text style={styles.label}>Frequency</Text>
          <Text style={styles.returns}>{currentInvestment.frequency.charAt(0).toUpperCase() + currentInvestment.frequency.slice(1)}</Text>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{currentInvestment.start_date}</Text>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{currentInvestment.end_date}</Text>
          {!showJoinForm &&
            <View style={styles.footer}>
              <Button
                title="Update"
                icon={<Ionicons name="create-outline" size={20} color={Colors.white} />}
                onPress={() => {
                  console.log("Editing investment:", currentInvestment); // full object
                  console.log("Editing investment ID:", currentInvestment.id); // just ID
                  navigation.navigate("EditInvestments", {
                    id: currentInvestment.id,
                    mode: "edit"
                  })

                }
                }
                style={styles.updateButton}
                textStyle={styles.footerButtonText}
                variant="primary"
              />
              <Button
                title="Delete"
                icon={<Ionicons name="trash-outline" size={20} color={Colors.white} />}
                onPress={() => handleDelete()}
                style={styles.deleteButton}
                textStyle={styles.footerButtonText}
                variant="primary"
              />
            </View>
          }
        </View>
        <Text style={styles.sectionTitle}>Transactions</Text>
        {currentInvestment?.recent_payouts?.map((tx: any) => (
          <View key={tx.id} style={styles.txCard}>
            <Text style={styles.txType}>{tx.payout_type.charAt(0).toUpperCase() + tx.payout_type.slice(1)}</Text>
            <Text style={styles.txAmount}>${tx.amount.toLocaleString()}</Text>
            <Text style={styles.txDate}>Due: {tx.due_date}</Text>
          </View>
        ))}
        {showJoinForm &&
          <View style={{
            marginBottom: 20, marginTop: 5, width: '100%', borderWidth: 1,
            borderColor: Colors.lightGray, borderRadius: 8, padding: 10,
            backgroundColor: Colors.white,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }} >
            <Text style={styles.sectionTitle}>Join This Investment</Text>

            <Input
              label="Amount to Invest"
              type="number"
              placeholder="Enter your investment amount"
              value={amount}
              onChangeText={(v) => {
                setAmount(v);
                if (formError) setFormError('');
              }}
              // error={errors.email}
              required
            // autoFocus
            />
            {/* {errors.amount && <Text style={styles.error}>{errors.amount.message}</Text>} */}

            <Input
              label="Notes (optional)"
              type="text"
              placeholder="Any notes for your investment"
              value={notes}
              onChangeText={setNotes}
            // error={errors.email}
            // required
            // autoFocus
            />
            {formError ? <Text style={styles.error}>{formError}</Text> : null}

            <Button
              // title={isJoining ? "Joining..." : "Join Investment"}
              title="Join Investment"
              onPress={handleJoinInvestment}
              disabled={isJoining}
              style={{ marginTop: 5, backgroundColor: Colors.primary, borderColor: Colors.lightGray }}
            />
            {/* {joinError && <Text style={{ color: "red", marginTop: 6 }}>{joinError}</Text>} */}
          </View>
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 100,
  },
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

  closeText: { fontSize: 22, fontWeight: "bold", color: Colors.secondary },
  menuBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 8,
    zIndex: 20,
  },
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
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 16,
  },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 1,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  label: { fontSize: 13, color: Colors.gray, marginTop: 8 },
  value: { fontSize: 16, color: Colors.white, fontWeight: "600" },
  status: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  statusActive: { color: Colors.green },
  statusCompleted: { color: Colors.gray },
  returns: {
    fontSize: 15,
    color: Colors.green,
    fontWeight: "600",
    marginTop: 2,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
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
  error: {
    color: Colors.error,
    marginBottom: 8,
    fontSize: 13,
  },
  updateButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#3B82F6", // Blue
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#EF4444", // Red
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
// export default InvestmentDetailsScreen;
