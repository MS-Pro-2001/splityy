/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useExpenseService, { ExpenseType } from '../store/expense';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import database from '@react-native-firebase/database';
import Loader from '../components/Loader';
interface Person {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  checked: boolean;
}

const AddExpensePage = ({ navigation, route }: any) => {
  const { groupId } = route.params;
  const { user }: any = useAuth();
  const { showMessage } = useSnackbar();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Divide Equally, 1: Divide Manually
  const [people, setPeople] = useState<Person[]>([]);

  React.useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        // Step 1: Get the user IDs from the group_members table using the groupId
        const groupMembersRef = database()
          .ref('/group-members')
          .orderByChild('groupId')
          .equalTo(groupId);

        const snapshot = await groupMembersRef.once('value');
        const groupMembersData = snapshot.val();

        if (!groupMembersData) {
          console.log('No members found for this group');
          setPeople([]); // Set empty array if no members found
          setIsLoading(false);
          return;
        }

        const userIds = Object.keys(groupMembersData).map(
          (key) => groupMembersData[key].userId
        );

        // Step 2: Fetch user details from the users table based on the userIds
        const usersRef = database().ref('/users');
        const usersPromises = userIds.map((userId) =>
          usersRef.child(userId).once('value')
        );

        const usersSnapshot = await Promise.all(usersPromises);
        const usersData = usersSnapshot.map((userSnapshot) =>
          userSnapshot.val()
        );
        console.log({ usersData });

        // Step 3: Set the people state with the fetched user details
        setPeople(
          usersData?.map((item: any) => ({
            ...item,
            amount: 0,
            checked: true,
            avatar: item?.photo,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching group members or users:', error);
        setIsLoading(false);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  const { createExpense, createExpenseSplit } = useExpenseService();

  const handleAddExpense = async () => {
    try {
      const newExpense: Omit<
        ExpenseType,
        'id' | 'createdAt' | 'updatedAt' | 'isDeleted'
      > = {
        groupId: groupId,
        paidBy: user?.id,
        totalAmount: parseFloat(amount),
        description: description || '',
      };
      const expenseId = await createExpense(newExpense);

      if (activeTab === 0) {
        const splitAmount =
          parseFloat(amount) /
            people.filter((person) => person.checked).length || 0;
        await Promise.all(
          people
            .filter((person) => person.checked)
            .map((person) =>
              createExpenseSplit({
                expenseId,
                userId: person.id,
                amountOwed: splitAmount,
                amountPaid: 0,
                settled: false,
              })
            )
        );
      } else {
        await Promise.all(
          people
            .filter((person) => person.checked)
            .map((person) =>
              createExpenseSplit({
                expenseId,
                userId: person.id,
                amountOwed: person.amount,
                amountPaid: 0,
                settled: false,
              })
            )
        );
      }

      showMessage('Expense added successfully', 2000);
      navigation.goBack();

      console.log('Expense and splits created successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleManualAmountChange = (id: string, value: string) => {
    const updatedPeople = people.map((person) =>
      person.id === id ? { ...person, amount: parseFloat(value) || 0 } : person
    );
    setPeople(updatedPeople);
  };

  const togglePersonChecked = (id: string) => {
    const updatedPeople = people.map((person) =>
      person.id === id ? { ...person, checked: !person.checked } : person
    );
    setPeople(updatedPeople);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>Add Expense</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.currency}>₹</Text>
        <RNTextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          style={styles.amountInput}
        />
      </View>

      <View style={styles.descriptionContainer}>
        <RNTextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Add a description"
          style={styles.descriptionInput}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab(0)} style={styles.tab}>
          <MaterialCommunityIcons
            name="scale-balance"
            size={24}
            color={activeTab === 0 ? '#4A249D' : '#aaa'}
          />
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity onPress={() => setActiveTab(1)} style={styles.tab}>
          <MaterialCommunityIcons
            name="numeric"
            size={24}
            color={activeTab === 1 ? '#4A249D' : '#aaa'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <Text style={styles.tabLabel}>
        {activeTab === 0 ? 'Split Equally' : 'Split Manually'}
      </Text>

      {isLoading && <Loader />}

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.personRow}>
            <MaterialCommunityIcons
              name={item.checked ? 'check-circle' : 'checkbox-blank-circle'}
              size={24}
              color={item.checked ? '#4A249D' : '#fff'}
              onPress={() => togglePersonChecked(item.id)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#4A249D',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                backgroundColor: '#fff',
              }}
            />

            {/* <Avatar.Image source={{ uri: item.avatar }} size={40} /> */}
            <Text style={styles.personName}>{item.name}</Text>
            {activeTab === 0 ? (
              <Text style={styles.personAmount}>
                ₹
                {!item.checked
                  ? 0
                  : (
                      parseFloat(amount) /
                        people.filter((person) => person.checked).length || 0
                    ).toFixed(2)}
              </Text>
            ) : (
              <View style={styles.manualInputContainer}>
                <Text style={styles.currency}>₹</Text>
                <RNTextInput
                  value={item?.amount?.toString()}
                  onChangeText={(value) =>
                    handleManualAmountChange(item.id, value)
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  style={styles.manualInput}
                />
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Button
        mode="contained"
        onPress={handleAddExpense}
        style={styles.addButton}
      >
        Add Expense
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  currency: {
    fontSize: 23,
    color: '#4A249D',
    marginRight: 5,
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 24,
    color: '#4A249D',
    borderBottomWidth: 1,
    borderBottomColor: '#4A249D',
    textAlign: 'center',
    width: '50%',
    marginBottom: 20,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#4A249D',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '90%',
    textAlign: 'center',
    opacity: 0.8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 80,
  },
  verticalLine: {
    height: 30,
    width: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  tabLabel: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: 'left',
    marginLeft: 10,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    // borderColor: '#4A249D',
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginRight: 10,
    // backgroundColor: '#fff',
  },
  personName: {
    fontSize: 18,
    color: '#4A249D',
    flex: 1,
    marginLeft: 10,
  },
  personAmount: {
    fontSize: 16,
    color: '#4A249D',
  },
  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4A249D',
    width: 80,
    justifyContent: 'center',
  },
  manualInput: {
    fontSize: 16,
    color: '#4A249D',
    textAlign: 'right',
    flex: 1,
  },
  addButton: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#4A249D',
    height: 50,
    justifyContent: 'center',
  },
});

export default AddExpensePage;
