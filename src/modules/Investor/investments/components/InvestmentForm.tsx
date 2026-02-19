import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui";
import { DatePicker } from "@/shared/components/ui/DatePicker";
import { useAppDispatch, useAppSelector } from "@/shared/store";
import { getCurrencies } from "@/shared/store/slices/profile/profileSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sharedInvestmentSchema,
  soloInvestmentSchema,
} from "@modules/auth/utils/authValidation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type InvestmentFormProps = {
  defaultValues?: any;
  mode: "add" | "edit";
  isLoading?: boolean;
  onSubmit: (data: any) => void;
};

export const InvestmentForm: React.FC<InvestmentFormProps> = ({
  defaultValues,
  mode,
  isLoading,
  onSubmit,
}) => {
  const dispatch = useAppDispatch();
  const { currencies } = useAppSelector((state) => state.profile);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isShared, setIsShared] = useState(
    defaultValues?.type === "shared" ? true : false,
  );
  const [investmentType, setInvestmentType] = useState<"solo" | "shared">(
    defaultValues?.type ?? "solo",
  );
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(
      isShared ? sharedInvestmentSchema : soloInvestmentSchema,
    ),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      type: "solo",
      is_shared: false,
      return_type: "",
      frequency: "",
      status: "",
      expected_return_rate: "",
      initial_amount: "",
      notes: "",
      total_target_amount: "",
      min_investment_amount: "",
      max_investment_amount: "",
      start_date: "",
      end_date: "",
      currency_id: null,
    },
  });
  const selectedCurrencyId = watch("currency_id");
  const selectedCurrency = currencies.find(
    (c: any) => c.id === selectedCurrencyId,
  );
  useEffect(() => {
    dispatch(getCurrencies());
    if (defaultValues) {
      reset(defaultValues);
      setIsShared(defaultValues.type === "shared");
    }
  }, [defaultValues, reset, dispatch]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.innerContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {mode === "edit" ? "Edit Investment" : "Add Investment"}
        </Text>

        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Investment Name"
              placeholder="Enter name"
              placeholderTextColor={Colors.gray}
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              required
            />
          )}
        />

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Input
              label="Description"
              placeholder="Enter description"
              placeholderTextColor={Colors.gray}
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              multiline
              required
            />
          )}
        />
        {/* Investment Type */}
        <Text style={styles.labelText}>Investment Type</Text>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <TouchableOpacity
            style={[styles.typeBtn, !isShared && styles.selected]}
            onPress={() => {
              setIsShared(false);
              setValue("type", "solo");
              setValue("is_shared", false);
            }}
          >
            <Text style={{ fontSize: 16 }}>Solo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, isShared && styles.selected]}
            onPress={() => {
              setIsShared(true);
              setValue("type", "shared");
              setValue("is_shared", true);
            }}
          >
            <Text>Shared</Text>
          </TouchableOpacity>
        </View>

        {/* Dates */}
        <Controller
          control={control}
          name="start_date"
          defaultValue={new Date().toISOString().split("T")[0]}
          render={({ field: startField }) => (
            <Controller
              control={control}
              name="end_date"
              defaultValue={new Date().toISOString().split("T")[0]}
              render={({ field: endField }) => (
                <DatePicker
                  startDate={startField.value}
                  endDate={endField.value}
                  onChange={(start, end) => {
                    startField.onChange(start);
                    endField.onChange(end);
                  }}
                />
              )}
            />
          )}
        />

        {!isShared && (
          <>
            <Controller
              control={control}
              name="initial_amount"
              render={({ field, fieldState }) => (
                <Input
                  label="Initial Amount"
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  value={String(field.value || "")}
                  onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </>
        )}

        {/* Currency */}
        <Controller
          control={control}
          name="currency_id"
          render={({ field, fieldState }) => (
            <>
              <Text style={styles.labelText}>Currency *</Text>
              <TouchableOpacity
                style={[
                  styles.textInput,
                  fieldState.error && { borderColor: Colors.error },
                ]}
                onPress={() => setCurrencyDropdownOpen(true)}
              >
                <Text
                  style={{
                    color: selectedCurrency ? Colors.secondary : Colors.gray,
                    fontSize: 16,
                  }}
                >
                  {selectedCurrency
                    ? `${selectedCurrency.icon} ${selectedCurrency.code}`
                    : "Select Currency"}
                </Text>
              </TouchableOpacity>

              {fieldState.error?.message && (
                <Text style={styles.error}>{fieldState.error.message}</Text>
              )}

              <Modal
                visible={currencyDropdownOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setCurrencyDropdownOpen(false)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    flex: 1,
                    // backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "flex-end",
                  }}
                  onPress={() => setCurrencyDropdownOpen(false)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      // backgroundColor: "#fff",
                      padding: 20,
                      borderTopLeftRadius: 24,
                      borderTopRightRadius: 24,
                      maxHeight: "70%",

                      backgroundColor: Colors.lightGray,
                      paddingTop: 16,
                      paddingHorizontal: 20,
                      paddingBottom: 20,
                    }}
                    onPress={() => {}}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 15,
                        color: Colors.gray,
                      }}
                    >
                      Select Currency
                    </Text>

                    <FlatList
                      data={currencies}
                      keyExtractor={(item: any) => item.id.toString()}
                      renderItem={({ item }: any) => (
                        <TouchableOpacity
                          style={{
                            paddingVertical: 12,
                            borderBottomWidth: 0.5,
                            borderColor: "#eee",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                          onPress={() => {
                            field.onChange(item.id); // 🔥 important
                            setCurrencyDropdownOpen(false);
                          }}
                        >
                          <Text>
                            {item.icon} {item.name}
                          </Text>
                          <Text>{item.code}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            </>
          )}
        />

        {/* Expected Return Rate */}
        <View style={{ height: 16 }} />
        <Controller
          control={control}
          name="expected_return_rate"
          render={({ field, fieldState }) => (
            <Input
              label="Expected Return Rate (%)"
              keyboardType="numeric"
              value={String(field.value || "")}
              placeholder="0.00"
              placeholderTextColor={Colors.gray}
              onChangeText={(v) => field.onChange(parseFloat(v) || "")}
              error={fieldState.error?.message}
              required
            />
          )}
        />
        {/* Shared Fields */}
        {isShared && (
          <>
            <Controller
              control={control}
              name="total_target_amount"
              render={({ field, fieldState }) => (
                <Input
                  label="Total Target Amount"
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  value={String(field.value || "")}
                  onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="min_investment_amount"
              render={({ field, fieldState }) => (
                <Input
                  label="Minimum Investment Amount"
                  keyboardType="numeric"
                  value={String(field.value || "")}
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
            <Controller
              control={control}
              name="max_investment_amount"
              render={({ field, fieldState }) => (
                <Input
                  label="Maximum Investment Amount"
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={Colors.gray}
                  value={String(field.value || "")}
                  onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                  error={fieldState.error?.message}
                  required
                />
              )}
            />
          </>
        )}
        {/* Return Type */}
        <Controller
          control={control}
          name="return_type"
          render={({ field, fieldState }) => {
            const [open, setOpen] = React.useState(false);
            const [items, setItems] = React.useState([
              { label: "Fixed", value: "fixed" },
              { label: "Percentage", value: "percentage" },
              { label: "Custom", value: "custom" },
            ]);

            return (
              <View style={{ zIndex: 3000 }}>
                <Text style={styles.labelText}>Return Type *</Text>
                <DropDownPicker
                  open={open}
                  value={field.value}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => field.onChange(callback(field.value))}
                  setItems={setItems}
                  placeholder="Select Return Type"
                  placeholderStyle={{ color: Colors.gray, fontSize: 16 }}
                  listMode="SCROLLVIEW"
                  dropDownDirection="BOTTOM"
                  style={[
                    styles.textInput,
                    fieldState.error && { borderColor: Colors.error },
                  ]}
                  dropDownContainerStyle={{
                    borderColor: "#ccc",
                  }}
                />
                {fieldState.error?.message && (
                  <Text style={styles.error}>{fieldState.error.message}</Text>
                )}
              </View>
            );
          }}
        />
        {/* Frequency */}
        <Controller
          control={control}
          name="frequency"
          render={({ field, fieldState }) => {
            const [open, setOpen] = React.useState(false);
            const [items, setItems] = React.useState([
              { label: "Monthly", value: "monthly" },
              { label: "Quarterly", value: "quarterly" },
              { label: "Annual", value: "annual" },
              { label: "Manual", value: "manual" },
            ]);

            return (
              <View style={{ marginTop: 16, zIndex: 2000 }}>
                <Text style={styles.labelText}>Frequency *</Text>
                <DropDownPicker
                  open={open}
                  value={field.value}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => field.onChange(callback(field.value))}
                  setItems={setItems}
                  placeholder="Select Frequency"
                  placeholderStyle={{ color: Colors.gray, fontSize: 16 }}
                  listMode="SCROLLVIEW"
                  dropDownDirection="BOTTOM"
                  style={[
                    styles.textInput,
                    fieldState.error && { borderColor: Colors.error },
                  ]}
                  dropDownContainerStyle={{
                    borderColor: "#ccc",
                    // zIndex: 1000, // Ensure it appears above other elements
                  }}
                />
                {fieldState.error?.message && (
                  <Text style={styles.error}>{fieldState.error.message}</Text>
                )}
              </View>
            );
          }}
        />
        {/* Status */}
        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => {
            const [open, setOpen] = React.useState(false);
            const [items, setItems] = React.useState([
              { label: "Draft", value: "draft" },
              { label: "Active", value: "active" },
              { label: "Pause", value: "paused" },
              { label: "Complete", value: "completed" },
              // { label: "Cancel", value: "cancelled" },
            ]);

            return (
              <View style={{ marginTop: 16, zIndex: 1500 }}>
                <Text style={styles.labelText}>Status *</Text>
                <DropDownPicker
                  open={open}
                  value={field.value}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => field.onChange(callback(field.value))}
                  setItems={setItems}
                  placeholder="Select Status"
                  placeholderStyle={{ color: Colors.gray, fontSize: 16 }}
                  listMode="SCROLLVIEW"
                  dropDownDirection="BOTTOM"
                  style={[
                    styles.textInput,
                    fieldState.error && { borderColor: Colors.error },
                  ]}
                  dropDownContainerStyle={{
                    borderColor: "#ccc",
                    // zIndex: 1000, // Ensure it appears above other elements
                  }}
                />
                {fieldState.error?.message && (
                  <Text style={styles.error}>{fieldState.error.message}</Text>
                )}
              </View>
            );
          }}
        />
        <View style={{ height: 16 }} />
        {/* Solo Fields */}
        {!isShared && (
          <>
            <Controller
              control={control}
              name="notes"
              render={({ field, fieldState }) => (
                <Input
                  label="Notes"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={fieldState.error?.message}
                  multiline
                  numberOfLines={3}
                />
              )}
            />
          </>
        )}

        {/* Submit */}
        <Button
          title={mode === "edit" ? "Update Investment" : "Add Investment"}
          onPress={handleSubmit(onSubmit)}
          //   onPress={handleAdd}
          //   onPress={()=> console.log("onSubmit called with:")}
          style={{ marginTop: 0, backgroundColor: Colors.secondary }}
          loading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    // paddingBottom: 80,
    paddingTop: 10,
    // marginBottom: 70,
  },
  innerContainer: {},
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.secondary,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray,
    marginBottom: 6,
  },
  labelText: {
    marginBottom: 4,
    fontWeight: "500",
    color: Colors.gray,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 8,
    // marginBottom: 16,
    backgroundColor: Colors.white,
  },
  typeBtn: {
    flex: 1,
    // padding: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: Colors.white,
  },
  error: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  selected: {
    backgroundColor: "rgba(144, 178, 234, 0.15)",
    borderColor: Colors.statusText,
    color: "white",
  },
});
export default InvestmentForm;
