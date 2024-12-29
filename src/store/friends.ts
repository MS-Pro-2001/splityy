import database from '@react-native-firebase/database';
import { createUniqueId } from '../utils/commonFunctions';

// Type Definitions
export type FriendType = {
  id: string; // Unique ID
  addedBy: string; // User ID who added the friend
  friendEmail?: string; // Friend's User ID
  createdAt: number; // Timestamp
  isRequestAccepted: boolean; // Request status
  friendName?: string;
  friend: string;
};

const useFriendListService = () => {
  /**
   * Add a friend to the friend list.
   */
  const addFriend = async (friendData: FriendType): Promise<void> => {
    try {
      const userRef = database()
        .ref('users')
        .orderByChild('email')
        .equalTo(friendData?.friendEmail ?? '');

      const snapshot = await userRef.once('value');
      const userData = snapshot.val();
      if (!userData) {
        const userId = createUniqueId();
        const payload = {
          googleId: null,
          name: friendData?.friendName,
          id: userId,
          email: friendData?.friendEmail,
          createdAt: `${new Date()}`,
          updatedAt: `${new Date()}`,
          isDeleted: false,
          isVerified: false,
        };

        // Save new user to Firebase
        await database().ref(`users/${userId}`).set(payload);
        friendData.friend = userId;
      } else {
        const userKey = Object.keys(userData)[0];
        const userDetails = userData[userKey];
        friendData.friend = userDetails.id;
      }
      delete friendData.friendName;
      delete friendData.friendEmail;

      await database().ref(`/friendList/${friendData?.id}`).set(friendData);
      console.log('Friend added successfully:', friendData);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  /**
   * Fetch a friend list by `addedBy` user ID.
   */
  const getFriendListByUserId = async (
    userId: string
  ): Promise<FriendType[]> => {
    try {
      const snapshot = await database()
        .ref('/friendList')
        .orderByChild('addedBy')
        .equalTo(userId)
        .once('value');

      const friends: FriendType[] = [];
      snapshot.forEach((childSnapshot) => {
        friends.push({
          ...(childSnapshot.val() as FriendType),
          id: childSnapshot.key!,
        });
      });

      return friends;
    } catch (error) {
      console.error('Error fetching friend list:', error);
      return [];
    }
  };

  /**
   * Update a friend's details in the friend list.
   */
  const updateFriend = async (
    id: string,
    updates: Partial<FriendType>
  ): Promise<void> => {
    try {
      await database().ref(`/friendList/${id}`).update(updates);
      console.log('Friend updated successfully:', updates);
    } catch (error) {
      console.error('Error updating friend:', error);
    }
  };

  /**
   * Remove a friend from the friend list.
   */
  const removeFriend = async (id: string): Promise<void> => {
    try {
      await database().ref(`/friendList/${id}`).remove();
      console.log('Friend removed successfully:', id);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  /**
   * Subscribe to real-time updates for a user's friend list.
   */
  const subscribeToFriendList = (
    userId: string,
    callback: (friendList: FriendType[] | null) => void
  ): (() => void) => {
    const friendListRef = database()
      .ref('/friendList')
      .orderByChild('addedBy')
      .equalTo(userId);

    const onValueChange = friendListRef.on('value', (snapshot) => {
      const friends: FriendType[] = [];
      snapshot.forEach((childSnapshot) => {
        friends.push({
          ...(childSnapshot.val() as FriendType),
          id: childSnapshot.key!,
        });
        return false; // Explicitly return `false` or `undefined` to continue iteration
      });
      callback(friends);
    });

    // Return a cleanup function to unsubscribe
    return () => friendListRef.off('value', onValueChange);
  };

  return {
    addFriend,
    getFriendListByUserId,
    updateFriend,
    removeFriend,
    subscribeToFriendList,
  };
};

export default useFriendListService;
