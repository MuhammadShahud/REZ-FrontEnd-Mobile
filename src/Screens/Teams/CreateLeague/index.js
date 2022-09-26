import React, { Component } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  calendar_gray,
  check_blue,
  close,
  dropdownGreyIcon,
  dropdownIcon,
  upload,
} from '../../../Assets';
import { Button, Header, Loader, Text, TextInput } from '../../../Components';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SelectDropdown from 'react-native-select-dropdown';
import BottomSheet from 'reanimated-bottom-sheet';
import { Colors } from '../../../Styles';
import { connect } from 'react-redux';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import { InviteFriends } from '../../Schedule';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

export class CreateLeague extends Component {
  constructor(props) {
    super(props);
    let item = this.props.route.params?.item;

    let date = item?.start_date;

    this.state = {
      leagueName: item?.league_name ? item?.league_name : '',
      leagueDescription: item?.league_description
        ? item?.league_description
        : '',
      leagueLocation: item?.venue_address ? item?.venue_address : '',
      leaguePrice: item?.price ? item?.price : '',
      numOfTeams: '',
      type: '',
      pickerType: '',
      selectedUsersIDs: [],
      teamUser: null,
      TeamBtn: undefined,
      startDate: item?.start_date ? new Date(item?.start_date) : undefined,
      endDate: item?.start_date ? new Date(item?.end_date) : undefined,
      leagueTime: item?.start_time
        ? new Date(item?.start_date + 'T' + item?.start_time + 'Z')
        : undefined,
      loading: false,
      isDatePickerVisible: false,
      isTeamModalVisible: false,
      registerAs: ['Lessons', 'Clinic', 'Training', 'Event'],
    };
  }

  async componentDidMount() {
    await this.props.getUsersByType({ role: 'team' }).then(data => {
      let item = this.props.route.params?.item;

      if (data && item) {
        let selectTeamUsers = [];

        selectTeamUsers[0] = this.props.usersByType.find(
          teamUser => teamUser?.id === item?.team1_id,
        );

        selectTeamUsers[1] = this.props.usersByType.find(
          teamUser => teamUser?.id === item?.team2_id,
        );

        this.setState({ selectedUsersIDs: selectTeamUsers });
      }
    });

    // this.sheetRef.snapTo(1);
  }

  renderContent = () => {
    let item = this.props.route.params?.item;
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.sheetRef.snapTo(1);
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
          <Text style={styles.sheetHeading}>{item ? "Your League has been updated" : "Your League has been added"}</Text>
          <Text style={styles.subHeading}>Successfully !!!</Text>
        </View>
      </View>
    );
  };

  updateLeague = () => {
    let item = this.props.route.params?.item;

    let {
      leagueName,
      leagueDescription,
      leaguePrice,
      leagueTime,
      startDate,
      endDate,
      leagueLocation,
    } = this.state;

    console.warn(this.state.leagueTime);
    // console.warn(leagueTime.toTimeString().slice(0, 8));

    this.setState({ loading: true });

    this.props
      .updateUserLeague({
        leagueId: item?.content_id,
        leagueName,
        leagueDescription,
        leaguePrice,
        leagueTime: leagueTime.toTimeString().slice(0, 8),
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        leagueLocation,
        // teamOneId: this.state.selectedUsersIDs[0].id,
        // teamTwoId: this.state.selectedUsersIDs[1].id,
      })
      .then(data => {
        if (data) {
          this.setState({
            loading: false,
          });
          this.sheetRef.snapTo(0);
        }
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
      });
  };

  onPressCreateLeague = () => {
    let {
      leagueName,
      leagueDescription,
      leaguePrice,
      leagueTime,
      startDate,
      endDate,
      leagueLocation,
    } = this.state;
    if (
      leagueName &&
      leagueDescription &&
      leaguePrice &&
      leagueTime &&
      startDate &&
      endDate &&
      leagueLocation
    ) {
      this.setState({ loading: true });
      this.props
        .createLeague({
          leagueName,
          leagueDescription,
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
          leaguePrice,
          leagueLocation,
          leagueTime: leagueTime.toTimeString().slice(0, 8),
          // teamOneId: this.state.selectedUsersIDs[0].id,
          // teamTwoId: this.state.selectedUsersIDs[1].id,
        })
        .then(data => {
          if (data) {
            this.setState({
              loading: false,
              leagueName: '',
              leagueDescription: '',
              leaguePrice: '',
              leagueTime: undefined,
              startDate: undefined,
              endDate: undefined,
              numOfTeams: '',
              leagueLocation: '',
            });
            this.sheetRef.snapTo(0);
          }
        })
        .catch(err => {
          this.setState({ loading: false });
        });
    } else {
      alert('All fields are required!');
    }

    // this.sheetRef.snapTo(0);
    // setTimeout(() => {
    //   this.props.navigation.navigate('LeagueDetails');
    // }, 2000);
  };

  selectLeagueDates = value => {
    let { type, pickerType } = this.state;

    // console.warn('vall==', value);

    if (type == 'startDate' && pickerType == 'date') {
      this.setState({
        startDate: value,
        isDatePickerVisible: false,
      });
    } else if (type == 'endDate' && pickerType == 'date') {
      this.setState({
        endDate: value,
        isDatePickerVisible: false,
      });
    } else {
      this.setState({
        leagueTime: value,
        isDatePickerVisible: false,
      });
    }
  };

  onPressUser = item => {
    let { TeamBtn } = this.state;
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;

    if (TeamBtn == 1) {
      selectedUsersIDsCopy[0] = item;
      this.setState({
        selectedUsersIDs: selectedUsersIDsCopy,
        isTeamModalVisible: false,
      });
    } else if (TeamBtn == 2) {
      selectedUsersIDsCopy[1] = item;
      this.setState({
        selectedUsersIDs: selectedUsersIDsCopy,
        isTeamModalVisible: false,
      });
    } else {
      let { teamUser } = this.state;

      let teamUserIndex = selectedUsersIDsCopy.findIndex(
        user => user.id === teamUser.id,
      );

      selectedUsersIDsCopy.splice(teamUserIndex, 1, item);
      this.setState({
        selectedUsersIDs: selectedUsersIDsCopy,
        isTeamModalVisible: false,
      });
    }
  };

  removeUserFromSelectedUserIds = item => {
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
    selectedUsersIDsCopy.splice(foundIndex, 1);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
  };

  renderTeamsModal = () => {
    return (
      <Modal
        visible={this.state.isTeamModalVisible}
        style={{}}
        animationType={'slide'}>
        <InviteFriends
          title={'Teams'}
          role="team"
          onPressSaveInvites={this.onPressSaveInvites}
          selectedUsersIDs={this.state.selectedUsersIDs}
          onPressUser={this.onPressUser}
          removeUserFromSelectedUserIds={this.removeUserFromSelectedUserIds}
          navigation={this.props.navigation}
          onPressBack={() => this.setState({ isTeamModalVisible: false })}
        />
      </Modal>
    );
  };

  render() {
    let { startDate, endDate, leagueTime } = this.state;
    let item = this.props.route.params?.item;

    let leagueNameindex = this.state.registerAs.findIndex(
      val => val === item?.league_name,
    );

    let teamOneIndex = this.props.usersByType.findIndex(
      teamUser => teamUser.id === item?.team1_id,
    );
    let teamTwoIndex = this.props.usersByType.findIndex(
      teamUser => teamUser.id === item?.team2_id,
    );

    let leagueStartTime = new Date(
      item?.start_date + 'T' + item?.start_time + 'Z',
    );

    let date = startDate ? new Date(startDate) : new Date();

    let maxDate = new Date(startDate) - new Date(endDate);

    console.warn(this.state.leagueTime);

    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <View style={{ paddingHorizontal: 24 }}>
          <Header
            navigation={this.props.navigation}
            title={'Leagues'}
            isShowLeftIcon={true}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}>
          <View style={{ marginVertical: 15 }}>
            <Text style={{ fontSize: 20 }}>Create League</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>League Name</Text>
            <TextInput
              value={this.state.leagueName}
              placeholder={'League Name'}
              onChangeText={text =>
                this.setState({ leagueName: text })}

            />
            {/* <SelectDropdown
              data={this.state.registerAs}
              defaultValue={
                item?.league_name
                  ? this.state.registerAs[leagueNameindex]
                  : this.state.registerAs[0]
              }
              dropdownIconPosition="right"
              renderDropdownIcon={() => {
                return (
                  <Image
                    resizeMode="contain"
                    source={dropdownGreyIcon}
                    style={{width: 20}}
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnText}
              buttonStyle={styles.btnStyle}
              onSelect={(selectedItem, index) => {
                this.setState({leagueName: selectedItem});
              }}
            /> */}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              value={this.state.leagueDescription}
              multiline={true}
              placeholder={'Description here'}
              onChangeText={text => this.setState({ leagueDescription: text })}
              style={styles.inputDescription}
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select Teams</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isTeamModalVisible: true,
                    TeamBtn: 1,
                    teamUser: this.state.selectedUsersIDs[0],
                  })
                }
                style={styles.leagueDateBtn}>
                <Text>
                  {this.state.selectedUsersIDs[0]?.username
                    ? this.state.selectedUsersIDs[0]?.username
                    : item?.team1_id
                    ? this.props.usersByType[teamOneIndex]?.username
                    : 'Name of Team'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isTeamModalVisible: true,
                    TeamBtn: 2,
                    teamUser: this.state.selectedUsersIDs[1],
                  })
                }
                style={styles.leagueDateBtn}>
                <Text>
                  {this.state.selectedUsersIDs[1]?.username
                    ? this.state.selectedUsersIDs[1]?.username
                    : item?.team1_id
                    ? this.props.usersByType[teamTwoIndex]?.username
                    : 'Name Of Team'}
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isDatePickerVisible: true,
                    pickerType: 'date',
                    type: 'startDate',
                  })
                }
                style={styles.leagueDateBtn}>
                <Text>
                  {startDate == undefined
                    ? 'Start Date'
                    : moment(startDate).format('MMM DD YYYY')}
                </Text>

                <Image source={calendar_gray} style={{ width: 17, height: 22 }} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isDatePickerVisible: true,
                    pickerType: 'date',
                    type: 'endDate',
                  })
                }
                style={styles.leagueDateBtn}>
                <Text>
                  {endDate == undefined
                    ? 'End Date'
                    : moment(endDate).format('MMM DD YYYY')}
                </Text>

                <Image source={calendar_gray} style={{ width: 17, height: 22 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Time</Text>

            <TouchableOpacity
              style={{
                width: '100%',
                paddingVertical: 12,
                paddingHorizontal: 6,
                borderWidth: 1,
                borderColor: Colors.GRAY_6,
                borderRadius: 8,
              }}
              onPress={() =>
                this.setState({ isDatePickerVisible: true, pickerType: 'time' })
              }>
              <Text>
                {leagueTime == undefined
                  ? 'Select Time'
                  : moment(leagueTime).format('LT')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput placeholder={'Enter Training Cost'} />
          </View> */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              value={this.state.leagueLocation}
              placeholder={'Enter Location'}
              onChangeText={text => this.setState({ leagueLocation: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              value={this.state.leaguePrice}
              keyboardType="numeric"
              placeholder={'Enter Price'}
              onChangeText={text => this.setState({ leaguePrice: text })}
            />
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Number of Teams</Text>
            <TextInput
              keyboardType="numeric"
              placeholder={'Enter Number of Teams'}
              onChangeText={text => this.setState({numOfTeams: text})}
            />
          </View> */}

          <Button
            onPress={item ? this.updateLeague : this.onPressCreateLeague}
            btnStyle={styles.mv20}
            name={item ? 'Update League' : 'Create League'}
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

        <DatePicker
          modal
          open={this.state.isDatePickerVisible}
          mode={this.state.pickerType == 'date' ? 'date' : 'time'}
          date={new Date()}
          minimumDate={date}
          is24hourSource={'device'}
          onConfirm={this.selectLeagueDates}
          onCancel={() => this.setState({ isDatePickerVisible: false })}
        />

        {this.renderTeamsModal()}
        <Loader loader={this.state.loading} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  usersByType: state.UserReducer.usersByType,
});

const mapDispatchToProps = dispatch => ({
  createLeague: payload => dispatch(UserMiddleware.createLeague(payload)),
  getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
  updateUserLeague: payload => dispatch(UserMiddleware.updateLeague(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateLeague);

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
    backgroundColor: Colors.GRAY_4,
    width: '100%',
    marginTop: 5,
    borderRadius: 10,
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
  leagueDateBtn: {
    width: '49%',
    borderWidth: 1,
    borderColor: Colors.GRAY_6,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
