import { selectIsAuthenticated } from '@modules/auth/store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/index';
import { useEffect } from 'react';
import { setupAutoTokenRefresh } from '../components/setupAutoTokenRefresh';

export const AutoTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setupAutoTokenRefresh(dispatch);
    }
  }, [dispatch, isAuthenticated]);

  return null;
};

export default AutoTokenRefresh;