import React, {Component} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {dummy} from '../../Assets';
import {Text, Button, Loader, Header} from '../../Components';
import {Colors} from '../../Styles';
import {connect} from 'react-redux';
import StoreMiddleware from '../../Store/Middleware/StoreMiddleware';
import BookingMidleware from '../../Store/Middleware/BookingMiddleware';
import {img_url} from '../../Store/Apis';
import {getHeaders} from '../../Utils';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

class FacilityBookingHistory extends Component {
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
  componentDidMount = () => {
    this.onRefresh();
  };
  onRefresh = async () => {
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
    if (staff_id) {
      payload.staff_id = staff_id;
    }
    this.setState({refreshing: true});
    this.props.BookingHistory({
      ...payload,
      callback: response => {
        if (response) {
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
    console.log('Booking History=>', JSON.stringify(item)),
    (
      <View activeOpacity={0.7} style={styles.userItemContainer}>
        <Image
          source={{uri: img_url + item?.item?.image}}
          style={styles.avatarImage}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>{item?.item?.title}</Text>
          <Text style={styles.userName}>
            Date: {moment(item?.item?.date.slice(0, 10)).format('MMM DD YYYY')}
          </Text>
          <Text style={styles.userName}>
            Time: {item?.item?.timeSlotData?.start_time}
          </Text>
          <Text style={styles.userName}>
            Booked By: {item?.item?.playerName}
          </Text>
        </View>

        <View>
          <Text style={styles.price}>
            $
            {item?.item?.new_amount > 0
              ? item?.item?.new_amount
              : item?.item?.amount}
          </Text>

          {/* <Button
          name="Rebook"
          btnStyle={{backgroundColor: Colors.BLUE, height: 30, marginTop: 4}}
          textStyle={{color: Colors.WHITE, fontSize: 14, fontWeight: 'none'}}
        /> */}
        </View>
      </View>
    )
  );

  renderStartDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowStartDateModal}
        mode={'date'}
        date={this.state.start_date ? this.state.start_date : new Date()}
        onConfirm={date => {
          this.setState({isShowStartDateModal: false, start_date: date}, () => {
            this.onRefresh();
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
            this.onRefresh();
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
          isShowLeftIcon={true}
          title={'Booking History'}
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
          style={styles.flex1}
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          renderItem={() => this.renderClassesList()}
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
                Booking not found
              </Text>
            </View>
          )}
        />
        <Loader loader={this.state.refreshing} />
        {this.renderStartDateModal()}
        {this.renderEndDateModal()}
      </View>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  BookingHistory: payload => dispatch(BookingMidleware.BookingHistory(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityBookingHistory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
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
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#000',
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
