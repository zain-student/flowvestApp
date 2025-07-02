/**
 * Authentication Service
 * JWT token management and authentication API calls
 */

import { API_ENDPOINTS } from '../../config/env';
import { apiClient } from './api';
import { storage, StorageKeys } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'user';
  company_name?: string;
  company_type?: 'individual' | 'private' | 'silent' | 'holding';
  registration_type?: 'invited' | 'independent';
  invitation_token?: string;
  terms_accepted: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id?: number;
  company?: {
    id: number;
    name: string;
    type: string;
  };
  permissions: string[];
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refresh_token: string;
    expires_at: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    expires_at: string;
  };
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        // Store tokens and user data
        await this.storeAuthData(response.data);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      if (response.success && response.data) {
        // Store tokens and user data
        await this.storeAuthData(response.data);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with local logout even if server call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      await this.clearAuthData();
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken }
      );

      if (response.success && response.data) {
        // Store new token
        await storage.setItem(StorageKeys.AUTH_TOKEN, response.data.token);
        return response.data.token;
      }

      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      await this.clearAuthData();
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User }>(
        API_ENDPOINTS.AUTH.ME
      );

      if (response.success && response.data) {
        // Update stored user data
        await storage.setItem(StorageKeys.USER_DATA, response.data);
        return response.data;
      }

      throw new Error('Failed to get user profile');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );

      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Initialize authentication state from stored data
   */
  async initializeAuth(): Promise<{ isAuthenticated: boolean; user: User | null }> {
    try {
      const token = await this.getToken();
      
      if (!token) {
        return { isAuthenticated: false, user: null };
      }

      // Try to get current user to verify token validity
      const user = await this.getCurrentUser();
      return { isAuthenticated: true, user };
    } catch (error) {
      console.warn('Failed to initialize auth from stored data:', error);
      // Clear invalid stored data
      await this.clearAuthData();
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await storage.getItem(StorageKeys.AUTH_TOKEN);
      
      if (!token) {
        return false;
      }

      // Verify token by getting current user
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Token is invalid, clear auth data
      await this.clearAuthData();
      return false;
    }
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    return await storage.getItem(StorageKeys.AUTH_TOKEN);
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem(StorageKeys.REFRESH_TOKEN);
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    return await storage.getItem(StorageKeys.USER_DATA);
  }

  /**
   * Store authentication data
   */
  private async storeAuthData(authData: AuthResponse['data']): Promise<void> {
    await Promise.all([
      storage.setItem(StorageKeys.AUTH_TOKEN, authData.token),
      storage.setItem(StorageKeys.REFRESH_TOKEN, authData.refresh_token),
      storage.setItem(StorageKeys.USER_DATA, authData.user),
    ]);
  }

  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    await Promise.all([
      storage.removeItem(StorageKeys.AUTH_TOKEN),
      storage.removeItem(StorageKeys.REFRESH_TOKEN),
      storage.removeItem(StorageKeys.USER_DATA),
    ]);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ success: boolean; data: User }>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        data
      );

      if (response.success && response.data) {
        // Update stored user data
        await storage.setItem(StorageKeys.USER_DATA, response.data);
        return response.data;
      }

      throw new Error('Failed to update profile');
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
      );

      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Enable/disable biometric authentication
   */
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await storage.setItem(StorageKeys.BIOMETRICS_ENABLED, enabled);
  }

  /**
   * Check if biometric authentication is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    return (await storage.getItem(StorageKeys.BIOMETRICS_ENABLED)) || false;
  }

  /**
   * Verify user has required permissions
   */
  hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.permissions) {
      return false;
    }

    return user.permissions.includes(permission) || user.permissions.includes('*');
  }

  /**
   * Check if user has specific role
   */
  hasRole(user: User | null, role: string): boolean {
    if (!user) {
      return false;
    }

    return user.role === role;
  }

  /**
   * Check if user is admin or superadmin
   */
  isAdmin(user: User | null): boolean {
    return this.hasRole(user, 'admin') || this.hasRole(user, 'superadmin');
  }

  /**
   * Check if user is superadmin
   */
  isSuperAdmin(user: User | null): boolean {
    return this.hasRole(user, 'superadmin');
  }
}

// Export singleton instance
export const authService = new AuthService(); 