import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, View, Image, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Divider,
  TouchableRipple,
  Avatar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useAuth } from '../context/AuthContext';

const AddGroupMembers = ({ navigation }: any) => {
  const [selectedMembers, setSelectedMembers]: [any, any] = useState([]);
  const { user }: any = useAuth();

  const toggleSelection = (member: any) => {
    const userId = member._id;
    if (selectedMembers.some((selected: any) => selected._id === userId)) {
      setSelectedMembers((prev: any) =>
        prev.filter((selected: any) => selected._id !== userId)
      );
    } else {
      setSelectedMembers((prev: any) => [...prev, member]);
    }
  };
  const isUserSelected = (id: any) => {
    return selectedMembers.some((member: any) => member?._id === id);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={36} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>Create Group</Text>
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
                  {member?.image ? (
                    <Image
                      source={{ uri: member.image }}
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
          {user?.friendsList.map((participant: any) => {
            const isSelected = isUserSelected(participant._id);
            return (
              <View
                key={participant._id}
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
                        {participant.image ? (
                          <Image
                            source={{ uri: participant.image }}
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
});
