/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { Avatar, Button, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import LottieView from 'lottie-react-native';
import database from '@react-native-firebase/database';
const ListEmptyComponent = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 100,
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <LottieView
        source={require('../../assets/animations/i.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
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
const Item = ({ title }: any) => (
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
      </View>
    </>
  </TouchableRipple>
);

const Friends = () => {
  const [friendList, setFriendList] = React.useState();
  const { user }: any = useAuth();

  console.log({ friendList });

  React.useEffect(() => {
    const friendListRef: any = database()
      .ref('/friendList')
      .orderByChild('addedBy')
      .equalTo(user?.id);

    const onValueChange = friendListRef.on('value', (snapshot: any) => {
      const res = snapshot.val();

      if (!res) {
        console.log('No groups found');
        setFriendList([]);
        return;
      }

      const data: any = Object.keys(res)
        .map((key) => ({
          id: key,
          ...res[key], // Spread the data to include group properties
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setFriendList(data);
    });

    // Clean up the listener when the component unmounts
    return () => friendListRef.off('value', onValueChange);
  }, [user?.id]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        // onRefresh={() => setIsRefreshing(true)}
        // refreshing={isRefreshing}
        ListEmptyComponent={ListEmptyComponent}
        data={friendList || []}
        renderItem={({ item }: any) => <Item title={item.friend} />}
        keyExtractor={(item: any) => item.id}
      />
      {/* <FAB
        icon="share"
        style={styles.fab}
        onPress={() => SheetManager.show('inviteFriends')}
        label="Invite/Add friend"
      /> */}
    </SafeAreaView>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 40,
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
    fontSize: 18,
    color: 'black',
  },
  grpImg: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'gray',
  },
});
