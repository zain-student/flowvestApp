import { storage, StorageKeys } from '@/shared/services/storage';
import { AppDispatch } from '@/shared/store';
import { refreshToken } from '../store/authSlice';

export const setupAutoTokenRefresh = async (dispatch: AppDispatch) => {
  const expiresAt = await storage.getItem(StorageKeys.EXPIRES_AT);
  if (!expiresAt) return;

  const expiresAtTime = new Date(expiresAt).getTime();
  const now = Date.now();

  const refreshThreshold = 2 * 60 * 1000; // 2 minutes
  const timeUntilExpiry = expiresAtTime - now;

  // If already expired or within refresh threshold, refresh now
  if (timeUntilExpiry <= refreshThreshold) {
    console.log("Token expired or near expiry. Refreshing now...");
    dispatch(refreshToken());
  } else {
    // Else, schedule refresh before 2 minutes of expiry
    const refreshDelay = timeUntilExpiry - refreshThreshold;
    console.log(`Scheduling token refresh in ${refreshDelay / 1000} seconds`);
    setTimeout(() => {
      dispatch(refreshToken());
    }, refreshDelay);
  }
};
