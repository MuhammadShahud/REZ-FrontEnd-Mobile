import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Text} from '../../Components';
import {Colors} from '../../Styles';
import BookingHistory from './BookingHistory';
import OrderHistory from './OrderHistory';

const TabNav = createMaterialTopTabNavigator();

const Tabs = ({role}) => {
  return (
    <TabNav.Navigator
      screenOptions={{
        indicatorStyle: {
          backgroundColor: Colors.BLUE,
          alignSelf: 'center',
        },
      }}
      style={{backgroundColor: 'red'}}>
      <TabNav.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{tabBarLabel: 'Order History'}}
      />
      <TabNav.Screen
        name="BookingHistory"
        component={BookingHistory}
        options={{
          tabBarLabel: role == 'store' ? 'Payment History' : 'Booking History',
        }}
      />
    </TabNav.Navigator>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
  };
};
const mapsDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapsDispatchToProps)(Tabs);
