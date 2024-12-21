import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutApp: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#4A249D" />
        </TouchableOpacity>
        <Text style={styles.heading}>ABOUT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.description}>
          Splityy is an easy-to-use app that helps you split expenses among
          friends, roommates, or colleagues. Whether you're sharing a dinner,
          splitting rent, or managing group travel costs, Splityy makes it
          simple and stress-free to keep track of who owes what.
        </Text>

        <Text style={styles.sectionTitle}>Key Features:</Text>
        <Text style={styles.features}>
          - Split expenses easily among multiple people{'\n'}- Track how much
          each person owes or is owed{'\n'}- Add both one-time and recurring
          expenses{'\n'}- Get detailed split reports that you can share{'\n'}
          Secure data with industry-standard encryption
        </Text>

        <Text style={styles.sectionTitle}>How to Use:</Text>
        <Text style={styles.features}>
          1. Create a group with your friends{'\n'}
          2. Add your expenses and the people involved{'\n'}
          3. Splityy automatically calculates each person's share{'\n'}
          4. Settle the amounts directly through the app or offline
        </Text>

        <Text style={styles.sectionTitle}>Contact Us:</Text>
        <Text style={styles.contact}>
          Email: support@splityy.com{'\n'}
          Website: www.splityy.com{'\n'}
        </Text>

        <Text style={styles.footer}>Thank you for using Splityy!</Text>
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
    fontSize: 22,
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
  description: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A249D',
    marginTop: 20,
    marginBottom: 10,
  },
  features: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  contact: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
  },
  footer: {
    fontSize: 14,
    color: '#4A249D',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default AboutApp;
