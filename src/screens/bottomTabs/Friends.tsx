/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import LottieView from 'lottie-react-native';
import database from '@react-native-firebase/database';
const ListEmptyComponent = ({ navigation }: any) => (
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
      onPress={() =>
        navigation.navigate('inviteFriends', {
          from: 'friends',
        })
      }
    >
      Invite/Add Friends
    </Button>
  </View>
);
const Item = ({ details }: any) => (
  <TouchableRipple
    style={styles.item}
    onPress={
      () => {}
      // navigation.navigate('groupDetail', { groupName: title, groupId })
    }
    // rippleColor="rgba(0, 0, 0, .32)"
  >
    <>
      <Avatar.Text label={details?.name?.[0]?.toUpperCase()} size={48} />

      <View>
        <Text style={styles.title}>{details?.name}</Text>
        <Text style={styles.subTitle}>{details?.email}</Text>
      </View>
    </>
  </TouchableRipple>
);

const Friends = ({ navigation, from }: any) => {
  const [friendList, setFriendList] = React.useState();
  const { user }: any = useAuth();

  React.useEffect(() => {
    const friendListRef: any = database()
      .ref('/friendList')
      .orderByChild('addedBy')
      .equalTo(user?.id);

    const onValueChange = friendListRef.on('value', async (snapshot: any) => {
      const res = snapshot.val();

      if (!res) {
        console.log('No friends found');
        setFriendList([]);
        return;
      }

      // Process the friend list data
      const data: any = Object.keys(res)
        .map((key) => ({
          id: key,
          ...res[key], // Spread the data to include friend properties
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      // Fetch details of all friends from the users reference
      const friendsDetailsPromises = data.map(async (item: any) => {
        const friendId = item.friend; // Assuming 'friend' contains the friend's user ID
        const userSnapshot = await database()
          .ref(`/users/${friendId}`)
          .once('value');
        const userData = userSnapshot.val();
        return { ...userData }; // Add friend details to the item
      });

      // Resolve all promises and update the state
      const enrichedFriendList: any = await Promise.all(friendsDetailsPromises);
      setFriendList(enrichedFriendList);
    });

    // Clean up the listener when the component unmounts
    return () => friendListRef.off('value', onValueChange);
  }, [user?.id]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        // onRefresh={() => setIsRefreshing(true)}
        // refreshing={isRefreshing}
        ListEmptyComponent={
          <ListEmptyComponent navigation={navigation} from={from} />
        }
        data={friendList || []}
        renderItem={({ item }: any) => <Item details={item} />}
        keyExtractor={(item: any) => item.id}
      />
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
  subTitle: {
    fontSize: 12,
    color: 'grey',
  },
  grpImg: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'gray',
  },
});
