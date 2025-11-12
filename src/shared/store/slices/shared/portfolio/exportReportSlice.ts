import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
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
  any,
  { reportType: string; fileType: "pdf" | "csv" },
  { rejectValue: string }
>(
  "exportReport/exportReport",
  async ({ reportType, fileType }, { rejectWithValue }) => {
    try {
      let endpoint =
        fileType === "csv"
          ? API_ENDPOINTS.ADMIN.REPORTS.EXPORT_CSV
          : API_ENDPOINTS.ADMIN.REPORTS.EXPORT_PDF;

      const response = await api.post(
        endpoint,
        { report_type: reportType },
        {
          responseType: fileType === "csv" ? "text" : "json", // Important for CSV
        }
      );

      if (fileType === "csv") {
        // CSV data comes as raw text
        const csvData = response.data;
        ToastAndroid.show(
          "CSV report generated successfully!",
          ToastAndroid.SHORT
        );
        console.log("CSV Response:", csvData);
        return csvData; // Return raw CSV string
      } else {
        // PDF API assumed to return { success, data, message }
        if (response.data.success) {
          ToastAndroid.show(
            "PDF report generated successfully!",
            ToastAndroid.SHORT
          );
          console.log("PDF Response:", response.data.data);
          return response.data.data;
        } else {
          return rejectWithValue(
            response.data.message || "Failed to generate PDF report"
          );
        }
      }
    } catch (error: any) {
      console.log("Export report error: ", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

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
