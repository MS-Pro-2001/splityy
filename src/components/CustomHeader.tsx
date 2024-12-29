import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
  route: {
    name: string;
  };
  navigation: any;
  notificationCount: number; // Pass notification count as a prop
}

const CustomHeader: React.FC<HeaderProps> = ({
  route,
  navigation,
  notificationCount,
}) => {
  const { user }: any = useAuth();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{route.name}</Text>

      <View style={styles.rightSection}>
        {/* Notification Bell Icon with Badge */}
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.notificationIcon}>
            <MaterialCommunityIcons name="bell" size={25} color="#4A249D" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <View style={styles.avatarCircle}>
            {user?.photo ? (
              <Avatar.Image size={48} source={{ uri: user?.photo }} />
            ) : (
              <Avatar.Text
                label={user?.givenName?.[0]?.toUpperCase()}
                size={48}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    margin: 2,
  },
  title: {
    color: '#4A249D',
    fontSize: 35,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Space between bell icon and avatar
  },
  notificationIcon: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4A249D',
  },
});

export default CustomHeader;
