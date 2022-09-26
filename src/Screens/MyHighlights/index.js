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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import {
  calendar,
  commentIcon,
  likedIcon,
  likeIcon,
  map_marker,
  searchIcon,
} from '../../Assets';
import { Header, Tag, Text } from '../../Components';
import { dummyImage } from '../../Config';
import HighlightsAction from '../../Store/Actions/HighlightsAction';
import { img_url } from '../../Store/Apis';
import HighlightsMiddleware from '../../Store/Middleware/HighlightsMiddleware';
// import PostLikeMiddleware from '../../Store/Middleware/PostLikeMiddleware';
import { Colors } from '../../Styles';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
      loader: true,
      modalVisible: false,
      leagueData: null,
      highlightCopy: [],
    };
  }

  componentDidMount() {
    this.props
      .getMyHighlights()
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { highlights } = this.props;
      this.props
        .getMyHighlights(highlights.next_page_url, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  deleteLeague = item => {
    console.warn(item);

    this.props.deleteLeague({
      id: item.content_id,
    });

    setTimeout(() => {
      this.onRefreshEclass(), this.setState({ modalVisible: false });
    }, 2000);
  };

  renderLoaderMoreButton = () => {
    const { myhighlights } = this.props;
    const { loader } = this.state;
    return myhighlights.next_page_url ? (
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

  renderClassesList = item => {
    console.warn(this.props.user);
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
          <View style={{ marginVertical: 10 }}>
            <Text>{item?.description}</Text>
          </View>
          {item?.image == '' ? null : (
            <View style={{ borderRadius: 20 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Post', {
                    type: 'highlights',
                    item,
                  })
                }>
                <Image
                  source={{ uri: img_url + item?.image }}
                  resizeMode="stretch"
                  style={{ height: 320, width: '100%' }}
                />
              </TouchableOpacity>
            </View>
          )}
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

            {(this.props.user.role === 'facility' &&
              item.content_type === 'league' &&
              item.user_id == this.props.user.id) ||
              (this.props.user.role === 'staff' &&
                item.content_type == 'league' &&
                item.user_id === this.props.user.id) ? (
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
          {item.content_type == 'event' ? (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('EventDetails', {
                  event_id: item?.content_id,
                  type: 'highlights',
                  screen: 'MyEvents'
                })
              }
              style={styles.containerLeagues}>
              <View style={styles.headingView}>
                <View style={styles.headDate}>
                  <Text style={styles.HeadingText}>{item?.event_name}</Text>
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.HeadingText}>Details :</Text>
                    <Text style={styles.Text}>{item?.description}</Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={calendar} style={styles.iconImg} />
                      <Text style={styles.dateText}>{item?.event_date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={map_marker} style={styles.iconImg} />
                      <Text style={styles.dateText}>{item?.event_address}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
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
          )}
        </View>
      )
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getMyHighlights(undefined)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  render() {
    const { myhighlights, myhighlights_list, loader, role } = this.props;

    return (
      <>
        <View style={styles.container}>
          <Header
            title="My Events"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          {!myhighlights ? (
            <ActivityIndicator
              size={'large'}
              color={Colors.BLUE}
              style={styles.loadMoreContentContainer}
            />
          ) : null}
          {myhighlights_list && myhighlights_list?.length ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={loader}
                  onRefresh={this.onRefreshEclass}
                />
              }
              style={styles.flex1}
              showsVerticalScrollIndicator={false}
              data={myhighlights_list}
              renderItem={({ item, index }) => this.renderClassesList(item)}
              ListFooterComponent={this.renderLoaderMoreButton()}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : null}

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
                    this.deleteLeague(this.state.leagueData)
                  }
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderBottomColor: Colors.GRAY_2,
                    borderBottomWidth: 1,
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
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    role: state.Auth.role,
    myhighlights: state.HighlightsReducer.myhighlights,
    myhighlights_list: state.HighlightsReducer.myhighlights_list,
    postLikeData: state.PostLikeReducer.postLikeData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getMyHighlights: payload =>
      dispatch(HighlightsMiddleware.getMyHighlights(payload)),
    // postLike: payload => dispatch(PostLikeMiddleware.postLike(payload)),

    deleteLeague: payload =>
      dispatch(HighlightsMiddleware.deleteLeague(payload)),
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
