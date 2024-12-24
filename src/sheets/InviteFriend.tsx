/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { CustomInput } from '../components/custom/CustomInput';
import { useAuth } from '../context/AuthContext';
import database from '@react-native-firebase/database';
import { createUniqueId } from '../utils/commonFunctions';
import sendEmail from 'react-native-email';
import useFriendListService from '../store/friends';
function InviteFriends() {
  const { user }: any = useAuth();

  const { addFriend }: any = useFriendListService();

  // console.log({ user });
  const [loading, setLoading] = useState(false); // Track loading state
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  }: any = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });
  const onSubmit: any = async (formData: any) => {
    setLoading(true);

    try {
      await addFriend({
        addedBy: user?.id,
        friend: formData?.email,
        createdAt: Date.now(),
        isRequestAccepted: false,
      });

      setLoading(false);
      reset();
      SheetManager.hide('inviteFriends');
      console.log('Friend Invited Successfully');
    } catch (error) {
      console.log('err', error);
    }
  };
  return (
    <ActionSheet
      containerStyle={styles.actionSheetContainer}
      gestureEnabled={true} // Enables drag gesture
    >
      <Text style={styles.avatarText}>Add / Invite Friend</Text>
      <View style={styles.container}>
        <CustomInput
          control={control}
          name="name"
          validationRules={{
            required: {
              value: true,
              message: 'Name is required',
            },
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters long',
            },
          }}
          placeholder={'Name*'}
          errors={errors}
          keyboardType="text"
        />

        <CustomInput
          control={control}
          name="email"
          validationRules={{
            required: {
              value: true,
              message: 'Email is required',
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address',
            },
          }}
          placeholder={'Email*'}
          errors={errors}
          keyboardType="text"
        />
      </View>
      <Button
        loading={loading}
        style={{ margin: 20 }}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Invite
      </Button>
      <Button
        disabled={loading}
        onPress={() => SheetManager.hide('inviteFriends')}
        style={{ marginHorizontal: 20 }}
        mode="contained-tonal"
      >
        Cancel
      </Button>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  actionSheetContainer: {
    flex: 1, // Allows the action sheet to take up full height
    maxHeight: '100%', // Expands up to the top of the screen
  },
  container: {
    margin: 20,
    gap: 25,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 8,
  },
  avatarText: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4A249D',
  },
});

export default InviteFriends;
