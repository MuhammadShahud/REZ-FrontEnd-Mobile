import { objectExpression } from '@babel/types';
import React, { Component } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { FlatList } from 'react-native-gesture-handler';
import { chat, cricketBg, dummy } from '../../../Assets';
import { Header, Text, Button } from '../../../Components';
import { Colors } from '../../../Styles';
import { connect } from 'react-redux';
import GetUserInfoMiddleware from '../../../Store/Middleware/GetUserInfoMiddleware';
import { img_url } from '../../../Store/Apis';
import { dummyImage } from '../../../Config';
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import GetFacilityMiddleware from '../../../Store/Middleware/GetFacilityMiddleware';

class UserProfile extends Component {
  // state = {
  //   loader: false,
  //   pageLoader: false,

  // };

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      pageLoader: false,
      btnIndex: 0,
      eClasses: [],
    };
  }

  SearchTeam = text => {
    let { user } = this.props;

    // this.props.getFollowUser({
    //   id: user.id
    // });
    return;
  };

  componentDidMount = () => {
    this.props.getUserInfoById({
      id: this.props.user.id,
    });

    this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        this.onRefresh();
      }, 2000);
    });
  };

  onRefresh = () => {
    this.props.getUserInfoById({
      id: this.props.user.id,
    });
    // .then(() => this.setState({ pageLoader: false }))
    // .catch(() => this.setState({ pageLoader: false }));
  };

  onPressChat = () => {
    // this.props.getChatSession({recipient_user_id: 2});
  };

  renderPosts = item => {
    console.warn('renderPosts');
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Post', { item })}>
        <Image source={{ uri: img_url + item?.image }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  // getClasses = () => {
  //   let {user} = this.props;

  //   console.warn('dataa');
  //   this.props.getFacilityEClassesById({id: user.id}).then(data => {
  //     this.setState({eClasses: data.data}, () => {
  //       this.renderFacilityClasses();
  //     });
  //   });
  // };

  // renderFacilityClasses = item => {
  //   console.warn('item', item);
  //   return (
  //     <View
  //       style={{
  //         width: '100%',
  //         alignSelf: 'center',
  //         backgroundColor: Colors.GRAY_4,
  //         marginVertical: 10,
  //         paddingVertical: 12,
  //       }}>
  //       <Image
  //         source={{uri: img_url + item?.item.file_path}}
  //         style={{width: 60, height: 60, borderRadius: 8, marginLeft: 8}}
  //       />
  //       <Text style={{fontSize: 16, fontWeight: 'bold', paddingLeft: 8}}>
  //         Session name:
  //       </Text>
  //       <Text style={{paddingLeft: 8}}>{item?.item.session_name}</Text>

  //       <View style={{marginVertical: 8}}>
  //         <Text style={{fontSize: 16, fontWeight: 'bold', paddingLeft: 8}}>
  //           Description:
  //         </Text>
  //         <Text style={{paddingHorizontal: 8}}>{item?.item.description}</Text>
  //       </View>

  //       <Text style={{fontSize: 16, fontWeight: 'bold', paddingLeft: 8}}>
  //         Price:
  //       </Text>
  //       <Text style={{paddingLeft: 8}}>{item?.item.price}</Text>
  //     </View>
  //   );
  // };

  // renderSchedules = item => {
  //   let {user} = this.props;
  //   if (user.role === 'facility') {
  //     this.props.navigation.navigate('ScheduleList');
  //   } else {
  //     this.props.navigation.navigate('Schedule');
  //   }
  // };

  render() {
    let { user } = this.props;
    const userItem = this.props?.getUserInfoData;
    console.log("---------", userItem?.roleInfo)
    // console.warn('userItem', this.state.eClasses);

    // console.warn('type??',this.props?.route?.params?.type)
    // const userFollow = this.props?.getFollowersData
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
                uri: user?.profile_image
                  ? img_url + user?.profile_image
                  : dummyImage,
              }}
              style={styles.avatarImage}
            />
            <View style={styles.userDetailContainer}>
              <Text style={styles.name}>{userItem?.username}</Text>
              <View style={styles.userStatsContainer}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Following', {
                      type: 'userProfile',
                    })
                  }>
                  <Text style={styles.statsName}>Following</Text>
                  <Text style={styles.stats}>{userItem?.follow}</Text>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Follower', {
                        type: 'userProfile',
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
          {userItem?.description ? (
            <View style={{ paddingVertical: 8 }}>
              <Text>{userItem?.description}</Text>
            </View>
          ) : null}
          <Button
            name={'Edit Profile'}
            btnStyle={styles.actionBtnLeft}
            backgroundColor={Colors.BLUE}
            textStyle={styles.colorWhite}
            onPress={() => {
              this.props.navigation.navigate('Profile');
            }}
          />
          <View style={styles.flex1}>
            <Text style={styles.imageSectionHeaderText}>Posts</Text>
            <View>
              <FlatList
                data={userItem?.posts}
                style={styles.postImagesContainer}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  // console.warn('image',img_url)
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
          </View>
        </ScrollView>
        {/* Fab Button */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Upload')}
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
    getUserInfoData: state.GetUserInfoReducer.getUserInfoData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getUserInfoById: payload =>
      dispatch(GetUserInfoMiddleware.getUserInfoById(payload)),
    getFacilityEClassesById: payload =>
      dispatch(GetFacilityMiddleware.getFacilityEClassesById(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(UserProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  actionBtnLeft: {
    flex: 1,
    marginRight: 3,
    marginVertical: 10,
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

  bio: {
    color: Colors.GRAY_1,
    fontSize: 12,
    fontWeight: '400'
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
    margin: 5,
    borderRadius: 6,
  },
  postImagesContainer: {
    // marginHorizontal: 0,
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
