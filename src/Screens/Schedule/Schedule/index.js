import React, { Component } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { dropdownIcon, dummy } from '../../../Assets';
import { Calendar, Header, Tag, Text } from '../../../Components';
import Entypo from 'react-native-vector-icons/Entypo';
import { Colors } from '../../../Styles';
import { connect } from 'react-redux';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware';
import ScheduleAction from '../../../Store/Actions/ScheduleAction'
import moment from 'moment';
import { img_url } from '../../../Store/Apis';
import { ScheduleDetail } from '..';

class Schedule extends Component {
  constructor(props) {
    let tag =
      props.role == 'player' || props.role == 'coach' || props.role == 'team'
        ? 'Player'
        : props.role == 'parent'
          ? 'Coach'
          : 'Event';
    super(props);
    this.state = {
      registerAs: [
        'All Childs',
        'All Available Coaches',
        'All Available Player',
      ],
      selectedTag: 'Main',
      selectedChild: null,
      selectedStaff: null,
      loader: false,
      schedule: null,
      isVisibleScheduleScreen: false,
      selectedDate: "",
      Room_id: '',
      Staff: true,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("focus", () => {
      this.getSchedulesByRole();
      this.props.role === 'facility' ?
        this.props.getRoom().then(data => {
          if (data.data.length > 0) {
            this.props.getRoomStaffList(data.data[0].id)
              .then(() => this.setState({ Staff: false }))
              .catch(() => this.setState({ Staff: false }))
            this.setState({ Room_id: data.data[0].id })
          } else {
            this.setState({ Staff: false })
          }
        }).catch(() => this.setState({ Staff: false }))
        : null
    })
  }


  getStaffList = Room_id => {
    this.setState({ Staff: true })
    this.props.getRoomStaffList(Room_id).then(data => {
      this.setState({ Staff: false })
    }).catch(() => {
      this.setState({ Staff: false })
    })
  }


  getSchedulesByRole = () => {
    let date = new Date();
    this.setState({ loader: true }, () => {
      this.props
        .getSchedulesByRole()
        .then(() => {
          this.setState({ loader: false });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  renderOptions = () => {
    return (
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={this.state.registerAs}
          defaultValue={
            this.props.role == 'team'
              ? this.state.registerAs[2]
              : this.props.role == 'player'
                ? this.state.registerAs[1]
                : this.state.registerAs[0]
          }
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
          buttonTextStyle={styles.dropDownBtnText}
          buttonStyle={styles.btnStyle}
          onSelect={(selectedItem, index) => {
            this.setState({ registeredAs: selectedItem });
          }}
        />
      </View>
    );
  };
  renderStaffOptions = () => {
    // let staff_list = [{ username: 'All Staff' }];
    // if (this.props.user?.staffInfo) {
    //   staff_list = [...staff_list, ...this.props.user?.staffInfo];
    // }
    let Rooms = this.props.getRooms;
    let stafflist = this.props.getStaffList;

    return (
      <View style={{ flexDirection: 'row' }}>
        {Rooms && Rooms.length > 0 ?
          <View style={{ width: '50%' }}>
            <SelectDropdown
              data={Rooms}
              defaultButtonText={"Select Room"}
              defaultValueByIndex={0}
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
                this.setState({ Room_id: selectedItem.id, selectedStaff: null }),
                  this.getStaffList(selectedItem.id)
              }}
            />
          </View> : !this.state.Staff ? <Text style={{ width: '50%', textAlign: 'center' }}>No room found</Text> : null}
        {stafflist && stafflist.length > 0 ?
          <View style={{ width: '50%' }}>
            <SelectDropdown
              data={stafflist}
              defaultButtonText={'Select Staff'}
              dropdownIconPosition="right"
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name;
              }}
              rowTextForSelection={(item, index) => {
                return item.name;
              }}
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownIcon}
                    style={styles.w20}
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnText}
              buttonStyle={styles.btnStyle}
              onSelect={(selectedItem, index) => {

                this.setState({ selectedStaff: selectedItem });

              }}
            />
          </View>
          : this.state.Staff ? <ActivityIndicator style={{ marginHorizontal: Rooms ? "20%" : "50%" }} size={'small'} color={Colors.GREEN} />
            : <Text style={{ width: '50%', textAlign: 'center' }}>Staffs not found</Text>
        }

      </View>

    );
  };
  renderChildrensOptions = () => {
    let child_list = [{ username: 'All Children' }];
    if (this.props.user?.childInfo) {
      child_list = [...child_list, ...this.props.user?.childInfo];
    }

    return (
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={child_list}
          defaultValue={'All Children'}
          dropdownIconPosition="right"
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem.username;
          }}
          rowTextForSelection={(item, index) => {
            return item.username;
          }}
          renderDropdownIcon={() => {
            return (
              <Image
                resizeMode="contain"
                source={dropdownIcon}
                style={styles.w20}
              />
            );
          }}
          buttonTextStyle={styles.dropDownBtnText}
          buttonStyle={styles.btnStyle}
          onSelect={(selectedItem, index) => {
            if (index === 0) {
              this.setState({ selectedChild: null });
            } else {
              this.setState({ selectedChild: selectedItem });
            }
          }}
        />
      </View>
    );
  };
  toggleIsVisibleScheduleScreen = item => {
    this.setState({
      isVisibleScheduleScreen: !this.state.isVisibleScheduleScreen,
      schedule: item,
    });
  };

  isStaffhasPermissionLeague = () => {
    if (this.props.role === 'staff') {
      const leaguePermission = this.props.user?.permissions?.find(
        x => x.permission_type == 'league',
      )
        ? true
        : false;
      return leaguePermission;
    } else {
      return false;
    }
  };

  render() {
    console.log(this.isStaffhasPermissionLeague());
    let schedule_list = [];
    console.log('selectedStaffselectedStaff=>', this.state.selectedStaff);
    if (this.state.selectedChild) {
      schedule_list = this.props.filterSchedules?.filter(
        x =>
          x.type === 'schedule_list' &&
          x?.child_data?.id === this.state.selectedChild.id,
      );
    }
    if (!this.state.loader && this.props.filterSchedules?.length > 0 && this.state.Room_id) {
      schedule_list = this.props.filterSchedules?.filter(
        x => x?.room_id === this.state.Room_id,
      );
    } else {
      schedule_list = this.props.filterSchedules;
    }
    let schedulelist = [];
    if (this.state.selectedStaff && schedule_list?.length > 0) {
      schedulelist = schedule_list.filter(
        x => x?.room_staff?.some(item => item.id === this.state.selectedStaff.id)
      );
      schedule_list = schedulelist
    }

    // if (this.state.selectedTag == 'Main') {
    //   schedule_list = this.props.filterSchedules;
    // }
    if (this.state.selectedTag == 'Coach') {
      const schedule_list_copy = schedule_list?.filter(
        x =>
          x.type == 'booked_sessions' ||
          x.type == 'sessions' ||
          x.type == 'schedule_list',
      );
      schedule_list = schedule_list_copy;
    } else if (this.state.selectedTag == 'Player') {
      const schedule_list_copy = schedule_list?.filter(
        x => x.type == 'eclasses' || x.type == 'booked_sessions',
      );
      schedule_list = schedule_list_copy;
    } else if (this.state.selectedTag == 'Child') {
      const schedule_list_copy = schedule_list?.filter(
        x => x.type === 'schedule_list',
      );
      schedule_list = schedule_list_copy;
    } else if (this.state.selectedTag == 'Event') {
      const schedule_list_copy = schedule_list?.filter(
        x => x.schedule_type_id == 2,
      );
      schedule_list = schedule_list_copy;
    }

    const activeDates = schedule_list?.map(x => {
      let date = new Date();
      if (x.type == 'sessions' || x.type == 'eclasses') {
        date = x.date;
      }
      if (x.type == 'booked_sessions' || x.type == 'schedule_list') {
        date = x.booking_date;
      }
      if (x.type == 'in_leagues') {
        date = x.start_date;
      }
      x.actual_date = date;
      return {
        date: new Date(date),
        color: 'green',
        key: 'fitness',
      };
    });
    const { selectedTag } = this.state;
    const { role } = this.props;

    // console.warn('dsada', this.props.user);

    return (
      <>
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            title={'Calendar'}
            isShowLeftIcon={true}
          />
          <View>
            {role !== 'staff' ? (
              <View style={styles.meshContainer}>
                <Tag
                  onPress={() => this.props.navigation.navigate('MeshCalendar')}
                  text={'Mesh'}
                  containerStyle={styles.meshTagContainer}
                  textStyle={styles.meshText}
                />
              </View>
            ) : null}
            {/* <FlatList
              showsHorizontalScrollIndicator={false}
              data={
                this.props.role == 'player'
                  ? []
                  : this.props.role == 'parent'
                    // ? ['Child', 'Coach', 'Main']
                    ? []
                    : this.props.role == 'coach'
                      ? []
                      : this.props.role == 'team'
                        ? []
                        : []
                // : ['Event', 'Coach', 'League', 'Main']
              }
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
              }}
              horizontal
              renderItem={({ item, index }) => {
                return (
                  <Tag
                    text={item}
                    isActive={selectedTag === item}
                    containerStyle={styles.mh5}
                    onPress={() => this.setState({ selectedTag: item })}
                  />
                );
              }}
            /> */}
            {role === 'facility' ? this.renderStaffOptions() : null}
            {role === 'parent' ? this.renderChildrensOptions() : null}
          </View>

          <Calendar
            //  periods={periods}
            onDayPress={(date) => {
              this.setState({ loader: true, selectedDate: date.dateString })
              this.props.getSchedulesByRole({
                date: `${date.year}-${date.month}-${date.day}`,
                filter: 'daily'
              }).then(() => {
                this.setState({ loader: false });
              }).catch(() => {
                this.setState({ loader: false });
              });
            }}
            activeDates={activeDates}
            additionalDate={{
              [this.state.selectedDate]: {
                selected: true, selectedColor: 'skyblue'
              }
            }}
            dotColor={this.props.user?.color_code == null ? Colors.GREEN : this.props.user?.color_code}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.loader}
                onRefresh={() => {
                  this.getSchedulesByRole();
                  this.setState({ selectedDate: '' })
                }}
              />
            }>

            <View
              style={{
                alignSelf: 'flex-end',
                marginTop: 20,
                // backgroundColor: 'blue',
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ScheduleList')}>
                <Text>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={schedule_list}
                style={styles.eventsListContainer}
                renderItem={({ item, index }) => {
                  let user_name = '';
                  let schedule_type_name = '';
                  let time = '';
                  let image = null;
                  let badge = '';
                  console.log('item?.schedule_type=>', item?.user?.id);
                  if (item?.schedule_type) {
                    schedule_type_name = item?.schedule_type?.title;
                  }
                  if (item?.image) {
                    image = { uri: img_url + item.image };
                  }
                  let date = new Date();
                  if (item.type == 'sessions') {
                    // badge = 'C';
                    badge = item?.user?.role.charAt(0);
                    user_name = this.props.user?.username;
                    time = `${moment(item.start_time, 'h:mm a').format(
                      'h:mm a',
                    )} - ${moment(item.end_time, 'h:mm a').format('h:mm a')}`;
                    date = item.date;
                  }
                  if (
                    item.type == 'booked_sessions' ||
                    item.type == 'schedule_list' ||
                    item?.type == 'team_schedules'
                  ) {
                    console.log('item?.user?.username=>', item?.user?.username);
                    // badge = 'P';
                    badge = item?.user?.role.charAt(0);
                    user_name = item?.user?.username;
                    time = `${moment(item.start_time, 'h:mm a').format(
                      'h:mm a',
                    )} - ${moment(item.end_time, 'h:mm a').format('h:mm a')}`;
                    date = item.booking_date;
                  }
                  if (item.type == 'in_leagues') {
                    // badge = 'L';
                    badge = item?.user?.role.charAt(0);
                    user_name = item?.user?.username;
                    time = `${moment(item.start_time, 'h:mm a').format(
                      'h:mm a',
                    )}`;
                    schedule_type_name = 'League';
                    date = item?.start_date;
                  }
                  if (item.type == 'eclasses') {
                    // badge = 'C';
                    badge = item?.user?.role.charAt(0);
                    schedule_type_name = 'E Class';
                    user_name = item?.user?.username;
                    time = `${moment(item.time, 'h:mm a').format('h:mm a')}`;
                    date = item.date;
                  }
                  console.log('ITEM>DATE=>', item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleIsVisibleScheduleScreen(item);
                      }}
                      style={styles.eventContainer}>
                      <Image
                        source={image ? image : dummy}
                        style={styles.avatarImage}
                        resizeMode={'contain'}
                      />
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{badge}</Text>
                      </View>
                      <View style={[styles.ph15, { flex: 1 }]}>
                        <Text style={styles.name}>{user_name}</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            flex: 1,
                          }}>
                          <Text style={styles.eventCategory}>
                            {schedule_type_name}
                          </Text>
                          <Text style={styles.eventCategory}>
                            {moment(date).format('MM/DD/YYYY')}
                          </Text>
                        </View>
                        <Text style={styles.eventTime}>{time}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </ScrollView>

          {/* Fab Button */}
          {(this.props.role === 'facility' ||
            this.props.role === 'staff' ||
            this.isStaffhasPermissionLeague()) &&
            (selectedTag == 'Event' || selectedTag == 'League') ? (
            <TouchableOpacity
              onPress={() => {
                if (
                  (this.props.role === 'staff' &&
                    !this.props.user.facilityMembership &&
                    !this.props.user.membership) ||
                  (this.props.role === 'facility' && !this.props.user.membership)
                ) {
                  this.props.navigation.navigate('MemberShip');
                } else {
                  this.props.navigation.navigate(
                    selectedTag == 'Event' ? 'AddScheduler' : 'CreateLeague',
                  );
                }
              }}
              activeOpacity={0.7}
              style={styles.fabBtn}>
              <Entypo name="plus" size={28} color={Colors.WHITE} />
            </TouchableOpacity>
          ) : null}

          {/* Fab Button && selectedTag == 'Coach' */}
          {this.props.role === 'coach' || this.props.role === 'team' ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AddScheduler')}
              activeOpacity={0.7}
              style={styles.fabBtn}>
              <Entypo name="plus" size={28} color={Colors.WHITE} />
            </TouchableOpacity>
          ) : null}

        </View>
        {this.state.isVisibleScheduleScreen && (
          <View style={{ width: '100%', height: 440 }}>
            <ScheduleDetail
              schedule={this.state.schedule}
              visible={this.state.isVisibleScheduleScreen}
              toggleIsVisibleScheduleScreen={this.toggleIsVisibleScheduleScreen}
            />
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    getRooms: state.RoomReducer.Rooms,
    getStaffList: state.RoomReducer.RoomStaffList,
    filterSchedules: state.ScheduleReducer.filterSchedules,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getSchedulesByRole: payload =>
      dispatch(ScheduleMiddleware.getSchedulesByRole(payload)),
    getRoom: () => dispatch(RoomMiddleware.GetAllRooms()),
    getRoomStaffList: payload => dispatch(RoomMiddleware.getRoomStaffs(payload)),
    resetSchedule: () => dispatch(ScheduleAction.resetGetFilterScheduleList()),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(Schedule);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  eventsListContainer: {
    marginTop: 20,
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    elevation: 4,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  name: {
    flex: 1,
    fontSize: 19,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  badgeContainer: {
    backgroundColor: Colors.GREEN,
    position: 'absolute',
    top: 7,
    height: 25,
    width: 25,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  mh5: {
    marginHorizontal: 5,
  },
  ph15: {
    paddingHorizontal: 15,
  },
  eventCategory: {
    fontWeight: '500',
    color: Colors.GRAY_6,
  },
  eventTime: {
    color: Colors.GRAY_6,
    fontSize: 13,
  },
  meshContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  meshTagContainer: {
    width: 150,
    backgroundColor: Colors.BLUE,
  },
  meshText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    color: Colors.GRAY_1,
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_3,
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  btnStyle: {
    height: 30,
    backgroundColor: Colors.BLUE_LIGHT,
    alignSelf: 'center',
    width: '95%',
    marginTop: 5,
  },
  w20: { width: 15 },
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
