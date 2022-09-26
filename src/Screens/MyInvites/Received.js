import React, { Component } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { check_box_checked, check_box_un_check, dummy } from '../../Assets';
import { Button, Header, SearchBar, Text } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import NotificationByUserMiddleware from '../../Store/Middleware/NotificationByUserMiddleware';
import PlayerRequestApproveMiddleware from '../../Store/Middleware/PlayerRequestApproveMiddleware';
import BookingMidleware from '../../Store/Middleware/BookingMiddleware';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';


class MyInvites extends Component {
  state = {
    loader: true,
    searchText: '',
    invitationListCopy: [],
  };


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({ loader: true })
      this.props
        .getInvitationByUser()
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    })
  }

  componentWillUnmount() {
    if (this.unsubscribe)
      this.unsubscribe()
  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { invitation_by_user } = this.props;
      this.props
        .getInvitationByUser(invitation_by_user.next_page_url, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };


  renderLoaderMoreButton = () => {
    const { invitation_by_user } = this.props;
    const { loader } = this.state;
    return invitation_by_user.next_page_url ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={styles.loadMoreContentContainer}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  onPressNotification = item => {
    console.log('onPressNotification=>', item);
    if (item.content_type == 'appointment_modify' && item?.title == 'Appointment has been updated' && item?.content_action != 'remove') {
      // Get One Appointment and update Appointmnet List[]
      this.props
        .getOneCoachBooking({ booking_id: item.content_id })
        .then(data => {
          this.props.navigation.navigate('AppointmentDetail', {
            appointment: data[0],
            isComeFromNotification: true,
          });
        });
    }
  };

  acceptCoachLeague = item => {
    let { user } = this.props;
    let { invitationListCopy } = this.state;

    invitationListCopy = this.props.invitation_by_user_list;
    let index = invitationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'accept',
    };

    invitationListCopy.splice(index, 1, updateItem);
    this.setState({ invitationListCopy });

    this.props.joinCoachLeague({
      notificationId: item.id,
      contentId: item.content_id,
      approvalStatus: 'accept',
    });
  };

  rejectLeague = item => {
    let { invitationListCopy } = this.state;

    invitationListCopy = this.props.invitation_by_user_list;
    let index = invitationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'reject',
    };

    invitationListCopy.splice(index, 1, updateItem);
    this.setState({ invitationListCopy });

    this.props.joinCoachLeague({
      notificationId: item.id,
      contentId: item.content_id,
      approvalStatus: 'reject',
    });
  };

  renderClassesList = item => {
    return (
      <TouchableOpacity
        style={[styles.userContainer]}
        onPress={() => this.onPressNotification(item)}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item?.profile_image ? img_url + item?.profile_image : dummyImage }}
            style={styles.avatarImage}
          // resizeMode={'contain'}
          />
          <View style={styles.flex1}>
            <View style={styles.inviteRecipientNameContainer}>
              <Text style={styles.inviteRecipientName}>{item.sendername}</Text>
              <Text style={{ ...styles.fontSize16, marginHorizontal: 0 }}>{item.title}</Text>
              <Text style={styles.inviteRecipientName}>
                {item.content_type}
              </Text>
            </View>
            {item.content_action == 'pending' &&
              item.content_type !== 'appointment_modify' ? (
              <View style={styles.flexRow}>
                <Button
                  onPress={() =>
                    item.content_type === 'league'
                      ? this.acceptCoachLeague(item)
                      : this.PlayerRequestApprove(item)
                  }
                  btnStyle={styles.actionBtnLeft}
                  name={'ACCEPT'}
                  backgroundColor={Colors.BLUE}
                  textStyle={styles.colorWhite}
                  width={80}
                  height={35}
                />
                <Button
                  onPress={() =>
                    item.content_type === 'league'
                      ? this.rejectLeague(item)
                      : this.PlayerRequestReject(item)
                  }
                  btnStyle={styles.actionBtnRight}
                  name={'REJECT'}
                  textStyle={styles.colorWhite}
                  width={80}
                  height={35}
                />
              </View>
            ) : null}

            {item.content_action == 'accept' ? (
              <View style={styles.flexRow}>
                <Button
                  onPress={() => this.PlayerRequestApprove(item)}
                  btnStyle={styles.actionBtnLeft}
                  name={'Accepted'}
                  backgroundColor={Colors.BLUE}
                  textStyle={styles.colorWhite}
                  width={80}
                  height={35}
                  disabled
                />
                {this.props.role === 'team' ?
                  <Button
                    onPress={() => this.CancelInvite(item)}
                    btnStyle={styles.actionBtnLeft}
                    name={'Cancel'}
                    backgroundColor={Colors.GREEN}
                    textStyle={styles.colorWhite}
                    width={80}
                    height={35}
                  /> : null}
              </View>
            ) : null}

            {item.content_action == 'reject' ? (
              <View style={styles.flexRow}>
                <Button
                  onPress={() => this.PlayerRequestApprove(item)}
                  btnStyle={styles.actionBtnLeft}
                  name={'Rejected'}
                  backgroundColor={Colors.GRAY_1}
                  textStyle={styles.colorWhite}
                  width={80}
                  height={35}
                  disabled
                />
              </View>
            ) : null}

            {item.content_action == 'cancelled' && this.props.role === 'team' ? (
              <View style={styles.flexRow}>
                <Button
                  onPress={() => this.PlayerRequestApprove(item)}
                  btnStyle={styles.actionBtnLeft}
                  name={'Cancelled'}
                  backgroundColor={Colors.GRAY_1}
                  textStyle={styles.colorWhite}
                  width={80}
                  height={35}
                  disabled
                />
              </View>
            ) : null}


          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getInvitationByUser(undefined)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };
  // onChangeSearchText = text => {
  //   this.setState({ loader: true }, () => {
  //     console.log(this.state.searchText, text, 'TEXT====>');
  //     this.props
  //       .getInvitationByUser(undefined)
  //       .then(() => this.setState({ loader: false }))
  //       .catch(() => this.setState({ loader: false }));
  //   });
  // };


  PlayerRequestApprove = item => {
    let { invitationListCopy } = this.state;

    invitationListCopy = this.props.invitation_by_user_list;
    let index = invitationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'accept',
    };

    invitationListCopy.splice(index, 1, updateItem);
    this.setState({ invitationListCopy });

    this.props.playerRequestApprove({
      id: item.id,
      cid: item.content_id,
      type: item.content_type,
      action: 'accept',
    })
    // setTimeout(() => {
    //   this.onRefreshEclass();
    // }, 5000);
    // console.warn("Accept", item);
  };

  PlayerRequestReject = item => {
    let { invitationListCopy } = this.state;

    invitationListCopy = this.props.invitation_by_user_list;
    let index = invitationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'reject',
    };

    invitationListCopy.splice(index, 1, updateItem);
    this.setState({ invitationListCopy });

    this.props.playerRequestApprove({
      id: item.id,
      cid: item.content_id,
      type: item.content_type,
      action: 'reject',
    })
    // this.onRefreshEclass()
    // setTimeout(() => {
    //   this.onRefreshEclass();
    // }, 5000)
  };

  CancelInvite = item => {
    let { invitationListCopy } = this.state;

    invitationListCopy = this.props.invitation_by_user_list;
    let index = invitationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'cancelled',
    };

    invitationListCopy.splice(index, 1, updateItem);
    this.setState({ invitationListCopy });

    this.props.cancelInvite({
      id: item.id,
      schedule_id: item.content_id,
    })
  };

  renderNotifications = ({ item }) => (
    (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 12,
        }}>
        <View
          style={{
            marginRight: 12,
            width: 14,
            height: 14,
            borderRadius: 100,
            marginTop: 6,
            backgroundColor: !item.isRead ? Colors.BLUE : Colors.GRAY_1,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: Colors.BLACK }}>{item.title}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text
              style={{ color: Colors.BLACK, fontSize: 12, paddingVertical: 3 }}>
              {item.time}
            </Text>

            {item?.following_status == 'pending' ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginVertical: 4,
                }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    backgroundColor: Colors.BLUE,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.WHITE,
                      fontWeight: 'bold',
                    }}>
                    Accept
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 5,
                    backgroundColor: Colors.GRAY_2,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    )
  );

  render() {
    const { getInvitationByUser, invitation_by_user_list, loader } = this.props;

    return (
      <View style={styles.container}>
        {/* <SearchBar onChangeText={this.onChangeSearchText} /> */}
        {this.state.loader ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />
        ) : null}

        {invitation_by_user_list && invitation_by_user_list?.length ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            // data={[1, 1, 1, 1, 1]}
            style={styles.usersListContainer}
            data={invitation_by_user_list}
            renderItem={({ item, index }) => this.renderClassesList(item)}
            ListFooterComponent={this.renderLoaderMoreButton()}
          />
        ) : null}

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    invitation_by_user: state.NotificationByUserReducer.invitation_by_user,
    invitation_by_user_list: state.NotificationByUserReducer.invitation_by_user_list,
    playerRequestApproveData: state.PlayerRequestApproveReducer.playerRequestApproveData,
    getLeagueDetail: state.UserReducer.leagueDetail,

  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getInvitationByUser: (payload) =>
      dispatch(NotificationByUserMiddleware.getInvitationByUser(payload)),
    playerRequestApprove: payload => dispatch(PlayerRequestApproveMiddleware.playerRequestApprove(payload)),
    cancelInvite: payload => dispatch(PlayerRequestApproveMiddleware.cancelInvite(payload)),

    getOneCoachBooking: payload =>
      dispatch(BookingMidleware.getOneCoachBooking(payload)),
    joinCoachLeague: payload =>
      dispatch(UserMiddleware.joinCoachLeague(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(MyInvites);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  bgWhite: {
    color: Colors.WHITE,
  },
  usersListContainer: {
    marginTop: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  name: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 19,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  checkunCheckImage: {
    height: 25,
    width: 25,
  },
  flexRow: { flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10 },
  actionBtnLeft: {
    width: 80,
    height: 40,
    marginRight: 3,
  },
  actionBtnRight: {
    width: 80,
    height: 40,
    marginLeft: 3,
  },
  colorWhite: {
    fontSize: 12,
    color: Colors.WHITE,
  },
  fontSize16: {
    fontSize: 16,
  },
  inviteRecipientNameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingLeft: 10,
    alignItems: 'center',
  },
  inviteRecipientName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  flex1: {
    flex: 1,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf: 'center'
  },

  flex1: { flex: 1 },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 120,
    marginVertical: 20,
  },
});

// export default MyInvites;
