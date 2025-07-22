import { storage, StorageKeys } from "@/shared/services/storage";
import { AppDispatch } from "@/shared/store";
import { refreshToken } from "../store/authSlice";

export const setupAutoTokenRefresh = async(dispatch: AppDispatch) => {
const expiresAt = await storage.getItem(StorageKeys.EXPIRES_AT);
  if (!expiresAt) return;

  const expiresAtTime = new Date(expiresAt).getTime();
  const now = Date.now();

  const refreshTime = expiresAtTime - now - 2 * 60 * 1000; // 2 mins before

  if (refreshTime <= 0) {
    dispatch(refreshToken());
    return;
  }

  setTimeout(() => {
    dispatch(refreshToken());
  }, refreshTime);
};