import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../context/AuthContext';
import { Avatar } from 'react-native-paper';
interface HeaderProps {
  route: {
    name: string;
  };
  navigation: any;
}

const CustomHeader: React.FC<HeaderProps> = ({ route, navigation }) => {
  const { user }: any = useAuth();
  console.log(user);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{route.name}</Text>

      <View style={styles.rightSection}>
        {/* <TouchableOpacity onPress={() => console.log('hello')}>
          <MaterialCommunityIcons name="magnify" size={30} color={'#4A249D'} />
        </TouchableOpacity> */}
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
            {/* <Text style={styles.avatarText}>{user.givenName?.slice(0, 1)}</Text> */}
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
    gap: 10,
  },
  icon: {
    marginRight: 15,
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
