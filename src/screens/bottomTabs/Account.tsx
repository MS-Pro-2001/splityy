import React from 'react';
import { Avatar, Text, List } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Account = ({ navigation }: any) => {
  const { logout, user }: any = useAuth();

  console.log({ user });

  const options = [
    { title: 'My Profile', icon: 'account', navigateTo: '' },
    { title: 'Settings', icon: 'cog', navigateTo: '' },
    { title: 'FAQ', icon: 'help-circle-outline', navigateTo: 'faq' },
    { title: 'About App', icon: 'information-outline', navigateTo: '' },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <Text style={styles.profileTitle}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {user?.photo ? (
          <Avatar.Image
            size={48}
            style={styles.avatar}
            source={{ uri: user?.photo }}
          />
        ) : (
          <Avatar.Text
            style={styles.avatar}
            label={user?.givenName?.[0]?.toUpperCase()}
            size={48}
          />
        )}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {/* My Profile */}
        {options?.map((item) => {
          return (
            <View key={item.title}>
              <TouchableOpacity
                onPress={() => navigation.navigate(item?.navigateTo)}
                style={styles.menuItem}
              >
                <List.Icon icon={item?.icon} style={styles.icon} />
                <Text style={styles.menuText}>{item?.title}</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
            </View>
          );
        })}
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.menuItem, styles.logoutSection]}
        onPress={() => logout()}
      >
        <List.Icon icon="logout" style={styles.icon} />
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A249D',
    marginBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  menuSection: {
    flex: 1, // Takes available space
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 5,
  },
  logoutSection: {
    // borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 10,
    paddingTop: 12,
    marginBottom: 30,
  },
  icon: {
    margin: 0,
  },
});

export default Account;
