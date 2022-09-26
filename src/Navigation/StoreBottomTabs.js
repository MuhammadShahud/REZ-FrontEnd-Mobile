import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  chat_active,
  chat_inactive,
  home_active,
  home_inactive,
  profile_active,
  profile_inactive,
  store_active,
  store_inactive,
} from '../Assets';
import {Chat, MyInvites, ProductList, Profile, Store, Inbox} from '../Screens';
import {Colors} from '../Styles';

const StoreBottomTabs = () => {
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
          } else if (route.name === 'Inbox') {
            icon = (
              <Image
                source={focused ? chat_active : chat_inactive}
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
        component={Store}
        options={{tabBarLabel: 'Home'}}
      />

      <BottomTab.Screen
        name={'Store'}
        component={ProductList}
        options={{tabBarLabel: 'Store'}}
      />
      <BottomTab.Screen
        name={'Inbox'}
        component={Inbox}
        options={{tabBarLabel: 'Chat'}}
      />
      <BottomTab.Screen
        name={'Profile'}
        component={Profile}
        options={{tabBarLabel: 'Profile'}}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconImage: {height: 25, width: 25},
  tabBarStyle: {height: 58},
  tabBarLabelStyle: {fontWeight: 'bold', fontSize: 11},
});

export default StoreBottomTabs;
