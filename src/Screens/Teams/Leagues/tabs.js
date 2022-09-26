import * as React from 'react';
import { StyleSheet, } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { UpcomingLeagues, PreviousLeagues } from '../../index';
import { Colors } from '../../../Styles';

const TabNav = createMaterialTopTabNavigator()


const Tabs = (props) => {

    return (
        <TabNav.Navigator
            tabBarOptions={{
                indicatorStyle: {
                    backgroundColor: Colors.BLUE,
                    // width: '20%',
                    alignSelf: 'center',

                },


            }}
        >
            <TabNav.Screen name="Upcoming Leagues" component={UpcomingLeagues} />
            <TabNav.Screen name="Previous Leagues" component={PreviousLeagues} />
        </TabNav.Navigator>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

export default Tabs;