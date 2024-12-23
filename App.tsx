import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import TabNavigator from './src/navigators/TabNavigator';
import { useAuth } from './src/context/AuthContext';
import Loader from './src/components/Loader';
import AddExpense from './src/screens/AddExpense';
import CreateGroup from './src/screens/CreateGroup';
import GroupDetail from './src/screens/GroupDetail';
import InviteFriends from './src/screens/InviteFriends';
import SplashScreen from './src/screens/SplashScreen'; // Import SplashScreen
import FAQ from './src/screens/Faq';
import AboutApp from './src/screens/About';

const App = () => {
  const Stack = createNativeStackNavigator();
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen" // Set SplashScreen as the initial screen
        screenOptions={{
          headerShown: false, // Hide the headers for all screens
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />

        {user ? (
          <>
            <Stack.Screen name="HomeScreen" component={TabNavigator} />
            <Stack.Screen name="AddExpense" component={AddExpense} />
            <Stack.Screen name="createGroup" component={CreateGroup} />
            <Stack.Screen name="groupDetail" component={GroupDetail} />
            <Stack.Screen name="inviteFriends" component={InviteFriends} />
            <Stack.Screen name="faq" component={FAQ} />
            <Stack.Screen name="about" component={AboutApp} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
