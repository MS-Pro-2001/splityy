/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Button } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { View } from 'react-native';

const Account = () => {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        style={{ margin: 20 }}
        icon="logout"
        mode="contained"
        onPress={() => logout()}
      >
        Logout
      </Button>
    </View>
  );
};

export default Account;
