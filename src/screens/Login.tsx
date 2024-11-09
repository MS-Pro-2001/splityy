import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
const Login = () => {
  const { login } = useAuth();
  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require('../assets/images/splityyImg.png')}
      />
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => {
          login();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tinyLogo: {
    width: 400,
    height: 400,
    borderRadius: 10,
    marginTop: -250,
    marginBottom: 100,
  },
});

export default Login;
