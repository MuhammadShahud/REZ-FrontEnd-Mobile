import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Header, Button, Text, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';
import {
  team,
  footballBg,
  calendar,
  clock,
  map_marker,
  price,
  check_blue,
  close,
} from '../../../Assets/index';
import { connect } from 'react-redux';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import { InviteFriends } from '../../';
import { dummyImage } from '../../../Config';
import { img_url } from '../../../Store/Apis';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isTeamModalVisible: false,
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      leagueDetail: undefined,
      selectedUsersIDs: [],
      teamsIds: [],
    };
  }

  async componentDidMount() {
    let { item } = this.props.route.params;

    this.props.leagueDetail({ id: item.content_id }).then(data => {
      if (data) {
        this.setState({
          leagueDetail: data.data,
          loading: false,
          startDate: data.data.start_date,
          endDate: data.data.start_date,
          startTime: data.data.start_time,
        });
      } else {
        this.setState({ loading: false });
      }
    });

    await this.props.getUsersByType({ role: 'team' }).then(data => { });
  }

  onPressUser = item => {
    let { teamsIds } = this.state;
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    selectedUsersIDsCopy.push(item);
    teamsIds.push(item.teamsid);

    this.setState({ selectedUsersIDs: selectedUsersIDsCopy, teamsIds });
  };

  removeUserFromSelectedUserIds = item => {
    let { teamsIds } = this.state;
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
    selectedUsersIDsCopy.splice(foundIndex, 1);
    teamsIds.splice(foundIndex, 1);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy, teamsIds });
  };

  inviteTeams = () => {
    let { teamsIds, leagueDetail } = this.state;
    let {
      inviteTeamsInLeague,
      user: {
        roleInfo: { id },
      },
    } = this.props;

    this.setState({ isTeamModalVisible: false, loading: true });

    inviteTeamsInLeague({
      leagueId: leagueDetail.id,
      coachId: id,
      teamsIds,
    }).then(data => {
      if (data) {
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
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
          type={'league'}
          onPressSaveInvites={this.inviteTeams}
          selectedUsersIDs={this.state.selectedUsersIDs}
          onPressUser={this.onPressUser}
          removeUserFromSelectedUserIds={this.removeUserFromSelectedUserIds}
          navigation={this.props.navigation}
          onPressBack={() => this.setState({ isTeamModalVisible: false })}
        />
      </Modal>
    );
  };

  renderContent = () => {
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.sheetRef.snapTo(1);
          }}>
          <Image
            source={close}
            style={styles.closeImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={styles.sheetBody}>
          <Button
            height={50}
            name={'Invite Team'}
            textStyle={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.WHITE,
            }}
            btnStyle={{ marginVertical: 5 }}
            backgroundColor={Colors.GREEN}
            onPress={() => {
              this.setState({ isTeamModalVisible: true }),
                this.sheetRef.snapTo(1);
            }}
          />
          {/* <Button
            height={50}
            name={'Invite Player'}
            textStyle={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors.WHITE,
            }}
            btnStyle={{marginVertical: 5}}
            backgroundColor={Colors.BLUE}
            onPress={() => this.props.navigation.navigate('InviteFriends')}
          /> */}
        </View>
      </View>
    );
  };

  render() {
    let { leagueDetail, startDate, endDate, startTime } = this.state;

    let leagueStartTime = new Date(startDate?.concat('T' + startTime + 'Z'));
    let leagueEndTime = new Date(endDate?.concat('T' + startTime + 'Z'));

    let currentDate = new Date();
    let isLeagueStarted =
      leagueStartTime <= currentDate && leagueEndTime <= currentDate;

    let isLeagueCompleted = currentDate >= leagueEndTime;
    console.log("-soadsadn", leagueDetail)

    return (
      <>
        <View style={styles.container}>
          <View style={{ marginHorizontal: 20 }}>
            <Header
              title={'League Details'}
              isShowLeftIcon={true}
              navigation={this.props.navigation}
            />
          </View>

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              {/* <View style={{height: 160, width: '100%'}}>
                <Image source={footballBg} style={styles.imgPromo} />
              </View> */}

              {this.props?.getLeagueDetail?.team.length === 2 &&
                !this.state.loading ? (
                <View style={styles.ImagesView}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                      source={{
                        uri: leagueDetail.team[0]?.profile_image != null
                          ? img_url + leagueDetail.team[0]?.profile_image
                          : dummyImage,
                      }}
                      style={styles.ImgView1}
                    />
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.clubName}>
                      {leagueDetail.team[0].username}
                    </Text>
                  </View>

                  {!isLeagueStarted ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginHorizontal: 10,
                      }}>
                      <Text style={styles.DaysText}>
                        {moment(leagueStartTime).startOf('day').fromNow()}
                      </Text>
                      {/* <Text style={styles.RemainingText}>Remaining</Text> */}
                    </View>
                  ) : (
                    <View
                      style={{
                        marginHorizontal: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.DaysText}>
                        {leagueDetail.team[0].team1_score ? leagueDetail.team[0].team1_score : 0}
                        {' - '}
                        {leagueDetail.team[1].team2_score ? leagueDetail.team[1].team2_score : 0}
                      </Text>
                    </View>
                  )}
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                      source={{
                        uri: leagueDetail.team[1]?.profile_image != null
                          ? img_url + leagueDetail.team[1]?.profile_image
                          : dummyImage,
                      }}
                      style={styles.ImgView2}
                    />
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.clubName}>
                      {leagueDetail.team[1].username}
                    </Text>
                  </View>
                </View>
              ) : null}

              {!this.state.loading ? (
                <View style={styles.DetailBody}>
                  <Text style={styles.HeadingBlack}>
                    {leagueDetail?.league_name}
                  </Text>

                  <Text style={styles.Heading}>Leagues Details</Text>
                  <Text style={styles.DetailPara}>
                    {leagueDetail?.league_description}
                  </Text>

                  <View style={styles.OptionView}>
                    <Image source={calendar} style={styles.iconImg} />
                    <Text style={styles.ShortHeadingInner}>
                      {leagueDetail?.start_date
                        ? moment(leagueDetail?.start_date).format('MMM DD YYYY')
                        : ''}

                      {' - '}

                      {leagueDetail?.end_date
                        ? moment(leagueDetail?.end_date).format('MMM DD YYYY')
                        : ''}
                    </Text>
                  </View>

                  <View style={styles.OptionView}>
                    <Image source={clock} style={styles.iconImg} />

                    <Text style={styles.ShortHeadingInner}>
                      {leagueStartTime
                        ? moment(leagueStartTime).format('LT')
                        : ''}
                    </Text>
                  </View>

                  <View style={styles.OptionView}>
                    <Image source={map_marker} style={styles.iconImg} />

                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={styles.ShortHeadingInner}>
                      {leagueDetail?.venue_address}
                    </Text>
                  </View>
                  <View style={styles.OptionView}>
                    <Image source={price} style={styles.iconImg} />

                    <Text style={styles.ShortHeadingInner}>
                      ${leagueDetail?.price}
                    </Text>
                  </View>

                  {!this.props.getLeagueDetail?.isJoin &&
                    this.props.role == 'coach' &&
                    this.props.getLeagueDetail?.team.length < 2 &&
                    !this.state.loading ? (
                    <Button
                      height={50}
                      name={'Join'}
                      textStyle={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.WHITE,
                      }}
                      btnStyle={{ marginVertical: 10 }}
                      backgroundColor={Colors.BLUE}
                      onPress={() =>
                        this.props.navigation.navigate('Payment', {
                          screen: 'league',
                          total: leagueDetail.price,
                          leagueId: leagueDetail?.id,
                        })
                      }
                    />
                  ) : this.props.getLeagueDetail?.isJoin &&
                    this.props.getLeagueDetail?.team.length < 2 &&
                    this.props.role === 'coach' ? (
                    <Button
                      height={50}
                      name={'Invite'}
                      textStyle={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.WHITE,
                      }}
                      btnStyle={{ marginVertical: 10 }}
                      backgroundColor={Colors.GREEN}
                      onPress={() => this.sheetRef.snapTo(0)}
                    />
                  ) : isLeagueCompleted && this.props.getLeagueDetail?.isMyLeague ? (
                    <Button
                      height={50}
                      name={'Update League Status'}
                      textStyle={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: Colors.WHITE,
                      }}
                      btnStyle={{ marginVertical: 10 }}
                      backgroundColor={Colors.GREEN}
                      onPress={() =>
                        this.props.navigation.navigate('UploadLeagueStats', {
                          item: leagueDetail,
                        })
                      }
                    />
                  ) : null}
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>

        {this.renderTeamsModal()}
        <Loader loader={this.state.loading} />

        {this.props.role === 'coach' ? (
          <BottomSheet
            ref={ref => (this.sheetRef = ref)}
            initialSnap={1}
            snapPoints={[150, 0]}
            borderRadius={10}
            renderContent={this.renderContent}
          />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
  usersByType: state.UserReducer.usersByType,
  user: state.Auth.user,
  getLeagueDetail: state.UserReducer.leagueDetail,
});

const mapDispatchToProps = dispatch => ({
  leagueDetail: payload => dispatch(UserMiddleware.leagueDetail(payload)),
  getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
  inviteTeamsInLeague: payload =>
    dispatch(UserMiddleware.inviteTeamsInLeague(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);

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
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
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
    paddingBottom: 12,
  },
  ShortHeading: {
    fontSize: 15,
    color: Colors.GRAY_5,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  ShortHeadingInner: {
    fontSize: 14,
    color: Colors.GRAY_1,
    marginHorizontal: 5,
    fontWeight: 'normal',
  },
  OptionView: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  ImagesView: {
    flexDirection: 'row',

    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  ImgView1: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ImgView2: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  DaysText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.GREEN,
  },
  RemainingText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  clubName: {
    fontSize: 13,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
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
    marginVertical: 30,
    justifyContent: 'center',
    //alignItems: 'center',
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
});
