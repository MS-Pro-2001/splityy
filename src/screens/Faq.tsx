/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FAQ: React.FC = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>Frequently Asked Questions (FAQ)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <List.Section>
          <List.Accordion
            title="How does Splityy work?"
            left={(props) => <List.Icon {...props} icon="information" />}
          >
            <Text style={styles.answerText}>
              Splityy helps you split expenses among friends. Simply create an
              expense, add your friends, and input the amounts spent. The app
              will automatically calculate how much each person owes or is owed.
            </Text>
          </List.Accordion>

          <Divider />

          <List.Accordion
            title="How do I add an expense?"
            left={(props) => <List.Icon {...props} icon="plus" />}
          >
            <Text style={styles.answerText}>
              To add an expense, go to the 'Expenses' tab, click on 'Add
              Expense', and enter the total amount and the people involved. You
              can then assign the amount each person paid, and Splityy will
              calculate the balance for each.
            </Text>
          </List.Accordion>

          <Divider />

          <List.Accordion
            title="Can I add recurring expenses?"
            left={(props) => <List.Icon {...props} icon="repeat" />}
          >
            <Text style={styles.answerText}>
              Yes! You can add recurring expenses such as monthly subscriptions
              or rent. Simply select the option to make the expense recurring
              when adding a new expense.
            </Text>
          </List.Accordion>

          <Divider />

          <List.Accordion
            title="How do I settle the balances?"
            left={(props) => <List.Icon {...props} icon="check-circle" />}
          >
            <Text style={styles.answerText}>
              Once the balances are calculated, you can settle them by either
              paying through an integrated payment option or simply noting down
              the amounts owed. Splityy will keep track of all your
              transactions.
            </Text>
          </List.Accordion>

          <Divider />

          <List.Accordion
            title="Is my data safe?"
            left={(props) => <List.Icon {...props} icon="shield" />}
          >
            <Text style={styles.answerText}>
              Absolutely! Splityy uses industry-standard encryption to keep your
              personal and financial data secure.
            </Text>
          </List.Accordion>

          <Divider />

          <List.Accordion
            title="Can I export the split details?"
            left={(props) => <List.Icon {...props} icon="file-export" />}
          >
            <Text style={styles.answerText}>
              Yes, you can export the split details to a CSV file for your
              reference or to share with friends.
            </Text>
          </List.Accordion>

          <Divider />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    color: '#4A249D',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    color: '#4A249D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A249D',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  answerText: {
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default FAQ;
