/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import database from '@react-native-firebase/database';
import { useAuth } from '../context/AuthContext';
import { createUniqueId } from '../utils/commonFunctions';
import sendEmail from 'react-native-email';

const InviteFriends = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const textInputRef: any = useRef(null);
  const { user }: any = useAuth();

  const handleInviteFriend = () => {
    const to = ['mridul.sehgalwork@gmail.com']; // string or array of email addresses
    sendEmail(to, {
      // Optional additional arguments
      //   cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
      //   bcc: 'mee@mee.com', // string or array of email addresses
      subject: 'Show how to use',
      body: 'Some body right here',
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
    // const userGroupsRef = database().ref(`/users/${user?.id}/groups`);
    // userGroupsRef
    //   .once('value')
    //   .then((snapshot) => {
    //     const groups = snapshot.val() ? snapshot.val() : []; // Get existing groups or initialize as an empty array
    //     console.log({ groups });
    //     userGroupsRef
    //       .set([...groups, { groupId: createUniqueId(), groupName: groupName }]) // Set the updated groups array with the new group added
    //       .then(() => console.log('Group added successfully.'));
    //   })
    //   .catch((error) => console.error('Error updating groups:', error));
    // setGroupName('');
    // navigation.goBack();
  };

  useEffect(() => {
    // Automatically focus the TextInput when the component mounts
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  return (
    <View>
      <View style={{ margin: 15 }}>
        <View
          style={{
            // margin: 15,
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={30} color={'#4A249D'} />
          </TouchableOpacity>
          <Text style={[styles.text, { fontSize: 25 }]}>Invite Friends</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.inputs}>
          <Text style={styles.text}>Enter Email </Text>

          <TextInput
            style={{
              backgroundColor: '#4A249D90',
              color: 'blue',
              fontSize: 18, // Increases font size
            }}
            ref={textInputRef}
            mode="flat"
            placeholder="Enter email"
            onChangeText={(e) => setEmail(e)}
          />
          <Text style={styles.text}>Message </Text>
          <TextInput
            style={{
              backgroundColor: '#4A249D90',
              fontSize: 18, // Increases font size
            }}
            disabled
            value="Please download www.google.com"
            placeholder="Enter Message"
            onChangeText={(e) => setEmail(e)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        disabled={!email}
        onPress={handleInviteFriend}
      >
        <View>
          <Text style={styles.text}>Invite</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 100, marginHorizontal: 10 },
  inputs: { gap: 20, marginBottom: 30 },
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

export default InviteFriends;
