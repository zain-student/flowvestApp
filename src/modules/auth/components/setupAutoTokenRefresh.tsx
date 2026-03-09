import { storage, StorageKeys } from "@/shared/services/storage";
import { AppDispatch } from "@/shared/store";
import { refreshToken } from "../store/authSlice";

export const setupAutoTokenRefresh = async (dispatch: AppDispatch) => {
  const expiresAt = await storage.getItem(StorageKeys.EXPIRES_AT);
  if (!expiresAt) return;

  const expiresAtTime = new Date(expiresAt).getTime();
  const now = Date.now();

  const refreshThreshold = 2 * 60 * 1000; // 2 minutes
  const timeUntilExpiry = expiresAtTime - now;

  // If already expired or within refresh threshold, refresh now
  if (timeUntilExpiry <= refreshThreshold) {
    
    dispatch(refreshToken());
  } else {
    // Else, schedule refresh before 2 minutes of expiry
    const refreshDelay = timeUntilExpiry - refreshThreshold;

    setTimeout(() => {
      dispatch(refreshToken());
    }, refreshDelay);
  }
};
