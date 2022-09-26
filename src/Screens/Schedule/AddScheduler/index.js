import React, { Component } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {
  calendar_gray,
  check_blue,
  close,
  dropdownGreyIcon,
  dropdownIcon,
  person_plus,
  upload,
} from '../../../Assets';
import { Button, Header, Text, TextInput, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { InviteFriends } from '../';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

export class AddScheduler extends Component {
  state = {
    selectScheduleType: '',
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: '',
    location: '',
    selectedUsersIDs: [],
    privacy: ['public', 'private', 'invites'],
    selectedPrivacy: 'public',
    image: null,
    interval_break: '',
    interval_time: '',
    isShowDateModal: false,
    isShowStartTimeModal: false,
    isShowEndTimeModal: false,
    isShowInviteFriendModal: false,
    participants: '',
    Room_id: '',
    Subroom_id: '',
    loader: false,
    getCoachs: null,
    coach_id: ''
  };

  resetState = () => {
    this.setState({
      selectScheduleType: '',
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      price: '',
      location: '',
      selectedUsersIDs: [],
      privacy: ['public', 'private'],
      selectedPrivacy: '',
      image: null,
      interval_break: '',
      interval_time: '',
      Room_id: '',
      Subroom_id: '',
      isShowDateModal: false,
      isShowStartTimeModal: false,
      isShowEndTimeModal: false,
      isShowInviteFriendModal: false,
      participants: '',
      loader: false,
      staffplaceholder: "Invites",
    });
  };

  componentDidMount() {
    // this.sheetRef.snapTo(1);
    this.props.getUsersByType({ role: 'multi_roles' });
    this.props.getScheduleTypes();
    this.props.getRoom()
    this.setState({ staffplaceholder: "Invites" })
    this.props.getUsersByRole({ role: 'coach' })
  }
  // componentWillUnmount() {
  //   this.props.getScheduleTypes();
  //   this.props.getUsersByType({ role: 'multi_roles' });
  //   this.props.getRoom()
  // }

  onChangeText = (key, value) => {
    this.setState({ [key]: value });
  };

  onPressSelecteDate = () => {
    this.setState({ isShowDateModal: true });
  };

  onPressUploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(img => {
      let spirit_uri = img.path.split('/');
      let name = spirit_uri[spirit_uri.length - 1];

      let imgObj = {
        name,
        uri: img.path,
        size: img.size,
        type: img.mime,
      };
      this.setState({ image: imgObj });
    });
  };

  onPressInvites = () => {
    this.setState({ isShowInviteFriendModal: true });
  };

  onPressSaveInvites = () => {
    this.setState({ isShowInviteFriendModal: false });

    let staffcount = this.state.selectedUsersIDs?.length;
    this.setState({ staffplaceholder: staffcount + " Members Selected" })
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

  onPressAddSchedule = () => {
    const {
      selectScheduleType,
      title,
      date,
      description,
      endTime,
      image,
      startTime,
      location,
      price,
      selectedPrivacy,
      selectedUsersIDs,
      interval_break,
      interval_time,
      participants,
      Room_id,
      Subroom_id,
      coach_id
    } = this.state;
    let obj = {
      schedule_type_id: selectScheduleType,
      title: title,
      description: description,
      date: date,
      start_time: startTime,
      end_time: endTime,
      price: price,
      address: location,
      invited_user_id: selectedUsersIDs,
      privacy: selectedPrivacy,
      image: image,
      interval_break,
      interval_time,
      participants: participants,
      room_id: Room_id,
      subroom_id: Subroom_id,
      coach_id: coach_id,
    };
    if (this.props.user?.role === 'facility'
      || this.props.user?.role === 'staff') {
      if (!Room_id && !Subroom_id) {
        alert('Room and subroom is required!');
        return;
      }
    }

    if (
      selectScheduleType &&
      title &&
      description &&
      date &&
      startTime &&
      endTime &&
      price &&
      location &&
      interval_break &&
      interval_time &&
      selectedPrivacy
    ) {
      this.setState({ loader: true }, () => {
        this.props
          .addSchedule(obj)
          .then(() => {
            this.sheetRef.snapTo(0);
            this.resetState();
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('All fields is required');
    }
  };

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.date ? this.state.date : new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          this.setState({ isShowDateModal: false, date: date });
        }}
        onCancel={() => {
          this.setState({ isShowDateModal: false });
        }}
      />
    );
  };

  renderStartTimeModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowStartTimeModal}
        mode={'time'}
        date={this.state.startTime ? this.state.startTime : this.state.date ? this.state.date : new Date()}
        is24hourSource={'device'}
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
      <DatePicker
        modal
        open={this.state.isShowEndTimeModal}
        mode={'time'}
        date={this.state.endTime ? this.state.endTime : this.state.date ? this.state.date : new Date()}
        minimumDate={new Date()}
        is24hourSource={'device'}
        onConfirm={time => {
          this.setState({ isShowEndTimeModal: false, endTime: time });
        }}
        onCancel={() => {
          this.setState({ isShowEndTimeModal: false });
        }}
      />
    );
  };

  renderInviteFriendsModal = () => {
    return (
      <Modal
        visible={this.state.isShowInviteFriendModal}
        style={{}}
        animationType={'slide'}>
        <InviteFriends
          title={'Members'}
          role={'multi_roles'}
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

  renderContent = () => {
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.sheetRef.snapTo(1),
              this.props.navigation.goBack();
          }}>
          <Image
            source={close}
            style={styles.closeImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={styles.sheetBody}>
          <Image
            source={check_blue}
            style={styles.checkImage}
            resizeMode={'contain'}
          />
          <Text style={styles.sheetHeading}>Your schedule has been added</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };

  renderSubRoom = id => {
    this.setState({ loader: true });
    this.props
      .getSubRoom({ id: id })
      .then(() => {
        this.setState({ loader: false });
      })
      .catch(err => {
        this.setState({ loader: false });
      });
  }

  render() {
    const { date, startTime, endTime, image } = this.state;
    let { role, user, scheduleTypes, getCoachs } = this.props;
    if (role === 'staff') {
      const filterScheduleListForStaff = scheduleTypes.filter(x => {
        const isFoundInPermissions = user?.permissions?.find(y => {
          return y.permission_id == x.id;
        });
        return isFoundInPermissions ? true : false;
      });
      scheduleTypes = filterScheduleListForStaff;
    }
    // let index = scheduleTypes.findIndex(item => item.id === 5);
    // scheduleTypes.splice(index, 1)

    let Rooms = this.props.getRooms;
    let subRooms = this.props.getSubRooms;

    return (
      <>
        <View style={{ paddingHorizontal: 25, backgroundColor: Colors.WHITE }}>
          <Header
            navigation={this.props.navigation}
            title={'Add Schedule'}
            isShowLeftIcon={true}
          />
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.inputContainer}>
            {scheduleTypes.length > 0 ? (<>
              <Text style={styles.inputLabel}>Schedule Type</Text>
              <SelectDropdown
                data={scheduleTypes}
                dropdownIconPosition="right"
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownIcon}
                      style={styles.w20}
                    />
                  );
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.title;
                }}
                rowTextForSelection={(item, index) => {
                  return item.title
                }}
                buttonTextStyle={styles.dropDownBtnText}
                buttonStyle={styles.btnStyle}
                onSelect={(selectedItem, index) => {
                  this.setState({ selectScheduleType: selectedItem.id });
                }}
              />
            </>) : null}
          </View>
          {this.props.user?.role === 'facility' || this.props.user?.role === 'staff' ? (
            <>
              <View style={styles.inputContainer}>

                {Rooms && Rooms.length > 0 ? (
                  <>
                    <Text style={styles.inputLabel}>Room</Text>
                    <SelectDropdown
                      data={Rooms}
                      dropdownIconPosition="right"
                      renderDropdownIcon={() => {
                        return (
                          <Image
                            resizeMode="contain"
                            source={dropdownIcon}
                            style={styles.w20}
                          />
                        );
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem.name;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item.name
                      }}
                      buttonTextStyle={styles.dropDownBtnText}
                      buttonStyle={styles.btnStyle}
                      onSelect={(selectedItem, index) => {
                        this.setState({ Room_id: selectedItem.id }),
                          this.renderSubRoom(selectedItem.id)
                      }}
                    />
                  </>) : <Text>No Room Found</Text>}
              </View>
              {subRooms && this.state.Room_id ? (
                <View style={styles.inputContainer}>
                  {subRooms.length > 0 ?
                    (
                      <>
                        <Text style={styles.inputLabel}>Sub Room</Text>
                        <SelectDropdown
                          data={subRooms}
                          dropdownIconPosition="right"
                          renderDropdownIcon={() => {
                            return (
                              <Image
                                resizeMode="contain"
                                source={dropdownIcon}
                                style={styles.w20}
                              />
                            );
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.name;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item.name
                          }}
                          buttonTextStyle={styles.dropDownBtnText}
                          buttonStyle={styles.btnStyle}
                          onSelect={(selectedItem, index) => {
                            this.setState({ Subroom_id: selectedItem.id });
                          }}
                        />
                      </>)
                    : <Text>This room doesn't have Subroom</Text>}
                </View>
              ) : null}
            </>
          )
            : null}
          {this.props.user?.role === 'facility' || this.props.user?.role === 'staff' ? (
            <View style={styles.inputContainer}>
              {getCoachs?.length > 0 ? (<>
                <Text style={styles.inputLabel}>Select Coach</Text>
                <SelectDropdown
                  data={getCoachs}
                  dropdownIconPosition="right"
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        resizeMode="contain"
                        source={dropdownIcon}
                        style={styles.w20}
                      />
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.username;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.username
                  }}
                  buttonTextStyle={styles.dropDownBtnText}
                  buttonStyle={styles.btnStyle}
                  onSelect={(selectedItem, index) => {
                    this.setState({ coach_id: selectedItem.id });
                  }}
                />
              </>) : null}
            </View>
          )
            : null}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              placeholder={'Title Here'}
              value={this.state.title}
              onChangeText={text => this.onChangeText('title', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              multiline={true}
              value={this.state.description}
              placeholder={'Description here'}
              style={styles.inputDescription}
              onChangeText={text => this.onChangeText('description', text)}
            />
          </View>
          <View style={{ width: '100%', marginTop: 10 }}>
            <Text style={{ color: Colors.GRAY_1 }}>Date</Text>
            <TouchableOpacity
              onPress={() => this.setState({ isShowDateModal: true })}
              style={styles.dateContainer}>
              <Text style={{ color: Colors.GRAY_1 }}>
                {date ? new Date(date).toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flexRow}>
            <View style={[styles.inputTime, styles.marginRight5]}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity
                onPress={() => this.setState({ isShowStartTimeModal: true })}>
                <Text style={styles.dateContainer}>
                  {startTime
                    ? moment(startTime).format('LT')
                    : 'Start Time'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputTime, styles.marginLeft5]}>
              <Text style={styles.inputLabel}></Text>
              <TouchableOpacity
                onPress={() => this.setState({ isShowEndTimeModal: true })}>
                <Text style={styles.dateContainer}>
                  {endTime
                    ? moment(endTime).format('LT')
                    : 'End Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Interval Time (Minutes)</Text>
            <TextInput
              keyboardType={'numeric'}
              value={this.state.interval_time}
              placeholder={'Enter Interval Time'}
              onChangeText={text => this.onChangeText('interval_time', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Interval break (Minutes)</Text>
            <TextInput
              keyboardType={'numeric'}
              value={this.state.interval_break}
              placeholder={'Enter Interval break'}
              onChangeText={text => this.onChangeText('interval_break', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              value={this.state.price}
              keyboardType={'numeric'}
              placeholder={'Enter Training Cost'}
              onChangeText={text => this.onChangeText('price', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>No. of Participants</Text>
            <TextInput
              keyboardType={'numeric'}
              value={this.state.participants}
              placeholder={'Enter No. of Participants'}
              onChangeText={text => this.onChangeText('participants', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              placeholder={'Enter Location'}
              value={this.state.location}
              onChangeText={text => this.onChangeText('location', text)}
            />
          </View>
          <View style={{ width: '100%', marginTop: 10 }}>
            <Text style={{ color: Colors.GRAY_1 }}>Invites</Text>
            <TouchableOpacity
              onPress={this.onPressInvites}
              style={[
                styles.dateContainer,
                { justifyContent: 'space-between', flexDirection: 'row' },
              ]}>
              <Text style={{ color: Colors.GRAY_1 }}>{this.state.staffplaceholder}</Text>
              <Image
                resizeMode="contain"
                source={person_plus}
                style={{ height: 20, width: 20 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Privacy</Text>
            <SelectDropdown
              data={this.state.privacy}
              dropdownIconPosition="right"
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownGreyIcon}
                    style={styles.w20}
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
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Upload Image</Text>
            <TouchableOpacity onPress={this.onPressUploadImage}>
              <TextInput
                editable={false}
                placeholder={'Upload Image'}
                endIcon={upload}
              />
            </TouchableOpacity>
          </View>
          {image ? (
            <View style={styles.inputContainer}>
              <Image
                source={{ uri: image.uri }}
                style={{ width: '100%', height: 250 }}
                resizeMode={'contain'}
              />
            </View>
          ) : null}
          <Button
            onPress={this.onPressAddSchedule}
            btnStyle={styles.mv20}
            name={'Add'}
            backgroundColor={Colors.BLUE}
            textStyle={styles.cWhite}
          />
        </ScrollView>
        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          initialSnap={1}
          snapPoints={[280, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
        {this.renderDateModal()}
        {this.renderStartTimeModal()}
        {this.renderEndTimeTimeModal()}
        {this.renderInviteFriendsModal()}
        <Loader loader={this.state.loader} />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    scheduleTypes: state.ScheduleReducer.scheduleTypes,
    usersByType: state.UserReducer.usersByType,
    user: state.Auth.user,
    role: state.Auth.role,
    getRooms: state.RoomReducer.Rooms,
    getSubRooms: state.RoomReducer.SubRooms,
    getCoachs: state.UserReducer.getUsers,


  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getScheduleTypes: () => dispatch(ScheduleMiddleware.getScheduleTypes()),
    getRoom: () => dispatch(RoomMiddleware.GetAllRooms()),
    getSubRoom: payload => dispatch(RoomMiddleware.GetAllSubRooms(payload)),

    addSchedule: payload => dispatch(ScheduleMiddleware.addSchedule(payload)),
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
    getUsersByRole: payload => dispatch(UserMiddleware.getUsersByRole(payload))
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(AddScheduler);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    color: Colors.GRAY_1,
  },
  inputDescription: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  mv20: {
    marginVertical: 20,
  },
  cWhite: {
    color: Colors.WHITE,
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_1,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: Colors.BLUE_LIGHT,
    width: '100%',
    marginTop: 5,
  },
  w20: {
    width: 20,
  },
  flexRow: {
    flexDirection: 'row',
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
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  closeImage: {
    width: 14,
    height: 14,
  },
  sheetBody: {
    marginVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkImage: {
    width: 40,
    height: 40,
  },
  sheetHeading: {
    fontSize: 18,
    color: Colors.GRAY_3,
    paddingVertical: 5,
  },
  subHeading: {
    fontSize: 22,
    color: Colors.GRAY_3,
    fontWeight: '500',
  },
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
