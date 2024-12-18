/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Avatar, Button, FAB, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

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
const Item = ({ title, note }: any) => (
  <TouchableRipple
    style={styles.item}
    onPress={
      () => {}
      // navigation.navigate('groupDetail', { groupName: title, groupId })
    }
    // rippleColor="rgba(0, 0, 0, .32)"
  >
    <>
      <Avatar.Text label={title?.[0]?.toUpperCase()} size={48} />

      <View>
        <Text style={styles.title}>{title}</Text>
        {note && <Text>{note}</Text>}
      </View>
    </>
  </TouchableRipple>
);

const Friends = () => {
  const { user }: any = useAuth();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        // onRefresh={() => setIsRefreshing(true)}
        // refreshing={isRefreshing}
        ListEmptyComponent={ListEmptyComponent}
        data={user?.friendsList || []}
        renderItem={({ item }) => (
          <Item title={item.name} note={item.note || ''} />
        )}
        keyExtractor={(item) => item._id}
      />
      <FAB
        icon="share"
        style={styles.fab}
        onPress={() => SheetManager.show('inviteFriends')}
        label="Invite/Add friend"
      />
    </SafeAreaView>
  );
};

export default Friends;

const styles = StyleSheet.create({
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
    gap: 5,
    backgroundColor: 'white',
    borderRadius: 10,
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
  },
});
