import * as React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ActiveEvents, PreviousEvents } from '../../index';
import { Colors } from '../../../Styles';

const TabNav = createMaterialTopTabNavigator();

const Tabs = props => {
  return (
    <TabNav.Navigator
      tabBarOptions={{
        indicatorStyle: {
          backgroundColor: Colors.BLUE,
          PaddingHorizontal: 80,
        },
      }}>
      <TabNav.Screen name="Active Events" component={ActiveEvents} />
      <TabNav.Screen name="Previous Events" component={PreviousEvents} />
    </TabNav.Navigator>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default Tabs;
