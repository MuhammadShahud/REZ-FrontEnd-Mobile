import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Header } from '../../Components';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';
import { Colors } from '../../Styles';

export default class StoreOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let data = this.props?.route?.params?.data
        console.warn('data', this.props?.route?.params?.data.buyer);
        return (
            <View style={styles.container}>
                <Header
                    title={'Customer Detail'}
                    isShowLeftIcon={true}
                    navigation={this.props.navigation}
                />
                <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                    <Image source={{ uri: data?.buyer?.profile_image ? img_url + data?.buyer?.profile_image : dummyImage }} style={{ borderRadius: 8, width: '30%', height: 80, resizeMode: 'cover' }} />
                    <View style={{ marginLeft: 10, width: '70%' }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: Colors.BLACK, fontSize: 15, fontWeight: 'bold' }}>Name: {data?.buyer?.username} </Text>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: Colors.GRAY_1, fontSize: 12, fontWeight: 'bold' }}>Email: {data?.buyer?.email}</Text>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: Colors.GRAY_1, fontSize: 12, fontWeight: 'bold' }}>Phone: {data?.buyer?.phone}</Text>
                    </View>

                </View>

                <Text style={{ color: Colors.BLACK, paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal' }}>Address: {data?.shipping_address}</Text>
                <Text style={{ color: Colors.BLACK, paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal' }}>Payment Method: {data?.payment_method}</Text>
                <Text style={{ color: Colors.BLACK, paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal' }}>Booking Date: {data?.booking_time}</Text>
                <Text style={{ color: Colors.BLACK, paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal' }}>Order Status: {data?.order_status}</Text>

                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: Colors.BLACK, fontSize: 12, fontWeight: 'normal' }}>Price: ${data?.order_unit_price}</Text>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: Colors.BLACK, paddingHorizontal: 10, fontSize: 12, fontWeight: 'normal' }}>Qty: {data?.order_quantity}</Text>
                </View>
                <Text adjustsFontSizeToFit numberOfLines={1} style={{ paddingHorizontal: 10, color: Colors.BLACK, fontSize: 13, fontWeight: 'bold' }}>Total: ${data?.order_total_price}</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        backgroundColor: Colors.WHITE,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.GRAY_3,
    },
});