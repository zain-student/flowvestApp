import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@store/index";
import { ToastAndroid } from "react-native";
interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  status: string;
  priority: string;
  scheduled_at: string;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
  recipient?: {
    id: number;
    name: string;
    email: string;
  };
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  has_more_pages: boolean;
}

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
  notifications: NotificationItem[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  isPaginating: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  settings: null,
  notifications: [],
  pagination: null,
  isLoading: false,
  isPaginating: false,
  error: null,
};

// Thunk for GET notification settings
export const fetchNotificationSettings = createAsyncThunk(
  "notifications/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.ADMIN.NOTIFICATIONS.SETTINGS,
      );
      console.log("Fetched notification settings:", response.data);
      ToastAndroid.show("Notification settings loaded", ToastAndroid.SHORT);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load settings",
      );
    }
  },
);
// Thunk for UPDATE notification settings
export const updateNotificationSettings = createAsyncThunk(
  "notifications/updateSettings",
  async (payload: NotificationSettings, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.ADMIN.NOTIFICATIONS.UPDATE_SETTINGS,
        payload,
      );
      console.log("Updated notification settings:", response.data);
      ToastAndroid.show("Notification settings updated", ToastAndroid.SHORT);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update settings",
      );
    }
  },
);
// Thunk for fetch all notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (
    { recipientId, page = 1 }: { recipientId: number; page?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.ADMIN.NOTIFICATIONS.LIST}?recipient_id=${recipientId}&page=${page}`,
      );

      const { notifications, pagination } = response.data.data;
      console.log("Fetched Notifications:", response.data);
      return { notifications, pagination, page };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
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
      })
      // Fetch notifications reducers
      .addCase(fetchNotifications.pending, (state, action) => {
        const page = action.meta.arg?.page ?? 1; // safely extract page number
        if (page > 1) state.isPaginating = true;
        else state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, pagination, page } = action.payload;
        state.isLoading = false;
        state.isPaginating = false;
        state.pagination = pagination;

        if (page === 1) {
          state.notifications = notifications;
        } else {
          // Append for next pages
          const newOnes = notifications.filter(
            (n: any) =>
              !state.notifications.some((existing) => existing.id === n.id),
          );
          state.notifications = [...state.notifications, ...newOnes];
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isPaginating = false;
        state.error = action.payload as string;
      });
  },
});

export const selectHasUnreadNotifications = (state: RootState) =>
  state.notificationSettings.notifications.some((n) => n.read_at === null);

export const selectUnreadCount = (state: RootState) =>
  state.notificationSettings.notifications.filter((n) => n.read_at === null)
    .length;
export default notificationSlice.reducer;
