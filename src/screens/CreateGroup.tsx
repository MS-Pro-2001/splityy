/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import database from '@react-native-firebase/database';
import { useAuth } from '../context/AuthContext';
import { createUniqueId } from '../utils/commonFunctions';

const CreateGroup = ({ navigation }: any) => {
  const [groupName, setGroupName] = useState('');

  const { user }: any = useAuth();

  const handleCreateGroup = () => {
    const userGroupsRef = database().ref(`/users/${user?.id}/groups`);
    userGroupsRef
      .once('value')
      .then((snapshot) => {
        const groups = snapshot.val() ? snapshot.val() : []; // Get existing groups or initialize as an empty array
        console.log({ groups });
        userGroupsRef
          .set([...groups, { groupId: createUniqueId(), groupName: groupName }]) // Set the updated groups array with the new group added
          .then(() => console.log('Group added successfully.'));
      })
      .catch((error) => console.error('Error updating groups:', error));

    setGroupName('');

    navigation.goBack();
  };

  return (
    <View>
      <View style={{ margin: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={30} color={'#4A249D'} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.inputs}>
          <Text style={styles.text}>Enter Group Name</Text>
          <TextInput onChangeText={(e) => setGroupName(e)} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        disabled={!groupName}
        onPress={handleCreateGroup}
      >
        <View>
          <Text style={styles.text}>Create Group</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 100, marginHorizontal: 10 },
  inputs: { gap: 20, marginBottom: 30 },
  input: {
    backgroundColor: 'transparent', // Removes background to only show the border
  },
  text: { fontSize: 20, color: '#4A249D' },
  div: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  button: {
    margin: 20,
    borderRadius: 5,
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A249D',
    fontSize: 20,
    color: '#4A249D',
  },
});

export default CreateGroup;
