/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GroupDetail = ({ route, navigation }: any) => {
  const { groupName } = route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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

          <Avatar.Text label={'G'} size={48} />

          <Text style={[styles.text, { fontSize: 25 }]}>{groupName}</Text>
        </View>
        <View style={styles.inputs}>
          <Text style={[styles.text, { marginLeft: 70, marginTop: 10 }]}>
            Hello
          </Text>
          <Text
            style={[
              styles.text,
              { marginLeft: 70, fontSize: 14, marginTop: -10 },
            ]}
          >
            No Expense added yet.
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#d3d3d3',
            borderRadius: 20,
          }}
        >
          <Text style={styles.text}>You are the only one in this group</Text>
          <Button
            style={{ margin: 20 }}
            icon="plus"
            mode="contained"
            // onPress={() => logout()}
          >
            Add members
          </Button>
          <Button
            style={{ margin: 20 }}
            icon="share"
            mode="contained"
            // onPress={() => logout()}
          >
            Share Group link
          </Button>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => console.log('Pressed')}
          label="Add Expense"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 100, marginHorizontal: 10 },
  inputs: { gap: 20, marginBottom: 30 },
  text: { color: '#4A249D', fontSize: 20 },
  div: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 30,
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
});

export default GroupDetail;
