/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Avatar, Button, FAB, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListEmptyComponent = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 250,
    }}
  >
    <Text style={{ fontSize: 20 }}>No Friends yet :(</Text>
    <Button
      style={{ margin: 20 }}
      icon="email-newsletter"
      mode="contained"
      onPress={() => SheetManager.show('inviteFriends')}
    >
      Invite/Add Friends
    </Button>
  </View>
);
const Item = ({ title, note, selectedPerson, id, setSelectedPerson }: any) => (
  <TouchableRipple
    onPress={
      () => {
        setSelectedPerson(id);
        SheetManager.hide('friendsList');
      }
      // navigation.navigate('groupDetail', { groupName: title, groupId })
    }
    // rippleColor="rgba(0, 0, 0, .32)"
  >
    <>
      <View style={styles.item}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Avatar.Text label={title?.[0]?.toUpperCase()} size={48} />

          <Text style={styles.title}>{title}</Text>
          {/* {note && <Text>{note}</Text>} */}
        </View>
        {selectedPerson === id && (
          <MaterialCommunityIcons name="check" size={26} />
        )}
      </View>
    </>
  </TouchableRipple>
);

const FriendsListSheet = () => {
  const { user }: any = useAuth();

  const [selectedPerson, setSelectedPerson] = useState(user?.id);
  return (
    <ActionSheet
      containerStyle={styles.actionSheetContainer}
      gestureEnabled={true} // Enables drag gesture
    >
      <SafeAreaView>
        <FlatList
          // onRefresh={() => setIsRefreshing(true)}
          // refreshing={isRefreshing}
          ListEmptyComponent={ListEmptyComponent}
          data={
            user?.friendsList && Array.isArray(user?.friendsList)
              ? [{ name: user?.name, _id: user?.id }, ...user.friendsList]
              : [{ name: user?.name, _id: user?.id }]
          }
          renderItem={({ item }) => (
            <Item
              id={item?._id}
              title={item.name}
              note={item.note || ''}
              selectedPerson={selectedPerson}
              setSelectedPerson={setSelectedPerson}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </ActionSheet>
  );
};

export default FriendsListSheet;

const styles = StyleSheet.create({
  actionSheetContainer: {
    flex: 1, // Allows the action sheet to take up full height
    // maxHeight: '100%', // Expands up to the top of the screen
  },

  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 5,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#4A249D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 22,
    color: 'black',
  },
  grpImg: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'gray',
    // alignSelf: 'center',
  },
});
