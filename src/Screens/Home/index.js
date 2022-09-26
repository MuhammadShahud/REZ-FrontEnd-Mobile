import moment from 'moment';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import {
  calendar,
  commentIcon,
  likedIcon,
  likeIcon,
  map_marker,
  price,
  searchIcon,
  close
} from '../../Assets';
import { AdModal, Header, Tag, Text, TextInput, Button } from '../../Components';
import { dummyImage } from '../../Config';
import HighlightsAction from '../../Store/Actions/HighlightsAction';
import { img_url } from '../../Store/Apis';
import HighlightsMiddleware from '../../Store/Middleware/HighlightsMiddleware';
import PostLikeMiddleware from '../../Store/Middleware/PostLikeMiddleware';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware';


import { Colors } from '../../Styles';
import PostCreateMiddleware from '../../Store/Middleware/PostCreateMiddleware';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      loader: true,
      loadmore: false,
      modalVisible: false,
      leagueData: null,
      highlightCopy: [],
      adModalVisible: false,
      forgotPassEmail: '',
      forgotPassCode: '',
      changePassModalVisible: false,
      newPassword: '',
      confirmPassword: '',
      isReport: false,
      postId: '',
      comment: '',
    };
  }

  componentDidMount() {
    this.props.role === 'staff' ?
      this.setState({ changePassModalVisible: this.props.user?.isEditRequired })
      : null;
    setTimeout(() => {
      this.setState({ adModalVisible: true });
    }, 2000);
    this.props
      .getHighlights()
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  deleteLeague = item => {
    console.warn(item);

    this.props.deleteLeague({
      id: item.content_id,
    });

    setTimeout(() => {
      this.onRefreshEclass(), this.setState({ modalVisible: false });
    }, 2000);
  };

  postLike = item => {
    console.warn('itemm', item);
    let highlightCopy = this.props.highlights_list;

    let index = highlightCopy.findIndex(val => val.id === item.id);

    if (!highlightCopy[index].like) {
      let updateItem = { ...item, like: true, liked_count: item.liked_count + 1 };

      highlightCopy.splice(index, 1, updateItem);
    } else {
      let index = highlightCopy.findIndex(val => val.id === item.id);
      let updateItem = {
        ...item,
        like: false,
        liked_count: item.liked_count - 1,
      };

      highlightCopy.splice(index, 1, updateItem);
    }

    this.setState({ highlightCopy });
    this.props.postLike({
      id: item.id,
      type: 'highlight',
      postUserId: item.user_id,
    });
  };

  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { highlights } = this.props;
      this.props
        .getHighlights(highlights.next_page_url, '')
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { highlights } = this.props;
    const { loadmore } = this.state;
    return highlights.next_page_url ? (
      loadmore ? (
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

  renderClassesList = item => {
    console.warn('dsaasdadadasda', item);
    return (
      //                 Posstssss                 //
      item?.content_type == 'post' ? (
        <View style={{ marginVertical: 10 }} key={item.id}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('OthersProfile', {
                type: 'highlights',
                item,
              })
            }>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Image
                  source={{
                    uri: item?.profile_image
                      ? img_url + item?.profile_image
                      : dummyImage,
                  }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              </View>
              <View style={{ marginHorizontal: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>{item?.username}</Text>
                <Text>{moment(item?.created_at).format('MMM DD YYYY')}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {item?.is_shared ?
            <View style={{ borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.GRAY_2, marginTop: 10 }}>
              <View style={styles.shareview}>
                <Image
                  style={{ width: 50, height: 50, borderRadius: 30, marginRight: 10 }}
                  source={{ uri: item?.shared_profile_image ? img_url + item?.shared_profile_image : dummyImage }} />
                <Text style={{ alignSelf: 'center' }}>{item?.shared_from != null ? item.shared_from : "Profile Name"}</Text>
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginLeft: item.is_shared ? 25 : 0 }}>{item?.description}</Text>
              </View>
            </View> : null
          }

          {!item?.is_shared ? <View style={{ marginVertical: 10 }}>
            <Text>{item?.description}</Text>
          </View> : null}

          {item?.image == '' ? null : (
            <View style={{ borderRadius: 20 }}>
              <TouchableOpacity
                onLongPress={() => this.setState({ postId: item.content_id, isReport: true })}
                onPress={() =>
                  this.props.navigation.navigate('Post', {
                    type: 'highlights',
                    item,
                  })
                }>
                <Image
                  source={{ uri: img_url + item?.image }}
                  resizeMode="cover"
                  style={{ height: 320, width: '100%' }}
                />
              </TouchableOpacity>
            </View>
          )}
          {item?.liked_count || item?.comment_count ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.GRAY_2,
                flexDirection: 'row',
                paddingVertical: 10,
              }}>
              <TouchableOpacity
                // onPress={() => this.postLike(userItem)}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={likeIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginHorizontal: 5 }}
                />
                <Text>{item?.liked_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => this.postLike(userItem)}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={commentIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginHorizontal: 5 }}
                />
                <Text>{item?.comment_count}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {/* {item?.liked_count ? (
            <View style={{ borderWidth: 1, borderColor: Colors.GRAY_2 }}>
              <TouchableOpacity
                onPress={() => this.postLike(userItem)}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={likedIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginHorizontal: 5 }}
                />
                <Text>{item?.liked_count}</Text>
              </TouchableOpacity>
            </View>
          ) : (null)} */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}>
            {item?.like ? (
              <TouchableOpacity
                onPress={() => this.postLike(item)}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={likedIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginHorizontal: 5 }}
                />
                <Text>Liked</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => this.postLike(item)}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={likeIcon}
                  resizeMode="contain"
                  style={{ width: 20, height: 20, marginHorizontal: 5 }}
                />
                <Text>Like</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Post', {
                  type: 'highlights',
                  item,
                })
              }
              style={{ flexDirection: 'row' }}>
              <Image
                source={commentIcon}
                resizeMode="contain"
                style={{ width: 20, height: 20, marginHorizontal: 5 }}
              />
              <Text>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Post', {
                  type: 'highlights',
                  item,
                  isShare: true,
                })
              }
              style={{ flexDirection: 'row' }}>
              <FontAwesome name="share-alt" style={{ marginHorizontal: 5 }} size={20} color={"#373737"} />

              <Text>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ marginVertical: 10 }}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('OthersProfile', {
                type: 'highlights',
                item,
              })
            }
            style={{ flexDirection: 'row' }}>
            <View>
              <Image
                source={{
                  uri: item?.profile_image
                    ? img_url + item?.profile_image
                    : dummyImage,
                }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            </View>
            <View style={{ marginHorizontal: 15 }}>
              <Text style={{ fontWeight: 'bold' }}>{item?.username}</Text>
              <Text>{moment(item?.created_at).format('MMM DD YYYY')}</Text>
            </View>

            {this.props.user?.role === 'facility' &&
              item?.user_id === this.props.user.id &&
              item.content_type == 'league' ? (
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({ modalVisible: true, leagueData: item })
                  }
                  style={{ padding: 2 }}>
                  <Entypo
                    name="dots-three-horizontal"
                    size={22}
                    color={Colors.BLACK}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </TouchableOpacity>
          {item?.content_type == 'league' ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('LeagueDetails', { item })
              }
              style={styles.containerLeagues}>
              <View style={styles.headingView}>
                <View style={styles.headDate}>
                  <Text style={styles.HeadingText}>{item?.league_name}</Text>
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.HeadingText}>Details :</Text>
                    <Text style={styles.Text}>{item?.league_description}</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={calendar} style={styles.iconImg} />
                      <Text style={styles.dateText}>
                        {item?.start_date + ' - ' + item?.end_date}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={map_marker} style={styles.iconImg} />
                      <Text style={styles.dateText}>{item?.venue_address}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.mv5}
              onPress={() =>
                this.props.navigation.navigate('EventDetails', {
                  event_id: item?.content_id,
                  type: 'highlights',
                  screen: 'highlights'
                })
              }>
              <View style={styles.postContainer}>
                {item?.image ? (
                  <Image
                    source={{ uri: img_url + item?.image }}
                    resizeMode="cover"
                    style={styles.bgImage}
                  />
                ) : null}
                <View style={styles.postContentContainer}>
                  <Text style={styles.postTitle}>{item?.event_name}</Text>
                  {/* <Text style={styles.postDate}>Date: {item?.event_date}</Text> */}
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={calendar} style={styles.iconImg} />
                    <Text style={styles.dateText}>
                      {moment(item?.event_date).format('MMM DD YYYY')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={map_marker} style={styles.iconImg} />
                    <Text style={styles.dateText}>{item?.event_address}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={price} style={styles.iconImg} />
                    <Text style={styles.dateText}>{item?.event_price}</Text>
                  </View>
                </View>
                {/* <View style={{ marginTop: 10 }}>
                  
                </View> */}
              </View>
            </TouchableOpacity>
          )}
        </View>
      )
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getHighlights(undefined)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  onPressUpdatePassword = () => {
    const { newPassword, confirmPassword, forgotPassEmail } = this.state;
    if (newPassword.length > 7) {
      this.setState({ loader: true }, () => {
        this.props
          .updatePassword({
            email: this.props.user.email,
            password: newPassword,
            password_confirm: confirmPassword,
          })
          .then(data => {
            this.setState({
              changePassModalVisible: false,
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('password should be at least 8 characters long');
    }
    if (newPassword === confirmPassword) {
    } else {
      alert('Password and confirm password should be match');
    }
  };
  renderReportModal = () => {
    return (
      <Modal
        visible={this.state.isReport}
        transparent
        animationType="fade">
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, .5)',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View style={styles.modalView2}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isReport: false })
              }}
              style={{ width: 20, height: 20, margin: 15 }}
            >
              <Image source={close} style={{ width: 16, height: 16 }} />
            </TouchableOpacity>
            <View style={{ width: '80%', alignSelf: 'center' }}>
              <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: 'bold', color: Colors.BLACK, textAlign: 'center' }}>Report</Text>
              <TextInput multiline={true} placeholder={"Ex: inappropriate content"} onChangeText={text => this.setState({ comment: text })} />
              <Button
                height={50}
                width={150}
                name={'Submit'}
                textStyle={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: Colors.WHITE,
                }}
                btnStyle={{ marginVertical: 10, borderRadius: 10 }}
                onPress={
                  () => {
                    this.onPressReport();
                  }
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  onPressReport = () => {
    console.log(this.state.postId)
    if (this.state.comment) {
      this.props.reportPost({
        post_id: this.state.postId,
        comment: this.state.comment
      }).then(() => { this.setState({ isReport: false }), alert("Post reported successfully.") })
        .catch()
    } else {
      alert("Field is required.!")
    }
  }

  render() {
    const { highlights, highlights_list, loader, role } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header
            title="Home"
            isShowLeftIcon={false}
            navigation={this.props.navigation}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SearchAllUsers')}
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: Colors.GRAY_4,
              alignItems: 'center',
              height: 50,
              borderRadius: 20,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}>
            <View>
              <Image
                source={searchIcon}
                style={{ height: 15, width: 15 }}
                resizeMode={'contain'}
              />
            </View>
            <View style={{ width: '90%' }}>
              {/* <TextInput placeholder="Search here" /> */}
              <Text style={{ marginHorizontal: 20 }}>Search here</Text>
            </View>
            {/* <View style={{position: 'absolute', right: 5}}>
              <Image
                source={filterIcon}
                style={{height: 15, width: 15}}
                resizeMode={'contain'}
              />
            </View> */}
          </TouchableOpacity>

          {/* <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}> */}
          <View style={styles.tagsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Tag isActive={true} text={'Highlights '} />
              <Tag
                isActive={false}
                text={'Schedule'}
                onPress={() => this.props.navigation.navigate('ScheduleList')}
              />
              {role === 'coach' ? (
                <Tag
                  isActive={false}
                  text={'Appointments'}
                  onPress={() => this.props.navigation.navigate('Appointments')}
                />
              ) : null}
              {/* {role !== 'coach' ? ( */}
              <Tag
                isActive={false}
                text={'Coaches'}
                onPress={() => this.props.navigation.navigate('Coach')}
              />
              {/* ) : null} */}
              {/* {role !== 'team' ? ( */}
              <Tag
                isActive={false}
                text={'Facility'}
                onPress={() =>
                  this.props.navigation.navigate('FacilitiesTypes')
                }
              />
              {/* ) : null} */}
              {role != 'team' ?
                <Tag
                  isActive={false}
                  text={'Teammates'}
                  onPress={() => this.props.navigation.navigate('TeammatesList')}
                /> : null}
              {role == 'player' || role == 'coach' ? (
                <Tag
                  isActive={false}
                  text={'Teams'}
                  onPress={() => this.props.navigation.navigate('TeamsTypes')}
                />
              ) : null}
              <Tag
                isActive={false}
                text={'E Classes'}
                onPress={() => this.props.navigation.navigate('EClass')}
              />
              <Tag
                isActive={false}
                text={'Leagues'}
                onPress={() =>
                  this.props.navigation.navigate(
                    role == 'player' || role == 'parent' || role == 'team'
                      ? 'LeagueHistory'
                      : 'Leagues',
                  )
                }
              />


            </ScrollView>
          </View>

          {!highlights ? (
            <ActivityIndicator
              size={'large'}
              color={Colors.BLUE}
              style={styles.loadMoreContentContainer}
            />
          ) : null}
          {highlights_list && highlights_list?.length ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.loader}
                  onRefresh={this.onRefreshEclass}
                />
              }
              style={styles.flex1}
              showsVerticalScrollIndicator={false}
              data={highlights_list}
              renderItem={({ item, index }) => this.renderClassesList(item)}
              ListFooterComponent={this.renderLoaderMoreButton()}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : null}

          {/* Fab Button */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Upload')}
            activeOpacity={0.7}
            style={styles.fabBtn}>
            <Entypo name="plus" size={28} color={Colors.WHITE} />
          </TouchableOpacity>

          <Modal
            visible={this.state.modalVisible}
            animationType="fade"
            transparent
            onTouchEnd={() => this.setState({ modalVisible: false })}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}>
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: Colors.WHITE,
                  borderRadius: 8,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible: false });
                    this.props.navigation.navigate('CreateLeague', {
                      item: this.state.leagueData,
                    });
                  }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderBottomColor: Colors.GRAY_2,
                    borderBottomWidth: 1,
                  }}>
                  <Text style={{ fontSize: 16 }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    this.deleteLeague((item = this.state.leagueData))
                  }
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                  }}>
                  <Text style={{ fontSize: 16 }}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: false })}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                  }}>
                  <Text style={{ fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {this.props.role === 'staff' ?

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.changePassModalVisible}
              onRequestClose={() =>
                this.setState({ changePassModalVisible: false })
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
                      Change Password?
                    </Text>
                    {/* <Text
                      style={{
                        fontSize: 16,
                        color: Colors.GRAY_1,
                        marginVertical: 10,
                        textAlign: 'center',
                      }}>
                      Enter New Password
                    </Text> */}

                    <View style={{ width: '100%', marginTop: 10 }}>
                      {/* <Text style={{ color: Colors.GRAY_1 }}>Code</Text> */}
                      <TextInput
                        placeholder="New Password"
                        secureTextEntry={true}
                        onChangeText={value => this.setState({ newPassword: value })}
                        value={this.state.newPassword}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      {/* <Text style={{ color: Colors.GRAY_1 }}>Code</Text> */}
                      <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        onChangeText={value => this.setState({ confirmPassword: value })}
                        value={this.state.confirmPassword}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Button
                        height={50}
                        name={'Update Password'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.WHITE,
                        }}
                        btnStyle={{}}
                        onPress={
                          () => {
                            this.onPressUpdatePassword();
                          }
                          // this.setState({changePassModalVisible: false})
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>

            : null}

          {this.renderReportModal()}

          {/* <----------Events------------> */}
          {/* <View>
              <EventPost
                profileImage={dummy}
                ProfileName={'Jennifer Dave'}
                PostTime={'8 min ago'}
                postImage={homeBg1}
                EventStatus={'Interested'}
                EventDate={'23'}
                EventDay={'Wed'}
                EventTitle={'UEFA Champions League Final'}
                EventDescription={
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              />
            </View> */}
          {/* <----------Events------------> */}

          {/* <----------Post------------> */}

          {/* <Post
              profileImage={dummy}
              ProfileName={'Jennifer Dave'}
              PostTime={'8 min ago'}
              PostDescription={
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
              }
              postImage={homeBg1}
            /> */}
          {/* <----------Post------------> */}
          {/* </ScrollView> */}
          {/* {this.state.adModalVisible ? (
            <AdModal visible={this.state.adModalVisible} />
          ) : null} */}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    role: state.Auth.role,
    highlights: state.HighlightsReducer.highlights,
    highlights_list: state.HighlightsReducer.highlights_list,
    postLikeData: state.PostLikeReducer.postLikeData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getHighlights: payload =>
      dispatch(HighlightsMiddleware.getHighlights(payload)),
    postLike: payload => dispatch(PostLikeMiddleware.postLike(payload)),
    deleteLeague: payload =>
      dispatch(HighlightsMiddleware.deleteLeague(payload)),
    updatePassword: payload => dispatch(AuthMiddleware.updatePassword(payload)),
    reportPost: payload => dispatch(PostCreateMiddleware.postReport(payload))
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  containerLeagues: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.GRAY_2,
    marginTop: 3,
  },

  headingView: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  headDate: {
    //flexDirection: 'column',
    width: '75%',
    paddingVertical: 5,
    //justifyContent: 'center',
    // backgroundColor: 'red',
  },
  HeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  Text: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  iconImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },

  postContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  postContentContainer: {
    height: 100,
    backgroundColor: Colors.BLUE_LIGHT,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  postTitle: {
    color: Colors.GRAY_3,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  postDate: {
    marginBottom: 10,
    color: Colors.GRAY_3,
    fontSize: 12,
  },

  bgImage: {
    height: 180,
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
  shareview: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 25
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf: 'center'
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 120,
    marginVertical: 20,
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
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    // height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});
