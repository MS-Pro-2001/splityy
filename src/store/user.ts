import database from '@react-native-firebase/database';

// Define the User type interface
type User = {
  id: string;
  name: string;
  email: string;
  // Add other properties as needed
  [key: string]: any;
};

export const addUser = (user: User): Promise<void> => {
  if (!user.id) {
    throw new Error('User ID is required');
  }

  return database().ref(`users/${user.id}`).set(user);
};
