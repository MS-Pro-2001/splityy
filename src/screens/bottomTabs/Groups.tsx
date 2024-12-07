/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, FAB, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

const Item = ({ title, navigation, groupId }: any) => (
  <TouchableRipple
    onPress={() =>
      navigation.navigate('groupDetail', { groupName: title, groupId })
    }
    // rippleColor="rgba(0, 0, 0, .32)"
  >
    <View style={styles.item}>
      <View style={styles.grpImg} />
      <Text style={styles.title}>{title}</Text>
      <Divider />
    </View>
  </TouchableRipple>
);

const Groups = ({ navigation }: any) => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }: any) => setState({ open });

  const { user }: any = useAuth();

  // const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        // onRefresh={() => setIsRefreshing(true)}
        // refreshing={isRefreshing}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 30,
              height: '100%',
              marginTop: 200,
            }}
          >
            <Text style={{ fontSize: 20 }}>No groups found</Text>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => navigation.navigate('createGroup')}
            >
              Create Groups
            </Button>
          </View>
        )}
        data={user?.groups}
        renderItem={({ item }) => (
          <Item
            title={item.groupName}
            navigation={navigation}
            groupId={item.groupId}
          />
        )}
        keyExtractor={(item) => item.groupId}
      />
      <FAB.Group
        open={state.open}
        visible
        icon={state.open ? 'newspaper' : 'plus'}
        actions={[
          // { icon: 'plus', onPress: () => console.log('Pressed add') },
          {
            icon: 'plus',
            label: 'Add Expense',
            onPress: () => navigation.navigate('AddExpense'),
          },
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

export default Groups;
