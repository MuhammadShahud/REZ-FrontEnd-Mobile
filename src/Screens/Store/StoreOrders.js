import moment from 'moment';
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {connect} from 'react-redux';
import {Header, StoreOrderCard} from '../../Components';
import {img_url} from '../../Store/Apis';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import {Colors} from '../../Styles';

class StoreOrders extends Component {
  constructor(props) {
    super(props);
    let date = new Date();

    this.state = {
      data: [],
      refreshing: false,
      isShowStartDateModal: false,
      isShowEndDateModal: false,
      start_date: new Date(date.setDate(date.getDate() - 7)),
      end_date: new Date(),
    };
  }
  _renderItem1 = ({item}) => {
    // console.warn('ITEM=================>', item);

    let order = item.order.find(item => item);

    console.warn('dsada', order);
    return (
      <StoreOrderCard
        image={{uri: img_url + item?.product_img}}
        product_id={item?.product_id}
        product_name={item?.product_name}
        productcategory_name={item?.productcategory_name}
        product_size={item?.product_size}
        product_color={item?.product_color}
        store_product_price={order?.store_product_price}
        product_description={item?.product_description}
        order_id={order?.order_id}
        order_quantity={order?.order_quantity}
        order_unit_price={order?.order_unit_price}
        order_total_price={order?.order_total_price}
        order_status={order?.order_status}
        onPress={() =>
          this.props.navigation.navigate('StoreOrderDetails', {
            data: order,
          })
        }
      />
    );
  };
  componentDidMount = () => {
    this.OnOrderList();
  };
  OnOrderList = () => {
    const {start_date, end_date} = this.state;
    const staff_id = this.props.route?.params?.staff_id;
    let payload = {
      start_date: `${start_date.getFullYear()}-${
        start_date.getMonth() + 1
      }-${start_date.getDate()}`,
      end_date: `${end_date.getFullYear()}-${
        end_date.getMonth() + 1
      }-${end_date.getDate()}`,
    };
    if (payload) {
      payload.staff_id = staff_id;
    }
    this.props.getStoreOrderListing({
      ...payload,
      callback: response => {
        if (response) {
          console.warn('RESPONCES', response?.data);
          this.setState({
            data: response?.data,
            refreshing: false,
          });
        } else {
          this.setState({loading: false, refreshing: false});
        }
      },
    });
  };

  renderStartDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowStartDateModal}
        mode={'date'}
        date={this.state.start_date ? this.state.start_date : new Date()}
        onConfirm={date => {
          this.setState({isShowStartDateModal: false, start_date: date}, () => {
            this.OnOrderList();
          });
        }}
        onCancel={() => {
          this.setState({isShowStartDateModal: false});
        }}
      />
    );
  };
  renderEndDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowEndDateModal}
        mode={'date'}
        date={this.state.end_date ? this.state.end_date : new Date()}
        onConfirm={date => {
          this.setState({isShowEndDateModal: false, end_date: date}, () => {
            this.OnOrderList();
          });
        }}
        onCancel={() => {
          this.setState({isShowEndDateModal: false});
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={'Order List'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <View style={{width: '100%', marginTop: 10, flexDirection: 'row'}}>
          <View style={{height: 80, flex: 1}}>
            <Text style={{fontSize: 12}}>From</Text>
            <TouchableOpacity
              onPress={() => this.setState({isShowStartDateModal: true})}
              style={[styles.dateContainer, {marginRight: 2}]}>
              <Text style={{color: Colors.GRAY_1}}>
                {this.state.start_date
                  ? moment(this.state.start_date).format('LL')
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 80, flex: 1}}>
            <Text style={{fontSize: 12}}>To</Text>
            <TouchableOpacity
              onPress={() => this.setState({isShowEndDateModal: true})}
              style={[styles.dateContainer, {marginLeft: 2}]}>
              <Text style={{color: Colors.GRAY_1}}>
                {this.state.end_date
                  ? moment(this.state.end_date).format('LL')
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={this.state.data}
          ListHeaderComponent={() => <Text style={styles.headerText}></Text>}
          renderItem={this._renderItem1}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          refreshing={this.state.refreshing}
          onRefresh={this.OnOrderList}
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
        {this.renderStartDateModal()}
        {this.renderEndDateModal()}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getStoreOrderListing: payload =>
      dispatch(StoreMiddleware.getStoreOrderListing(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(StoreOrders);

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
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
