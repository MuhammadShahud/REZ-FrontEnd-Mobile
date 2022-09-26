import { objectExpression } from '@babel/types';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { FlatList } from 'react-native-gesture-handler';
import { chat, chat_active, cricketBg, dummy, message, threedots, close } from '../../../Assets';
import { Header, Text, Button, Loader } from '../../../Components';
import { Colors } from '../../../Styles';
import GetUserInfoMiddleware from '../../../Store/Middleware/GetUserInfoMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../../Store/Apis';
import { dummyImage } from '../../../Config';
import GetFollowingMiddleware from '../../../Store/Middleware/GetFollowingMiddleware';
import FollowMiddleware from '../../../Store/Middleware/FollowMiddleware';
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import GetFacilityMiddleware from '../../../Store/Middleware/GetFacilityMiddleware';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware'
import BlockButton from '../../../Components/BlockButton'
class OthersProfile extends Component {
  state = {
    loader: false,
    pageLoader: false,
    followingProfileCopy: [],
    facilityButtons: ['Posts', 'Classes', 'Schedules'],
    coachButtons: ['Posts', 'Schedules', ''],
    btnIndex: 0,
    eClasses: [],
    blockModal: false,
    blockStatus: false,
  };

  async componentDidMount() {
    // this.props.getEClasses();
    this.props.getStatus({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.user_id)
          : (id = this.props.route.params.item.id),
    })
      .then((data) => this.setState({ blockStatus: data?.message?.isBlocked }))
      .catch()
    await this.props.getUserInfoById({
      // id: this.props.route.params.item.id,
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.user_id)
          : (id = this.props.route.params.item.id),
    });

  }

  FollowUser = item => {
    this.setState({ btnIndex: 0 });
    this.props.followUser({ id: item.id });
    setTimeout(() => {
      this.props.getUserInfoById({
        id:
          this.props.route.params.type == 'highlights'
            ? (id = this.props.route.params.item.user_id)
            : (id = this.props.route.params.item.id),
      });
    }, 3000);
  };
  onPressChat = () => {
    const { item } = this.props.route.params;
    this.setState({ loader: true, btnIndex: 0 }, () => {
      this.props
        .getChatSession({
          recipient_user_id:
            this.props.route.params.type == 'highlights'
              ? (id = item.user_id)
              : (id = item.id),
        })
        .then(chatHead => {
          this.setState({ loader: false });
          this.props.navigation.navigate('Chat', { chatHead: chatHead });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  onRefresh = () => {
    this.props.getUserInfoById({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.user_id)
          : (id = this.props.route.params.item.id),
    });
    // .then(() => this.setState({ pageLoader: false }))
    // .catch(() => this.setState({ pageLoader: false }));
  };

  getClasses = () => {
    const userItem = this.props?.getUserInfoData;
    console.warn('dataa');
    this.props.getFacilityEClassesById({ id: userItem.id }).then(data => {
      this.setState({ eClasses: data.data }, () => {
        this.renderFacilityClasses();
      });
    });
  };

  renderFacilityClasses = item => {
    return (
      <TouchableOpacity
        key={item?.item.id}
        activeOpacity={0.7}
        style={styles.userItemContainer}
        onPress={() => {
          this.setState({ btnIndex: 1 }),
            this.props.navigation.navigate('EClassDetails', {
              eclass: item?.item,
            });
        }}>
        <Image
          source={{ uri: img_url + item?.item.file_path }}
          style={styles.avatarImage}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>{item?.item.session_name}</Text>
          <Text style={styles.userName}>{`Date : ${item?.item.date}`}</Text>
          <Text
            style={
              styles.userName
            }>{`Duration:  ${item?.item.duration} mins`}</Text>
        </View>
        <Text style={styles.price}>{`$${item?.item.price}`}</Text>
      </TouchableOpacity>
    );
  };

  renderSchedules = item => {
    const userItem = this.props?.getUserInfoData;
    if (userItem?.role === 'coach' && this.state.btnIndex === 1) {
      this.props.navigation.navigate('CoachTraining', { CoachItem: userItem });
    } else if (
      (userItem?.role === 'facility' || userItem?.role === 'staff') &&
      this.state.btnIndex === 2
    ) {
      this.props.navigation.navigate('FacilityEvents', { item: userItem });
      return;
    }
  };

  render() {
    let id =
      this.props.route.params.type == 'highlights'
        ? (id = this.props.route.params.item.user_id)
        : (id = this.props.route.params.item.id);
    let { user } = this.props;
    const { item } = this.props.route.params;
    const userItem = this.props?.getUserInfoData;
    const userFollow = this.props?.getFollowersData;

    console.log("---------",userItem?.roleInfo)

    return (
      <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.pageLoader}
              onRefresh={this.onRefresh}
            />
          }>
          <Header
            title={'Profile'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
          <View style={styles.userContainer}>
            <Image
              source={{
                uri: userItem?.profile_image
                  ? img_url + userItem?.profile_image
                  : dummyImage,
              }}
              style={styles.avatarImage}
            />
            <View style={styles.userDetailContainer}>
              <Text style={styles.name}>{item.username}</Text>
              <View style={styles.userStatsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Following', {
                      userItem,
                      type: 'otherProfile',
                    })
                  }>
                  <Text style={styles.statsName}>Following</Text>
                  <Text style={styles.stats}>{userItem?.follow}</Text>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Follower', {
                        userItem,
                        type: 'otherProfile',
                      })
                    }>
                    <Text style={styles.statsName}>Followers</Text>
                    <Text style={styles.stats}>{userItem?.followed_user}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.statsName}>Posts</Text>
                  <Text style={styles.stats}>{userItem?.postCount}</Text>
                </View>
              </View>
            </View>
          </View>

          {userItem?.roleInfo?.description ? (
            <View style={{ paddingVertical: 8 }}>
              <Text>{userItem?.roleInfo?.description}</Text>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', marginVertical: 20 }}>

            {userItem?.already_following ? (
              <View style={{ flex: 1, marginRight: 10, opacity: 0.7 }}>
                <Button
                  name={'Following'}
                  backgroundColor={Colors.BLUE}
                  textStyle={styles.colorWhite}
                // onPress={() => this.FollowUser(userItem)}
                />
              </View>
            ) : (
              <View style={{ flex: 1, marginRight: 10 }}>
                <Button
                  name={'Follow'}
                  backgroundColor={Colors.BLUE}
                  textStyle={styles.colorWhite}
                  onPress={() => this.FollowUser(userItem)}
                />
              </View>
            )}
            {id == user.id ? null :
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={this.onPressChat}
                  style={{
                    backgroundColor: '#F8F8F8',
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image source={chat} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
              </View>}
            {id != this.props.user.id ?
              <TouchableOpacity style={{
                backgroundColor: '#F8F8F8',
                width: 20,
                marginLeft: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
                onPress={() => this.setState({ blockModal: true })}
              >

                <Image source={threedots} style={{ width: 20, height: 20 }} resizeMode={'contain'} />

              </TouchableOpacity> : null}
          </View>

          <View style={styles.flex1}>
            {userItem?.role === 'facility' || userItem?.role === 'staff' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {this.state.facilityButtons.map((item, index) => (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ btnIndex: index }, () => {
                          this.state.btnIndex === 1 &&
                            (userItem?.role === 'facility' ||
                              userItem?.role === 'staff')
                            ? this.getClasses()
                            : this.renderSchedules();
                        })
                      }
                      style={{
                        backgroundColor:
                          this.state.btnIndex == index
                            ? Colors.GREEN
                            : Colors.GRAY_PRIMARY,
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color:
                            this.state.btnIndex == index
                              ? Colors.WHITE
                              : Colors.GRAY_3,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  </>
                ))}
              </View>
            ) : userItem?.role === 'coach' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                {this.state.coachButtons.map((item, index) => (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ btnIndex: index }, () => {
                          this.renderSchedules();
                        })
                      }
                      style={{
                        backgroundColor:
                          this.state.btnIndex == index
                            ? Colors.GREEN
                            : index !== 2
                              ? Colors.GRAY_PRIMARY
                              : Colors.WHITE,
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                      }}>
                      <Text
                        style={{
                          color:
                            this.state.btnIndex == index
                              ? Colors.WHITE
                              : Colors.GRAY_3,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                    {index === 2 ? (
                      <View
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 20,
                          borderRadius: 12,
                        }}
                      />
                    ) : null}
                  </>
                ))}
              </View>
            ) : (
              <>
                <View>
                  <Text style={styles.imageSectionHeaderText}>Posts</Text>
                  <FlatList
                    key={this.state.btnIndex}
                    data={userItem?.posts}
                    style={styles.postImagesContainer}
                    numColumns={3}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('Post', { item })
                        }>
                        <Image
                          source={{ uri: img_url + item.image }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </>
            )}
          </View>

          {this.state.btnIndex === 0 ? (
            <FlatList
              key={this.state.btnIndex}
              data={userItem?.posts}
              style={styles.postImagesContainer}
              numColumns={3}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Post', { item })
                  }>
                  <Image
                    source={{ uri: img_url + item.image }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              key={this.state.btnIndex}
              data={
                (this.state.btnIndex === 1 && userItem?.role === 'facility') ||
                  userItem?.role === 'staff'
                  ? this.state.eClasses
                  : []
              }
              style={styles.postImagesContainer}
              keyExtractor={(item, index) => index.toString()}
              renderItem={
                (this.state.btnIndex === 1 && userItem?.role === 'facility') ||
                  userItem?.role === 'staff'
                  ? this.renderFacilityClasses
                  : this.renderSchedules
              }
            />
          )}
          {/* <Text style={styles.imageSectionHeaderText}>Posts</Text> */}
          {/* <View>
              {!userItem ? (
                <ActivityIndicator
                  size={'large'}
                  color={Colors.BLUE}
                  style={styles.loadMoreContentContainer}
                />
              ) : null}
              {userItem?.posts && userItem?.posts?.length ? (
              <FlatList
                data={userItem?.posts}
                style={styles.postImagesContainer}
                numColumns={3}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Post', {item})
                    }>
                    <Image
                      source={{uri: img_url + item.image}}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                )}
              />
               ) : null} 
            </View> */}
        </ScrollView>
        <Loader loader={this.state.loader} />
        <Modal
          visible={this.state.blockModal}
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
                  this.setState({ blockModal: false }, () => {
                    this.props.getStatus({
                      id: id
                    })
                      .then((data) => this.setState({ blockStatus: data?.message?.isBlocked }))
                      .catch()
                  })
                }}
                style={{ width: 20, height: 20, margin: 15 }}
              >
                <Image source={close} style={{ width: 16, height: 16 }} />
              </TouchableOpacity>
              <BlockButton name={item.username} user_id={id} isBlock={this.state.blockStatus} />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    getUserInfoData: state.GetUserInfoReducer.getUserInfoData,
    getFollowingData: state.GetFollowingReducer.getFollowingData,
    followUserData: state.FollowReducer.followUserData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getUserInfoById: payload =>
      dispatch(GetUserInfoMiddleware.getUserInfoById(payload)),
    getFollowingUser: payload =>
      dispatch(GetFollowingMiddleware.getFollowingUser(payload)),
    followUser: payload => dispatch(FollowMiddleware.followUser(payload)),
    getChatSession: payload => dispatch(ChatMiddleware.getChatSession(payload)),
    getFacilityEClassesById: payload =>
      dispatch(GetFacilityMiddleware.getFacilityEClassesById(payload)),
    getStatus: payload => dispatch(AuthMiddleware.checkBlockStatus(payload))

  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(OthersProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  actionBtnLeft: {
    flex: 1,
    marginRight: 3,
    marginVertical: 30,
  },
  colorWhite: {
    color: Colors.WHITE,
  },
  userContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: 10,
  },
  userDetailContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.GRAY_5,
  },
  userStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    color: Colors.GRAY_3,
    fontWeight: '600',
    alignSelf: 'center',
  },
  statsName: {
    color: Colors.GRAY_6,
    fontSize: 12,
  },
  flex1: {
    flex: 1,
  },
  imageSectionHeaderText: {
    color: Colors.GRAY_3,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 90,
    height: 80,
    maxHeight: 100,
    margin: 10,
    borderRadius: 6,
  },
  postImagesContainer: {
    marginHorizontal: -5,
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
  userItemContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_LIGHT,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  modalView: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
