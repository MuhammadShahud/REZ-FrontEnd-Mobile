import React, { Component } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  dummy,
  eye,
  filterIcon,
  map_marker,
  searchIcon,
  plus_white,
} from '../../Assets';
import { Header, TextInput, Text, SearchBar } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import GetFollowingMiddleware from '../../Store/Middleware/GetFollowingMiddleware';
import FollowMiddleware from '../../Store/Middleware/FollowMiddleware';
import { img_url } from '../../Store/Apis';
import { dummyImage } from '../../Config';


class Following extends Component {
  state = {
    loader: true,
    followingCopy: [],
  };

  componentDidMount() {
    let userItem = this.props.route.params.userItem
    this.props
      .getFollowingUser({
        id: this.props.route.params.type == 'userProfile' ? (id = this.props.user.id) : (id = userItem.id)
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));

    return;
  }

  FollowUser = (item) => {
    let followingCopy = this.props.getFollowingData_list

    let index = followingCopy.findIndex(val => val.id === item.id)

    if (!followingCopy[index].isFollowing) {
      let updateItem = { ...item, isFollowing: true, }


      followingCopy.splice(index, 1, updateItem)

    } else {
      let index = followingCopy.findIndex(val => val.id === item.id)
      let updateItem = { ...item, isFollowing: false, }

      followingCopy.splice(index, 1, updateItem)

    }
    this.setState({ followingCopy })
    this.props
      .followUser({ id: item.id })
  };

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { getFollowingData } = this.props;
      this.props
        .getFollowingUser(getFollowingData.next_page_url, '')
        .then(() => {
          this.setState({ loader: false });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  renderLoaderMoreButton = () => {
    const { getFollowingData } = this.props;
    const { loader } = this.state;
    console.warn('useridasdasdasdasdasdasd', this.props.user, this.props.route.params.userItem);
    return getFollowingData.next_page_url ? (
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

  renderUsersList = item =>
  // console.warn(item);
  (
    <TouchableOpacity
      onPress={() => this.props.navigation.navigate('OthersProfile', { item })}
      activeOpacity={0.7} style={styles.userItemContainer}>
      <Image source={{
        uri: item?.profile_image
          ? img_url + item?.profile_image
          : dummyImage,
      }} style={styles.avatarImage} />
      <View style={styles.userNameContainer}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.userName}>{item.role}</Text>
      </View>
      {item?.is_my_id ? (null) : (
      <View>
      {/* {item.id !== this.props.user.id && item.id !== this.props.route.params.userItem.id ? ( */}
      {this.props.route.params.type == 'userProfile' ? (
        <View style={styles.followContainer}>
          {item.isFollowing ? (
            <TouchableOpacity onPress={() => this.FollowUser(item)} style={styles.buyNowContainer}>
              {/* <Image source={plus_white} style={styles.plusImage} /> */}
              <Text style={styles.buyNowText}>Following</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.FollowUser(item)} style={styles.buyNowContainer}>
              <Image source={plus_white} style={styles.plusImage} />
              <Text style={styles.buyNowText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.followContainer}>
          {item.isFollowing ? (
            <TouchableOpacity onPress={() => this.FollowUser(item)} style={styles.buyNowContainer}>
              {/* <Image source={plus_white} style={styles.plusImage} /> */}
              <Text style={styles.buyNowText}>Following</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.FollowUser(item)} style={styles.buyNowContainer}>
              <Image source={plus_white} style={styles.plusImage} />
              <Text style={styles.buyNowText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      </View>
      )}
      {/* ) : null} */}
    </TouchableOpacity>
  )

  onRefreshGetFollowing = () => {
    let userItem = this.props.route.params.userItem
    this.props
      .getFollowingUser({
        id: this.props.route.params.type == 'userProfile' ? (id = this.props.user.id) : (id = userItem.id)
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  };

  render() {
    const { getFollowingData, getFollowingData_list, loader } = this.props;
    // const { userFollow } = this.props.route.params
    // console.warn('getFollowingData', getFollowingData)

    console.warn('==========================>>>>>', getFollowingData_list)
    return (
      <View style={styles.container}>
        <Header
          title={'Following'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        {/* <SearchBar /> */}
        {!getFollowingData ? (
          <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />
        ) : null}
        {getFollowingData_list && getFollowingData_list?.length ? (
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
            data={getFollowingData_list}
            renderItem={({ item, index }) => this.renderUsersList(item)}
            // renderItem={this.renderUsersList}
            ListFooterComponent={this.renderLoaderMoreButton()}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    getFollowingData: state.GetFollowingReducer.getFollowingData,
    getFollowingData_list: state.GetFollowingReducer.getFollowingData_list,
    followUserData: state.FollowReducer.followUserData,

  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getFollowingUser: payload => dispatch(GetFollowingMiddleware.getFollowingUser(payload)),
    followUser: payload => dispatch(FollowMiddleware.followUser(payload)),

  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(Following);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  buyNowContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  buyNowText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: { flex: 1 },
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.GRAY_3,
    fontWeight: '500',
    fontSize: 18,
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  followContainer: {
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  plusImage: {
    width: 13,
    height: 13,
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
