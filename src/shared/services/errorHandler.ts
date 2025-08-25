/**
 * Error Handler Service
 * Centralized error handling with user-friendly messages
 */

import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
  data?: any;
}

class ErrorHandler {
  /**
   * Handle API errors and convert them to user-friendly messages
   */
  handle(error: any): ApiError {
    // Handle Axios errors
    if (error.isAxiosError || error instanceof AxiosError) {
      return this.handleAxiosError(error);
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return this.handleValidationError(error);
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR') {
      return {
        message: 'Please check your internet connection and try again.',
        code: 'NETWORK_ERROR',
      };
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT_ERROR',
      };
    }

    // Default error
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Handle Axios-specific errors
   */
  private handleAxiosError(error: AxiosError): ApiError {
    const status = error.response?.status;
    const data = error.response?.data as any;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Invalid request. Please check your input.',
          status,
          code: 'BAD_REQUEST',
          data,
        };

      case 401:
        return {
          message: 'Your session has expired. Please log in again.',
          status,
          code: 'UNAUTHORIZED',
        };

      case 403:
        return {
          message: 'You do not have permission to perform this action.',
          status,
          code: 'FORBIDDEN',
        };

      case 404:
        return {
          message: 'The requested resource was not found.',
          status,
          code: 'NOT_FOUND',
        };

      case 409:
        return {
          message: data?.message || 'A conflict occurred. Please try again.',
          status,
          code: 'CONFLICT',
          data,
        };

      case 422:
        // Handle validation errors from Laravel
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          return {
            message: firstError?.[0] || 'Validation failed.',
            status,
            code: 'VALIDATION_ERROR',
            data: data.errors,
          };
        }
        return {
          message: data?.message || 'Validation failed.',
          status,
          code: 'VALIDATION_ERROR',
          data,
        };

      case 429:
        return {
          message: 'Too many requests. Please wait a moment and try again.',
          status,
          code: 'RATE_LIMIT',
        };

      case 500:
        return {
          message: data?.message ||'Server error. Please try again later.',
          status,
          code: data?.error_code || 'SERVER_ERROR',
          data,
        };

      case 502:
      case 503:
      case 504:
        return {
          message: 'Service temporarily unavailable. Please try again later.',
          status,
          code: 'SERVICE_UNAVAILABLE',
        };

      default:
        return {
          message: data?.message || error.message || 'An unexpected error occurred.',
          status,
          code: 'HTTP_ERROR',
          data,
        };
    }
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: any): ApiError {
    return {
      message: error.message || 'Validation failed.',
      code: 'VALIDATION_ERROR',
      data: error.errors,
    };
  }

  /**
   * Get user-friendly message for common error codes
   */
  getUserFriendlyMessage(code: string): string {
    const messages: Record<string, string> = {
      NETWORK_ERROR: 'Please check your internet connection.',
      TIMEOUT_ERROR: 'Request timed out. Please try again.',
      UNAUTHORIZED: 'Please log in again.',
      FORBIDDEN: 'You do not have permission for this action.',
      NOT_FOUND: 'Resource not found.',
      VALIDATION_ERROR: 'Please check your input.',
      RATE_LIMIT: 'Too many requests. Please wait.',
      SERVER_ERROR: 'Server error. Please try again later.',
      SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
    };

    return messages[code] || 'An unexpected error occurred.';
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: ApiError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'RATE_LIMIT',
      'SERVER_ERROR',
      'SERVICE_UNAVAILABLE',
    ];

    return retryableCodes.includes(error.code || '');
  }

  /**
   * Log error for debugging (development only)
   */
  logError(error: any, context?: string): void {
    if (__DEV__) {
      console.group(`🚨 Error ${context ? `(${context})` : ''}`);
      console.error('Original error:', error);
      console.error('Handled error:', this.handle(error));
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler(); 