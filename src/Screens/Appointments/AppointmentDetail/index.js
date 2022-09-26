import moment from 'moment';
import React, { Component } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { calendar, clock, dummy, map_marker } from '../../../Assets';
import { Button, Header, Loader } from '../../../Components';
import { img_url } from '../../../Store/Apis';
import BookingMidleware from '../../../Store/Middleware/BookingMiddleware';
import { Colors } from '../../../Styles';

class AppointmentDetail extends Component {
  state = {
    loader: false,
  };
  onPressActionBtn = status => {
    const bookingDetail = this.props.route?.params?.appointment;
    const reciever_user_id = this.props.route?.params?.reciever_user_id;

    this.setState({ loader: true }, () => {
      this.props
        .updateBookingStatus({ status, booking_id: bookingDetail.id, reciever_user_id: reciever_user_id })
        .then(() => {
          this.setState({ loader: false }, () => {
            this.props.navigation.goBack();
          });
        })
        .catch(() => this.setState({ loader: false }));
    });
  };
  render() {
    let bookingDetail = this.props.route?.params?.appointment;
    console.log('bookingDetail=>', bookingDetail);
    let isComeFromNotification =
      this.props.route?.params?.isComeFromNotification;
    bookingDetail = this.props.coachBooking?.find(
      x => x.id === bookingDetail?.id,
    );
    // console.log('bookingDetail', bookingDetail);
    let isShowAcceptRejectBtn = true;
    let isShowModifyBtn = true;

    let created_at = new Date(bookingDetail?.created_at);
    let updated_at = new Date(bookingDetail?.updated_at);

    if (updated_at > created_at) {
      isShowAcceptRejectBtn = false;
      isShowModifyBtn = false;
    }
    if (isComeFromNotification) {
      isShowAcceptRejectBtn = true;
      isShowModifyBtn = false;
    }

    return (
      <View style={styles.container}>
        <Header
          title="Appointment Details"
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <View style={styles.flex1}>
          <View activeOpacity={0.7} style={styles.profileContainer}>
            <Image
              source={{ uri: img_url + bookingDetail?.user?.profile_image }}
              style={styles.profileImage}
            />
            <View style={styles.profileDetailContainer}>
              <Text style={styles.profileName}>
                {bookingDetail?.user?.username}
              </Text>
              <Text style={styles.profileDesc}>
                {bookingDetail?.description}
              </Text>
            </View>
          </View>
          <View style={styles.appointmentDetailsContainer}>
            <Image
              source={calendar}
              style={styles.iconImage}
              resizeMode={'contain'}
            />
            <Text style={styles.appointmentDetailText}>
              {moment(bookingDetail?.booking_date).format('LL')}
            </Text>
          </View>
          <View style={styles.appointmentDetailsContainer}>
            <Image
              source={clock}
              style={styles.iconImage}
              resizeMode={'contain'}
            />
            <Text style={styles.appointmentDetailText}>
              {bookingDetail?.start_time} - {bookingDetail?.end_time}
            </Text>
          </View>
          <View style={styles.appointmentDetailsContainer}>
            <Image
              source={map_marker}
              style={styles.iconImage}
              resizeMode={'contain'}
            />
            <Text style={styles.appointmentDetailText}>
              {bookingDetail?.location_address
                ? bookingDetail?.location_address
                : bookingDetail?.address}
            </Text>
          </View>
        </View>
        {isShowAcceptRejectBtn && (
          <View
            style={[
              styles.flexRow,
              { width: '100%', justifyContent: 'space-between' },
            ]}>
            <View style={{ width: '48%' }}>
              <Button
                onPress={() => this.onPressActionBtn('accept')}
                name={'Accept'}
                backgroundColor={Colors.BLUE}
                textStyle={styles.colorWhite}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Button
                onPress={() => this.onPressActionBtn('reject')}
                name={'Reject'}
                textStyle={styles.colorWhite}
              />
            </View>
          </View>
        )}
        {isShowModifyBtn && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Note</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                {/* <Text>
                  Lorem ipsum dolor sit amet,consectetur adipiscing elit. Nam
                  quis placerat leo.
                </Text> */}
              </View>
              <View style={{ width: '30%' }}>
                <Button
                  btnStyle={{ height: 40, backgroundColor: Colors.BLUE }}
                  name={'Modify'}
                  textStyle={[styles.colorWhite, { fontWeight: 'normal' }]}
                  onPress={() =>
                    this.props.navigation.navigate('ModifyBooking', {
                      bookingDetail,
                    })
                  }
                />
              </View>
            </View>
          </View>
        )}
        <Loader loader={this.state.loader} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    coachBooking: state.BookingReducer.coachBooking,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    updateBookingStatus: payload =>
      dispatch(BookingMidleware.updateBookingStatus(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(AppointmentDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
    marginBottom: 10,
  },
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  profileContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_4,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  profileDetailContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  profileName: {
    color: Colors.GRAY_3,
    fontWeight: '500',
    fontSize: 18,
  },
  profileDesc: {
    color: Colors.GRAY_1,
  },
  appointmentDetailsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  appointmentDetailText: {
    paddingHorizontal: 10,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.GRAY_6,
  },
  actionBtnLeft: {
    flex: 1,
    marginRight: 3,
  },
  actionBtnRight: {
    flex: 1,
    marginLeft: 3,
  },
  colorWhite: {
    color: Colors.WHITE,
  },
});
