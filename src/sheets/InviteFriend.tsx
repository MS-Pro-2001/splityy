import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { CustomInput } from '../components/custom/CustomInput';
import { useAuth } from '../context/AuthContext';
import useFriendListService from '../store/friends';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createUniqueId } from '../utils/commonFunctions';
function InviteFriends({ navigation, route }: any) {
  const { from } = route.params;

  const { user }: any = useAuth();
  const { addFriend }: any = useFriendListService();
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
        id: createUniqueId(),
        addedBy: user?.id,
        friend: formData?.email,
        createdAt: Date.now(),
        isRequestAccepted: false,
        isDeleted: false,
      });

      setLoading(false);
      reset();
      console.log('Friend Invited Successfully');
      if (from === 'createGroup') {
        navigation.navigate('Groups');
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.log('err', error);
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {from === 'createGroup' && (
          <>
            <Text style={styles.heading}>Add / Invite Friend</Text>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => navigation.navigate('Groups')}
            >
              <Text>Skip</Text>
            </TouchableOpacity>
          </>
        )}
        {from !== 'createGroup' && (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#4A249D"
              />
            </TouchableOpacity>
            <Text style={styles.heading}>Add / Invite Friend</Text>
          </>
        )}
      </View>

      {/* Name Input */}
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
        keyboardType="default"
      />

      {/* Email Input */}
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
        keyboardType="email-address"
      />

      {/* Submit Button */}
      <Button
        loading={loading}
        style={styles.submitButton}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Invite
      </Button>

      {/* Cancel Button */}
      <Button
        disabled={loading}
        onPress={() => {
          if (from === 'createGroup') {
            navigation.navigate('Groups');
          } else {
            navigation.goBack();
          }
        }} // Navigate back on cancel
        style={styles.cancelButton}
        mode="contained-tonal"
      >
        Cancel
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  skipButton: {
    marginLeft: 'auto', // Pushes the Skip button to the right
    color: '#4A249D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A249D',
    textAlign: 'center',
    flex: 1, // Ensures the title is centered
  },
  container: {
    padding: 20,
    gap: 8,
    backgroundColor: '#ffffff',
    flexGrow: 1, // Ensure ScrollView covers full height
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4A249D',
    marginBottom: 20,
  },
  submitButton: {
    marginTop: 20,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default InviteFriends;
