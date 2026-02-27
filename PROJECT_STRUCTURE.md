# InvstrHub Mobile App - Project Structure & Best Practices

## 📁 Project Structure

```
invstrhubApp/
├── src/
│   ├── /app
│   │   ├── App.tsx                     # Entry point with providers and navigation
│   │   ├── AppProvider.tsx             # Global providers (Redux, Theme, Auth)
│   │   ├── RootNavigator.tsx           # Main navigation handler (Auth vs App)
│   │   └── navigation.ts               # Global navigation utilities
│   │
│   ├── /modules                        # Feature-first modular architecture
│   │   ├── /auth
│   │   │   ├── /screens
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RegisterScreen.tsx
│   │   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   └── ChangePasswordScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── RoleSelector.tsx
│   │   │   │   └── CompanyTypeSelector.tsx
│   │   │   ├── AuthStack.tsx           # Auth module navigation
│   │   │   ├── /services
│   │   │   │   └── authApi.ts          # Auth API calls
│   │   │   ├── /hooks
│   │   │   │   ├── useAuth.ts          # Auth business logic
│   │   │   │   └── useRegister.ts      # Registration logic
│   │   │   ├── /store
│   │   │   │   ├── authSlice.ts        # Redux auth slice
│   │   │   │   └── authTypes.ts        # Auth type definitions
│   │   │   └── /utils
│   │   │       ├── authValidation.ts   # Form validation schemas
│   │   │       └── roleHelpers.ts      # Role-specific utilities
│   │   │
│   │   ├── /dashboard
│   │   │   ├── /screens
│   │   │   │   ├── DashboardScreen.tsx
│   │   │   │   ├── AdminDashboardScreen.tsx
│   │   │   │   └── UserDashboardScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   ├── UpcomingPayouts.tsx
│   │   │   │   └── PerformanceChart.tsx
│   │   │   ├── DashboardStack.tsx
│   │   │   ├── /services
│   │   │   │   └── dashboardApi.ts
│   │   │   ├── /hooks
│   │   │   │   └── useDashboard.ts
│   │   │   └── /store
│   │   │       └── dashboardSlice.ts
│   │   │
│   │   ├── /investments
│   │   │   ├── /screens
│   │   │   │   ├── InvestmentsListScreen.tsx
│   │   │   │   ├── InvestmentDetailScreen.tsx
│   │   │   │   ├── CreateInvestmentScreen.tsx
│   │   │   │   ├── EditInvestmentScreen.tsx
│   │   │   │   ├── JoinInvestmentScreen.tsx
│   │   │   │   └── SharedInvestmentsScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── InvestmentCard.tsx
│   │   │   │   ├── InvestmentForm.tsx
│   │   │   │   ├── ParticipantsList.tsx
│   │   │   │   ├── InvestmentStats.tsx
│   │   │   │   └── InvestmentActions.tsx
│   │   │   ├── InvestmentStack.tsx
│   │   │   ├── /services
│   │   │   │   └── investmentApi.ts
│   │   │   ├── /hooks
│   │   │   │   ├── useInvestments.ts
│   │   │   │   ├── useInvestmentActions.ts
│   │   │   │   └── useSharedInvestments.ts
│   │   │   ├── /store
│   │   │   │   ├── investmentSlice.ts
│   │   │   │   └── investmentTypes.ts
│   │   │   └── /utils
│   │   │       ├── investmentHelpers.ts
│   │   │       └── investmentValidation.ts
│   │   │
│   │   ├── /payouts
│   │   │   ├── /screens
│   │   │   │   ├── PayoutsListScreen.tsx
│   │   │   │   ├── PayoutDetailScreen.tsx
│   │   │   │   ├── UpcomingPayoutsScreen.tsx
│   │   │   │   ├── PayoutHistoryScreen.tsx
│   │   │   │   └── CreatePayoutScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── PayoutCard.tsx
│   │   │   │   ├── PayoutCalendar.tsx
│   │   │   │   ├── PayoutStatusBadge.tsx
│   │   │   │   └── PayoutActions.tsx
│   │   │   ├── PayoutStack.tsx
│   │   │   ├── /services
│   │   │   │   └── payoutApi.ts
│   │   │   ├── /hooks
│   │   │   │   ├── usePayouts.ts
│   │   │   │   └── usePayoutActions.ts
│   │   │   ├── /store
│   │   │   │   ├── payoutSlice.ts
│   │   │   │   └── payoutTypes.ts
│   │   │   └── /utils
│   │   │       └── payoutHelpers.ts
│   │   │
│   │   ├── /portfolio
│   │   │   ├── /screens
│   │   │   │   ├── PortfolioScreen.tsx
│   │   │   │   ├── PortfolioSummaryScreen.tsx
│   │   │   │   ├── PerformanceScreen.tsx
│   │   │   │   ├── DiversityScreen.tsx
│   │   │   │   └── ParticipationsScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── PortfolioCard.tsx
│   │   │   │   ├── PerformanceChart.tsx
│   │   │   │   ├── DiversityChart.tsx
│   │   │   │   └── ParticipationItem.tsx
│   │   │   ├── PortfolioStack.tsx
│   │   │   ├── /services
│   │   │   │   └── portfolioApi.ts
│   │   │   ├── /hooks
│   │   │   │   └── usePortfolio.ts
│   │   │   └── /store
│   │   │       └── portfolioSlice.ts
│   │   │
│   │   ├── /profile
│   │   │   ├── /screens
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── EditProfileScreen.tsx
│   │   │   │   ├── SettingsScreen.tsx
│   │   │   │   ├── PreferencesScreen.tsx
│   │   │   │   └── SecurityScreen.tsx
│   │   │   ├── /components
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── SettingsItem.tsx
│   │   │   │   └── PreferenceToggle.tsx
│   │   │   ├── ProfileStack.tsx
│   │   │   ├── /services
│   │   │   │   └── profileApi.ts
│   │   │   ├── /hooks
│   │   │   │   └── useProfile.ts
│   │   │   └── /store
│   │   │       └── profileSlice.ts
│   │   │
│   │   └── /notifications
│   │       ├── /screens
│   │       │   ├── NotificationsScreen.tsx
│   │       │   └── NotificationSettingsScreen.tsx
│   │       ├── /components
│   │       │   ├── NotificationItem.tsx
│   │       │   └── NotificationBadge.tsx
│   │       ├── NotificationStack.tsx
│   │       ├── /services
│   │       │   └── notificationApi.ts
│   │       ├── /hooks
│   │       │   └── useNotifications.ts
│   │       └── /store
│   │           └── notificationSlice.ts
│   │
│   ├── /shared
│   │   ├── /components                 # Reusable UI components
│   │   │   ├── /ui
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── /layout
│   │   │   │   ├── Screen.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── TabBar.tsx
│   │   │   ├── /forms
│   │   │   │   ├── FormField.tsx
│   │   │   │   ├── FormSelect.tsx
│   │   │   │   ├── FormCheckbox.tsx
│   │   │   │   └── FormDatePicker.tsx
│   │   │   └── /feedback
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── EmptyState.tsx
│   │   │       ├── ErrorMessage.tsx
│   │   │       └── SuccessMessage.tsx
│   │   │
│   │   ├── /hooks                      # Reusable custom hooks
│   │   │   ├── useTheme.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── usePagination.ts
│   │   │   ├── useRefresh.ts
│   │   │   ├── useAsync.ts
│   │   │   ├── useKeyboard.ts
│   │   │   └── useNetworkStatus.ts
│   │   │
│   │   ├── /services                   # Core services
│   │   │   ├── api.ts                  # Axios instance with interceptors
│   │   │   ├── httpClient.ts           # HTTP client configuration
│   │   │   ├── authService.ts          # Token management & refresh
│   │   │   ├── errorHandler.ts         # Global error handling
│   │   │   ├── storage.ts              # Async storage wrapper
│   │   │   ├── biometrics.ts           # Biometric authentication
│   │   │   └── analytics.ts            # Analytics service
│   │   │
│   │   ├── /store                      # Redux store configuration
│   │   │   ├── index.ts                # Store configuration
│   │   │   ├── rootReducer.ts          # Root reducer
│   │   │   ├── middleware.ts           # Custom middleware
│   │   │   └── persistConfig.ts        # Redux persist configuration
│   │   │
│   │   ├── /utils                      # Utility functions
│   │   │   ├── formatters.ts           # Currency, date, number formatters
│   │   │   ├── validators.ts           # Common validation functions
│   │   │   ├── constants.ts            # App-wide constants
│   │   │   ├── helpers.ts              # General helper functions
│   │   │   ├── calculations.ts         # Investment/financial calculations
│   │   │   └── deviceInfo.ts           # Device-specific utilities
│   │   │
│   │   ├── /theme                      # Theme and styling
│   │   │   ├── index.ts                # Main theme export
│   │   │   ├── colors.ts               # Color palette
│   │   │   ├── typography.ts           # Font definitions
│   │   │   ├── spacing.ts              # Spacing scale
│   │   │   ├── shadows.ts              # Shadow definitions
│   │   │   └── darkTheme.ts            # Dark theme overrides
│   │   │
│   │   └── /types                      # Shared TypeScript types
│   │       ├── api.ts                  # API response types
│   │       ├── auth.ts                 # Authentication types
│   │       ├── investment.ts           # Investment-related types
│   │       ├── payout.ts               # Payout-related types
│   │       ├── navigation.ts           # Navigation types
│   │       └── common.ts               # Common shared types
│   │
│   ├── /config                         # App configuration
│   │   ├── env.ts                      # Environment variables
│   │   ├── api.ts                      # API endpoints configuration
│   │   ├── roles.ts                    # Role definitions matching backend
│   │   ├── permissions.ts              # Permission mappings
│   │   ├── navigation.ts               # Navigation configuration
│   │   └── app.ts                      # General app settings
│   │
│   └── /assets                         # Static assets
│       ├── /fonts
│       │   ├── Inter-Regular.ttf
│       │   ├── Inter-Medium.ttf
│       │   └── Inter-Bold.ttf
│       ├── /images
│       │   ├── logo.png
│       │   ├── onboarding/
│       │   └── placeholders/
│       └── /icons
│           ├── investment.svg
│           ├── payout.svg
│           └── portfolio.svg
│
├── App.tsx                             # Main app entry point
├── index.js                            # React Native entry
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript configuration
├── babel.config.js                     # Babel configuration
├── metro.config.js                     # Metro bundler configuration
└── eas.json                            # EAS Build configuration
```

## 🏗️ Architecture Best Practices

### 1. **State Management - Redux Toolkit**

```typescript
// Example: investmentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchInvestments = createAsyncThunk(
  "investments/fetchInvestments",
  async (params: InvestmentFilters) => {
    const response = await investmentApi.getInvestments(params);
    return response.data;
  },
);

const investmentSlice = createSlice({
  name: "investments",
  initialState,
  reducers: {
    setSelectedInvestment: (state, action) => {
      state.selectedInvestment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestments.fulfilled, (state, action) => {
      state.investments = action.payload;
      state.loading = false;
    });
  },
});
```

### 2. **Navigation - React Navigation 6**

```typescript
// RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="AppTabs" component={AppTabNavigator} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### 3. **API Layer - Axios with Interceptors**

```typescript
// services/api.ts
import axios from "axios";
import { authService } from "./authService";

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authService.refreshToken();
      // Retry original request
    }
    return Promise.reject(error);
  },
);
```

### 4. **Custom Hooks Pattern**

```typescript
// hooks/useInvestments.ts
export const useInvestments = () => {
  const dispatch = useAppDispatch();
  const { investments, loading, error } = useAppSelector(
    (state) => state.investments,
  );

  const fetchInvestments = useCallback(
    (filters?: InvestmentFilters) => {
      dispatch(fetchInvestmentsThunk(filters));
    },
    [dispatch],
  );

  const createInvestment = useCallback(
    async (data: CreateInvestmentData) => {
      const result = await dispatch(createInvestmentThunk(data));
      return result;
    },
    [dispatch],
  );

  return {
    investments,
    loading,
    error,
    fetchInvestments,
    createInvestment,
  };
};
```

### 5. **Component Patterns**

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  onPress,
  children,
  disabled = false,
  loading = false,
}) => {
  // Component implementation
};
```

## 🔧 Development Tools & Configuration

### **Essential Dependencies**

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "redux-persist": "^6.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.7.4",
    "axios": "^1.6.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "react-native-async-storage": "^1.19.5",
    "react-native-keychain": "^8.1.3",
    "react-native-mmkv": "^2.10.2",
    "expo-local-authentication": "^13.8.0",
    "expo-secure-store": "^12.5.0"
  }
}
```

### **Code Quality & Standards**

- **ESLint + Prettier**: Consistent code formatting
- **TypeScript**: Full type safety
- **Husky**: Pre-commit hooks
- **Jest + React Native Testing Library**: Unit testing
- **Detox**: E2E testing

### **Performance Optimizations**

- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Memoize expensive operations
- **FlatList optimization**: For large data sets
- **Image optimization**: WebP format, lazy loading
- **Bundle splitting**: Code splitting by modules

### **Security Best Practices**

- **Secure token storage**: Keychain/Keystore
- **Certificate pinning**: API security
- **Biometric authentication**: Touch/Face ID
- **Root/Jailbreak detection**: App integrity
- **Code obfuscation**: Release builds

## 🎯 Module Integration with Backend

### **Auth Module**

- Integrates with `/api/v1/auth/*` endpoints
- Handles JWT token management
- Role-based navigation (admin vs user flows)
- Biometric authentication support

### **Investment Module**

- CRUD operations via `/api/v1/investments/*`
- Real-time investment tracking
- Shared investment discovery
- Investment analytics dashboard

### **Payout Module**

- Payout tracking via `/api/v1/payouts/*`
- Calendar view for upcoming payouts
- History and status management
- Push notifications for due payouts

### **Portfolio Module**

- Portfolio analytics via `/api/v1/portfolio/*`
- Performance charts and metrics
- Diversity analysis
- Investment participation tracking

This structure ensures:

- ✅ **Scalability**: Feature-first modular architecture
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Type Safety**: Full TypeScript integration
- ✅ **Performance**: Optimized for mobile devices
- ✅ **Security**: Industry-standard security practices
- ✅ **Testing**: Comprehensive testing strategy
- ✅ **Backend Integration**: Seamless API connectivity
