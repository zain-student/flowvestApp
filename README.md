# 📱 FlowVest Mobile App

## 🎯 Overview

**FlowVest Mobile** is the native React Native/Expo mobile application for the FlowVest Investment & Payout Management platform. This app provides a modern, intuitive interface for investment managers (Admins) and investors (Users) to access their investment portfolios, track payouts, and manage their financial data on-the-go.

The mobile app integrates seamlessly with the [FlowVest Laravel API backend](../flowvestBackend/) via JWT authentication and RESTful API calls.

---

## 🏗️ Architecture & Technology Stack

### **Core Technologies**
- **Framework**: React Native with Expo SDK 51+
- **Language**: TypeScript 5.x
- **Navigation**: React Navigation 7.x with Expo Router
- **State Management**: Redux Toolkit with RTK Query
- **Persistence**: Redux Persist with MMKV (encrypted storage)
- **Authentication**: JWT token-based with refresh capability
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **UI Framework**: React Native with custom styled components

### **Project Structure**
```
src/
├── app/                    # Main app configuration
│   ├── AppProvider.tsx     # Root providers and context
│   ├── RootNavigator.tsx   # Authentication flow routing
│   └── AppTabNavigator.tsx # Main app navigation
├── modules/                # Feature-based modules
│   ├── auth/              # Authentication module
│   ├── dashboard/         # Dashboard module (planned)
│   ├── investments/       # Investments module (planned)
│   ├── payouts/          # Payouts module (planned)
│   └── notifications/    # Notifications module (planned)
├── shared/                # Shared utilities and components
│   ├── components/       # Reusable UI components
│   ├── services/        # API and business logic services
│   ├── store/          # Redux store configuration
│   ├── theme/          # Design system (planned)
│   └── utils/          # Helper functions
└── config/             # Environment and configuration
```

---

## 🔐 Authentication & User Roles

### **Supported User Roles**
- **Superadmin** - Full system access (web interface only)
- **Admin** - Investment managers and companies
- **User** - Investors and partners receiving payouts

### **Authentication Features**
- ✅ **Role-based registration** with company and invitation flows
- ✅ **JWT token management** with automatic refresh
- ✅ **Secure storage** using MMKV encryption
- ✅ **Biometric authentication** support (planned)
- ✅ **Remember me** functionality
- ✅ **Password reset** flow

### **Registration Flows**

#### **Admin Registration** (Investment Managers)
- Company name required
- Automatic admin role assignment
- Can invite users to join their company

#### **User Registration (Invited)**
- Requires invitation token from existing company
- Links user to company automatically
- Access to company's investment programs

#### **User Registration (Independent)**
- Self-managed investors
- Create own company profile
- Company types: Individual, Private, Silent Partnership, Holding

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (Mac) or Android Emulator
- FlowVest Backend API running on `http://localhost:8000`

### **Installation**

1. **Clone and navigate to the project**
   ```bash
   git clone <repository-url>
   cd flowvestApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Update src/config/env.ts with your API endpoints
   # Default: http://localhost:8000/api/v1
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

---

## 📋 Implementation Status

### ✅ **Completed Features**

#### **Core Infrastructure**
- [x] Project setup with Expo SDK 51+
- [x] TypeScript configuration with path aliases
- [x] Redux Toolkit store with persistence
- [x] Navigation structure (Auth + Main App)
- [x] Environment configuration
- [x] Error handling and logging

#### **Authentication System**
- [x] JWT token management with auto-refresh
- [x] Secure storage with MMKV encryption
- [x] Login form with validation
- [x] Multi-step registration with role selection
- [x] Forgot password flow
- [x] Role-based UI flows
- [x] Form validation with Zod schemas

#### **UI Components Library**
- [x] Button component (variants: primary, secondary, outline, ghost)
- [x] Input component (email, password, text with validation)
- [x] Select component with modal picker
- [x] Form components with error handling
- [x] Loading states and feedback

#### **API Integration**
- [x] Axios HTTP client with interceptors
- [x] Authentication service with all endpoints
- [x] Error handling and user-friendly messages
- [x] Request/response type definitions
- [x] Automatic token refresh logic

### 🚧 **Planned Features**

#### **Core Modules** (Ready for Development)
- [ ] **Dashboard** - Portfolio overview and analytics
- [ ] **Investments** - Investment management and tracking
- [ ] **Payouts** - Payout history and scheduling
- [ ] **Portfolio** - Personal portfolio management
- [ ] **Profile** - User profile and settings
- [ ] **Notifications** - Push notifications and alerts

#### **Advanced Features**
- [ ] **Biometric Authentication** - Face ID/Touch ID/Fingerprint
- [ ] **Offline Support** - Cache critical data locally
- [ ] **Push Notifications** - Real-time payout and investment alerts
- [ ] **PDF Reports** - Export investment and payout reports
- [ ] **Dark Mode** - Theme switching capability
- [ ] **Multi-language** - Internationalization support

---

## 🔧 Development Guidelines

### **Code Organization**
- **Feature-based modules**: Each feature has its own folder with components, services, and state
- **Shared utilities**: Common components and services in `/shared`
- **Type safety**: Full TypeScript implementation with strict typing
- **State management**: Redux Toolkit with normalized state shape

### **Component Standards**
```typescript
// Example component structure
interface ComponentProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Component: React.FC<ComponentProps> = ({
  title,
  onPress,
  variant = 'primary'
}) => {
  // Component implementation
};
```

### **API Service Pattern**
```typescript
// Service methods return typed responses
class InvestmentService {
  async getInvestments(): Promise<Investment[]> {
    const response = await apiClient.get<ApiResponse<Investment[]>>('/investments');
    return response.data;
  }
}
```

### **Redux State Pattern**
```typescript
// Each module has its own slice
interface ModuleState {
  data: Item[];
  loading: boolean;
  error: string | null;
}

// Async thunks for API calls
export const fetchItems = createAsyncThunk(
  'module/fetchItems',
  async () => await service.getItems()
);
```

---

## 🌐 API Integration

### **Backend Endpoints**
The app integrates with the FlowVest Laravel API:

- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Bearer JWT tokens
- **Content-Type**: `application/json`

### **Key Endpoints**
```
POST /auth/register         # User registration
POST /auth/login           # User login
POST /auth/logout          # Token invalidation
POST /auth/refresh         # Token refresh
GET  /auth/me              # Current user profile
POST /auth/forgot-password # Password reset

GET  /investments          # List investments
POST /investments          # Create investment
GET  /investments/{id}     # Get investment details

GET  /payouts              # List payouts
GET  /payouts/{id}         # Get payout details
```

### **Authentication Flow**
1. User logs in → Receive JWT + refresh token
2. Store tokens securely with MMKV
3. Include Bearer token in all API requests
4. Auto-refresh token when expired
5. Logout clears all stored data

---

## 🧪 Testing & Quality

### **Code Quality**
- **TypeScript**: Strict mode enabled with zero compilation errors
- **ESLint**: Configured with React Native and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Type Safety**: Full type coverage for API responses and state

### **Testing Strategy** (Planned)
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service and Redux state testing
- **E2E Tests**: Critical user flows with Detox
- **Performance**: React Native performance monitoring

### **Development Commands**
```bash
# Type checking
npx tsc --noEmit

# Linting
npx eslint src/

# Formatting
npx prettier --write src/

# Build for production
npx expo build

# Run tests (when implemented)
npm test
```

---

## 📱 Platform Support

### **Target Platforms**
- **iOS**: 13.0+ (Expo managed workflow)
- **Android**: API level 21+ (Android 5.0+)
- **Development**: iOS Simulator, Android Emulator, Expo Go

### **Device Features**
- **Biometric Authentication**: Face ID, Touch ID, Fingerprint
- **Secure Storage**: Hardware-backed keystore when available
- **Network Detection**: Online/offline status monitoring
- **Push Notifications**: Firebase Cloud Messaging (FCM)

---

## 🚀 Deployment

### **Build Process**
```bash
# Development build
npx expo build

# Production build (EAS Build recommended)
npm install -g @expo/eas-cli
eas build --platform all

# Preview build for testing
eas build --profile preview
```

### **Environment Configuration**
- **Development**: `src/config/env.ts` → localhost API
- **Staging**: Update API endpoints for staging environment
- **Production**: Update API endpoints for production environment

---

## 🤝 Contributing

### **Development Workflow**
1. Create feature branch from `main`
2. Implement feature with TypeScript
3. Add/update types and interfaces
4. Test on both iOS and Android
5. Ensure zero TypeScript errors
6. Submit pull request with clear description

### **Commit Convention**
```
feat: add investment dashboard screen
fix: resolve token refresh issue
docs: update API integration guide
refactor: improve component structure
test: add authentication flow tests
```

### **Code Review Checklist**
- [ ] TypeScript compilation passes
- [ ] No ESLint warnings
- [ ] Component props are properly typed
- [ ] API responses are typed
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Tested on iOS and Android

---

## 📞 Support & Documentation

### **Additional Resources**
- **Backend API**: See `../flowvestBackend/README.md`
- **API Documentation**: `http://localhost:8000/docs` (when backend is running)
- **Expo Documentation**: [https://docs.expo.dev](https://docs.expo.dev)
- **React Navigation**: [https://reactnavigation.org](https://reactnavigation.org)

### **Development Team Notes**
- All authentication flows are complete and tested
- Redux store is configured with proper persistence
- API integration is ready for all planned modules
- UI component library provides consistent design
- TypeScript ensures type safety throughout the app

**Ready for feature development!** 🚀

---

## 📄 License

This project is part of the FlowVest Investment Management platform. All rights reserved.
