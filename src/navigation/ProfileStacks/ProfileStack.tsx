import { NotificationTemplate } from '@/shared/store/slices/profile/notifications/notificationTemplateSlice';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { TouchableOpacity } from "react-native";
import { NotificationButtons } from "../../modules/Common/notifications/screens/NotificationButtons";
import { NotificationSettingsScreen } from "../../modules/Common/notifications/screens/NotificationSettingsScreen";
import { NotificationTemplatesScreen } from "../../modules/Common/notifications/screens/NotificationTemplatesScreen";
import { TemplateDetailScreen } from '../../modules/Common/notifications/screens/TemplateDetailScreen';
import { ChangePasswordScreen } from "../../modules/Common/profile/screens/ChangePasswordScreen";
import { CompanyInfoScreen } from "../../modules/Common/profile/screens/CompanyInfoScreen";
import { EditCompanyScreen } from "../../modules/Common/profile/screens/EditCompanyScreen";
import ProfileScreen from "../../modules/Common/profile/screens/ProfileScreen";
import { UpdateProfile } from "../../modules/Common/profile/screens/UpdateProfile";
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ChangePassword: undefined;
  UpdateProfile: undefined;
  NotificationButtons: undefined;
  NotificationSettings: undefined;
  NotificationsTemplates: undefined;
  TemplateDetail: { template: NotificationTemplate };
  NotificationsScreen: undefined;
  NotificationDetail: { notification: any };
  CompanyInfo: undefined;
  EditCompany: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Change Password',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Update Profile',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CompanyInfo"
        component={CompanyInfoScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Company Info',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditCompany"
        component={EditCompanyScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Edit Company',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NotificationButtons"
        component={NotificationButtons}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Notifications Center',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Notification Settings',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NotificationsTemplates"
        component={NotificationTemplatesScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Notification Templates',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TemplateDetail"
        component={TemplateDetailScreen}
        options={({ navigation }) => ({
          // gestureEnabled: false,
          title: 'Templates Detail',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginRight: 16,
                marginLeft: 10,
                marginTop: 5,
                marginBottom: 5,
                backgroundColor: "#F3F4F6",
                width: 40,
                height: 40,
                borderRadius: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="chevron-back" color={"black"} size={30} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
