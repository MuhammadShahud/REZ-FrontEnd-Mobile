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
  Calendar,
} from '../../../Components';
import {
  calendar,
  check_blue,
  clock,
  close,
  documentIcon,
  dropdownGreyIcon,
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
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import moment from 'moment';
import { InviteFriends } from '../..';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privacy: ['public', 'private', 'invite'],
      coachVisitModal: false,
      coachVisit: ['yes', 'no'],
      locationServiceChargesModal: false,
      timeSlotModal: false,
      location: 'newyork, USA',
      startTime: '',
      endTime: '',
      selectedPrivacy: 'public',
      notes: '',
      selectedTimeSlot: null,
      selectedChild: null,
      isCoachVisitYourLocation: false,
      isShowStartTimeModal: false,
      isShowEndTimeModal: false,
      isShowInviteFriendModal: false,
      selectedUsersIDs: [],
    };
  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  renderContent = () => {
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
            }}>
            <Image
              source={modalBarIcon}
              style={styles.closeImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* <Text style={{ fontWeight: 'bold' }}>In This Post</Text> */}
        </View>
        <View style={styles.sheetBody}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={check_blue}
                resizeMode="contain"
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
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Reta</Text>
                <Text>Football Trainer</Text>
                <Text>Coaching: 14 Years</Text>
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
                />
              </View>

              <View style={{ width: '48%' }}>
                <Button
                  name="Track"
                  backgroundColor={Colors.GREEN}
                  textStyle={{ color: Colors.WHITE }}
                />
              </View>
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
                  8:00 - 9:00 PM
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
                  New York, U.S
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
                  $12
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  componentDidMount() {
    const { coachSessionDetail } = this.props;
    this.setState({ location: coachSessionDetail?.session?.address });
    this.sheetRef.snapTo(1);
    this.props.getUsersByType({ role: 'player' });
  }

  renderStartTimeModal = () => {
    return (
      <DateTimePickerModal
        isVisible={this.state.isShowStartTimeModal}
        mode={'time'}
        is24Hour={true}
        onConfirm={time => {
          this.setState({ isShowStartTimeModal: false, startTime: time });
        }}
        onCancel={() => {
          this.setState({ isShowStartTimeModal: false });
        }}
      />
    );
  };

  renderEndTimeTimeModal = () => {
    return (
      <DateTimePickerModal
        isVisible={this.state.isShowEndTimeModal}
        mode={'time'}
        is24Hour={true}
        onConfirm={time => {
          this.setState({ isShowEndTimeModal: false, endTime: time });
        }}
        onCancel={() => {
          this.setState({ isShowEndTimeModal: false });
        }}
      />
    );
  };

  renderTimeSlotList = ({ item, index }) => {

    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            timeSlotModal: false,
            locationServiceChargesModal: true,
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
  onPressInvites = () => {
    this.setState({ isShowInviteFriendModal: true });
  };

  onPressSaveInvites = () => {
    this.setState({ isShowInviteFriendModal: false });
  };
  onPressUser = item => {
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    selectedUsersIDsCopy.push(item);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
  };

  removeUserFromSelectedUserIds = item => {
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
    selectedUsersIDsCopy.splice(foundIndex, 1);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
  };
  renderInviteFriendsModal = () => {
    return (
      <Modal
        visible={this.state.isShowInviteFriendModal}
        style={{}}
        animationType={'slide'}>
        <InviteFriends
          title={'Player'}
          role={'coach'}
          onPressSaveInvites={this.onPressSaveInvites}
          selectedUsersIDs={this.state.selectedUsersIDs}
          onPressUser={this.onPressUser}
          removeUserFromSelectedUserIds={this.removeUserFromSelectedUserIds}
          navigation={this.props.navigation}
          onPressBack={() => this.setState({ isShowInviteFriendModal: false })}
        />
      </Modal>
    );
  };
  onPressNextIsCoachVisitYourLocation = () => {
    let coach = this.props.route.params.coach;
    const { coachSessionDetail } = this.props;

    this.setState({ coachVisitModal: false });

    const {
      location,

      selectedPrivacy,
      notes,
      selectedTimeSlot,
      isCoachVisitYourLocation,
      selectedChild,
      selectedUsersIDs,
    } = this.state;
    let bookingDetails = {
      location,
      startTime: coachSessionDetail?.session?.start_time,
      endTime: coachSessionDetail?.session?.end_time,
      selectedPrivacy,
      notes,
      selectedTimeSlot,
      isCoachVisitYourLocation,
      selectedChild,
      selectedUsersIDs,
    };
    console.log('selectedChild 314=>', selectedChild);
    this.props.navigation.navigate('BookAppointment', { bookingDetails, coach });
  };
  render() {
    const { selectedTag, startTime, endTime } = this.state;
    const { coachSessionDetail, user } = this.props;

    let periods = [];
    let activeDates = [
      {
        date: new Date(coachSessionDetail?.session?.date),
        color: 'green',
        key: 'fitness',
      },
    ];
    // alert(2);
    console.log('coachSessionDetail', coachSessionDetail);
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Book Appointment"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.coachVisitModal}
            onRequestClose={() => this.setState({ coachVisitModal: false })}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: 'bold',
                      color: Colors.GREEN,
                    }}>
                    Do you want coach to visit your place?
                  </Text>

                  <View style={[styles.inputContainer, { width: '100%' }]}>
                    <SelectDropdown
                      data={this.state.coachVisit}
                      dropdownIconPosition="right"
                      renderDropdownIcon={() => {
                        return (
                          <Image
                            resizeMode="contain"
                            source={dropdownGreyIcon}
                            style={{ width: 20 }}
                          />
                        );
                      }}
                      buttonTextStyle={styles.dropDownBtnText}
                      buttonStyle={styles.btnStyle}
                      onSelect={(selectedItem, index) => {
                        this.setState({
                          isCoachVisitYourLocation:
                            selectedItem === 'yes' ? true : false,
                        });
                      }}
                    />
                  </View>

                  <View style={{ width: '100%', marginTop: 5 }}>
                    <Button
                      height={50}
                      name={'Next'}
                      textStyle={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.WHITE,
                      }}
                      btnStyle={{}}
                      onPress={this.onPressNextIsCoachVisitYourLocation}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.locationServiceChargesModal}
            onRequestClose={() =>
              this.setState({ locationServiceChargesModal: false })
            }>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: 'bold',
                      color: Colors.GREEN,
                    }}>
                    Choose Location
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.GRAY_1,
                      marginVertical: 10,
                      textAlign: 'center',
                    }}>
                    $5 extra service charges
                  </Text>

                  <View style={{ width: '100%', marginTop: 5 }}>
                    <Button
                      height={50}
                      name={'Next'}
                      textStyle={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.WHITE,
                      }}
                      btnStyle={{}}
                      onPress={() =>
                        this.setState({
                          locationServiceChargesModal: false,
                          coachVisitModal: true,
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.timeSlotModal}
            onRequestClose={() => this.setState({ timeSlotModal: false })}>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
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
                      data={coachSessionDetail?.session?.timeslots}
                      renderItem={this.renderTimeSlotList}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.mainView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <View>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.BLACK,
                    marginVertical: 10,
                  }}>
                  Select date for booking
                </Text>

                <Calendar periods={periods} activeDates={activeDates} />
              </View> */}

              <View style={{ alignItems: 'center' }}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={'Date'}
                    editable={false}
                    value={moment(coachSessionDetail?.session?.date).format(
                      'LL',
                    )}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    editable={false}
                    placeholder={'Add your Location'}
                    value={this.state.location}
                    onChangeText={text => this.onChangeText('location', text)}
                  />
                </View>

                <View style={styles.flexRow}>
                  <View style={[styles.inputTime, styles.marginRight5]}>
                    <Text style={styles.inputLabel}>Time</Text>
                    <View
                    // onPress={() =>
                    //   this.setState({ isShowStartTimeModal: true })
                    // }
                    >
                      <Text style={styles.dateContainer}>
                        {coachSessionDetail?.session?.start_time}
                        {/* {startTime
                          ? new Date(startTime).toLocaleTimeString()
                          : 'Start Time'} */}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.inputTime, styles.marginLeft5]}>
                    <Text style={styles.inputLabel}></Text>
                    <View
                    // onPress={() => this.setState({ isShowEndTimeModal: true })}
                    >
                      <Text style={styles.dateContainer}>
                        {coachSessionDetail?.session?.end_time}
                        {/* {endTime
                          ? new Date(endTime).toLocaleTimeString()
                          : 'End Time'} */}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text
                style={{
                  fontWeight: 'bold',
                  color: Colors.BLACK,
                  marginVertical: 10,
                }}>
                Privacy
              </Text>

              <View style={{ alignItems: 'center' }}>
                <View style={styles.inputContainer}>
                  <SelectDropdown
                    data={this.state.privacy}
                    defaultButtonText={'Public'}
                    dropdownIconPosition="right"
                    renderDropdownIcon={() => {
                      return (
                        <Image
                          resizeMode="contain"
                          source={dropdownGreyIcon}
                          style={{ width: 20 }}
                        />
                      );
                    }}
                    buttonTextStyle={styles.dropDownBtnText}
                    buttonStyle={styles.btnStyle}
                    onSelect={(selectedItem, index) => {
                      this.setState({ selectedPrivacy: selectedItem });
                    }}
                  />
                </View>

                {this.state.selectedPrivacy == 'invite' ? (
                  <TouchableOpacity
                    onPress={this.onPressInvites}
                    style={styles.inputContainer}>
                    <TextInput
                      placeholder={`${this.state.selectedUsersIDs?.length
                        ? this.state.selectedUsersIDs?.length + ' invited'
                        : 'Invite Friend (Enter Name to add)'
                        }`}
                      editable={false}
                    />
                  </TouchableOpacity>
                ) : null}

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={'Add notes here..'}
                    value={this.state.notes}
                    onChangeText={text => this.setState({ notes: text })}
                  />
                </View>
              </View>
              {user?.childInfo && (
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: Colors.BLACK,
                    marginVertical: 10,
                  }}>
                  Children
                </Text>
              )}

              {user?.childInfo ? (
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.inputContainer}>
                    <SelectDropdown
                      data={user?.childInfo}
                      defaultButtonText={'Select Child'}
                      dropdownIconPosition="right"
                      renderDropdownIcon={() => {
                        return (
                          <Image
                            resizeMode="contain"
                            source={dropdownGreyIcon}
                            style={{ width: 20 }}
                          />
                        );
                      }}
                      buttonTextStyle={styles.dropDownBtnText}
                      buttonStyle={styles.btnStyle}
                      buttonTextAfterSelection={selectedItem =>
                        selectedItem.username
                      }
                      rowTextForSelection={(item, index) => item.username}
                      onSelect={(selectedItem, index) => {
                        this.setState({ selectedChild: selectedItem });
                      }}
                    />
                  </View>
                </View>
              ) : null}

              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: '90%' }}>
                  <Button
                    name="Book"
                    backgroundColor={Colors.BLUE}
                    textStyle={{ color: Colors.WHITE }}
                    onPressBook
                    onPress={() => {
                      if (
                        (this.props.role != 'player' && this.props.role != 'parent' &&
                          !this.props.user?.parentMembership &&
                          !this.props.user?.membership) ||
                        (this.props.role != 'player' && this.props.role != 'parent' &&
                          !this.props.user?.membership)
                      ) {
                        this.props.navigation.navigate('MemberShip');
                      } else if (this.props.role === 'parent') {
                        if (this.state.selectedChild) {
                          this.setState({
                            timeSlotModal: true,
                            //   locationServiceChargesModal: true,
                          });
                        } else {
                          alert('Select Child');
                        }
                      } else {
                        this.setState({
                          timeSlotModal: true,
                          //   locationServiceChargesModal: true,
                        });
                      }
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        {this.renderStartTimeModal()}
        {this.renderEndTimeTimeModal()}
        {this.renderInviteFriendsModal()}

        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          snapPoints={[650, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    coachSessionDetail: state.GetCoachesReducer.coachSessionDetail,
    user: state.Auth.user,
    role: state.Auth.role,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  flexRow: {
    flexDirection: 'row',
    width: '90%',
  },
  inputTime: {
    flex: 1,
    marginTop: 10,
  },
  marginLeft5: {
    marginLeft: 5,
  },
  marginRight5: {
    marginRight: 5,
  },
  dateContainer: {
    backgroundColor: Colors.GRAY_4,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  closeImage: { width: 60, height: 20 },
  inputContainer: {
    marginVertical: 10,
    backgroundColor: Colors.GRAY_4,
    width: '90%',
    paddingHorizontal: 15,
  },
  inputLabel: {
    color: Colors.GRAY_1,
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_1,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: Colors.GRAY_4,
    width: '100%',
    marginTop: 5,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxHeight: 450,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
