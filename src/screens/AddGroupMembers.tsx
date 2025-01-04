import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';
import { TouchableOpacity, View, Image, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Divider,
  TouchableRipple,
  Avatar,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useAuth } from '../context/AuthContext';
import useGroupService from '../store/groups';
import { useSnackbar } from '../context/SnackbarContext';

const AddGroupMembers = ({ navigation, route }: any) => {
  const { groupData } = route.params;
  const { showMessage } = useSnackbar();
  const { createGroup, createGroupMembers } = useGroupService();
  const [selectedMembers, setSelectedMembers]: [any, any] = useState([]);
  const { user }: any = useAuth();
  const [friendList, setFriendList] = useState([]);
  console.log({ friendList }, { depth: null });
  React.useEffect(() => {
    const friendListRef: any = database()
      .ref('/friendList')
      .orderByChild('addedBy')
      .equalTo(user?.id);

    const onValueChange = friendListRef.on('value', async (snapshot: any) => {
      const res = snapshot.val();
      if (!res) {
        console.log('No friends found');
        setFriendList([]);
        return;
      }

      // Process the friend list data
      const data: any = Object.keys(res)
        .map((key) => ({
          id: key,
          ...res[key], // Spread the data to include friend properties
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      // Fetch details of all friends from the users reference
      const friendsDetailsPromises = data.map(async (item: any) => {
        const friendId = item.friend; // Assuming 'friend' contains the friend's user ID
        const userSnapshot = await database()
          .ref(`/users/${friendId}`)
          .once('value');
        const userData = userSnapshot.val();
        return { ...userData }; // Add friend details to the item
      });

      // Resolve all promises and update the state
      const enrichedFriendList: any = await Promise.all(friendsDetailsPromises);
      setFriendList(enrichedFriendList);
    });

    // Clean up the listener when the component unmounts
    return () => friendListRef.off('value', onValueChange);
  }, [user?.id]);

  const toggleSelection = (member: any) => {
    const userId = member.id;
    if (selectedMembers.some((selected: any) => selected.id === userId)) {
      setSelectedMembers((prev: any) =>
        prev.filter((selected: any) => selected.id !== userId)
      );
    } else {
      setSelectedMembers((prev: any) => [...prev, member]);
    }
  };
  const isUserSelected = (id: any) => {
    return selectedMembers.some((member: any) => member?.id === id);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    setIsLoading(true);
    console.log({ selectedMembers });

    try {
      // Create the group and get the group ID
      const groupId = await createGroup(groupData);

      // Loop through the selectedMembers array and create group members
      for (let member of selectedMembers) {
        await createGroupMembers({
          memberId: member.id, // assuming each member has an id field
          groupId,
        });
      }

      setIsLoading(false);
      showMessage('Group Created Successfully', 2000);
      navigation.navigate('Groups');
    } catch (error) {
      console.log('err', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('createGroup', { mode: 'edit' })}
        >
          <MaterialCommunityIcons name="arrow-left" size={36} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>{groupData?.groupName}</Text>
      </View>
      <View style={styles.container}>
        <FontAwesome
          name="magnifying-glass"
          size={24}
          color="#4A249D"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="rgba(76,36,157,1)"
          underlineColorAndroid={'transparent'}
        />
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.selectedMembersContainer}
          contentContainerStyle={styles.selectedMembersContent}
        >
          {selectedMembers.map((member: any) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity
                  onPress={() => toggleSelection(member)}
                  style={styles.cancelIconContainer}
                >
                  <MaterialCommunityIcons
                    name="close-box"
                    size={18}
                    color="#4A249D"
                    style={styles.cancelIcon}
                  />
                </TouchableOpacity>
                <View style={styles.avatar}>
                  {member?.photo ? (
                    <Image
                      source={{ uri: member.photo }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Avatar.Text
                      label={member.name?.[0]?.toUpperCase()}
                      size={55}
                      color="#675B97"
                      style={styles.avatarText}
                    />
                  )}
                </View>
              </View>
              <Text
                style={styles.memberName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {member.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Divider />
      <View style={styles.participantsList}>
        <Text variant="titleLarge" style={styles.participantsTitle}>
          Add Participants
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.listContainer}
        >
          {friendList.map((participant: any) => {
            const isSelected = isUserSelected(participant.id);
            return (
              <View
                key={participant.id}
                style={{
                  ...styles.participantItemContainer,
                  ...(isSelected && { elevation: 0 }),
                }}
              >
                <TouchableRipple
                  onPress={() => toggleSelection(participant)}
                  rippleColor="rgba(74, 36, 157, 0.1)"
                  style={styles.participantItem}
                >
                  <View style={styles.participantInner}>
                    <View style={styles.participantInfo}>
                      <View style={styles.participantAvatar}>
                        {participant.photo ? (
                          <Image
                            source={{ uri: participant.photo }}
                            style={styles.avatarImage}
                          />
                        ) : (
                          <Avatar.Text
                            label={participant.name?.[0]?.toUpperCase()}
                            size={45}
                            color="#675B97"
                            style={styles.avatarText}
                          />
                        )}
                      </View>
                      <Text
                        variant="bodyLarge"
                        style={{
                          ...styles.participantName,
                          ...(isSelected && { color: '#919191' }),
                        }}
                      >
                        {participant.name}
                      </Text>
                    </View>
                    <View style={styles.addIconContainer}>
                      <MaterialCommunityIcons
                        name={isSelected ? 'minus-circle' : 'plus-circle'}
                        size={28}
                        color={isSelected ? '#CBB3FF' : '#4A249D'}
                      />
                    </View>
                  </View>
                </TouchableRipple>
              </View>
            );
          })}
        </ScrollView>
        {/* TODO save the selectedMembers onPress of this button */}
        <Button
          mode="contained"
          onPress={handleCreateGroup}
          disabled={!selectedMembers?.length}
          loading={isLoading}
          style={[
            styles.button,
            // {
            //   backgroundColor:
            //     groupName.trim().length < 3 || loading ? '#B0B0B0' : '#4A249D',
            // },
          ]}
          // labelStyle={{
          //   color:
          //     groupName.trim().length < 3 || loading ? '#808080' : '#FFFFFF',
          // }}
        >
          {'Create Group'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default AddGroupMembers;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 15,
    marginBottom: 30,
  },
  heading: {
    fontSize: 22,
    color: '#4A249D',
    marginLeft: 16,
    fontWeight: 'bold',
    fontFamily: 'Capriola',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6C6C6C',
    borderRadius: 8,
    backgroundColor: '#EBE8F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#4A249D',
    height: 40,
    backgroundColor: 'transparent',
  },
  selectedMembersContainer: {
    paddingVertical: 10,
    marginTop: 7,
  },
  selectedMembersContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  memberItem: {
    marginBottom: 8,
    width: 60,
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#675B97',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cancelIconContainer: {
    position: 'absolute',
    right: -3,
    top: -3,
    zIndex: 1,
    borderRadius: 5,
  },
  cancelIcon: {},
  memberName: {
    marginTop: 4,
    fontSize: 12,
    color: '#3D3D3D',
    textAlign: 'center',
    width: 60,
  },
  participantsList: {
    flex: 1,
    paddingTop: 16,
  },
  participantsTitle: {
    paddingHorizontal: 16,
    color: '#4A249D',
    marginBottom: 16,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  participantItemContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#4A249D',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  participantItem: {
    borderRadius: 12,
  },
  participantInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#675B97',
    overflow: 'hidden',
  },
  participantName: {
    color: '#3D3D3D',
    fontSize: 18,
    fontWeight: '600',
  },
  addIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    backgroundColor: '#EBE8F6',
  },
  button: {
    borderRadius: 5,
    height: 50,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
});
