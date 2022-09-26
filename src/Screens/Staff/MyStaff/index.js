import React, {Component} from 'react';
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
} from '../../../Assets';
import {Header, TextInput, Text, SearchBar} from '../../../Components';
import {Colors} from '../../../Styles';
import FollowMiddleware from '../../../Store/Middleware/FollowMiddleware';
import {connect} from 'react-redux';
import SearchAllUsersMiddleware from '../../../Store/Middleware/SearchAllUsersMiddleware';
import {dummyImage} from '../../../Config';
import {img_url} from '../../../Store/Apis';
import Entypo from 'react-native-vector-icons/Entypo';

class index extends Component {
  state = {
    loader: false,
    searchText: '',
    followerSearchCopy: [],
  };

  componentDidMount() {}

  renderUsersList = (item, index) => {
    console.log(item);
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('StaffDetail', {staff: item});
        }}
        activeOpacity={0.7}
        style={styles.userItemContainer}>
        <Image
          source={{
            uri: item?.profile_image
              ? `${img_url}${item?.profile_image}`
              : dummyImage,
          }}
          style={styles.avatarImage}
        />
        <View style={styles.userNameContainer}>
          <Text style={styles.name}>{item?.username}</Text>
          <Text style={styles.userName}>{item?.email}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {loader} = this.state;
    const {user} = this.props;
    console.log('user render=>', JSON.stringify(user?.staffInfo));
    return (
      <View style={styles.container}>
        <Header
          title={'My Staff'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />

        {/* <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          /> */}

        <FlatList
          style={styles.flex1}
          showsVerticalScrollIndicator={false}
          data={user?.staffInfo}
          renderItem={({item, index}) => this.renderUsersList(item, index)}
          ListEmptyComponent={() => (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  color: Colors.GRAY_1,
                  fontSize: 16,
                  paddingVertical: 40,
                }}>
                Staff not found
              </Text>
            </View>
          )}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AddStaff')}
          activeOpacity={0.7}
          style={styles.fabBtn}>
          <Entypo name="plus" size={28} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  flex1: {flex: 1},
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

  flex1: {flex: 1},
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
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
});
