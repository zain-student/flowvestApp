// src/features/exportReport/exportReportSlice.ts
import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api"; // Your axios instance
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastAndroid } from "react-native";
interface ExportReportState {
  loading: boolean;
  error: string | null;
  dataExpo: any | null;
}

const initialState: ExportReportState = {
  loading: false,
  error: null,
  dataExpo: null,
};

// Async thunk
export const exportReport = createAsyncThunk<
  any, // return type
  { reportType: string; fileType: string }, // argument
  { rejectValue: string }
>("exportReport/exportReport", async ({ reportType, fileType }, { rejectWithValue }) => {
  try {
    const response = await api.post(API_ENDPOINTS.ADMIN.REPORTS.EXPORT_PDF, {
      report_type: reportType,
      file_type: fileType,
    });

    if (response.data.success) {
      ToastAndroid.show("Report generated successfully!", ToastAndroid.SHORT);
      console.log("Response of Report:",response.data.data);
      return response.data.data;
    } else {
      return rejectWithValue(response.data.message || "Failed to generate report");
    }
  } catch (error: any) {
    console.log("Export report error: ", error);
    return rejectWithValue(error.message || "Something went wrong");
  }
});

const exportReportSlice = createSlice({
  name: "exportReport",
  initialState,
  reducers: {
    clearExportData: (state) => {
      state.dataExpo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportReport.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.dataExpo = action.payload;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to export report";
        ToastAndroid.show(state.error, ToastAndroid.LONG);
      });
  },
});

export const { clearExportData } = exportReportSlice.actions;
export default exportReportSlice.reducer;
