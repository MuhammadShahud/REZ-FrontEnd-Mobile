import * as React from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PaymentHistory from './PaymentHistory';
import PaymentCards from './PaymentCards';
import {Colors} from '../../Styles';
import {connect} from 'react-redux';

const TabNav = createMaterialTopTabNavigator();

const Tabs = props => {
  let screen = props?.screen;

  console.warn(props.leagueId);

  return (
    <TabNav.Navigator
      screenOptions={{
        indicatorStyle: {
          backgroundColor: Colors.BLUE,
          // width: '20%',
          alignSelf: 'center',
        },
      }}>
      <TabNav.Screen
        name="Payment"
        component={() => (
          <PaymentCards
            screen={screen}
            showModal={props.showModal}
            totalPrice={props.totalPrice}
            shippingAddress={props.shippingAddress}
            leagueId={props.leagueId}
            navigation={props.navigation}
          />
        )}
      />

      {/* {props.role !== 'store' ||
      props.role !== 'facility' ||
      props.role !== 'coach' ? (
        <TabNav.Screen
          name="PaymentHistory"
          component={PaymentHistory}
          options={{tabBarLabel: 'Payment History'}}
        />
      ) : null} */}
    </TabNav.Navigator>
  );
};

export default Tabs;
