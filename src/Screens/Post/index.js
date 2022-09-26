import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { Text, Header } from '../../Components';
import {
  bin_black,
  commentIcon,
  dummy,
  likedIcon,
  likeIcon,
  Send,
  shareIcon,
  close,
  check_blue
} from '../../Assets';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import { img_url } from '../../Store/Apis';
import { dummyImage } from '../../Config';
import PostCreateMiddleware from '../../Store/Middleware/PostCreateMiddleware';
import PostLikeMiddleware from '../../Store/Middleware/PostLikeMiddleware';
import HighlightsMiddleware from '../../Store/Middleware/HighlightsMiddleware';
import GetUserInfoMiddleware from '../../Store/Middleware/GetUserInfoMiddleware';
import ChatMiddleware from '../../Store/Middleware/ChatMiddleware';
import moment from 'moment';
import BottomSheet from 'reanimated-bottom-sheet';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Shadow from '../../Components/Shadow/Shadow'


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      loader: true,
      pageLoader: false,
      // postLiked: undefined
      highlightData: null,
      highlightCopy: [],
      getPostByUserData: null,
      getPostByUserDataCopy: [],
      ismessage: false,
      isSuccess: false,
      isChat: false,
      isSelection: false,
    };
  }

  componentDidMount() {
    if (this.props.route.params.isShare) {
      this.BottomSheet_ref.snapTo(1);
    }
    this.props
      .getPostComments({
        // id: this.props.route.params.item.id
        id:
          this.props.route.params.type == 'highlights'
            ? (id = this.props.route.params.item.content_id)
            : (id = this.props.route.params.item.id),
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));

    this.props.getPostByUser({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.user_id)
          : (id = this.props.route.params.item.user_id),
    });

    const highlightData = this?.props?.route?.params?.item;
    this.setState({ highlightData });

    const getPostByUserData = this?.props?.route?.params?.item;
    this.setState({ getPostByUserData });
    console.warn('data', this.props.route.params.item);
    // console.warn('data', this.props?.postByUser);
  }

  postDelete = item => {
    console.warn(item.content_id);
    // this.props.postDelete({ id: item.content_id });
    this.props.postDelete({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = item.content_id)
          : (id = item.id),
    }).then(() => this.sheetRef.snapTo(0))
      .catch();

  };

  onRefresh = () => {
    this.props.getPostComments({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.content_id)
          : (id = this.props.route.params.item.id),
    });
    // .then(() => this.setState({ pageLoader: false }))
    // .catch(() => this.setState({ pageLoader: false }));
  };

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { getPostCommentsData } = this.props;
      this.props
        .getPostComments(getPostCommentsData.next_page_url, '')
        .then(() => {
          this.setState({ loader: false });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  renderLoaderMoreButton = () => {
    const { getPostCommentsData } = this.props;
    const { loader } = this.state;
    return getPostCommentsData.next_page_url ? (
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

  renderUsersList = item => (
    <TouchableOpacity
      onPress={() => {
        if (item.user_id === this.props.user.id) {
          this.props.navigation.navigate('UserProfile');
        } else {
          this.props.navigation.navigate('OthersProfile', {
            type: 'highlights',
            item,
          });
        }
      }}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: Colors.GRAY_2,
        paddingVertical: 10,
      }}>
      <View>
        <Image
          source={{
            uri: item?.profile_image
              ? img_url + item?.profile_image
              : dummyImage,
          }}
          style={{ width: 40, height: 40, borderRadius: 30 }}
        />
      </View>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>{item?.username}</Text>
        <Text style={styles.userName}>{item?.comment}</Text>
      </View>
      <View style={{ position: 'absolute', right: 3, top: 10 }}>
        <Text>({moment(item?.created_at).format('MMM DD YYYY')})</Text>
      </View>
    </TouchableOpacity>
  );

  onRefreshGetFollowing = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getPostComments({
          // this.props.route.params.item.id
          id:
            this.props.route.params.type == 'highlights'
              ? (id = this.props.route.params.item.content_id)
              : (id = this.props.route.params.item.id),
        })
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  handleChangeComment = value => {
    this.setState({ comment: value });
    // console.warn(value);
  };

  shareviafeed = () => {
    this.setState({ loader: true })
    this.props.sharePost({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = this.props.route.params.item.content_id)
          : (id = this.props.route.params.item.id),
    })
      .then(data => this.setState({ loader: false, ismessage: data.message, isSuccess: data.success }))
      .catch(() => this.setState({ loader: false }));
  }

  shareviachat = item => {
    let post_id =
      this.props.route.params.type == 'highlights'
        ? (id = this.props.route.params.item.content_id)
        : (id = this.props.route.params.item.id);
    console.warn(item.id, item.user.id, post_id);
    this.setState({ loader: true }, () => {
      this.props
        .sendMessage({
          chathead_id: item.id,
          recipient_user: item.user.id,
          message: null,
          content_id: post_id
        })
        .then(data => { this.BottomSheet_ref.snapTo(1), this.setState({ loader: false, ismessage: data.message, isSuccess: data.success }) })
        .catch(() => this.setState({ loader: false }));
    });
  }
  shareviaGroupchat = item => {
    let post_id =
      this.props.route.params.type == 'highlights'
        ? (id = this.props.route.params.item.content_id)
        : (id = this.props.route.params.item.id);
    this.setState({ loader: true }, () => {
      this.props
        .sendGroupMessage({
          Group_id: item.id,
          message: null,
          content_id: post_id
        })
        .then(data => {
          this.BottomSheet_ref.snapTo(1),
            this.setState({ loader: false, ismessage: data.message, isSuccess: data.success })
        })
        .catch(() => this.setState({ loader: false }));
    });
  }
  shareviatext = () => {
    console.log("text")
  }

  // postLike = item => {
  //   console.warn(item);
  //   this.props.postLike({
  //     // id: item.content_id,
  //     id:
  //       this.props.route.params.type == 'highlights'
  //         ? (id = item.content_id)
  //         : (id = item.id),
  //     type: 'post',
  //   });
  // };

  postLikeHighlight = item => {
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
      id: (id = item.content_id),
      type: 'post',
      postUserId: item.user_id,
    });
  };

  postLikeUser = item => {
    console.warn('posttttLike', item);
    let getPostByUserDataCopy = this.props.postsData;

    let index = getPostByUserDataCopy.findIndex(val => val.id === item.id);

    if (!getPostByUserDataCopy[index].like) {
      let updateItem = { ...item, like: true, liked_count: item.liked_count + 1 };

      getPostByUserDataCopy.splice(index, 1, updateItem);
    } else {
      let index = getPostByUserDataCopy.findIndex(val => val.id === item.id);
      let updateItem = {
        ...item,
        like: false,
        liked_count: item.liked_count - 1,
      };

      getPostByUserDataCopy.splice(index, 1, updateItem);
    }
    this.setState({ getPostByUserDataCopy });
    return;
    this.props.postLike({
      id: (id = item.id),
      type: 'post',
      postUserId: item.user_id,
    });
  };

  postComment = item => {
    // let type = this.props.route.params.type
    this.props.postComment({
      id:
        this.props.route.params.type == 'highlights'
          ? (id = item.content_id)
          : (id = item.id),
      // postType: 'post',
      comment: this.state.comment,
      postUserId: item.user_id,
    });

    this.setState({ comment: '' });
    setTimeout(() => {
      // write your functions
      this.onRefreshGetFollowing();
    }, 1000);
  };

  renderChatList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.shareviachat(item)}
        activeOpacity={0.7}
        style={styles.button}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: item.user?.profile_image
                ? `${img_url}${item.user.profile_image}`
                : dummyImage,
            }}
            style={{ width: 65, height: 65, borderRadius: 100, alignSelf: 'center' }}
          />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: Colors.GRAY_3, fontWeight: 'bold', textAlign: 'center' }}>
            {item.user.username}
          </Text>
        </View>

      </TouchableOpacity>
    );
  };

  renderGroupChatList = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.shareviaGroupchat(item)}
        activeOpacity={0.7}
        style={styles.button}>
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: item.image
                ? `${img_url}${item.image}`
                : dummyImage,
            }}
            style={{ width: 65, height: 65, borderRadius: 100, alignSelf: 'center' }}
          />
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ color: Colors.GRAY_3, fontWeight: 'bold', textAlign: 'center' }}>
            {item.name}
          </Text>
        </View>

      </TouchableOpacity>
    );
  };


  renderContent = () => {
    let userItem = this.props.route.params.item;
    let data = [];
    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.BottomSheet_ref.snapTo(2);
            this.setState({ isSelection: false, ismessage: false })
            // if (this.props.role === 'store') {
            //     this.props.navigation.navigate('StoreBottomTabs');
            // } else {
            //     this.props.navigation.goBack();
            // }
          }}>
          <Image
            source={close}
            style={styles.closeImage}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View style={styles.sheetBody}>
          {!this.state.ismessage ?
            !this.state.isSelection ?
              <>
                <Text style={styles.heading}>Share via</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={styles.sharebtn}
                    onPress={() => this.setState({ isSelection: true }, () => { this.props.getChatHeads(); this.props.getGroupChatHeads(); this.BottomSheet_ref.snapTo(0); })}>
                    <Text style={styles.subheading}>Chat</Text>
                  </TouchableOpacity>
                  {!userItem?.is_my_post ?
                    <TouchableOpacity style={styles.sharebtn}
                      onPress={() => this.shareviafeed()}
                    >
                      <Text style={styles.subheading}>Feed</Text>
                    </TouchableOpacity>
                    : null}
                  {/* <TouchableOpacity style={styles.sharebtn}
                    onPress={() => this.shareviatext()}>
                    <Text style={styles.subheading}>Text</Text>
                  </TouchableOpacity> */}

                </View>
              </> :
              <>
                <Text style={styles.heading}>Share with</Text>
                <View style={{ width: "90%", height: 100, alignItems: 'center' }}>

                  <FlatList
                    key={1}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={

                      <Text style={{ color: Colors.GRAY_3, fontSize: 17, alignSelf: 'center' }}>
                        No Chat Found
                      </Text>

                    }
                    data={this.props.chatHeads}
                    renderItem={this.renderChatList}
                  />

                </View>
                <View style={{ width: "90%", height: 100, alignItems: 'center', marginTop: 5 }}>

                  <FlatList
                    key={1}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={

                      <Text style={{ color: Colors.GRAY_3, fontSize: 17, alignSelf: 'center' }}>
                        No Chat Found
                      </Text>

                    }
                    data={this.props.GroupsHead}
                    renderItem={this.renderGroupChatList}
                  />

                </View>
                <TouchableOpacity style={{ marginVertical: 10, alignSelf: 'center' }} onPress={() => { this.BottomSheet_ref.snapTo(1), this.setState(({ isSelection: false })) }}>
                  <Text style={[styles.subheading, { color: Colors.BLUE }]}>Dismiss </Text>
                </TouchableOpacity>
              </>

            :
            <>
              {this.state.isSuccess ?
                <Image
                  source={check_blue}
                  style={styles.checkImage}
                  resizeMode={'contain'}
                />
                : <Image
                  source={close}
                  style={styles.checkImage}
                  resizeMode={'contain'}
                />}
              <Text style={styles.subheading}>{this.state.ismessage} </Text>


              <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { this.BottomSheet_ref.snapTo(1), this.setState(({ ismessage: false, isSelection: false })) }}>
                <Text style={[styles.subheading, { color: Colors.BLUE }]}>Dismiss </Text>
              </TouchableOpacity>

            </>
          }
        </View>
      </View>
    );
  };

  renderAlertSheet = () => {
    return (
      <View style={[styles.confirmationSheetContainer, { backgroundColor: Colors.BLUE_LIGHT }]}>
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
          <Text style={{ fontSize: 18 }}>Your post has been deleted</Text>
          <Text style={{ fontSize: 18 }}>Successfully !!!</Text>
        </View>
      </View>
    );
  };


  render() {
    let highlightData_id = this.state.highlightData?.id;
    let highlightData;
    if (highlightData_id) {
      highlightData = this.props?.highlights_list?.find(
        x => x.id === highlightData_id,
      );
    }

    let getPostByUserData_id = this.state.getPostByUserData?.id;
    let getPostByUserData;
    if (getPostByUserData_id) {
      getPostByUserData = this.props?.postsData?.find(
        x => x.id === getPostByUserData_id,
      );
    }
    const { getPostCommentsData, getPostCommentsData_list, loader } = this.props;

    let { user } = this.props;

    let share_image = this.props.route.params.item.shared_profile_image;
    let userItem =
      this.props?.route.params.type == 'highlights'
        ? highlightData
        : getPostByUserData;
    console.warn('userItem', userItem);
    return (
      <>
        <View style={styles.container}>
          <Header
            title={userItem?.title}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />


          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.pageLoader}
                onRefresh={this.onRefresh}
              />
            }>
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

            {userItem != undefined ?

              <View style={styles.mainView}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('OthersProfile', {
                        type: 'highlights',
                        item: userItem,
                      })
                    }
                    style={{ flexDirection: 'row' }}>
                    <View>
                      <Image
                        source={{
                          uri: userItem?.profile_image
                            ? img_url + userItem?.profile_image
                            : dummyImage,
                        }}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                      />
                    </View>
                    <View style={{ marginHorizontal: 15 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {userItem?.username}
                      </Text>
                      <Text>
                        {moment(userItem?.created_at).format('MMM DD YYYY')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {userItem?.is_my_post ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        right: 0,
                        position: 'absolute',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.postDelete(userItem)}
                        style={{ flexDirection: 'column' }}>
                        <Image
                          source={bin_black}
                          resizeMode="contain"
                          style={{ width: 15, height: 15, marginVertical: 10 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                {userItem?.is_shared ?
                  <View style={{ borderWidth: 1, borderBottomWidth: 0, borderColor: Colors.GRAY_2, marginTop: 10 }}>
                    <View style={styles.shareview}>
                      <Image
                        style={{ width: 50, height: 50, borderRadius: 30, marginRight: 10 }}
                        source={{ uri: userItem?.shared_profile_image != null ? img_url + userItem?.shared_profile_image : dummyImage }} />
                      <Text style={{ alignSelf: 'center' }}>{userItem?.shared_from != null ? userItem?.shared_from : "Profile Name"}</Text>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      <Text style={{ marginLeft: 25 }}>{userItem?.description}</Text>
                    </View>
                  </View> : null
                }
                {!userItem?.is_shared ?
                  <View style={{ marginVertical: 10 }}>
                    <Text>{userItem?.description}</Text>
                  </View> : null}

                <View style={{ borderRadius: 20 }}>
                  <Image
                    source={{ uri: img_url + userItem?.image }}
                    resizeMode="cover"
                    style={{ height: 300, width: '100%' }}
                  />
                </View>
                {userItem?.liked_count || userItem?.comment_count ? (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: Colors.GRAY_2,
                      flexDirection: 'row',
                      paddingVertical: 10,
                    }}>
                    <TouchableOpacity
                      // onPress={() => this.postLike(userItem)}
                      style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      <Image
                        source={likeIcon}
                        resizeMode="contain"
                        style={{ width: 20, height: 20, marginHorizontal: 5 }}
                      />
                      <Text>{userItem?.liked_count}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // onPress={() => this.postLike(userItem)}
                      style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                      <Image
                        source={commentIcon}
                        resizeMode="contain"
                        style={{ width: 20, height: 20, marginHorizontal: 5 }}
                      />
                      <Text>{userItem?.comment_count}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 10,
                  }}>
                  {userItem?.like ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.props?.route.params.type == 'highlights'
                          ? this.postLikeHighlight(userItem)
                          : this.postLikeUser(userItem)
                      }
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
                      onPress={() =>
                        this.props?.route.params.type == 'highlights'
                          ? this.postLikeHighlight(userItem)
                          : this.postLikeUser(userItem)
                      }
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
                    // onPress={onCommentPress}
                    style={{ flexDirection: 'row' }}>
                    <Image
                      source={commentIcon}
                      resizeMode="contain"
                      style={{ width: 20, height: 20, marginHorizontal: 5 }}
                    />
                    <Text>Comment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.BottomSheet_ref.snapTo(1)
                    }
                    style={{ flexDirection: 'row' }}>
                    <FontAwesome name="share-alt" style={{ marginHorizontal: 5 }} size={20} color={"#373737"} />

                    <Text>Share</Text>
                  </TouchableOpacity>



                </View>



                <View>
                  {!getPostCommentsData ? (
                    <ActivityIndicator
                      size={'large'}
                      color={Colors.BLUE}
                      style={styles.loadMoreContentContainer}
                    />
                  ) : null}
                  {getPostCommentsData_list &&
                    getPostCommentsData_list?.length ? (
                    <FlatList
                      refreshControl={
                        <RefreshControl
                          refreshing={loader}
                          onRefresh={this.onRefreshGetFollowing}
                        />
                      }
                      style={styles.flex1}
                      showsVerticalScrollIndicator={false}
                      // data={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                      data={getPostCommentsData_list}
                      renderItem={({ item, index }) => this.renderUsersList(item)}
                      // renderItem={this.renderUsersList}
                      ListFooterComponent={this.renderLoaderMoreButton()}
                    />
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: Colors.GRAY_2,
                  }}>
                  <TextInput
                    value={this.state.comment}
                    onChangeText={this.handleChangeComment}
                    placeholder="Write a comment..."
                    placeholderTextColor={Colors.GRAY_1}
                    style={styles.input}
                  />
                  {this.state.comment == '' ? (
                    <TouchableOpacity
                      disabled={true}
                      // onPress={() => this.postComment(userItem)}
                      style={{ paddingHorizontal: 10 }}>
                      <Image source={Send} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => this.postComment(userItem)}
                      style={{ paddingHorizontal: 10 }}>
                      <Image source={Send} style={{ width: 22, height: 22 }} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              : !this.state.loader ?
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                  <Text style={{ fontSize: 16 }}>Post not found or deleted</Text>
                </View>
                : null
            }
            {/* <----------Post------------> */}
          </ScrollView>
        </View>
        <BottomSheet
          ref={ref => (this.BottomSheet_ref = ref)}
          initialSnap={2}
          snapPoints={[350, 250, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />
        <BottomSheet
          ref={ref => (this.sheetRef = ref)}
          initialSnap={1}
          snapPoints={[250, 0]}
          borderRadius={10}
          renderContent={this.renderAlertSheet}
        />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    postsList: state.PostCreateReducer.postsList,
    getPostCommentsData: state.PostCreateReducer.getPostCommentsData,
    getPostCommentsData_list: state.PostCreateReducer.getPostCommentsData_list,
    postLikeData: state.PostLikeReducer.postLikeData,
    highlights: state.HighlightsReducer.highlights,
    highlights_list: state.HighlightsReducer.highlights_list,
    postsData: state.HighlightsReducer.postsData,
    chatHeads: state.ChatReducer.chatHeads,
    GroupsHead: state.ChatReducer.GroupChatHeads,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    postDelete: payload => dispatch(PostCreateMiddleware.postDelete(payload)),
    postComment: payload => dispatch(PostCreateMiddleware.postComment(payload)),
    getPostComments: payload =>
      dispatch(PostCreateMiddleware.getPostComments(payload)),
    postLike: payload => dispatch(PostLikeMiddleware.postLike(payload)),
    getHighlights: payload =>
      dispatch(HighlightsMiddleware.getHighlights(payload)),
    getPostByUser: payload =>
      dispatch(HighlightsMiddleware.getPostByUser(payload)),
    sharePost: payload =>
      dispatch(HighlightsMiddleware.sharePost(payload)),
    sendMessage: payload => dispatch(ChatMiddleware.sendMessage(payload)),
    sendGroupMessage: payload => dispatch(ChatMiddleware.sendGroupMessage(payload)),
    getChatHeads: () => dispatch(ChatMiddleware.getChatHeads()),
    getGroupChatHeads: () => dispatch(ChatMiddleware.getGroupChatHeads()),


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
  input: { flex: 1, paddingLeft: 14, color: Colors.GRAY_3 },

  footer: {
    paddingVertical: 4,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_1,
    alignItems: 'center',
  },
  flex1: { flex: 1 },

  confirmationSheetContainer: {
    backgroundColor: "#faf9fb",
    height: 380,
    paddingHorizontal: 35,
    paddingTop: 20,
    borderRadius: 20,
  },
  closeImage: {
    width: 14,
    height: 14,
  },
  sheetBody: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sharebtn: {
    width: 80,
    height: 80,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginHorizontal: 10,
    ...Shadow
  },
  heading: {
    fontSize: 22,
    color: Colors.BLACK,
    fontWeight: '400',
    marginBottom: 10
  },
  subheading: {
    fontSize: 14,
    color: '#373737',
    fontWeight: '500',
  },
  checkImage: {
    width: 40,
    height: 40,
    tintColor: Colors.BLUE,
    marginBottom: 10,
  },
  shareview: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 25
  },
  imgContainer: { justifyContent: 'center' },
  button: {
    width: 100
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
});
