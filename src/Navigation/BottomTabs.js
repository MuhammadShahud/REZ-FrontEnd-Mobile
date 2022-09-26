import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  calendar_active,
  calendar_inactive,
  chat_active,
  chat_inactive,
  home_active,
  home_inactive,
  profile_active,
  profile_inactive,
  store_active,
  store_inactive,
} from '../Assets';
import {
  Chat,
  Home,
  Inbox,
  InviteFriends,
  MyInvites,
  Profile,
  Schedule,
  ScheduleList,
  Store,
} from '../Screens';
import {Colors} from '../Styles';

const BottomTabs = () => {
  const BottomTab = createBottomTabNavigator();

  return (
    <BottomTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIcon: ({focused, color, size}) => {
          let icon;
          if (route.name === 'Home') {
            icon = (
              <Image
                source={focused ? home_active : home_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Calender') {
            icon = (
              <Image
                source={focused ? calendar_active : calendar_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Store') {
            icon = (
              <Image
                source={focused ? store_active : store_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Inbox') {
            icon = (
              <Image
                source={focused ? chat_active : chat_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          } else if (route.name === 'Profile') {
            icon = (
              <Image
                source={focused ? profile_active : profile_inactive}
                style={styles.iconImage}
                resizeMode={'contain'}
              />
            );
          }
          return icon;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.GREEN,
        inactiveTintColor: Colors.BLACK,
      }}
      initialRouteName="Home">
      <BottomTab.Screen
        name={'Home'}
        component={Home}
        options={{tabBarLabel: 'Home'}}
      />
      <BottomTab.Screen
        name={'Calender'}
        component={Schedule}
        options={{tabBarLabel: 'Calendar'}}
      />
      <BottomTab.Screen
        name={'Store'}
        component={Store}
        options={{tabBarLabel: 'Store'}}
      />
      <BottomTab.Screen
        name={'Inbox'}
        component={Inbox}
        options={{tabBarLabel: 'Chat'}}
      />
      <BottomTab.Screen
        name={'Profile'}
        // component={InviteFriends}
        component={MyInvites}
        options={{tabBarLabel: 'Invites'}}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconImage: {height: 25, width: 25},
  // tabBarStyle: {height: 58},
  // tabBarLabelStyle: {fontWeight: 'bold', fontSize: 11},
});

export default BottomTabs;
