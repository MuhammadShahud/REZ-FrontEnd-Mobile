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
import { getHeaders } from '../../Utils';
import GetCoachesMiddleware from '../../Store/Middleware/GetCoachesMiddleware';
import BookingMidleware from '../../Store/Middleware/BookingMiddleware';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import NotificationByUserAction from '../../Store/Actions/NotificationByUserAction';
import UserAction from '../../Store/Actions/UserAction';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';

class index extends Component {
  // state = {
  //   notifications: [
  //     {
  //       title: 'Your slots have been confirmed.',
  //       time: '2 min ago',
  //       isRead: false,
  //     },
  //     {
  //       title: '12 pm to 4 pm slots are available.',
  //       time: '5 min ago',
  //       isRead: true,
  //     },
  //     {
  //       title: 'Please complete your profile.',
  //       time: '30 min ago',
  //       isRead: false,
  //     },
  //     {
  //       title: 'Stacy Doe, just sent you follow request.',
  //       following_status: 'pending',
  //       time: '32 min ago',
  //       isRead: true,
  //     },
  //     {
  //       title: 'Chris Morgan started following you.',
  //       time: '36 min ago',
  //       isRead: true,
  //     },
  //     {
  //       title: 'Chris Morgan, just sent you follow request.',
  //       following_status: 'pending',
  //       time: '36 min ago',
  //       isRead: false,
  //     },
  //   ],
  // };

  state = {
    loader: true,
    searchText: '',
    notificationListCopy: [],
  };

  async componentDidMount() {
    this.props
      .getNotificationByUser()
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { notification_by_user } = this.props;
      this.props
        .getNotificationByUser(notification_by_user.next_page_url, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { notification_by_user } = this.props;
    const { loader } = this.state;
    return notification_by_user.next_page_url ? (
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
    if (item.content_type == 'appointment_modify' && item?.title == 'Appointment has been updated' && item?.content_action != 'remove') {
      // Get One Appointment and update Appointmnet List[]
      this.props
        .getOneCoachBooking({ booking_id: item.content_id })
        .then(data => {
          console.warn("0000000000", data[0].reciever_user_id)
          if (data[0]?.status !== 'accept') {
            this.props.navigation.navigate('AppointmentDetail', {
              appointment: data[0],
              isComeFromNotification: true,
              reciever_user_id: item?.reciever_user_id
            });
          }
        });
    }
  };

  acceptCoachLeague = item => {
    let { user } = this.props;
    let { notificationListCopy } = this.state;

    notificationListCopy = this.props.notification_by_user_list;
    let index = notificationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'accept',
    };

    notificationListCopy.splice(index, 1, updateItem);
    this.setState({ notificationListCopy });

    this.props.joinCoachLeague({
      notificationId: item.id,
      contentId: item.content_id,
      approvalStatus: 'accept',
    });
  };

  rejectLeague = item => {
    let { notificationListCopy } = this.state;

    notificationListCopy = this.props.notification_by_user_list;
    let index = notificationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'reject',
    };

    notificationListCopy.splice(index, 1, updateItem);
    this.setState({ notificationListCopy });

    this.props.joinCoachLeague({
      notificationId: item.id,
      contentId: item.content_id,
      approvalStatus: 'reject',
    });
  };

  renderClassesList = item => {
    console.warn('itemm ', item);
    return (
      <TouchableOpacity
        style={styles.userContainer}
        // disabled={item.content_action === 'static' ? true : false}
        onPress={() => {
          this.onPressNotification(item);
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item?.profile_image ? img_url + item?.profile_image : dummyImage }}
            style={styles.avatarImage}
          // resizeMode={'contain'}
          />
          <View style={styles.flex1}>
            <View style={styles.inviteRecipientNameContainer}>
              <Text style={styles.inviteRecipientName}>
                {item.sendername + ' '}
              </Text>
              <Text style={styles.fontSize16}>{item.title}</Text>
              <Text style={styles.inviteRecipientName}>
                {item.content_type === 'appointment_modify'
                  ? ''
                  : item.content_type}
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
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getNotificationByUser(undefined)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  onChangeSearchText = text => {
    this.setState({ loader: true }, () => {
      // console.log(this.state.searchText, text, 'TEXT====>');
      this.props
        .getNotificationByUser(undefined)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  PlayerRequestApprove = item => {
    let { notificationListCopy } = this.state;

    notificationListCopy = this.props.notification_by_user_list;
    let index = notificationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'accept',
    };

    notificationListCopy.splice(index, 1, updateItem);
    this.setState({ notificationListCopy });

    this.props.playerRequestApprove({
      id: item.id,
      cid: item.content_id,
      type: item.content_type,
      action: 'accept',
    });
    // setTimeout(() => {
    //   this.onRefreshEclass();
    // }, 5000);
    // console.warn("Accept", item);
  };

  PlayerRequestReject = item => {
    let { notificationListCopy } = this.state;

    notificationListCopy = this.props.notification_by_user_list;
    let index = notificationListCopy.findIndex(val => val.id === item.id);

    let updateItem = {
      ...item,
      content_action: 'reject',
    };

    notificationListCopy.splice(index, 1, updateItem);
    this.setState({ notificationListCopy });

    this.props.playerRequestApprove({
      id: item.id,
      cid: item.content_id,
      type: item.content_type,
      action: 'reject',
    });
    // this.onRefreshEclass()
    // setTimeout(() => {
    //   this.onRefreshEclass();
    // }, 5000);
  };

  renderNotifications = ({ item }) => (
    console.warn('itemm ==', item),
    (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 12,
          backgroundColor: 'pink',
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
    const { getNotificationByUser, notification_by_user_list, loader } =
      this.props;

    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <View style={{ paddingHorizontal: 25 }}>
          <Header
            navigation={this.props.navigation}
            title="Notifications"
            isShowLeftIcon={true}
          />
        </View>
        {!getNotificationByUser ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />
        ) : null}

        {notification_by_user_list && notification_by_user_list?.length ? (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loader}
                onRefresh={this.onRefreshEclass}
              />
            }
            // data={[1, 1, 1, 1, 1]}
            style={styles.usersListContainer}
            data={notification_by_user_list}
            renderItem={({ item, index }) => this.renderClassesList(item)}
            ListFooterComponent={this.renderLoaderMoreButton()}
            showsVerticalScrollIndicator={false}
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
    notification_by_user: state.NotificationByUserReducer.notification_by_user,
    notification_by_user_list:
      state.NotificationByUserReducer.notification_by_user_list,
    playerRequestApproveData:
      state.PlayerRequestApproveReducer.playerRequestApproveData,
    getLeagueDetail: state.UserReducer.leagueDetail,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getNotificationByUser: payload =>
      dispatch(NotificationByUserMiddleware.getNotificationByUser(payload)),
    playerRequestApprove: payload =>
      dispatch(PlayerRequestApproveMiddleware.playerRequestApprove(payload)),
    getOneCoachBooking: payload =>
      dispatch(BookingMidleware.getOneCoachBooking(payload)),
    joinCoachLeague: payload =>
      dispatch(UserMiddleware.joinCoachLeague(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

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
    // marginTop: 20,
    // backgroundColor: 'red',
  },
  userContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
    borderRadius: 2,
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: { flex: 1 },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
});
