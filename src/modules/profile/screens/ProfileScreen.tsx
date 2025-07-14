import Colors from '@/shared/colors/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardLayout } from '../../dashboard/components/DashboardLayout';

const mockUser = {
  name: 'Naomi Carter',
  role: 'Investment Manager',
  email: 'naomi@flowvest.com',
  company: 'FlowVest Inc.',
};

export const ProfileScreen: React.FC = () => {
  return (
    <DashboardLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>N</Text>
          </View>
          <Text style={styles.name}>{mockUser.name}</Text>
          <Text style={styles.role}>{mockUser.role}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{mockUser.email}</Text>
          <Text style={styles.infoLabel}>Company</Text>
          <Text style={styles.infoValue}>{mockUser.company}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonItem}>
               <Ionicons name='lock-closed-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonItem}>
              <Ionicons name='notifications-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}> Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonItem}>
               <Ionicons name='call-outline' color={"gray"} size={20} />
              <Text style={styles.buttonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    // flex:1,
    backgroundColor: Colors.background, // Light background color
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    // backgroundColor: '#2563EB',
    backgroundColor:Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 32,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 2,
  },
  role: {
    fontSize: 15,
    color: Colors.gray,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.gray,
    marginTop: 2,
  },
  buttonGroup: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    paddingTop: 12,
    gap: 10,
  },
  buttonItem: {
    // backgroundColor: '#E5E7EB',
    flexDirection:'row',
    backgroundColor:Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
     shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 15,
    // color: Colors.secondary,
    color:Colors.white,
    fontWeight: '500',
    marginLeft:5
  },
});

export default ProfileScreen;
