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
function InviteFriends() {
  const { user }: any = useAuth();
  console.log({ user });
  const [loading, setLoading] = useState(false); // Track loading state
  const {
    control,
    handleSubmit,
    reset,
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

    database()
      .ref(`/users/${user?.id}`)
      .update({
        friendsList: [
          ...(user?.friendsList || []),
          {
            _id: createUniqueId(),
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
            required: { value: true, message: 'Name is required' },
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
              message: 'Email or contact number is required',
            },
          }}
          placeholder={'Email* / Phone Number*'}
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
