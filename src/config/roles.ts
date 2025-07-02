/**
 * Role Configuration
 * Defines user roles and their properties matching backend Spatie roles
 */

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

export interface RoleConfig {
  name: UserRole;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  canAccessWeb: boolean;
  canAccessMobile: boolean;
  registrationOptions: RegistrationOption[];
}

export interface RegistrationOption {
  type: 'default' | 'invited' | 'independent';
  label: string;
  description: string;
  requiresCompany: boolean;
  requiresInvitation: boolean;
  companyTypes?: CompanyType[];
}

export interface CompanyType {
  value: string;
  label: string;
  description: string;
}

// Company types for independent registration
export const COMPANY_TYPES: CompanyType[] = [
  {
    value: 'individual',
    label: 'Individual',
    description: 'Personal investment management',
  },
  {
    value: 'private',
    label: 'Private Company',
    description: 'Private investment company',
  },
  {
    value: 'silent',
    label: 'Silent Partner',
    description: 'Silent investment partnership',
  },
  {
    value: 'holding',
    label: 'Holding Company',
    description: 'Investment holding company',
  },
];

// Role configurations
export const ROLES: Record<UserRole, RoleConfig> = {
  [UserRole.SUPERADMIN]: {
    name: UserRole.SUPERADMIN,
    displayName: 'Super Admin',
    description: 'Full system access with administrative privileges',
    color: '#DC2626', // red-600
    icon: 'shield-account',
    canAccessWeb: true,
    canAccessMobile: false, // Superadmins use web interface only
    registrationOptions: [], // Cannot register as superadmin
  },
  
  [UserRole.ADMIN]: {
    name: UserRole.ADMIN,
    displayName: 'Admin',
    description: 'Investment manager or company administrator',
    color: '#2563EB', // blue-600
    icon: 'briefcase-account',
    canAccessWeb: false,
    canAccessMobile: true,
    registrationOptions: [
      {
        type: 'default',
        label: 'Company Admin',
        description: 'Register as an investment company administrator',
        requiresCompany: true,
        requiresInvitation: false,
      },
    ],
  },
  
  [UserRole.USER]: {
    name: UserRole.USER,
    displayName: 'Investor',
    description: 'Individual investor with portfolio access',
    color: '#10B981', // green-600
    icon: 'account-cash',
    canAccessWeb: false,
    canAccessMobile: true,
    registrationOptions: [
      {
        type: 'invited',
        label: 'Join via Invitation',
        description: 'Join an existing investment company with an invitation code',
        requiresCompany: false,
        requiresInvitation: true,
      },
      {
        type: 'independent',
        label: 'Independent Investor',
        description: 'Create your own investment company',
        requiresCompany: true,
        requiresInvitation: false,
        companyTypes: COMPANY_TYPES,
      },
    ],
  },
};

// Helper functions
export const getRoleConfig = (role: UserRole): RoleConfig => {
  return ROLES[role];
};

export const getRoleDisplayName = (role: UserRole): string => {
  return ROLES[role]?.displayName || role;
};

export const getRoleColor = (role: UserRole): string => {
  return ROLES[role]?.color || '#6B7280';
};

export const canAccessMobile = (role: UserRole): boolean => {
  return ROLES[role]?.canAccessMobile || false;
};

export const getRegistrationOptions = (role: UserRole): RegistrationOption[] => {
  return ROLES[role]?.registrationOptions || [];
};

export const isAdminRole = (role: UserRole): boolean => {
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
};

export const isInvestorRole = (role: UserRole): boolean => {
  return role === UserRole.USER;
}; 