import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {redShirt} from '../../Assets';
import {Text} from '../../Components';
import {Colors} from '../../Styles';
import {connect} from 'react-redux';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import {img_url} from '../../Store/Apis';
import moment from 'moment';
//import StoreMiddleware from '../../../Store/Middleware/StoreMiddleware';

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
    };
  }
  componentDidMount = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.props.OrderHistory({
      callback: response => {
        if (response) {
          console.warn('OrdeHistory RES,', response?.data?.data);
          this.setState({
            data: response?.data?.data,
            refreshing: false,
          });
        } else {
          this.setState({loading: false, refreshing: false});
        }
      },
    });
  };

  renderClassesList = item => (
    console.log('ORDER HSITORY=====>:', item?.item),
    (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.userItemContainer}
        onPress={() =>
          this.props.navigation.navigate('OrderDetails', {
            orderNo: 'Order No: ' + item?.item?.id,
            items: item?.item?.items,
          })
        }>
        {/* <Image source={{ uri: img_url + item?.item?.product_img }} style={styles.avatarImage} /> */}
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>Order No: {item?.item?.id}</Text>
          <Text style={styles.userName}>
            Date: {moment(item?.item?.created_at).format('MMM DD YYYY')}
          </Text>
          <Text style={styles.userName}>
            Payment: {item?.item?.payment_method}
          </Text>
          <Text style={styles.userName}>
            Shipping Address: {item?.item?.shipping_address}
          </Text>
        </View>
        <Text style={styles.price}>${item?.item?.total_price}</Text>
      </TouchableOpacity>
    )
  );
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          style={styles.pt15}
          ListHeaderComponentStyle={{
            marginBottom: 10,
            marginTop: 10,
          }}
          renderItem={this.renderClassesList}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  color: Colors.black,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Order not found
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  OrderHistory: payload => dispatch(StoreMiddleware.orderHistory(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  buyNowContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  buyNowText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: {flex: 1},
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_LIGHT,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 2,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.BLACK,
    fontWeight: '500',
    fontSize: 18,
    paddingRight: 10,
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  followContainer: {
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  plusImage: {
    width: 13,
    height: 13,
  },
  price: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  fabBtn: {
    width: 56,
    height: 56,
    bottom: 15,
    right: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
    position: 'absolute',
  },
});
