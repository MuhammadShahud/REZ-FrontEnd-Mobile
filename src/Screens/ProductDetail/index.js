import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Platform,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import { Header } from '../../Components';
import { Colors } from '../../Styles';
import CartAction from '../../Store/Actions/CartAction';
import { connect } from 'react-redux';
import { redShirt } from '../../Assets';
import { img_url } from '../../Store/Apis';

class index extends Component {
  constructor(props) {
    super(props);
    let { item } = this.props.route.params;
    console.warn("PRICE",item?.product_price)
    let screen = this.props.route.params?.screen;
    this.state = {
      quantity: item?.quantity ? item.quantity : 1,
      size: screen === 'cart' ? item?.productSize : '',
      totalPrice: '',
      price: item?.product_price ? item?.product_price : "",
    };
  }

  addToCart = item => {
    let { quantity, price, size } = this.state;
    let screen = this.props.route.params?.screen;

    console.warn(item.productSize === size);
    if (!size) {
      alert('Select product size.');
      return;
    }

    let cartIndex = this.props.cartProducts.findIndex(
      val => val.id === item.id,
    );

    if (
      this.props.cartProducts[cartIndex]?.id === item.id &&
      screen === 'cart' &&
      item.productSize === size
    ) {
      let updateCart = {
        ...item,
        price,
        productSize: size,
        quantity,
      };

      this.props.updateCart(updateCart);
    } else {
      let productCartItem = { ...item, price, productSize: size, quantity };
      this.props.AddToCart(productCartItem);
    }
    ToastAndroid.show('Added Successfully!', 500);
  };

  increaseQuantity = () => {
    let { item } = this.props.route.params;
    let productPrice = item.product_price;
    this.setState({
      quantity: this.state.quantity + 1,
      price: parseInt(this.state.price) + parseInt(productPrice),
    });
  };

  decreaseQuantity = () => {
    let { item } = this.props.route.params;
    let productPrice = item.product_price;

    this.setState(
      {
        quantity: this.state.quantity > 1 ? this.state.quantity - 1 : 1,
        price:
          this.state.quantity > 1
            ? parseInt(this.state.price) - parseInt(productPrice)
            : productPrice,
      },
      // () => {
      //   let {price} = this.state;
      //   let updatePrice = this.props.totalPrice;
      //   let totalPrices = updatePrice == 0 ? price : updatePrice - price;
      //   this.props.CartTotalPrice(totalPrices);
      // },
    );
  };

  render() {
    let { item } = this.props.route.params;

    console.warn('itemm ==', item);

    return (
      <View style={styles.container}>
        <View style={{ paddingHorizontal: 25 }}>
          <Header
            title={'Product Detail'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: img_url + item.product_img }}
            style={{ width: '100%', height: 300 }}
          />
        </View>

        <Text style={styles.productName}>{item.product_name}</Text>

        <Text style={{ paddingHorizontal: 18 }}>{item.product_description}</Text>

        {/* <Text style={styles.postedName}>Posted by: John</Text> */}

        {this.props.role === 'team' ||
          this.props.role === 'player' ||
          this.props.role === 'parent' ? (
          <View style={styles.bodyContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={this.increaseQuantity}
                style={styles.button}>
                <Entypo name="plus" size={23} color={Colors.BLACK} />
              </TouchableOpacity>

              <Text style={{ fontSize: 18 }}>{this.state.quantity}</Text>

              <TouchableOpacity
                onPress={this.decreaseQuantity}
                style={styles.button}>
                <Entypo name="minus" size={25} color={Colors.BLACK} />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={this.state.size}
                style={styles.picker}
                itemStyle={{}}
                onValueChange={(value, itemIndex) =>
                  this.setState({ size: value })
                }>
                <Picker.Item label="Select size" value="" />
                {item?.size.map(val => {
                  return <Picker.Item label={val} value={val} />;
                })}
              </Picker>
              {/* 
              <Text style={{fontSize: 16, padding: 14}}>
                Size: {this.state.size}
              </Text> */}
            </View>
          </View>
        ) : null}

        {/* Cart Button */}

        <View style={styles.footerContainer}>
          <View style={styles.amountCartContainer}>
            <View style={styles.amountContainer}>
              <View>
                <Text style={{ fontSize: 16 }}>Total</Text>
                <Text style={{ fontSize: 16 }}>Amount</Text>
              </View>

              <Text style={styles.price}>${this.state.price}</Text>
            </View>

            {this.props.role === 'team' ||
              this.props.role === 'player' ||
              this.props.role === 'parent' ? (
              <View style={styles.cartContainer}>
                <TouchableOpacity
                  onPress={() => this.addToCart(item)}
                  disabled={!this.state.quantity}
                  activeOpacity={0.7}
                  style={[
                    styles.cartBtn,
                    {
                      backgroundColor: !this.state.quantity
                        ? Colors.GRAY_2
                        : Colors.BLUE,
                    },
                  ]}>
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cartProducts: state.CartReducer?.storeCart,
  totalPrice: state.CartReducer.CartTotalPrice,
  role: state.Auth.role,
});

const mapDispatchToProps = disptach => ({
  AddToCart: payload => disptach(CartAction.addToCart(payload)),
  updateCart: payload => disptach(CartAction.updateProductCart(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  imageContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.GRAY_4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  productName: {
    padding: 18,
    fontSize: 18,
    color: Colors.BLACK,
  },
  postedName: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    fontSize: 12,
    color: Colors.BLACK,
  },
  bodyContainer: {
    height: 55,
    width: '85%',
    marginHorizontal: 18,
    marginVertical: 12,
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  quantityContainer: {
    width: '40%',
    borderWidth: 1,
    borderColor: Colors.GRAY_1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    // width: '40%',
    marginHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.GRAY_1,
  },
  picker: {
    height: Platform.OS == "ios" ? null : 50,
    width: 150,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  amountCartContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_2,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    paddingRight: 20,
    fontSize: 20,
    color: Colors.BLACK,
  },
  cartContainer: {
    flex: 1,
    marginVertical: 8,
  },
  cartBtn: {
    paddingVertical: 12,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
});
