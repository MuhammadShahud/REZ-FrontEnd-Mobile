import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../Styles';
import {eyeIcon} from '../../Assets';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {calendar} from '../../Assets';
export class StoreOrderCard extends Component {
  render() {
    const {
      image,
      product_id,
      product_name,
      productcategory_name,
      product_size,
      product_color,
      store_product_price,
      product_description,
      order_id,
      order_quantity,
      order_unit_price,
      order_total_price,
      order_status,
      onPress,
    } = this.props;

    console.warn(order_quantity);
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
          <Image
            source={image}
            style={{
              borderRadius: 8,
              width: '30%',
              height: 80,
              resizeMode: 'cover',
            }}
          />
          <View style={{marginLeft: 10, width: '70%'}}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{color: Colors.BLACK, fontSize: 15, fontWeight: 'bold'}}>
              Order Id: {order_id}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{color: Colors.BLACK, fontSize: 14, fontWeight: 'bold'}}>
              {product_name}
            </Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{color: Colors.GRAY_1, fontSize: 12, fontWeight: 'bold'}}>
              {productcategory_name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{color: Colors.BLACK, fontSize: 12, fontWeight: 'normal'}}>
            Size: {product_size}
          </Text>
        </View>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            paddingHorizontal: 10,
            color: Colors.BLACK,
            fontSize: 12,
            fontWeight: 'normal',
          }}>
          Status:{' '}
          <Text style={{color: order_status == 'pending' ? 'red' : 'green'}}>
            {order_status}
          </Text>
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            color: Colors.BLACK,
            paddingHorizontal: 10,
            fontSize: 12,
            fontWeight: 'normal',
          }}>
          Color: {product_color}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{color: Colors.BLACK, fontSize: 12, fontWeight: 'normal'}}>
            Price: ${order_unit_price}
          </Text>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={{
              color: Colors.BLACK,
              paddingHorizontal: 10,
              fontSize: 12,
              fontWeight: 'normal',
            }}>
            Qty: {order_quantity}
          </Text>
        </View>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={{
            paddingHorizontal: 10,
            color: Colors.BLACK,
            fontSize: 13,
            fontWeight: 'bold',
          }}>
          Total: ${order_total_price}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: '70%',
            height: 40,
            backgroundColor: Colors.BLUE,
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: Colors.WHITE,
              fontWeight: 'bold',
              fontSize: 12,
            }}>
            Customer Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.GRAY_2,
    marginTop: 3,
    borderRadius: 8,
  },
});
export default StoreOrderCard;
