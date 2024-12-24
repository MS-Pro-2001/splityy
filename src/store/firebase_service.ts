import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

// Type Definitions
export type UserType = {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
};

const useFirebaseService = () => {
  /**
   * Fetch user data from Firebase by user ID.
   */
  const getUserById = useCallback(
    async (userId: string): Promise<UserType | null> => {
      try {
        const snapshot = await database().ref(`users/${userId}`).once('value');
        return snapshot.val();
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }
    },
    []
  );

  /**
   * Create or update a user in Firebase.
   */
  const upsertUser = useCallback(async (user: UserType): Promise<void> => {
    try {
      await database().ref(`users/${user.id}`).set(user);
    } catch (error) {
      console.error('Error creating or updating user:', error);
    }
  }, []);

  /**
   * Listen for real-time updates to a user in Firebase.
   */
  const subscribeToUser = useCallback(
    (
      userId: string,
      callback: (userData: UserType | null) => void
    ): (() => void) => {
      const userRef = database().ref(`users/${userId}`);
      const onValueChange = userRef.on('value', (snapshot) => {
        callback(snapshot.val());
      });

      // Return a cleanup function to unsubscribe from the listener
      return () => userRef.off('value', onValueChange);
    },
    []
  );

  /**
   * Save user data to AsyncStorage.
   */
  const saveUserToStorage = useCallback(
    async (user: UserType): Promise<void> => {
      try {
        await AsyncStorage.setItem('userinfo', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    },
    []
  );

  /**
   * Fetch user data from AsyncStorage.
   */
  const getUserFromStorage = useCallback(async (): Promise<UserType | null> => {
    try {
      const userData = await AsyncStorage.getItem('userinfo');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error fetching user from storage:', error);
      return null;
    }
  }, []);

  /**
   * Clear user data from AsyncStorage.
   */
  const clearUserFromStorage = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('userinfo');
    } catch (error) {
      console.error('Error clearing user from storage:', error);
    }
  }, []);

  return {
    getUserById,
    upsertUser,
    subscribeToUser,
    saveUserToStorage,
    getUserFromStorage,
    clearUserFromStorage,
  };
};

export default useFirebaseService;
