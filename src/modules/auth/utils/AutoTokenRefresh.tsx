import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from "@modules/auth/store/authSlice";
import { useAppDispatch, useAppSelector } from "@store/index";
import { useEffect } from "react";
import { setupAutoTokenRefresh } from "../components/setupAutoTokenRefresh";

export const AutoTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authInitialized = useAppSelector(selectAuthInitialized);
  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      setupAutoTokenRefresh(dispatch);
    }
  }, [dispatch, isAuthenticated, authInitialized]);

  return null;
};

export default AutoTokenRefresh;
