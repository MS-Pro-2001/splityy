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

      // Extract the user ID
      const userId = userInfo?.data?.user?.id;

      // Fetch user data from Firebase using user ID
      const userRef = database().ref(`users/${userId}`);
      userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          // Update user data in context and AsyncStorage
          const userWithGroups: UserType = {
            ...userInfo.data.user,
            ...userData,
          };
          setUser(userWithGroups);
          AsyncStorage.setItem('userinfo', JSON.stringify(userWithGroups));
        } else {
          database()
            .ref(`users/${userId}`)
            .set({ ...(userInfo?.data?.user ?? {}) });
        }
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  const fetchUserFromStorage: any = async () => {
    try {
      const userData = await AsyncStorage.getItem('userinfo');
      // console.log({ userData });
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error fetching user from storage:', error);
      return null;
    }
  };

  const logout: any = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
      await AsyncStorage.removeItem('userinfo'); // Clear user data from AsyncStorage
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedInUser = await fetchUserFromStorage();
        if (loggedInUser) {
          setUser(loggedInUser);
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
