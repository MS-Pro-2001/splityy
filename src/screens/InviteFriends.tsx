/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm } from 'react-hook-form';
import sendEmail from 'react-native-email';
import { CustomInput } from '../components/custom/CustomInput';

const InviteFriends = ({ navigation }: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);

    // Send email to the invited friend
    const to = [data.email]; // Send to the entered email
    sendEmail(to, {
      subject: 'You have been invited!',
      body: `Hello ${data.name},

${data.note || 'You have been invited to join us!'}`,
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);

    reset(); // Reset form fields
    navigation.goBack();
  };

  return (
    <View>
      <View style={{ margin: 15 }}>
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="close" size={30} color={'#4A249D'} />
          </TouchableOpacity>
          <Text style={[styles.text, { fontSize: 25 }]}>Invite Friends</Text>
        </View>
      </View>
      <View style={styles.container}>
        <CustomInput
          control={control}
          name="name"
          validationRules={{
            required: { value: true, message: 'Name is required' },
            minLength: {
              value: 3,
              message: 'Name must be at least 3 characters',
            },
          }}
          placeholder="Enter Name"
          errors={errors}
        />
        <CustomInput
          control={control}
          name="email"
          validationRules={{
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          }}
          placeholder="Enter Email"
          errors={errors}
        />
        <CustomInput
          control={control}
          name="note"
          placeholder="Enter Note (Optional)"
          errors={errors}
        />
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleSubmit(onSubmit)}>
        <MaterialCommunityIcons name="check" size={30} color={'white'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 50, marginHorizontal: 10 },
  text: { fontSize: 20, color: '#4A249D' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4A249D',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default InviteFriends;
