import Colors from "@/shared/colors/Colors";
import { Button, Input } from "@/shared/components/ui"; // custom styled input
import { DatePicker } from "@/shared/components/ui/DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    sharedInvestmentSchema,
    soloInvestmentSchema,
} from "@modules/auth/utils/authValidation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export const AddInvestments = () => {
    const [isShared, setIsShared] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { control, handleSubmit, reset, setValue } = useForm({
        resolver: zodResolver(isShared ? sharedInvestmentSchema : soloInvestmentSchema),
        defaultValues: {
            name: "",
            description: "",
            is_shared: false,
            return_type: "percentage",
            frequency: "monthly",
            expected_return_rate: "",
            initial_amount: "",
            notes: "",
            total_target_amount: "",
            min_investment_amount: "",
            max_investment_amount: "",
            start_date: '',
            end_date: '',
        },
    });
    useEffect(() => {
        reset();
    }, [])

    const onSubmit = (data: any) => {
        // console.log("Pressed")
        console.log("Final API Payload:", data);
        reset();
        // call createInvestment API here
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.innerContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Create an Investment</Text>
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
                <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: 6,
                }}>Investment Type</Text>
                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                    <TouchableOpacity

                        style={[styles.typeBtn, !isShared && styles.selected]}
                        onPress={() => {
                            setIsShared(false);
                            setValue("is_shared", false);
                            // reset({ ...control.getValues(), is_shared: false });
                        }}
                    >
                        <Text >Solo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBtn, isShared && styles.selected]}
                        onPress={() => {
                            setIsShared(true);
                            setValue("is_shared", true);
                            // reset({ ...control.getValues(), is_shared: true });

                        }}
                    >
                        <Text>Shared</Text>
                    </TouchableOpacity>
                </View>

                {/* Return Type */}
                <Controller
                    control={control}
                    name="return_type"
                    render={({ field }) => (
                        <Input
                            label="Return Type"
                            placeholder="percentage / fixed / custom"
                            value={field.value}
                            onChangeText={field.onChange}
                            required
                        />
                    )}
                />

                {/* Frequency */}
                <Controller
                    control={control}
                    name="frequency"
                    render={({ field }) => (
                        <Input
                            label="Frequency"
                            placeholder="monthly / quarterly / annual / manual"
                            value={field.value}
                            onChangeText={field.onChange}
                            required
                        />
                    )}
                />

                {/* Expected Return Rate */}
                <Controller
                    control={control}
                    name="expected_return_rate"
                    render={({ field }) => (
                        <Input
                            label="Expected Return Rate (%)"
                            keyboardType="numeric"
                            value={String(field.value || "")}
                            onChangeText={(v) => field.onChange(parseFloat(v) || "")}
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
                            render={({ field }) => (
                                <Input
                                    label="Initial Amount"
                                    keyboardType="numeric"
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    required
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="notes"
                            render={({ field }) => (
                                <Input
                                    label="Notes"
                                    value={field.value}
                                    onChangeText={field.onChange}
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
                            render={({ field }) => (
                                <Input
                                    label="Total Target Amount"
                                    keyboardType="numeric"
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    required
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="min_investment_amount"
                            render={({ field }) => (
                                <Input
                                    label="Minimum Investment Amount"
                                    keyboardType="numeric"
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    required
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="max_investment_amount"
                            render={({ field }) => (
                                <Input
                                    label="Maximum Investment Amount"
                                    keyboardType="numeric"
                                    value={String(field.value || "")}
                                    onChangeText={(v) => field.onChange(parseFloat(v) || "")}
                                    required
                                />
                            )}
                        />
                    </>
                )}
                <Button
                    title="Create Investment"
                    onPress={handleSubmit(onSubmit)}
                    style={{
                        marginTop: 0,
                        backgroundColor: Colors.secondary,
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingBottom: 80,
        paddingTop: 10
    },
    innerContainer: {

    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
        color: Colors.secondary,
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
        // backgroundColor:Colors.secondary,
        borderColor: "#4CAF50",
        color: "white",

    },
    submitBtn: {
        backgroundColor: "#4CAF50",
        padding: 14,
        borderRadius: 8,
        marginTop: 20,
    },
});
