import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from './src/screens/Login';
import TabNavigator from './src/navigators/TabNavigator';
import { useAuth } from './src/context/AuthContext';
import Loader from './src/components/Loader';
import AddExpense from './src/screens/AddExpense';
import CreateGroup from './src/screens/CreateGroup';
import GroupDetail from './src/screens/GroupDetail';

const App = () => {
  const Stack = createNativeStackNavigator();
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="HomeScreen" component={TabNavigator} />
            <Stack.Screen name="AddExpense" component={AddExpense} />
            <Stack.Screen name="createGroup" component={CreateGroup} />
            <Stack.Screen name="groupDetail" component={GroupDetail} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
