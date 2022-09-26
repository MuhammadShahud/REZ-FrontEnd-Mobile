import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { ScheduleDetail } from '..';
import { dummy, dropdownIcon } from '../../../Assets';
import { Text, Header, Tag, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import BookingMidleware from '../../../Store/Middleware/BookingMiddleware';
import SelectDropdown from 'react-native-select-dropdown';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import moment from 'moment';
import { img_url } from '../../../Store/Apis';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware';
import ScheduleAction from '../../../Store/Actions/ScheduleAction'
import DatePicker from 'react-native-date-picker';
import Timetable from "react-native-calendar-timetable";
import { Calendar } from 'react-native-big-calendar'

class ScheduleList extends Component {
  timeout = React.createRef(null)
  state = {
    isVisibleScheduleScreen: false,
    filter: '',
    date: new Date(),
    currentDate: new Date(),
    isShowDateModal: false,
    schedule: null,
    Room: '',
    Room_id: '',
    isStaff: true,
    selectedStaff: false,
    loader: false,
  };

  componentDidMount() {
    this.getSchedulesByRole();
    this.props.role === 'facility' ?
      this.props.getRoom().then(data => {
        if (data.data.length > 0) {
          this.setState({ Room_id: data.data[0].id })
          this.getStaffList(data.data[0].id)
          this.setState({ Room_id: data.data[0].id })
        } else {
          this.setState({ isStaff: false })
        }
      }).catch() : null
  }

  getStaffList = Room_id => {
    this.setState({ isStaff: true })
    this.props.getRoomStaffList(Room_id).then(data => {
      this.setState({ isStaff: false })
    }).catch(() => {
      this.setState({ isStaff: false })
    })
  }
  getSchedulesByRole = () => {
    console.warn(this.state.filter);
    let date = this.state.date;
    this.setState({ loader: true })
    console.warn( `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
    this.props.getSchedulesByRole({
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      filter:
        this.state.filter === 'Daily Hour'
          ? 'daily'
          : this.state.filter.toLowerCase(),
    }).then(() => { this.setState({ loader: false, currentDate: date }) });

  };

  onChangeFilter = filter => {
    this.setState({ filter }, () => this.getSchedulesByRole());
  };

  toggleIsVisibleScheduleScreen = item => {
    this.setState({
      isVisibleScheduleScreen: !this.state.isVisibleScheduleScreen,
      schedule: item,
    });
  };
  renderScheduleList = () => {
    const { filterSchedules } = this.props;
    return filterSchedules !== null ? (
      <FlatList
        showsVerticalScrollIndicator={false}
        style={[styles.scheduleListContainer]}
        data={filterSchedules}
        ListEmptyComponent={
          <View style={styles.emptyEventContainer}>
            <Text style={styles.noSchedual}>No Schedule</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          let user_name = '';
          let schedule_type_name = '';
          let time = '';
          let image = null;
          let title = '';
          // console.warn(item);
          if (item?.schedule_type) {
            schedule_type_name = item?.schedule_type?.title;
          }
          if (item?.image) {
            image = { uri: img_url + item.image };
          }
          if (item?.title) {
            title = item?.title;
          }
          let date = new Date();

          if (item?.type == 'sessions') {
            user_name = this.props.user?.username;
            time = `${moment(item?.start_time, 'h:mm a').format(
              'h:mm a',
            )} - ${moment(item?.end_time, 'h:mm a').format('h:mm a')}`;
            date = item.date;
          }
          if (
            item?.type == 'booked_sessions' ||
            item?.type == 'schedule_list' ||
            item?.type == 'team_schedules'
          ) {
            user_name = item?.user?.username;
            time = `${moment(item?.start_time, 'h:mm a').format(
              'h:mm a',
            )} - ${moment(item?.end_time, 'h:mm a').format('h:mm a')}`;
            date = item.booking_date;
          }
          if (item?.type == 'in_leagues') {
            user_name = item?.user?.username;
            time = `${moment(item?.start_time, 'h:mm a').format('h:mm a')}`;
            schedule_type_name = 'League';
            date = item?.start_date;
            title = item?.league_name;
          }
          if (item?.type == 'eclasses') {
            schedule_type_name = 'E Class';
            user_name = item?.user?.username;
            time = `${moment(item.time, 'h:mm a').format('h:mm a')}`;
            title = item?.session_name;
          }

          // return;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                this.toggleIsVisibleScheduleScreen(item);
              }}
              style={styles.eventContainer}>
              <View style={styles.eventDateContainer}>
                <Text style={styles.eventDateText}>
                  {moment(date).format('DD')}
                </Text>
                <Text style={styles.eventDayText}>
                  {moment(date).format('MMM')}
                </Text>
              </View>

              <View style={styles.eventDetailContainer}>
                <Image
                  source={image ? image : dummy}
                  style={styles.eventImage}
                />
                <View>
                  <Text style={styles.eventTime}>{time}</Text>
                  <Text style={styles.eventCategory}>{schedule_type_name}</Text>
                  <Text style={styles.eventShortDescription}>{title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    ) : (
      <View style={styles.emptyEventContainer}>
        <ActivityIndicator size={'large'} color={Colors.GREEN} />
      </View>
    );
  };
  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.date ? this.state.date : new Date()}
        // minimumDate={new Date()}
        onConfirm={date => {
          this.setState({ isShowDateModal: false, date: date }, () =>
            this.getSchedulesByRole(),
          );
        }}
        onCancel={() => {
          this.setState({ isShowDateModal: false });
        }}
      />
    );
  };

  OnPressEvent = (item) => {
    let user_name = '';
    let schedule_type_name = '';
    let time = '';
    let image = null;
    let title = '';
    // console.warn(item);
    if (item?.schedule_type) {
      schedule_type_name = item?.schedule_type?.title;
    }
    if (item?.image) {
      image = { uri: img_url + item.image };
    }
    if (item?.title) {
      title = item?.title;
    }
    let date = new Date();

    if (item?.type == 'sessions') {
      user_name = this.props.user?.username;
      time = `${moment(item?.start_time, 'h:mm a').format(
        'h:mm a',
      )} - ${moment(item?.end_time, 'h:mm a').format('h:mm a')}`;
      date = item.date;
    }
    if (
      item?.type == 'booked_sessions' ||
      item?.type == 'schedule_list'
    ) {
      user_name = item?.user?.username;
      time = `${moment(item?.start_time, 'h:mm a').format(
        'h:mm a',
      )} - ${moment(item?.end_time, 'h:mm a').format('h:mm a')}`;
      date = item.booking_date;
    }
    if (item?.type == 'in_leagues') {
      user_name = item?.user?.username;
      time = `${moment(item?.start_time, 'h:mm a').format('h:mm a')}`;
      schedule_type_name = 'League';
      date = item?.start_date;
      title = item?.league_name;
    }
    if (item?.type == 'eclasses') {
      schedule_type_name = 'E Class';
      user_name = item?.user?.username;
      time = `${moment(item.time, 'h:mm a').format('h:mm a')}`;
      title = item?.session_name;
    }
    this.toggleIsVisibleScheduleScreen(item);
  }

  onChangeDate = (date) => {
    let dates = new Date(date);
    this.setState({ date: dates }),
      clearTimeout(this.timeout.current)
    this.timeout.current = setTimeout(() => {
      this.getSchedulesByRole()
    }, 0);
  }


  render() {
    const { filter, currentDate } = this.state;
    let year = currentDate.getFullYear();
    let day = currentDate.getDate();
    let month = currentDate.getMonth();

    let schedule_list = [];
    if (!this.state.loader && this.props.filterSchedules?.length > 0 && this.state.Room_id) {
      schedule_list = this.props.filterSchedules?.filter(
        x => x?.room_id == this.state.Room_id,
      );
    }
    let schedulelist = [];
    if (this.state.selectedStaff && schedule_list?.length > 0) {
      schedulelist = schedule_list?.filter(
        x => x?.room_staff?.some(item => item.id == this.state.selectedStaff.id)
      );
      schedule_list = schedulelist
    }

    let sessions = schedule_list?.filter(
      x => x?.type.toLowerCase() == 'sessions'
    )
    schedule_list = sessions;

    const eventsData = schedule_list?.map((data) => {
      let hour = parseInt(data?.start_time?.slice(0, 2));
      let endhour = parseInt(data?.end_time?.slice(0, 2));
      return {
        ...data,
        title: data?.league_name || data.title,
        allDay: false,
        start: new Date(year, month, day, hour, 0),
        end: data?.end_time
          ? new Date(year, month, day, endhour, 0)
          : new Date(year, month, day, hour, 0),
      }
    });

    schedule_list = eventsData




    let Rooms = this.props.getRooms;
    let stafflist = this.props.getStaffList;

    return (<>
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          title={'Schedule'}
          isShowLeftIcon={true}
        />
        <View style={styles.tagsContainer}>
          <Tag
            text={'Daily'}
            isActive={filter === 'Daily'}
            onPress={() => this.onChangeFilter('Daily')}
          />
          <Tag
            text={'Weekly'}
            isActive={filter === 'Weekly'}
            onPress={() => this.onChangeFilter('Weekly')}
          />
          <Tag
            isActive={filter === 'Monthly'}
            onPress={() => this.onChangeFilter('Monthly')}
            text={'Monthly'}
          />
          {this.props.role === 'facility' ?
            <Tag
              isActive={filter === 'Daily Hour'}
              onPress={() => this.onChangeFilter('Daily Hour')}
              text={'Hourly'}
            />
            : null}

        </View>
        {filter != 'Daily Hour' ? <>
          <View style={{ width: '100%', marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => this.setState({ isShowDateModal: true })}
              style={styles.dateContainer}>
              <Text style={{ color: Colors.GRAY_1 }}>
                {this.state.date
                  ? moment(this.state.date).format('LL')
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>

          {this.renderScheduleList()}
        </>
          : <>
            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              {Rooms && Rooms.length > 0 ?
                <View style={{ width: '50%' }}>
                  <SelectDropdown
                    data={Rooms}
                    dropdownIconPosition="right"
                    defaultValueByIndex={0}
                    renderDropdownIcon={() => {
                      return (
                        <Image
                          resizeMode="contain"
                          source={dropdownIcon}
                          style={{ width: 15 }}
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
                </View> : !this.state.isStaff ? <Text style={{ width: '50%', textAlign: 'center' }}>No room found</Text> : null}

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
                          style={{ width: 15 }}
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

                : this.state.isStaff ?
                  <ActivityIndicator style={{ marginHorizontal: Rooms ? "20%" : "50%" }} size={'small'} color={Colors.GREEN} />
                  : <Text style={{ width: '50%', textAlign: 'center' }}>Staffs not found</Text>}


            </View>
            {schedule_list ?
              <ScrollView showsVerticalScrollIndicator={false}>

                <Calendar
                  headerContainerStyle={{ height: 70 }}
                  swipeEnabled={false}
                  onPressEvent={(event) => this.OnPressEvent(event)}
                  hideNowIndicator={true}
                  events={schedule_list}
                  mode={'week'}
                  ampm={true}
                  activeDate={this.state.currentDate}
                  height={600}
                  onPressDateHeader={(date) => this.onChangeDate(date)}
                  date={this.state.currentDate}
                />

                {/* <Timetable
                  startProperty={'startDate'}
                  endProperty={'endDate'}
                  enableSnapping={true}
                  // width={windowWidth}
                  hideNowLine={true}
                  items={schedule_list}
                  cardComponent={this.MyItemCard}
                  date={date} // optional
                  range={range} // optional    
                  fromHour={0}
                  toHour={12}
                /> */}
              </ScrollView>
              :
              <ActivityIndicator size={'large'} color={Colors.GREEN} />
            }
          </>

        }

        {/* Fab Button */}
        {this.props.role !== 'player' &&
          this.props.role !== 'coach' &&
          this.props.role !== 'team' &&
          this.props.role !== 'parent' ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AddScheduler')}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
        ) : null}
        {this.renderDateModal()}
      </View>
      <ScheduleDetail
        schedule={this.state.schedule}
        visible={this.state.isVisibleScheduleScreen}
        toggleIsVisibleScheduleScreen={this.toggleIsVisibleScheduleScreen}
      />
      {filter === 'Daily Hour' ?
        <Loader loader={this.state.loader} />
        : null}

    </>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterSchedules: state.ScheduleReducer.filterSchedules,
    role: state.Auth.role,
    getRooms: state.RoomReducer.Rooms,
    getStaffList: state.RoomReducer.RoomStaffList,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getFilterScheduleLis: payload =>
      dispatch(ScheduleMiddleware.getFilterScheduleLis(payload)),
    getSchedulesByRole: payload =>
      dispatch(ScheduleMiddleware.getSchedulesByRole(payload)),
    getRoom: () => dispatch(RoomMiddleware.GetAllRooms()),
    getRoomStaffList: payload => dispatch(RoomMiddleware.getRoomStaffs(payload)),
    resetSchedule: () => dispatch(ScheduleAction.resetGetFilterScheduleList()),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(ScheduleList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  monthChip: {
    backgroundColor: Colors.GREEN,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    width: 80,
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 10,
  },
  monthChipText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 12,
  },
  eventContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  eventDateContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  eventDateText: {
    color: Colors.GREEN,
    fontSize: 20,
    fontWeight: '800',
  },
  eventDayText: {
    color: Colors.GRAY_1,
    fontSize: 12,
  },
  eventDetailContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
  eventImage: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    borderRadius: 60,
  },
  eventTime: {
    color: Colors.GRAY_5,
    fontWeight: '800',
    fontSize: 16,
  },
  eventCategory: {
    color: Colors.GRAY_6,
    fontSize: 13,
    fontWeight: '700',
  },
  eventShortDescription: {
    color: Colors.GRAY_6,
    fontSize: 12,
  },
  scheduleListContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  emptyEventContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSchedual: {
    fontSize: 16,
    color: Colors.GRAY_6,
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
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownBtnText: {
    textAlign: 'left',
    color: Colors.GRAY_3,
    fontSize: 14,
    // fontWeight: 'bold',
    // textAlign: 'center',
  },
  btnStyle: {
    height: 30,
    backgroundColor: Colors.BLUE_LIGHT,
    alignSelf: 'center',
    width: '95%',
    marginTop: 5,
  },
});
