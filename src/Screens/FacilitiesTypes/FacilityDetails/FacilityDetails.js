import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Header, Button, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Text } from '../../../Components';
import {
  footballBg,
  hockeyBg,
  redShirt,
  calendar,
  clock,
  map_marker,
  price,
  lock,
  graph,
  close
} from '../../../Assets/index';
import { dummyImage } from '../../../Config';
import { img_url } from '../../../Store/Apis';
import { connect } from 'react-redux';
import moment from 'moment';
import BookingMidleware from '../../../Store/Middleware/BookingMiddleware';
import GetFacilityMiddleware from '../../../Store/Middleware/GetFacilityMiddleware';
import PackagesMiddleware from '../../../Store/Middleware/PackagesMiddleware';
class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeSlotModal: false,
      selectedTimeSlot: null,
      timeSlots: null,
      loader: false,
      sheduleDetails: null,
      isContract: false,
      contractId: '',
      packageId: '',
      passId: '',
    };
  }
  componentDidMount() {
    this.props
      .getCoachTimeSlot({ session_id: this.props.route?.params?.item?.id })
      .then(timeSlots => {
        let selectedTimeSlot = null;
        this.setState({
          timeSlots: timeSlots,
        });
      })
      .catch(err => console.log(err));
    const sheduleDetails = this?.props?.route?.params?.item;
    this.setState({ sheduleDetails });

    this.props.getContract({ id: this.props.route.params.facility_id })
    this.props.getPackages({ id: this.props.route.params.facility_id })
    this.props.getPasses({ id: this.props.route.params.facility_id })
    this.props.getUserDetail({ id: this.props.route.params.facility_id })
  }

  onPressBookAppointment = () => {
    this.setState({ isContract: false })
    // const item = this.props.route?.params?.item;
    const sheduleDetails = this.state.sheduleDetails;
    this.props.navigation.navigate('Payment', {
      screen: 'FacilityDetails',
      showModal: card_id => {
        let payload = {
          training_session_id: sheduleDetails?.id,
          location_address: sheduleDetails?.address,
          time_slot_id: this.state.selectedTimeSlot.id,
          payment_method_id: card_id,
          amount: sheduleDetails?.price,
          booking_date: sheduleDetails?.date,
        };

        this.setState({ loader: true }, () => {
          this.props
            .createBooking(payload)
            .then(() => {
              this.setState({
                loader: false,
                notificationModal: true,
              });
              alert('Facility booking successfully');
              this.props.navigation.goBack();
            })
            .catch(() => {
              this.setState({ loader: false });
            });
        });
      },
    });
  };

  Booking = ({ packageId, contractId, passId }) => {
    const sheduleDetails = this.state.sheduleDetails;
    let payload = {
      training_session_id: sheduleDetails?.id,
      location_address: sheduleDetails?.address,
      time_slot_id: this.state.selectedTimeSlot.id,
      payment_method_id: null,
      amount: sheduleDetails?.price,
      booking_date: sheduleDetails?.date,
      contract_id: contractId,
      package_id: packageId,
      pass_id: passId,
    };
    this.setState({ loader: true }, () => {
      this.props
        .createBooking(payload)
        .then(() => {
          this.setState({
            loader: false,
            notificationModal: true,
          });
          alert('Facility booking successfully');
          this.props.navigation.goBack();
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  }

  checkUserMembership = () => {
    let userPlans = this.props.userPkgDetail;
    const screen = this.props?.route?.params?.screen
    let sheduleDetails
    if (screen == 'EventDetail') {
      sheduleDetails = this.state.sheduleDetails
    } else {
      let sheduleDetails_id = this.state.sheduleDetails?.id;
      if (sheduleDetails_id) {
        sheduleDetails = this.props?.getShedulesData_list.find(
          x => x.id === sheduleDetails_id,
        );
      }
    }
    let Action =
      sheduleDetails?.schedule_type_name === "Lessons" ? "Packages"
        : sheduleDetails?.schedule_type_name === "Clinic" ? "Passes"
          : sheduleDetails?.sport_name === "Gym" ? "Contracts" : null;

    switch (Action) {
      case "Packages":
        if (userPlans?.package != null) {
          this.Booking({
            packageId: userPlans.package.id,
            contractId: '',
            passId: ''
          });
        } else {
          this.setState({ isContract: true });
        }
        break;
      case "Passes":
        if (userPlans?.pass != null) {
          if (userPlans.pass.consumed_visits === userPlans.pass.visits) {
            alert("Your passes are consumed");
            this.setState({ isContract: true });
          } else {
            this.Booking({
              packageId: '',
              contractId: '',
              passId: userPlans.pass.id
            });
          }
        } else {
          this.setState({ isContract: true });
        }
        break;
      case "Contracts":
        if (userPlans?.contract != null) {
          this.Booking({
            packageId: '',
            contractId: userPlans.contract.id,
            passId: ''
          });
        } else {
          this.setState({ isContract: true });
        }
        break;

      default:
        this.onPressBookAppointment();
        break;
    }

  }

  SubscribePlans = (item, type) => {
    console.warn(item, type);
    this.setState({ isContract: false })
    this.props.navigation.navigate('Payment', {
      screen: 'FacilityPackage',
      showModal: card_id => {

        this.setState({ loader: true }, () => {
          this.props
            .subscribedPlans({
              payid: card_id,
              amount: item.price,
              id: item.id,
              type: type
            })
            .then(() => {
              this.setState({
                loader: false,
                notificationModal: true,
              });
              alert('Purchased Successfully..');
              this.props.navigation.goBack();
            })
            .catch(() => {
              this.setState({ loader: false });
            });
        });
      },
    });
  }

  renderTimeSlotList = ({ item, index }) => {

    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            timeSlotModal: false,
            selectedTimeSlot: item,
          })
        }>
        <View
          style={{
            backgroundColor: Colors.GREEN,
            width: 100,
            height: 60,
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: Colors.WHITE }}>{moment(item?.start_time, 'hh:mm a').format('LT')}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  renderContractList = ({ item, index }) => {
    const sheduleDetails = this.state.sheduleDetails;

    let type =
      sheduleDetails?.schedule_type_name === "Lessons" ? "package"
        : sheduleDetails?.schedule_type_name === "Clinic" ? "pass"
          : sheduleDetails?.sport_name === "Gym" ? "contract"
            : null; return (
              <View activeOpacity={0.7} style={styles.userItemContainer}>

                <View style={[styles.contractContainer, { height: 'auto' }]}>
                  <View style={styles.headingContainer}>
                    <Text style={styles.heading}>{item.name}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>

                    <View style={{ width: '55%', padding: 10 }}>
                      <Text style={{ color: Colors.WHITE, fontSize: 12, marginBottom: 10 }}
                        numberOfLines={6}
                      > {item.description != null ? item.description : "No Description"}
                      </Text>
                      {item.no_of_passes != undefined ?
                        <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>{" No. Of Passes " + item.no_of_passes}</Text>
                        : null}

                      {item.visits != undefined ?
                        <Text style={{ color: Colors.WHITE, fontSize: 12, fontWeight: 'bold' }}>{"Total Visits " + item.visits}</Text>
                        : null}
                    </View>

                    <View style={{ width: '45%', paddingTop: 10 }}>
                      {item.validity != undefined ?
                        <View style={styles.validContainer}>
                          <Text style={{ fontSize: 12, paddingHorizontal: 10, alignSelf: 'center' }}>{"Validity " + item.validity}</Text>
                        </View> : null}

                      <View style={styles.priceContainer}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'center', color: Colors.WHITE }}>{"$" + item.price}</Text>
                      </View>
                    </View>

                  </View>
                  <TouchableOpacity style={styles.renewContainer} onPress={() => this.SubscribePlans(item, type)}>
                    <Text style={{ fontSize: 15, alignSelf: 'center', color: Colors.WHITE }}>Buy Now</Text>
                  </TouchableOpacity>
                </View>


              </View>
            );
  };

  renderFacilityPackages = () => {
    let data = []
    let Contracts = this.props.getcontacts;
    let packages = this.props.getpackages;
    let passes = this.props.getpasses;

    const screen = this.props?.route?.params?.screen
    let sheduleDetails
    if (screen == 'EventDetail') {
      sheduleDetails = this.state.sheduleDetails
    } else {
      let sheduleDetails_id = this.state.sheduleDetails?.id;
      if (sheduleDetails_id) {
        sheduleDetails = this.props?.getShedulesData_list.find(
          x => x.id === sheduleDetails_id,
        );
      }
    }
    let heading =
      sheduleDetails?.schedule_type_name === "Lessons" ? "Packages"
        : sheduleDetails?.schedule_type_name === "Clinic" ? "Passes"
          : sheduleDetails?.sport_name === "Gym" ? "Contracts"
            : null;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isContract}
        onRequestClose={() => this.setState({ isContract: false })}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#fff', flex: 1, paddingTop: 10 }}>
            <View style={[styles.centeredView, { marginTop: 0 }]}>
              <View style={{ backgroundColor: Colors.WHITE, height: '100%' }}>
                <TouchableOpacity
                  style={{ alignSelf: 'flex-start', margin: 10, width: 25, height: 25 }}
                  onPress={() => this.onPressBookAppointment()}
                >
                  <Image
                    source={close}
                    resizeMode={'contain'}
                    style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
                <View style={styles.modalInnerView}>

                  <Text style={[styles.heading, { color: Colors.BLACK }]}>{"Facility " + heading}</Text>
                  {sheduleDetails && sheduleDetails?.schedule_type_name === "Lessons" ?
                    <FlatList
                      style={{ marginBottom: '30%' }}
                      showsVerticalScrollIndicator={false}
                      data={packages}
                      renderItem={this.renderContractList}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={() =>

                        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                          <Text>Packages Not Found</Text>
                        </View>

                      }
                    /> : sheduleDetails?.schedule_type_name === "Clinic" ?
                      <FlatList
                        style={{ marginBottom: '30%' }}
                        showsVerticalScrollIndicator={false}
                        data={passes}
                        renderItem={this.renderContractList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                            <Text>Passes Not Found</Text>
                          </View>

                        }
                      /> :

                      <FlatList
                        style={{ marginBottom: '30%' }}
                        showsVerticalScrollIndicator={false}
                        data={Contracts}
                        renderItem={this.renderContractList}
                        keyExtractor={(item, index) => index.toString()}
                        ListEmptyComponent={() =>

                          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                            <Text>Contract Not Found</Text>
                          </View>

                        }
                      />
                  }
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }
  render() {
    const screen = this.props?.route?.params?.screen
    let sheduleDetails
    if (screen == 'EventDetail') {
      sheduleDetails = this.state.sheduleDetails
    } else {
      let sheduleDetails_id = this.state.sheduleDetails?.id;
      if (sheduleDetails_id) {
        sheduleDetails = this.props?.getShedulesData_list.find(
          x => x.id === sheduleDetails_id,
        );
      }
    }
    const item = this.props.route?.params?.item;
    console.warn('itemmmm', sheduleDetails);
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Header
            title={'Facility Details'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View style={{ height: 200 }}>
              <Image
                source={{
                  uri: sheduleDetails?.image
                    ? img_url + sheduleDetails?.image
                    : dummyImage,
                }}
                style={styles.imgPromo}
              />
            </View>

            <View style={styles.DetailBody}>
              <Text style={styles.HeadingBlack}>{sheduleDetails?.title}</Text>
              <Text style={styles.Heading}>Details</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Image
                  source={calendar}
                  style={{ height: 25, width: 25 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  {moment(sheduleDetails?.date).format('LL')}
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
                  style={{ height: 25, width: 25 }}
                  resizeMode={'contain'}
                />
                <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                  {`${moment(sheduleDetails?.start_time, 'hh:mm a').format('LT')} - ${moment(sheduleDetails?.end_time, 'hh:mm a').format('LT')}`}
                </Text>
              </View>
              <View style={styles.OptionView}>
                <Image
                  source={map_marker}
                  style={{ height: 25, width: 25 }}
                  resizeMode={'contain'}
                />
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={styles.ShortHeadingInner}>
                  {sheduleDetails?.address}
                </Text>
              </View>
              <View style={styles.OptionView}>
                <FontAwesome
                  name={'dollar'}
                  style={{ marginLeft: 5 }}
                  size={26}
                  color={Colors.BLACK}
                />
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={styles.ShortHeadingInner}>
                  {sheduleDetails?.price}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.BLACK,
                    marginTop: 10,
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  Time Interval:{' '}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  {sheduleDetails?.interval_time}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.BLACK,
                    marginTop: 10,
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  Room Name:{' '}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  {sheduleDetails?.room_name}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.BLACK,
                    marginTop: 10,
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  Subroom Name:{' '}
                </Text>
                <Text style={{ marginTop: 10 }}>
                  {sheduleDetails?.subroom_name}
                </Text>
              </View>
              {sheduleDetails?.participants != 0 ?
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.BLACK,
                      marginTop: 10,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    Total Participants:{' '}
                  </Text>
                  <Text style={{ marginTop: 10 }}>
                    {sheduleDetails?.participants}
                  </Text>
                </View>
                : null}


              <Text
                style={{
                  fontSize: 14,
                  color: Colors.BLACK,
                  marginTop: 10,
                  fontWeight: 'bold',
                }}>
                Description:
              </Text>
              <Text style={styles.DetailPara}>
                {sheduleDetails?.description}
              </Text>
              {/* <View style={styles.OptionView}>
                <Image source={calendar} style={styles.iconImg} />
                <Text style={styles.ShortHeadingInner}>Sep 15' 21</Text>
              </View>
              <View style={styles.OptionView}>
                <Image source={clock} style={styles.iconImg} />
                <Text style={styles.ShortHeadingInner}>08:00 - 09:00 PM</Text>
              </View> */}

              {this.props.role != 'facility' && this.props.role != 'staff' ? (
                this.state.selectedTimeSlot == null ? (
                  <Button
                    height={50}
                    name={'Select Time Slot'}
                    textStyle={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: Colors.WHITE,
                    }}
                    btnStyle={{ marginVertical: 10 }}
                    backgroundColor={Colors.BLUE}
                    onPress={() => {
                      if (
                        (this.props.role != 'player' && this.props.role != 'parent' &&
                          !this.props.user?.parentMembership &&
                          !this.props.user?.membership) ||
                        (this.props.role != 'player' && this.props.role != 'parent' &&
                          !this.props.user?.membership)
                      ) {
                        this.props.navigation.navigate('MemberShip');
                      } else {
                        this.setState({ timeSlotModal: true });
                      }
                    }}
                  />
                ) : (
                  <Button
                    height={50}
                    name={'Book'}
                    textStyle={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: Colors.WHITE,
                    }}
                    btnStyle={{ marginVertical: 10 }}
                    backgroundColor={Colors.BLUE}
                    onPress={() => this.checkUserMembership()}
                  />
                )
              ) : null}
            </View>
          </View>
        </ScrollView>
        {this.renderFacilityPackages()}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.timeSlotModal}
          onRequestClose={() => this.setState({ timeSlotModal: false })}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1, paddingTop: 10 }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity
                    style={{ alignSelf: 'flex-start', margin: 10, width: 25, height: 25 }}
                    onPress={() => this.setState({ timeSlotModal: false })}
                  >
                    <Image
                      source={close}
                      resizeMode={'contain'}
                      style={{ width: 15, height: 15 }} />
                  </TouchableOpacity>
                  <View style={styles.modalInnerView}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.GRAY_1,
                        marginVertical: 10,
                        textAlign: 'center',
                      }}>
                      Select available time slot
                    </Text>

                    <View>
                      <FlatList
                        style={{ marginVertical: 20 }}
                        //   horizontal
                        numColumns={2}
                        showsHorizontalScrollIndicator={false}
                        data={this.state?.timeSlots}
                        renderItem={this.renderTimeSlotList}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
        <Loader loader={this.state.loader} />
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    role: state.Auth.role,
    getFacilityData: state.GetFacilityReducer.getFacilityData,
    getFacilityData_list: state.GetFacilityReducer.getFacilityData_list,
    user: state.Auth.user,
    getShedulesData: state.GetFacilityReducer.getShedulesData,
    getShedulesData_list: state.GetFacilityReducer.getShedulesData_list,

    getcontacts: state.PackagesReducer.Contracts,
    getpackages: state.PackagesReducer.Packages,
    getpasses: state.PackagesReducer.Passes,
    userPkgDetail: state.PackagesReducer.userPackageDetail,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getCoachTimeSlot: payload =>
      dispatch(BookingMidleware.getCoachTimeSlot(payload)),
    createBooking: payload => dispatch(BookingMidleware.createBooking(payload)),
    getAllFacility: (payload, searchText) =>
      dispatch(GetFacilityMiddleware.getAllFacility(payload, searchText)),
    getSchedulesOther: payload =>
      dispatch(GetFacilityMiddleware.getSchedulesOther(payload)),

    getContract: payload => dispatch(PackagesMiddleware.getAllContracts(payload)),
    getPackages: payload => dispatch(PackagesMiddleware.getAllPackages(payload)),
    getPasses: payload => dispatch(PackagesMiddleware.getAllPasses(payload)),

    getUserDetail: payload => dispatch(PackagesMiddleware.getUserMembership(payload)),

    subscribedPlans: payload => dispatch(PackagesMiddleware.subscribedPlans(payload))

  };
};

export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  body: {
    flex: 1,
    marginHorizontal: 20,
    // backgroundColor: 'pink',
    paddingBottom: 10,
  },

  imgPromo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  DetailBody: {
    flex: 0.5,
  },
  HeadingBlack: {
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 20,
    fontWeight: 'bold',
  },
  Heading: {
    fontSize: 16,
    color: Colors.BLACK,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  DetailPara: {
    fontSize: 13,
    color: Colors.GRAY_1,
    marginBottom: 10,
  },
  ShortHeading: {
    fontSize: 15,
    color: Colors.GRAY_5,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  ShortHeadingInner: {
    fontSize: 14,
    //color: Colors.GRAY_1,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  OptionView: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  modalInnerView: {
    paddingHorizontal: 35,
    alignItems: 'center',
  },
  contractContainer: {
    backgroundColor: Colors.GREEN,
    width: '100%',
    borderRadius: 20,
    marginVertical: 10
  },
  headingContainer: {
    backgroundColor: Colors.WHITE,
    width: '100%',
    height: 35,
    marginTop: 25,
    justifyContent: 'center'
  },
  heading: {
    fontSize: 20,
    marginHorizontal: 10,
    fontWeight: '900',
    color: Colors.GREEN
  },
  validContainer: {
    backgroundColor: Colors.WHITE,
    width: 85,
    height: 35,
    alignSelf: 'flex-end',
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    justifyContent: 'center',
  },

  priceContainer: {
    backgroundColor: Colors.BLUE,
    width: 95,
    height: 40,
    alignSelf: 'flex-end',
    marginVertical: 10,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    justifyContent: 'center'
  },
  renewContainer: {
    borderColor: Colors.WHITE,
    borderWidth: 1.5,
    width: 100,
    height: 30,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
});
