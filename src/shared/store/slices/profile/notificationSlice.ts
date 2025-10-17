import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ToastAndroid } from "react-native";
interface NotificationSettings {
  email_notifications: {
    enabled: boolean;
    payout_reminders: boolean;
    investment_updates: boolean;
    system_alerts: boolean;
  };
  sms_notifications: {
    enabled: boolean;
    payout_reminders: boolean;
    urgent_alerts: boolean;
  };
  push_notifications: {
    enabled: boolean;
    payout_reminders: boolean;
    investment_updates: boolean;
  };
  reminder_settings: {
    payout_reminder_days: number[];
    overdue_alert_days: number;
    investment_milestone_alerts: boolean;
  };
}

interface NotificationState {
  settings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  settings: null,
  isLoading: false,
  error: null,
};

// Thunk for GET notification settings
export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN.NOTIFICATIONS.SETTINGS
      );
      console.log("Fetched notification settings:", response.data);
      ToastAndroid.show("Notification settings loaded", ToastAndroid.SHORT);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load settings"
      );
    }
  }
);
// Thunk for UPDATE notification settings
export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (payload: NotificationSettings, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.ADMIN.NOTIFICATIONS.UPDATE_SETTINGS,
        payload
      );
      console.log("Updated notification settings:", response.data);
      ToastAndroid.show("Notification settings updated", ToastAndroid.SHORT);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update settings"
      );
    }
  }
);


const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        // FETCH SETTINGS
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // UPDATE SETTINGS
      .addCase(updateNotificationSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload; // replace with updated data
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default notificationSlice.reducer;
