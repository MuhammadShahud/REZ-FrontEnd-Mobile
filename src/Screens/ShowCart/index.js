import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {Header, Button} from '../../Components';
import {Colors} from '../../Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {img_url} from '../../Store/Apis';
import StoreAction from '../../Store/Actions/StoreAction';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingAddress: '',
    };
  }

  buyNow = total => {
    let {shippingAddress} = this.state;
    if (shippingAddress) {
      this.props.navigation.navigate('Payment', {
        screen: 'store',
        total,
        shippingAddress,
      });
    } else {
      alert('Shipping address is required');
    }
  };

  RemoveCartProduct = (item, index) => {
    let cartCopy = this.props.cartProducts.slice(0);
    cartCopy.splice(index, 1);
    this.props.removeCartProduct(cartCopy);

    // updateTotalCartPrice = updateTotalCartPrice - item.price;
    // this.props.CartTotalPrice(updateTotalCartPrice);
  };

  renderCartItems = ({item, index}) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('ProductDetail', {item, screen: 'cart'})
      }
      style={{
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        padding: 8,
        backgroundColor: Colors.GRAY_PRIMARY,
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 0.25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: img_url + item?.product_img}}
          style={{width: 55, height: 60}}
        />
      </View>

      <View style={{flex: 1, paddingHorizontal: 6}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {item?.product_name}
          </Text>
          <Text style={{fontWeight: 'bold'}}>${item?.price}</Text>
        </View>

        <Text style={{fontSize: 12}}>Quantity: {item?.quantity}</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 12}}>Size: {item?.productSize}</Text>

          <TouchableOpacity onPress={() => this.RemoveCartProduct(item, index)}>
            <MaterialIcons name="delete" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
    console.warn(this.props.cartProducts);
    let total = 0;
    this.props.cartProducts.forEach(element => {
      total = parseInt(total) + parseInt(element?.price);
    });

    return (
      <View style={styles.container}>
        <View style={{paddingHorizontal: 25}}>
          <Header
            title="Cart"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>

        <FlatList
          data={this.props.cartProducts}
          renderItem={this.renderCartItems}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 17,
                  color: Colors.GRAY_6,
                }}>
                No item to show
              </Text>
            </View>
          )}
        />

        {this.props.cartProducts.length ? (
          <View style={{paddingHorizontal: 20}}>
            <TextInput
              style={{
                width: '100%',
                fontSize: 13,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 4,
                backgroundColor: Colors.GRAY_PRIMARY,
              }}
              placeholder="Enter Shipping Address"
              value={this.state.shippingAddress}
              onChangeText={text => this.setState({shippingAddress: text})}
            />
            <View style={styles.footerContainer}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                Total Amount
              </Text>
              <Text style={{color: Colors.BLACK, fontSize: 16}}>${total}</Text>
            </View>

            <Button
              onPress={() => this.buyNow(total)}
              btnStyle={{backgroundColor: Colors.BLUE}}
              name="Buy now"
              textStyle={{color: '#fff'}}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cartProducts: state.CartReducer?.storeCart,
});

const mapDispatchToProps = disptach => ({
  removeCartProduct: payload =>
    disptach(StoreAction.removeProductFromCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  footerContainer: {
    marginVertical: 12,
    paddingVertical: 10,
    borderBottomColor: Colors.GRAY_6,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
