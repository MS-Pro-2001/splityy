/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LottieView from 'lottie-react-native';
import useGroupService from '../store/groups';

const CreateGroup = ({ navigation }: any) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false); // To handle the loading state

  const textInputRef = useRef<TextInput | null>(null);

  const { createGroup } = useGroupService();

  useEffect(() => {
    textInputRef.current?.focus();
  }, []);

  const handleCreateGroup = async () => {
    setLoading(true); // Start loading animation

    const groupData: any = {
      groupName: groupName.trim(),
      description: description.trim(),
    };

    try {
      await createGroup(groupData);
      setLoading(false); // Stop loading animation
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log('err', error);
    }
  };

  // File Upload handler
  const handleProfilePhotoUploader = () => {};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Heading */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#4A249D"
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Create Group</Text>
        </View>

        {/* Lottie Animation */}
        <View style={{ alignItems: 'center' }}>
          <LottieView
            source={require('../assets/animations/groupAnimation.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>

        <Button
          onPress={handleProfilePhotoUploader}
          mode="outlined"
          loading={loading}
          style={[styles.addProfile]}
        >
          {'Upload Group Photo'}
        </Button>

        <View style={styles.inputs}>
          <TextInput
            label="Group Name"
            value={groupName}
            onChangeText={(value) => setGroupName(value)}
            placeholder="Enter group name"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#4A249D' } }}
            ref={textInputRef}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={(value) => setDescription(value)}
            placeholder="Enter description"
            multiline
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: '#4A249D' } }}
          />
        </View>

        {/* Create Group Button */}
        <Button
          mode="contained"
          onPress={handleCreateGroup}
          disabled={groupName.trim().length < 3 || loading}
          loading={loading}
          style={[
            styles.button,
            {
              backgroundColor:
                groupName.trim().length < 3 || loading ? '#B0B0B0' : '#4A249D',
            },
          ]}
          labelStyle={{
            color:
              groupName.trim().length < 3 || loading ? '#808080' : '#FFFFFF',
          }}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  heading: {
    fontSize: 22,
    color: '#4A249D',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  animation: {
    width: 200,
    height: 200,
  },
  inputs: {
    width: '100%',
    gap: 20,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 5,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addProfile: {
    borderRadius: 5,
    height: 40,
    width: 180,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderColor: '#4A249D',
  },
});

export default CreateGroup;
