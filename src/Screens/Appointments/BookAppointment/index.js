import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Tag,
  Post,
  CoachProfile,
  SearchBar,
  Loader,
} from '../../../Components';
import {
  calendar,
  check_blue,
  clock,
  close,
  documentIcon,
  dummy,
  followButton,
  income,
  map_marker,
  modalBarIcon,
  searchIcon,
} from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../Styles';
import Feed from '../../../Components/Feed';
import BottomSheet from 'reanimated-bottom-sheet';
import StarRating from 'react-native-star-rating-widget';
import { connect } from 'react-redux';
import PaymentAction from '../../../Store/Actions/PaymentAction';
import moment from 'moment';
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import BookingMiddleware from '../../../Store/Middleware/BookingMiddleware';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      notificationModal: false,
      loader: false,
      bookingDetails: null,
      coach: null,
    };
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
  };

  onPressChat = () => {
    let coach = this.state.coach;
    this.setState({ loader: true }, () => {
      this.props
        .getChatSession({ recipient_user_id: coach.user_id })
        .then(chatHead => {
          this.setState({ loader: false });
          this.sheetRef.snapTo(0);
          this.props.navigation.navigate('Chat', { chatHead: chatHead });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  renderContent = () => {
    const bookingDetails = this.state.bookingDetails;
    let coach = this.state.coach;
    const { coachSessionDetail } = this.props;
    console.log('bookingDetails==========>', bookingDetails);
    console.log('coach==========>', coach);
    return (
      <View style={styles.confirmationSheetContainer}>
        <View
          style={{
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: Colors.GRAY_2,
            paddingBottom: 20,
          }}>
          <View style={{ position: 'absolute', left: 5, top: 10 }}>
            <TouchableOpacity
              onPress={() => {
                this.sheetRef.snapTo(1);
                this.props.PayNow(false);
                this.resetState();
              }}>
              <Image
                source={close}
                style={{ width: 15, height: 15 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.sheetRef.snapTo(1);
              this.props.PayNow(false);
            }}>
            <Image
              source={modalBarIcon}
              style={styles.closeImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* <Text style={{fontWeight: 'bold'}}>In This Post</Text> */}
        </View>
        <View style={styles.sheetBody}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={check_blue}
                resizeMode={'contain'}
                style={{ width: 60, height: 60, marginHorizontal: 10 }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                Thanks For Your Booking
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                paddingVertical: 20,
              }}>
              <Image
                source={dummy}
                style={{ width: 80, height: 80, marginHorizontal: 10 }}
              />
              <View style={{ marginHorizontal: 30 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {coach?.username}
                </Text>
                <Text>{coach?.sportname} Trainer</Text>
                <Text>
                  Coaching: {coach?.experience ? coach?.experience : 0} Years
                </Text>
                <Text>Rank # 1</Text>
                <StarRating
                  rating={4.5}
                  onChange={() => null}
                  color={Colors.GREEN}
                  starSize={15}
                  starStyle={{ width: '5%' }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 30,
              }}>
              <View style={{ width: '48%' }}>
                <Button
                  name="Message"
                  backgroundColor={Colors.BLUE}
                  textStyle={{ color: Colors.WHITE }}
                  onPress={this.onPressChat}
                />
              </View>

              {/* {bookingDetails?.isCoachVisitYourLocation ? (
                <View style={{width: '48%'}}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.GREEN,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('TrackCoach', {
                        coach_id: coach?.user_id,
                        username: coach?.username,
                        email: coach?.email,
                      })
                    }>
                    <Text style={{color: Colors.WHITE, fontWeight: 'bold'}}>
                      Track
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null} */}
            </View>

            <View style={{ marginVertical: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={clock}
                  style={{ height: 30, width: 30 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  {coachSessionDetail?.session?.start_time} -{' '}
                  {coachSessionDetail?.session?.end_time}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={map_marker}
                  style={{ height: 30, width: 30 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  {bookingDetails?.location}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={documentIcon}
                  style={{ height: 30, width: 30 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  Details about booking.
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={income}
                  style={{ height: 30, width: 30 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  ${coachSessionDetail?.session?.price + 5}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  componentDidMount() {
    const bookingDetails = this.props.route?.params?.bookingDetails;
    let coach = this.props.route?.params?.coach;
    this.setState({ coach, bookingDetails });
    this.sheetRef.snapTo(1);
  }
  resetState = () => {
    this.setState(
      {
        coach: null,
        bookingDetails: null,
      },
      () => {
        this.props.navigation.navigate('Coach');
      },
    );
  };

  onPressBookAppointment = () => {
    this.props.navigation.navigate('Payment', {
      screen: 'bookAppointment',
      showModal: card_id => {
        const bookingDetails = this.state.bookingDetails;
        const { coachSessionDetail, user } = this.props;
        console.log('bookingDetails', bookingDetails);
        let payload = {
          training_session_id: coachSessionDetail.session.id,
          privacy_type: bookingDetails?.selectedPrivacy,
          private_location: bookingDetails?.isCoachVisitYourLocation,
          location_address: bookingDetails?.location,

          time_slot_id: bookingDetails?.selectedTimeSlot?.id,
          payment_method_id: card_id,

          amount: bookingDetails?.isCoachVisitYourLocation ? (coachSessionDetail?.session?.price + 5) : (coachSessionDetail?.session?.price),
          booking_date: coachSessionDetail?.session?.date,
          invite_list: bookingDetails.selectedUsersIDs,
        };
        if (bookingDetails?.selectedChild) {
          payload.user_id = bookingDetails?.selectedChild?.id;
          payload.parent_id = user.id;
        } else {
          payload.user_id = user.id;
          payload.parent_id = '';
        }
        this.setState({ loader: true }, () => {
          this.props
            .createBooking(payload)
            .then(() => {
              this.setState({
                loader: false,
                notificationModal: true,
              });
            })
            .catch(() => {
              this.setState({ loader: false });
            });
        });
      },
    });
  };

  render() {
    // console.warn('dasda', this.state.notificationModal);
    const bookingDetails = this.state.bookingDetails;
    let coach = this.state.coach;
    const { coachSessionDetail } = this.props;
    console.log('coachSessionDetail=>', coachSessionDetail);
    console.log('coach=>', coach);
    console.log('bookingDetails=>', this.state);

    return (
      <>
        <View style={styles.container}>
          <Header
            title="Book Appointment"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View style={styles.mainView}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.BLACK,
                    marginVertical: 10,
                  }}>
                  Booking Confirmed
                </Text>

                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.GRAY_3,
                    marginVertical: 10,
                  }}>
                  Coach Details
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    paddingVertical: 20,
                  }}>
                  <Image
                    source={dummy}
                    style={{ width: 80, height: 80, marginHorizontal: 10 }}
                  />
                  <View style={{ marginHorizontal: 30 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {coach?.username}
                    </Text>
                    <Text>{coach?.sportname} Trainer</Text>
                    <Text>
                      Location : {coachSessionDetail?.session?.address}
                    </Text>
                    <Text>Price : ${coachSessionDetail?.session?.price}</Text>
                    {bookingDetails?.isCoachVisitYourLocation ? (
                      <Text>Service Charges : $5</Text>
                    ) : (null)}
                    
                  </View>
                </View>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: Colors.BLACK,
                    }}>
                    Booking Details
                  </Text>

                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.GREEN,
                      }}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={calendar}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {moment(coachSessionDetail?.session?.date).format('LL')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={clock}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {coachSessionDetail?.session?.start_time} -{' '}
                    {coachSessionDetail?.session?.end_time}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={map_marker}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {bookingDetails?.location
                      ? bookingDetails?.location
                      : coachSessionDetail?.session?.address}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={require('../../../Assets/Icons/lock.png')}
                    style={{ height: 25, width: 25 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {bookingDetails?.selectedPrivacy}
                  </Text>
                </View>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: Colors.BLACK,
                    }}>
                    Payment Details
                  </Text>

                  {/* <TouchableOpacity>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: Colors.GREEN,
                      }}>
                      Change
                    </Text>
                  </TouchableOpacity> */}
                </View>

                <View style={{ borderBottomWidth: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{ marginVertical: 5 }}>Sub Total</Text>
                    <Text style={{ marginVertical: 5 }}>
                      ${coachSessionDetail?.session?.price}
                    </Text>
                  </View>
                  {bookingDetails?.isCoachVisitYourLocation ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{ marginVertical: 5 }}>Service Charges</Text>
                      <Text style={{ marginVertical: 5 }}>$5</Text>
                    </View>
                  ) : (null)}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ marginVertical: 5 }}>Total</Text>
                  <Text style={{ marginVertical: 5 }}>
                    ${bookingDetails?.isCoachVisitYourLocation ? (coachSessionDetail?.session?.price + 5): (coachSessionDetail?.session?.price)}
                  </Text>
                </View>
              </View>
              <View style={{ width: '100%', marginBottom: 10 }}>
                <Button
                  name="Book Appointment"
                  backgroundColor={Colors.BLUE}
                  textStyle={{ color: Colors.WHITE }}
                  onPress={this.onPressBookAppointment}
                />
              </View>
            </ScrollView>
          </View>
        </View>

        <Modal
          visible={this.state.notificationModal}
          transparent
          animationType="fade">
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, .5)',
              flex: 1,
              justifyContent: 'center',
            }}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ notificationModal: false }, () => {
                    this.sheetRef.snapTo(0);
                  });
                }}>
                <Image source={close} style={{ width: 16, height: 16 }} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.GRAY_1,
                  marginVertical: 10,
                  textAlign: 'center',
                }}>
                Please wait, you will receive notification when Coach accepts
                your request.
              </Text>
            </View>
          </View>
        </Modal>

        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[650, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
        <Loader loader={this.state.loader} />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    isBookingConfirm: state.PaymentReducer.isBookingConfirm,
    coachSessionDetail: state.GetCoachesReducer.coachSessionDetail,
    PaymentCards: state.PaymentReducer.PaymentCards,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    PayNow: payload => dispatch(PaymentAction.IS_BOOKING_CONFIRM(payload)),
    getChatSession: payload => dispatch(ChatMiddleware.getChatSession(payload)),
    createBooking: payload =>
      dispatch(BookingMiddleware.createBooking(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  mainView: {
    flex: 1,
    marginTop: 20,
    // alignSelf: 'center',
    // backgroundColor:'red'
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  isSelectedView: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  isNotSelectedView: {
    backgroundColor: Colors.GRAY_4,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 650,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  sheetBody: {
    marginVertical: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modalView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  closeImage: { width: 60, height: 20 },
});
