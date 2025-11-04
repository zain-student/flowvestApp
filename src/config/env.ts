/**
 * Environment Configuration
 * Manages all environment variables and API endpoints
 */

interface EnvironmentConfig {
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  DEBUG_MODE: boolean;
  JWT_REFRESH_THRESHOLD: number; // minutes before expiry to refresh token
  REQUEST_TIMEOUT: number; // milliseconds
  MAX_RETRY_ATTEMPTS: number;
  ENABLE_BIOMETRICS: boolean;
  ENABLE_ANALYTICS: boolean;
}

const ENV: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://smartpayout.outscalers.com/api', // Default to production API
  // 'http://localhost:8000/api'
  
  
  // App Configuration
  APP_NAME: 'FlowVest',
  APP_VERSION: '1.0.0',
  ENVIRONMENT: (process.env.EXPO_PUBLIC_ENVIRONMENT as any) || 'development',
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  
  // Authentication
  JWT_REFRESH_THRESHOLD: 5, // Refresh token 5 minutes before expiry
  
  // Network
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  
  // Features
  ENABLE_BIOMETRICS: true,
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Base URL (already includes /api)
  BASE_URL: ENV.API_BASE_URL,
  
  // Authentication
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh',
    ME: '/v1/auth/me',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    CHANGE_PASSWORD: '/v1/auth/change-password',
    UPDATE_PROFILE: '/v1/auth/profile',
  },
  
  // Dashboard
  DASHBOARD: {
    ADMIN: '/v1/admin/reports/dashboard-summary',
    USER: '/v1/user/dashboard',
  },
  
  // Investments
  INVESTMENTS: {
    LIST: '/v1/investments',
    CREATE: '/v1/investments',
    DETAIL: (id: number) => `/v1/investments/${id}`,
    UPDATE: (id: number) => `/v1/investments/${id}`,
    DELETE: (id: number) => `/v1/investments/${id}`,
    JOIN: (id: number) => `/v1/investments/${id}/join`,
    LEAVE: (id: number) => `/v1/investments/${id}/leave`,
    PAUSE: (id: number) => `/v1/investments/${id}/pause`,
    RESUME: (id: number) => `/v1/investments/${id}/resume`,
    DUPLICATE: (id: number) => `/v1/investments/${id}/duplicate`,
    COMPLETE: (id: number) => `/v1/investments/${id}/complete`,
    ANALYTICS: (id: number) => `/v1/investments/${id}/analytics`,
    SHARED_AVAILABLE: '/v1/investments/shared/available',
    PAYOUTS: (id: number) => `/v1/investments/${id}/payouts`,
    CREATE_MANUAL_PAYOUT: (id: number) => `/v1/investments/${id}/payouts/manual`,
    INVESTMENT_PARTNERS: (id: number) => `/v1/investments/${id}/partners`,
    ADD_PARTNER:(id: number) => `/v1/investments/${id}/partners/invite`,
    APPROVE_PARTNER: (investmentId: number, partnerId: number) =>`/v1/investments/${investmentId}/partners/${partnerId}/approve`,
  },
  
  // Payouts
  PAYOUTS: {
    LIST: '/v1/payouts/managed',
    DETAIL: (id: number) => `/v1/payouts/managed/${id}`,
    MARK_PAID: (id: number) => `/v1/payouts/managed/${id}`,
    CANCEL: (id: number) => `/v1/payouts/managed/${id}`,
    RESCHEDULE: (id: number) => `/v1/payouts/${id}/reschedule`,
    UPCOMING: '/v1/payouts/upcoming/all',
    OVERDUE: '/v1/payouts/overdue/all',
    STATISTICS: '/v1/payouts/managed/statistics',
    BULK_MARK_PAID: '/v1/payouts/managed/bulk-update',
  },
  
  // Portfolio
  PORTFOLIO: {
    INDEX: '/v1/portfolio',
    SUMMARY: '/v1/portfolio/summary',
    PARTICIPATIONS: '/v1/portfolio/participations',
    PERFORMANCE: '/v1/portfolio/performance',
    HISTORY: '/v1/portfolio/history',
    DIVERSITY: '/v1/portfolio/diversity',
  },
  
  // Profile
  PROFILE: {
    GET: '/v1/profile',
    UPDATE: '/v1/profile',
    PREFERENCES: '/v1/profile/preferences',
    SETTINGS: '/v1/profile/settings',
    UPLOAD_AVATAR:"/v1/profile/avatar"
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/v1/notifications',
    MARK_READ: (id: string) => `/v1/notifications/${id}/read`,
    SETTINGS: '/v1/notifications/settings',
  },
  
  // Public endpoints
  PUBLIC: {
    COMPANY_INFO: '/v1/public/company-info',
    PLATFORM_STATS: '/v1/public/platform-stats',
    HEALTH: '/v1/health',
    DOCS: '/v1/docs',
  },
  
  // Admin-specific endpoints
  ADMIN: {
    INVESTMENTS: {
      LIST: '/v1/admin/investments',
      CREATE: '/v1/admin/investments',
      DETAIL: (id: string) => `/v1/admin/investments/${id}`,
      UPDATE: (id: string) => `/v1/admin/investments/${id}`,
      DELETE: (id: string) => `/v1/admin/investments/${id}`,
      DUPLICATE: (id: string) => `/v1/admin/investments/${id}/duplicate`,
      PAUSE: (id: string) => `/v1/admin/investments/${id}/pause`,
      RESUME: (id: string) => `/v1/admin/investments/${id}/resume`,
      AUDIT_LOG: (id: string) => `/v1/admin/investments/${id}/audit-log`,
    },
    PAYOUTS: {
      LIST: '/v1/admin/payouts',
      CREATE: '/v1/admin/payouts',
      DETAIL: (id: string) => `/v1/admin/payouts/${id}`,
      UPDATE: (id: string) => `/v1/admin/payouts/${id}`,
      CANCEL: (id: string) => `/v1/admin/payouts/${id}/cancel`,
      EXECUTE: (id: string) => `/v1/admin/payouts/${id}/execute`,
      UPDATE_STATUS: (id: string) => `/v1/admin/payouts/${id}/status`,
      UPCOMING: '/v1/admin/payouts/upcoming',
      OVERDUE: '/v1/admin/payouts/overdue',
      BULK_EXECUTE: '/v1/admin/payouts/bulk-execute',
    },
    PARTNERS: {
      LIST: '/v1/admin/partners',
      CREATE: '/v1/admin/partners',
      DETAIL: (id: number) => `/v1/admin/partners/${id}`,
      UPDATE: (id: number) => `/v1/admin/partners/${id}`,
      DEACTIVATE: (id: number) => `/v1/admin/partners/${id}`,
      INVESTMENTS: (id: number) => `/v1/admin/partners/${id}/investments`,
      PAYOUTS: (id: number) => `/v1/admin/partners/${id}/payouts`,
      PERFORMANCE: (id: number) => `/v1/admin/partners/${id}/performance`,
    },
    REPORTS: {
      DASHBOARD_SUMMARY: '/v1/admin/reports/dashboard-summary',
      PARTNER_PERFORMANCE: '/v1/admin/reports/partner-performance',
      INVESTMENT_SUMMARY: '/v1/admin/reports/investment-summary',
      PAYOUT_SUMMARY: '/v1/admin/reports/payout-summary',
      ROI_ANALYSIS: '/v1/admin/reports/roi-analysis',
      EXPORT_PDF: '/v1/admin/reports/export-pdf',
      EXPORT_CSV: '/v1/admin/reports/export-csv',
      AUDIT_TRAIL: '/v1/admin/reports/audit-trail',
    },
    NOTIFICATIONS: {
      LIST: '/v1/admin/notifications',
      SEND: '/v1/admin/notifications',
      TEMPLATES: '/v1/admin/notifications/templates',
      PAYOUT_REMINDERS: '/v1/admin/notifications/payout-reminders',
      SETTINGS: '/v1/admin/notifications/settings',
      UPDATE_SETTINGS: '/v1/admin/notifications/settings',
    },
  },
  
  // User-specific endpoints
  USER: {
    PORTFOLIO: {
      LIST: '/v1/user/portfolio',
      PERFORMANCE: '/v1/user/portfolio/performance',
      HISTORY: '/v1/user/portfolio/history',
      SUMMARY: '/v1/user/portfolio/summary',
    },
    PAYOUTS: {
      LIST: '/v1/user/payouts',
      DETAIL: (id: string) => `/v1/user/payouts/${id}`,
      HISTORY: '/v1/user/payouts/history',
      UPCOMING: '/v1/user/payouts/upcoming',
    },
    INVESTMENTS: {
      LIST: '/v1/user/investments',
      DETAIL: (id: string) => `/v1/user/investments/${id}`,
      PAYOUTS: (id: string) => `/v1/user/investments/${id}/payouts`,
    },
  },
};

export default ENV; 