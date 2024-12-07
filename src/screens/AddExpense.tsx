/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Chip, Text, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddExpense = ({ navigation }: any) => {
  return (
    <View>
      <View
        style={{
          margin: 15,
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={'#4A249D'}
          />
        </TouchableOpacity>
        <Text style={styles.text}>Add Expense</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.div}>
          <Text style={styles.text}>With you and:</Text>
          <TextInput
            style={styles.input}
            placeholder=" " // Keeps input focusable without visible text
          />
          {/* <Chip icon="close" onPress={() => console.log('Pressed')}>
            Example Chip
          </Chip> */}
        </View>
        <View style={styles.inputs}>
          <TextInput placeholder="Enter a description" />
          <TextInput keyboardType="numeric" placeholder="amount" />
        </View>
        <View style={styles.div}>
          <Text style={styles.text}>Paid by</Text>
          <TouchableOpacity
            onPress={() => SheetManager.show('friendsList')}
            style={styles.sDiv}
          >
            <Text style={styles.text}>you</Text>
          </TouchableOpacity>
          <Text style={styles.text}>and split</Text>
          <TouchableOpacity style={styles.sDiv}>
            <Text style={styles.text}>equally</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <View>
          <Text style={styles.text}>+ Add</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 100, marginHorizontal: 10 },
  inputs: { gap: 20, marginBottom: 30 },
  text: { color: '#4A249D', fontSize: 20 },
  div: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  sDiv: {
    borderColor: 'grey',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingBottom: 2,
  },
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
  input: {
    width: 200, // Adjust as needed
    backgroundColor: 'transparent', // No background
    color: 'transparent', // Makes entered text invisible
    borderWidth: 0, // No border
  },
});

export default AddExpense;
