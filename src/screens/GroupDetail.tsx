/* eslint-disable react-native/no-inline-styles */
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Text, FAB, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { truncateText } from '../utils/commonFunctions';

// Utility function to truncate text to 30 characters and append ellipses

const expensesData = [
  {
    id: '1',
    date: '2024-12-21',
    name: 'To Coimbatore',
    category: 'Travel',
    amount: 554,
    icon: 'bus',
  },
  {
    id: '2',
    date: '2024-12-21',
    name: 'Diesel fuel at CBE',
    category: 'Fuel',
    amount: 800,
    icon: 'gas-station',
  },
  {
    id: '3',
    date: '2024-12-21',
    name: 'Weekly - Vegetables',
    category: 'Vegetables',
    amount: 350,
    icon: 'food-apple',
  },
  {
    id: '4',
    date: '2024-12-20',
    name: 'Brookefields Cinema',
    category: 'Entertainment',
    amount: 350,
    icon: 'movie',
  },
  {
    id: '5',
    date: '2024-12-20',
    name: 'Casuals',
    category: 'Shopping',
    amount: 1150,
    icon: 'tshirt-crew',
  },
  {
    id: '6',
    date: '2024-12-19',
    name: 'Night out with Friends',
    category: 'Party',
    amount: 550,
    icon: 'party-popper',
  },
];

const friendsData = [
  { id: '1', name: 'John Doe', contact: '+91 1234567890' },
  { id: '2', name: 'Jane Smith', contact: '+91 9876543210' },
  { id: '3', name: 'Jack Black', contact: '+91 1122334455' },
];

const ItemSeparator = () => <Divider style={styles.divider} />;
const ListEmptyComponent = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <LottieView
        source={require('../assets/animations/noExpense.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
    <Text style={{ fontSize: 20 }}>No Expenses found</Text>
  </View>
);
const GroupDetail = ({ route, navigation }: any) => {
  const { groupName } = route.params;
  const dummyImageUrl = 'https://picsum.photos/205/300';
  const [fabExtended, setFabExtended] = useState(true); // Tracks the FAB state
  const [activeTab, setActiveTab] = useState<'expenses' | 'friends'>(
    'expenses'
  ); // Tracks active tab

  const formatDate = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const expenseDate = new Date(dateString);

    if (
      expenseDate.getDate() === today.getDate() &&
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      expenseDate.getDate() === yesterday.getDate() &&
      expenseDate.getMonth() === yesterday.getMonth() &&
      expenseDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday';
    } else {
      return expenseDate.toLocaleDateString(); // Formats as MM/DD/YYYY or DD/MM/YYYY based on locale
    }
  };

  const groupedExpenses = expensesData.reduce((acc, expense) => {
    const formattedDate = formatDate(expense.date);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(expense);
    return acc;
  }, {} as Record<string, typeof expensesData>);

  const renderExpenseItem = ({ item }: { item: (typeof expensesData)[0] }) => (
    <View style={styles.expenseItem}>
      <MaterialCommunityIcons name={item.icon} size={30} color="#4A249D" />
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseName}>{truncateText(item.name)}</Text>
        <Text style={styles.expenseCategory}>
          {truncateText(item.category)}
        </Text>
      </View>
      <Text style={styles.expenseAmount}>₹{item.amount}</Text>
    </View>
  );

  const renderFriendItem = ({ item }: { item: (typeof friendsData)[0] }) => (
    <View style={styles.expenseItem}>
      <MaterialCommunityIcons name="account-circle" size={30} color="#4A249D" />
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseName}>{item.name}</Text>
        <Text style={styles.expenseCategory}>{item.contact}</Text>
      </View>
    </View>
  );

  const renderSection = (date: string) => (
    <View key={date}>
      <Text style={styles.sectionHeader}>{date}</Text>
      <FlatList
        data={groupedExpenses[date]}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );

  const handleScroll = (event: any) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    setFabExtended(scrollOffsetY <= 10); // Extend the FAB only near the top
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={{ flex: 1 }}>
        {/* Top Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: dummyImageUrl }} style={styles.topImage} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={30}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {/* Group Name */}
          <Text style={styles.groupName}>{groupName}</Text>
        </View>

        {/* Tabs for Expenses and Friends */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
            onPress={() => setActiveTab('expenses')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'expenses' && styles.activeTabText,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
            onPress={() => setActiveTab('friends')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'friends' && styles.activeTabText,
              ]}
            >
              Friends
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expenses or Friends List */}
        {activeTab === 'expenses' ? (
          <FlatList
            data={Object.keys(groupedExpenses) || []}
            renderItem={({ item }) => renderSection(item)}
            keyExtractor={(item) => item}
            onScroll={handleScroll}
            scrollEventThrottle={16} // Improves scroll responsiveness
            contentContainerStyle={styles.expensesList}
            ListEmptyComponent={ListEmptyComponent}
          />
        ) : (
          <FlatList
            data={friendsData}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.expensesList}
          />
        )}

        {/* Floating Action Button */}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddExpense')}
          label={
            activeTab === 'expenses'
              ? fabExtended
                ? 'Add Expense'
                : undefined
              : fabExtended
              ? 'Add Friend'
              : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').height * 0.35,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    opacity: 0.8,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 5,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  groupName: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A249D',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A249D',
  },
  activeTabText: {
    color: '#4A249D',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A249D',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  expenseDetails: {
    flex: 1,
    marginLeft: 15,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A249D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  expensesList: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 30,
  },
});

export default GroupDetail;
