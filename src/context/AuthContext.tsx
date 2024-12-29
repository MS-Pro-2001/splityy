import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import database from '@react-native-firebase/database';
import { createUniqueId } from '../utils/commonFunctions';

type UserType = {
  // Define the structure of your user object
  id: string;
  name: string;
  email: string;
};
interface AuthContextType {
  user: UserType | null; // User can be a UserType or null
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>; // Correct type for setUser
  login: () => Promise<void>; // Define login method type
  logout: () => Promise<void>; // Define logout method type
  isUserLoading: boolean; //
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: any) => {
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState<any>(true);

  const webClientId =
    '136945013267-m7a1jv9putoo1eqvasu1lfm8ohjjdgp8.apps.googleusercontent.com';

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: webClientId,
    });
  }, []);

  useEffect(() => {
    if (user?.id) {
      const userRef = database().ref(`users/${user.id}`);

      const onValueChange = userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        // console.log({ userData });
        if (userData) {
          const updatedUser = {
            ...userData,
          };
          setUser(updatedUser);
          AsyncStorage.setItem('userinfo', JSON.stringify(updatedUser));
        }
      });

      // Cleanup the listener when the component unmounts or user changes
      return () => userRef.off('value', onValueChange);
    }
  }, [user?.id]); // Re-run this effect if user ID changes

  // google
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      console.log({ userInfo }, ':::::::::::::::userInfo');
      const email = userInfo?.data?.user?.email;
      // Extract the user ID

      // Fetch user data from Firebase using user ID
      const userRef = database()
        .ref('users')
        .orderByChild('email')
        .equalTo(email);

      const snapshot = await userRef.once('value');
      const userData = snapshot.val();

      if (userData) {
        // Firebase returns an object where keys are user IDs
        const userKey = Object.keys(userData)[0];
        const userDetails = userData[userKey];

        // Update user data in context and AsyncStorage
        const loggedInUserData: UserType = {
          ...userDetails,
        };

        setUser(loggedInUserData);
        await AsyncStorage.setItem(
          'userinfo',
          JSON.stringify(loggedInUserData)
        );
      } else {
        // Create a new user if no data exists
        const userId = createUniqueId();
        const payload = {
          ...userInfo?.data?.user,
          googleId: userInfo?.data?.user?.id,
          id: userId,
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
          isDeleted: false,
          isVerified: true,
        };

        // Save new user to Firebase
        await database().ref(`users/${userId}`).set(payload);

        // Update context and AsyncStorage
        setUser(payload);
        await AsyncStorage.setItem('userinfo', JSON.stringify(payload));
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const fetchUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('userinfo');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error fetching user from storage:', error);
      return null;
    }
  };
  const logout = async () => {
    try {
      const isSignedIn = GoogleSignin.getCurrentUser(); // Check if the user is signed in
      if (isSignedIn) {
        console.log('Signing out...');
        await GoogleSignin.revokeAccess(); // Revoke access token
        await GoogleSignin.signOut(); // Sign out from Google
        setUser(null); // Clear user state
        await AsyncStorage.removeItem('userinfo'); // Clear user data from AsyncStorage
        console.log('User signed out successfully');
      } else {
        console.log('No user is signed in');
      }
    } catch (err) {
      console.log('Error during sign out:', err);
    }
  };

  const restoreSession = async () => {
    try {
      // Attempt to silently sign in
      const userInfo = await GoogleSignin.signInSilently();
      console.log('Google session restored:', userInfo);
      return userInfo?.data;
    } catch (error) {
      console.log('No valid Google session to restore:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = await fetchUserFromStorage();

        if (storedUser) {
          // Restore Google session
          const restoredSession = await restoreSession();

          if (restoredSession) {
            // If Google session is valid, set the user
            setUser(storedUser);
          } else {
            // If session restoration fails, clear stored user
            await AsyncStorage.removeItem('userinfo');
            setUser(null);
            console.log('Cleared stored user due to invalid session');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsUserLoading(false);
      }
    };

    checkUser();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: googleLogin,
        logout,
        isUserLoading: isUserLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
