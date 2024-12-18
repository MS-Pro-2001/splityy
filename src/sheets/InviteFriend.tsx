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
function InviteFriends() {
  const { user }: any = useAuth();

  // console.log({ user });
  const [loading, setLoading] = useState(false); // Track loading state
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  }: any = useForm({
    defaultValues: {
      name: '',
      contactInfo: '',
      note: '',
    },
  });
  const onSubmit = (formData: any) => {
    setLoading(true);

    const to = ['mridul.sehgalwork@gmail.com']; // string or array of email addresses
    sendEmail(to, {
      // Optional additional arguments
      cc: [`${getValues('contactInfo')}`], // string or array of email addresses
      //   bcc: 'mee@mee.com', // string or array of email addresses
      subject: 'Show how to use',
      body: 'Some body right here',
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);

    database()
      .ref(`/users/${user?.id}`)
      .update({
        friendsList: [
          ...(user?.friendsList || []),
          {
            _id: createUniqueId('friend'),
            name: formData.name,
            contactInfo: formData?.contactInfo,
            note: formData?.note,
          },
        ],
      })
      .then(() => {
        setLoading(false);
        reset();
        SheetManager.hide('inviteFriends');
        console.log('Friend Invited Successfully');
      })
      .catch((error) => console.error('Error inviting friend:', error));
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
          name="contactInfo"
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

        <CustomInput
          control={control}
          name="note"
          placeholder={'Note'}
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
    gap: 50,
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
