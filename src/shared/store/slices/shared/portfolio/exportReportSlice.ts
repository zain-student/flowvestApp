import { API_ENDPOINTS } from "@/config/env";
import { showToast } from "@/modules/auth/utils/showToast";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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
        showToast("CSV exported successfully!");
        return { fileUri, type: "csv" };
      }

      // ========== PDF FLOW ==========
      if (fileType === "pdf") {
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

              showToast("PDF exported successfully!");
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
        showToast(state.error, "error");
      });
  },
});

export const { clearExportData } = exportReportSlice.actions;
export default exportReportSlice.reducer;
