import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import React from 'react';
import { TextInput } from 'react-native-paper';

function AddExpenseSheet() {
  return (
    <ActionSheet>
      <View style={styles.container}>
        <View>
          <Text>With you and:</Text>
        </View>
        <View style={styles.inputs}>
          <TextInput placeholder="Enter a description" />
          <TextInput placeholder="amount" />
        </View>
        <View style={styles.info}>
          <Text style={styles.text}>Paid by</Text>
          <TouchableOpacity>
            <Text style={styles.text}>you</Text>
          </TouchableOpacity>
          <Text style={styles.text}>and split</Text>
          <TouchableOpacity>
            <Text style={styles.text}>equally</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: { margin: 5 },
  inputs: { gap: 5 },
  info: { flex: 1, flexDirection: 'row' },
  text: { color: 'black' },
});

export default AddExpenseSheet;
