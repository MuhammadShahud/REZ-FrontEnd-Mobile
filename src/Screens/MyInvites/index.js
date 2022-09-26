import * as React from 'react';
import { StyleSheet, } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Received from './Received';
import Sent from './Sent';
import { Colors } from '../../Styles';
import { View } from 'react-native-animatable';
import { Header } from '../../Components';

const TabNav = createMaterialTopTabNavigator()


const Tabs = (props) => {

    return (
        <View style={{ flex: 1,backgroundColor: Colors.WHITE, }}>
            <View style={{ paddingHorizontal: 25 }}>
                <Header
                    navigation={props.navigation}
                    title={'Invites'}
                    isShowLeftIcon={true}
                />
            </View>
            <TabNav.Navigator
                tabBarOptions={{
                    indicatorStyle: {
                        backgroundColor: Colors.BLUE,
                        // width: '20%',
                        alignSelf: 'center',

                    },
                }}
                screenOptions={{
                    lazy:true
                }}
            >
                <TabNav.Screen name="Sent" component={Sent}  />
                <TabNav.Screen name="Received" component={Received} />
            </TabNav.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

export default Tabs;