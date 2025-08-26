import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui";
import { DatePicker } from "@/shared/components/ui/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharedInvestmentSchema, soloInvestmentSchema } from "@modules/auth/utils/authValidation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

    const [isShared, setIsShared] = useState(defaultValues?.type === "shared" ? true : false);
    const [investmentType, setInvestmentType] = useState<"solo" | "shared">(
        defaultValues?.type ?? "solo"
    );

    const { control, handleSubmit, reset, setValue } = useForm({
        resolver: zodResolver(isShared ? sharedInvestmentSchema : soloInvestmentSchema),
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
        },
    });



    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
            setIsShared(defaultValues.type === "shared");
        }
    }, [defaultValues, reset]);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.innerContainer} showsVerticalScrollIndicator={false}>
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
                            value={field.value}
                            onChangeText={field.onChange}
                            error={fieldState.error?.message}
                            multiline
                            required
                        />
                    )}
                />

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

                {/* Investment Type */}
                <Text style={styles.subTitle}>Investment Type</Text>
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                    <TouchableOpacity
                        style={[styles.typeBtn, !isShared && styles.selected]}
                        onPress={() => {
                            setIsShared(false);
                            setValue("type", "solo");
                            setValue("is_shared", false);
                        }}
                    >
                        <Text>Solo</Text>
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
                            <View style={{ marginBottom: 16, zIndex: 3000 }}>
                                <Text style={{ marginBottom: 4, fontWeight: "500" }}>Return Type *</Text>
                                <DropDownPicker
                                    open={open}
                                    value={field.value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={(callback) => field.onChange(callback(field.value))}
                                    setItems={setItems}
                                    placeholder="Select Return Type"
                                    listMode="SCROLLVIEW"
                                    dropDownDirection="BOTTOM"
                                    style={{
                                        borderColor: fieldState.error ? "red" : "#ccc",
                                        borderRadius: 8,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#ccc",
                                    }}
                                />
                                {fieldState.error?.message && (
                                    <Text style={{ color: "red", marginTop: 4 }}>
                                        {fieldState.error.message}
                                    </Text>
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
                            <View style={{ marginBottom: 16, zIndex: 2000 }}>
                                <Text style={{ marginBottom: 4, fontWeight: "500" }}>Frequency *</Text>
                                <DropDownPicker
                                    open={open}
                                    value={field.value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={(callback) => field.onChange(callback(field.value))}
                                    setItems={setItems}
                                    placeholder="Select Frequency"
                                    listMode="SCROLLVIEW"
                                    dropDownDirection="BOTTOM"
                                    style={{
                                        borderColor: fieldState.error ? "red" : "#ccc",
                                        borderRadius: 8,
                                        // zIndex: 1000, // Ensure it appears above other elements
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#ccc",
                                        // zIndex: 1000, // Ensure it appears above other elements
                                    }}
                                />
                                {fieldState.error?.message && (
                                    <Text style={{ color: "red", marginTop: 4 }}>
                                        {fieldState.error.message}
                                    </Text>
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
                        ]);

                        return (
                            <View style={{ marginBottom: 16, zIndex: 1500 }}>
                                <Text style={{ marginBottom: 4, fontWeight: "500" }}>Status *</Text>
                                <DropDownPicker
                                    open={open}
                                    value={field.value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={(callback) => field.onChange(callback(field.value))}
                                    setItems={setItems}
                                    placeholder="Select Status"
                                    listMode="SCROLLVIEW"
                                    dropDownDirection="BOTTOM"
                                    style={{
                                        borderColor: fieldState.error ? "red" : "#ccc",
                                        borderRadius: 8,
                                        // zIndex: 1000, // Ensure it appears above other elements
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#ccc",
                                        // zIndex: 1000, // Ensure it appears above other elements
                                    }}
                                />
                                {fieldState.error?.message && (
                                    <Text style={{ color: "red", marginTop: 4 }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </View>
                        );
                    }}
                />


                {/* Expected Return Rate */}
                <Controller
                    control={control}
                    name="expected_return_rate"
                    render={({ field, fieldState }) => (
                        <Input
                            label="Expected Return Rate (%)"
                            keyboardType="numeric"
                            value={String(field.value || "")}
                            onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                            error={fieldState.error?.message}
                            required
                        />
                    )}
                />

                {/* Solo Fields */}
                {!isShared && (
                    <>
                        <Controller
                            control={control}
                            name="initial_amount"
                            render={({ field, fieldState }) => (
                                <Input
                                    label="Initial Amount"
                                    keyboardType="numeric"
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    error={fieldState.error?.message}
                                    required
                                />
                            )}
                        />
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
                                />
                            )}
                        />
                    </>
                )}

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
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    error={fieldState.error?.message}
                                    required
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
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingBottom: 80,
        paddingTop: 10,
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
        color: "#374151",
        marginBottom: 6,
    },
    typeBtn: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 4,
        backgroundColor: Colors.white,
    },
    selected: {
        backgroundColor: "#d0f0c0",
        borderColor: "#4CAF50",
        color: "white",
    },
});
export default InvestmentForm;