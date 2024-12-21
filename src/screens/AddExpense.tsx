/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  FlatList,
  TextInput as RNTextInput,
} from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddExpense = ({ navigation }: any) => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState(['John', 'Emma', 'Sophia', 'Liam']); // Dummy people list
  const [filteredPeople, setFilteredPeople] = useState(people); // Filtered list for search
  const [paidBy, setPaidBy] = useState('You'); // Default paid by "You"
  const [distributeEqually, setDistributeEqually] = useState(true); // Default distribute equally
  const [manualChips, setManualChips] = useState(people); // Chips shown in "Manual" mode

  // Handle person selection from action sheet
  const handleSelectPerson = (person: any) => {
    setPaidBy(person);
    SheetManager.hide('paidBySheet');
  };

  // Filter people list for search
  const handleSearch = (text: string) => {
    const filtered = people.filter((person) =>
      person.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPeople(filtered);
  };

  // Disable button if expense name or amount is invalid
  const isFormValid = () => {
    return expenseName.length >= 3 && !isNaN(amount) && Number(amount) > 0;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button and Heading */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>Add Expense</Text>
      </View>

      <TextInput
        label="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
        placeholder="Enter expense name"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#4A249D' } }}
      />

      <TextInput
        label="₹ Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#4A249D' } }}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
        mode="outlined"
        style={styles.input}
        theme={{ colors: { primary: '#4A249D' } }}
      />

      {/* Paid By Section */}
      <View style={styles.row}>
        <Text style={styles.label}>Paid By</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => SheetManager.show('paidBySheet')}
        >
          <Text style={styles.selectText}>{paidBy}</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#4A249D"
          />
        </TouchableOpacity>
      </View>

      {/* Distribute Section */}
      <View style={styles.row}>
        <Text style={styles.label}>Distribute</Text>
        <Chip
          onPress={() => setDistributeEqually(!distributeEqually)}
          style={styles.chip}
          mode={distributeEqually ? 'flat' : 'outlined'}
        >
          {distributeEqually || manualChips?.length === 0
            ? 'Equally'
            : 'Manually'}
        </Chip>
      </View>

      {!distributeEqually && (
        <View style={styles.chipContainer}>
          {manualChips.map((person, index) => (
            <Chip
              key={index}
              onClose={() =>
                setManualChips(manualChips.filter((p) => p !== person))
              }
              style={styles.chip}
            >
              {person}
            </Chip>
          ))}
        </View>
      )}

      <Button
        mode="contained"
        onPress={() =>
          console.log({
            expenseName,
            amount,
            paidBy,
            description,
            manualChips,
            distributeEqually,
          })
        }
        disabled={!isFormValid()}
        style={[
          styles.button,
          { backgroundColor: isFormValid() ? '#4A249D' : '#B0B0B0' },
        ]}
      >
        Add Expense
      </Button>

      {/* Paid By Action Sheet */}
      <ActionSheet id="paidBySheet">
        <View style={styles.actionSheetContainer}>
          <TouchableOpacity
            onPress={() => SheetManager.hide('paidBySheet')}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons name="close" size={24} color="#4A249D" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color="#4A249D" />
            <RNTextInput
              placeholder="Search People"
              placeholderTextColor="#999"
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>

          <FlatList
            data={filteredPeople}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.personItem}
                onPress={() => handleSelectPerson(item)}
              >
                <Text style={styles.personName}>{item}</Text>
                {paidBy === item && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color="#4A249D"
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </ActionSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    color: '#4A249D',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#4A249D',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4A249D',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectText: {
    color: '#4A249D',
    fontSize: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#EDE7F6',
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  actionSheetContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  personItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  personName: {
    fontSize: 18,
    color: '#4A249D',
  },
});

export default AddExpense;
