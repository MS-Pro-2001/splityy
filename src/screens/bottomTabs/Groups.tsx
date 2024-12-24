/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, FAB, TouchableRipple } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { truncateText } from '../../utils/commonFunctions';
import database from '@react-native-firebase/database';
import { useAuth } from '../../context/AuthContext';

const Item = ({ title, navigation, groupId, desc }: any) => (
  <TouchableRipple
    style={styles.item}
    onPress={() =>
      navigation.navigate('groupDetail', { groupName: title, groupId, desc })
    }
  >
    <>
      <Avatar.Text label={title?.[0]?.toUpperCase()} size={40} />

      <View>
        <Text style={styles.title}>{truncateText(title)}</Text>
        <Text style={styles.subtitle}>{truncateText(desc)}</Text>
      </View>
    </>
    {/* <View style={styles.item}>
      <View style={styles.grpImg} />
      <Text style={styles.title}>{title}</Text>
      <Divider />
    </View> */}
  </TouchableRipple>
);

const Groups = ({ navigation }: any) => {
  const [state, setState] = React.useState({ open: false });
  const [grpData, setGrpData] = React.useState([]);

  const { user }: any = useAuth();

  console.log({ grpData });

  React.useEffect(() => {
    const groupsRef = database()
      .ref('/groups')
      .orderByChild('createdBy')
      .equalTo(user?.id);

    const onValueChange = groupsRef.on('value', (snapshot) => {
      const res = snapshot.val();

      if (!res) {
        console.log('No groups found');
        setGrpData([]);
        return;
      }

      const data: any = Object.keys(res)
        .map((key) => ({
          groupId: key,
          ...res[key], // Spread the data to include group properties
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setGrpData(data);
    });

    // Clean up the listener when the component unmounts
    return () => groupsRef.off('value', onValueChange);
  }, [user?.id]);

  const onStateChange = ({ open }: any) => setState({ open });

  // const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        // onRefresh={() => setIsRefreshing(true)}
        // refreshing={isRefreshing}
        ListEmptyComponent={() => (
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
                source={require('../../assets/animations/noGroup2.json')}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
            <Text style={{ fontSize: 20 }}>No groups found</Text>
            <Button
              style={{ margin: 20 }}
              icon="plus"
              mode="contained"
              onPress={() => navigation.navigate('createGroup')}
            >
              Create Group
            </Button>
          </View>
        )}
        data={grpData || []}
        renderItem={({ item }: any) => (
          <Item
            title={item.groupName}
            navigation={navigation}
            groupId={item.groupId}
            desc={item.description}
          />
        )}
        keyExtractor={(item: any) => item.groupId}
      />
      <FAB.Group
        open={state.open}
        visible
        icon={state.open ? 'chevron-down' : 'plus'}
        actions={[
          // { icon: 'plus', onPress: () => console.log('Pressed add') },
          {
            icon: 'account-group-outline',
            label: 'Create Group',
            onPress: () => navigation.navigate('createGroup'),
          },
          {
            icon: 'android-messages',
            label: 'Invite Friends',
            onPress: () => navigation.navigate('inviteFriends'),
          },
          {
            icon: 'plus',
            label: 'Add Expense',
            onPress: () => navigation.navigate('AddExpense'),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (state.open) {
            // do something if the speed dial is open
          }
        }}
      />
    </SafeAreaView>
  );
};

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
    gap: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
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
  subtitle: {
    fontSize: 12,
    color: 'gray',
  },
  grpImg: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: 'gray',
  },
});

export default Groups;
