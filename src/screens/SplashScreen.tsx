import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const SplashScreen = ({ navigation }: any) => {
  const { user } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      // This will give time for the AuthContext to check for the user
      if (!user) {
        navigation.navigate('HomeScreen');
      } else {
        navigation.navigate('Login');
      }
    };

    setTimeout(() => {
      checkUser();
    }, 2000);
  }, [user, navigation]);

  return (
    <View style={styles.main}>
      <Loader />
    </View>
  ); // You can add a loader here if desired
};

const styles = StyleSheet.create({ main: { flex: 1 } });

export default SplashScreen;
