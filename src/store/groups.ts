import database from '@react-native-firebase/database';
import { useAuth } from '../context/AuthContext';
import { createUniqueId } from '../utils/commonFunctions';

// Type Definitions
export type GroupType = {
  groupId: string;
  createdBy: string; // User ID of the creator
  groupName: string;
  description: string;
  photo?: string;
  createdAt: number; // Timestamp
};

const useGroupService = () => {
  const { user }: any = useAuth();
  /**
   * Create a new group in Firebase.
   */
  const createGroup = async (groupData: GroupType): Promise<void> => {
    try {
      const finalGroupData = {
        ...groupData,
        createdAt: Date.now(),
        createdBy: user?.id,
        photo: '',
      };
      await database().ref(`/groups/${createUniqueId()}`).set(finalGroupData);
      console.log('Group created successfully:', groupData);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  /**
   * Fetch a group by its ID from Firebase.
   */
  const getGroupById = async (groupId: string): Promise<GroupType | null> => {
    try {
      const snapshot = await database().ref(`/groups/${groupId}`).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Error fetching group by ID:', error);
      return null;
    }
  };

  /**
   * Update a group's details in Firebase.
   */
  const updateGroup = async (
    groupId: string,
    updates: Partial<GroupType>
  ): Promise<void> => {
    try {
      await database().ref(`/groups/${groupId}`).update(updates);
      console.log('Group updated successfully:', updates);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  /**
   * Delete a group from Firebase.
   */
  const deleteGroup = async (groupId: string): Promise<void> => {
    try {
      await database().ref(`/groups/${groupId}`).remove();
      console.log('Group deleted successfully:', groupId);
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  /**
   * Subscribe to real-time updates for a specific group.
   */
  const subscribeToGroup = (
    groupId: string,
    callback: (groupData: GroupType | null) => void
  ): (() => void) => {
    const groupRef = database().ref(`/groups/${groupId}`);
    const onValueChange = groupRef.on('value', (snapshot) => {
      callback(snapshot.val());
    });

    // Return a cleanup function to unsubscribe from the listener
    return () => groupRef.off('value', onValueChange);
  };

  /**
   * Fetch all groups created by a specific user.
   */
  const getGroupsByUserId = (): Promise<GroupType[]> => {
    return new Promise((resolve, reject) => {
      const groupsRef = database()
        .ref('/groups')
        .orderByChild('createdBy')
        .equalTo(user?.id);

      const onValueChange = (snapshot: any) => {
        // If there's no data, resolve with an empty array
        if (!snapshot.exists()) {
          console.log('No groups found');
          resolve([]);
          return;
        }

        const data = snapshot.val();
        console.log({ data });

        const groups: GroupType[] = Object.keys(data).map((key) => ({
          groupId: key,
          ...data[key], // Spread the data to include group properties
        }));

        // Resolve the promise with the groups
        resolve(groups);
      };

      // Listen for value changes (real-time updates)
      groupsRef.on('value', onValueChange);

      // Cleanup function if the listener needs to be removed (optional in this case)
      // groupsRef.off('value', onValueChange);
    });
  };

  return {
    createGroup,
    getGroupById,
    updateGroup,
    deleteGroup,
    subscribeToGroup,
    getGroupsByUserId,
  };
};

export default useGroupService;
