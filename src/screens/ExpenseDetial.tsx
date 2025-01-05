import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';
import database from '@react-native-firebase/database';
const ExpenseDetail = ({ route, navigation }: any) => {
  const { expense } = route.params;

  const [expenseSplits, setExpenseSplits] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const formatDate = (date: string) => {
    const expenseDate = new Date(date);
    return expenseDate.toLocaleDateString(); // Formats as MM/DD/YYYY or DD/MM/YYYY based on locale
  };

  React.useEffect(() => {
    const fetchUserData = async (userId: string) => {
      const userSnapshot = await database()
        .ref(`/users/${userId}`)
        .once('value');
      return userSnapshot.val();
    };

    const fetchExpenseSplits = async () => {
      try {
        const splitsRef = database()
          .ref('/expense_splits')
          .orderByChild('expenseId')
          .equalTo(expense.id);

        const snapshot = await splitsRef.once('value');
        const splitsData = snapshot.val();

        if (!splitsData) {
          console.log('No splits found for this expense');
          setExpenseSplits([]);
        } else {
          const formattedSplits: any = await Promise.all(
            Object.keys(splitsData).map(async (key) => {
              const split = splitsData[key];
              const userData = await fetchUserData(split.userId);
              return {
                ...split,
                id: key, // Add the Firebase key as ID
                user: userData, // Attach user data
              };
            })
          );
          setExpenseSplits(formattedSplits);
        }
      } catch (error) {
        console.error('Error fetching expense splits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenseSplits();
  }, [expense.id]);
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="#000" />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="delete" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="pencil" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expense Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.expenseName}>{expense.name}</Text>
        <Text style={styles.totalAmount}>₹{expense.totalAmount}</Text>
        <Text style={styles.addedByText}>
          Added by you on {formatDate(expense.createdAt)}
        </Text>
      </View>

      {/* Payment Split Tree */}
      <View style={styles.splitContainer}>
        <View style={styles.splitRow}>
          <Avatar.Text label="Y" size={40} style={styles.avatar} />
          <Text style={styles.splitText}>You paid ₹{expense.totalAmount}</Text>
        </View>
        <View style={styles.treeContainer}>
          {expenseSplits.map((split: any, index) => (
            <View key={split?.user?.id} style={styles.treeItem}>
              <View style={styles.connector}>
                <View style={styles.verticalLine} />
                {index !== expenseSplits.length - 1 && (
                  <View style={styles.horizontalLine} />
                )}
              </View>
              <View style={styles.subSplitRow}>
                <Avatar.Text
                  label={split.user.name.charAt(0).toUpperCase()}
                  size={30}
                  style={styles.subAvatar}
                />
                <Text style={styles.subSplitText}>
                  <Text style={styles.boldText}>{split?.user?.name}</Text> owes
                  ₹{split.amountOwed}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  expenseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 20,
    color: '#4A4A4A',
    marginBottom: 5,
  },
  addedByText: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  splitContainer: {
    marginTop: 20,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    marginRight: 10,
    backgroundColor: '#4A249D',
  },
  splitText: {
    fontSize: 16,
    color: '#4A4A4A',
  },

  treeContainer: {
    marginLeft: 25,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 20,
    alignItems: 'center',
  },
  verticalLine: {
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
    height: 30,
  },
  horizontalLine: {
    position: 'absolute',
    top: 14,
    left: 20,
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    width: 20,
  },
  subSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subAvatar: {
    marginRight: 10,
  },
  subSplitText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default ExpenseDetail;
