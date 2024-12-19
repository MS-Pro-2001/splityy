import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigation.replace('HomeScreen');
      } else {
        navigation.replace('Login');
      }
    }, 3000);

    // Cleanup timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, [navigation, user]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/splityy_lottie.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: { width: 500, height: 1000 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Customize as per your app theme
  },
});

export default SplashScreen;
