import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
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

export const exportReport = createAsyncThunk<
  any,
  { reportType: string; fileType: "pdf" | "csv" },
  { rejectValue: string }
>(
  "exportReport/exportReport",
  async ({ reportType, fileType }, { rejectWithValue }) => {
    try {
      const endpoint =
        fileType === "csv"
          ? API_ENDPOINTS.ADMIN.REPORTS.EXPORT_CSV
          : API_ENDPOINTS.ADMIN.REPORTS.EXPORT_PDF;

      // Request
      const response = await api.post(
        endpoint,
        { report_type: reportType },
        {
          responseType: fileType === "csv" ? "text" : "blob",
        },
      );

      // ========== CSV FLOW ==========
      if (fileType === "csv") {
        const csvData = response.data;
        const filename = `${reportType}_${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.writeAsStringAsync(fileUri, csvData, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        }
        console.log("CSV data:", csvData);
        ToastAndroid.show("CSV exported successfully!", ToastAndroid.SHORT);
        console.log("CSV saved to:", fileUri);
        return { fileUri, type: "csv" };
      }

      // ========== PDF FLOW ==========
      // if (fileType === "pdf") {
      //   const { success, data } = response.data;
      //   if (!success) {
      //     return rejectWithValue("Failed to generate PDF report");
      //   }

      //   const pdfData = JSON.stringify(data.report_data, null, 2); // simple readable format
      //   const filename = data.filename || `${reportType}_${Date.now()}.pdf`;
      //   const fileUri = `${FileSystem.documentDirectory}${filename}`;

      //   // Convert text data to PDF-compatible bytes (mock format)
      //   await FileSystem.writeAsStringAsync(fileUri, pdfData, {
      //     encoding: FileSystem.EncodingType.UTF8,
      //   });

      //   if (await Sharing.isAvailableAsync()) {
      //     await Sharing.shareAsync(fileUri);
      //   }
      //   console.log("PDF data: ", pdfData);
      //   ToastAndroid.show("PDF exported successfully!", ToastAndroid.SHORT);
      //   console.log("PDF saved to:", fileUri);
      //   return { fileUri, type: "pdf" };
      // }
      if (fileType === "pdf") {
        // Assuming API now returns binary PDF
        const pdfBlob = response.data; // Blob from API

        // Create local file URI
        const filename = `${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        // Convert blob to base64 string for FileSystem
        const reader = new FileReader();
        const fileWritePromise = new Promise<void>((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64Data = (reader.result as string).split(",")[1]; // remove data:application/pdf;base64,
              await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
              });

              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
              }

              ToastAndroid.show(
                "PDF exported successfully!",
                ToastAndroid.SHORT,
              );
              resolve();
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
        });

        reader.readAsDataURL(pdfBlob); // read blob as base64
        await fileWritePromise;

        return { fileUri, type: "pdf" };
      }
    } catch (error: any) {
      console.error("Export report error: ", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  },
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
