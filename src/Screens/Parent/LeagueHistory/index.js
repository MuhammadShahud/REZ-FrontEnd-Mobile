import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { calendar, dummy, homeBg1, team } from '../../../Assets';
import { Header, Text } from '../../../Components';
import { Colors } from '../../../Styles';
import UserMiddleware from '../../../Store/Middleware/UserMiddleware';
import { connect } from 'react-redux';
import { img_url } from '../../../Store/Apis';
import { dummyImage } from '../../../Config';

// export default class LeagueHistory extends Component {
class LeagueHistory extends Component {
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
    };
  }

  componentDidMount() {
    this.props.leaguesHistory();
    // console.warn('Historyy Dataa',this.props?.leaguesHistory);
  }

  onRefresh= () => {
    this.setState({ loader: true }, () => {
      this.props
        .leaguesHistory()
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLeagueMatches = (item) => {
    // console.warn('itemmmm',item);
    return (
      <View>
        <Text style={styles.sectionHeader}>{item?.league_name}</Text>
        <View activeOpacity={0.7} style={styles.profileContainer}>
          <View style={styles.teamsContainer}>
            <View>
              <Image
                source={{
                  uri: item?.team1_image
                    ? img_url + item?.team1_image
                    : dummyImage,
                }}
                style={styles.profileImage}
              />
              <Text style={styles.stats}>{item?.team1_score}</Text>
            </View>
            <View>
              <Image source={{
                  uri: item?.team2_image
                    ? img_url + item?.team2_image
                    : dummyImage,
                }} style={styles.profileImage} />
              <Text style={styles.stats}>{item?.team2_score}</Text>
            </View>
          </View>
          <View style={styles.profileDetailContainer}>
            <Text style={styles.profileName} numberOfLines={1}>
              {item?.team1_name + ' vs ' + item?.team2_name}
            </Text>
            <View style={styles.matchDateContainer}>
              <Image
                source={calendar}
                style={styles.calendarIcon}
                resizeMode={'contain'}
              />
              <Text
                style={{
                  color: Colors.GRAY_3,
                  fontWeight: '500',
                }}>{item?.end_date}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  render() {
    const { leaguesHistoryData } = this.props;
    console.warn('Dataaaa', leaguesHistoryData);

    return (
      <View
        style={{ flex: 1, paddingHorizontal: 25, backgroundColor: Colors.WHITE }}>
        <Header
          title={'Leagues History'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.pageLoader}
              onRefresh={this.onRefresh}
            />
          }>
          <View>
            {/* <Image source={homeBg1} style={styles.featureImage} /> */}
            <View style={styles.userDetailContainer}>
              <View style={styles.userStatsContainer}>
                <View>
                  <Text style={styles.statsName}>Total Leagues</Text>
                  <Text style={styles.stats}>{leaguesHistoryData?.total_match}</Text>
                </View>
                <View>
                  <Text style={styles.statsName}>Total Wins</Text>
                  <Text style={styles.stats}>{leaguesHistoryData?.win}</Text>
                </View>
                <View>
                  <Text style={styles.statsName}>Total Loss</Text>
                  <Text style={styles.stats}>{leaguesHistoryData?.lose}</Text>
                </View>
              </View>
            </View>
          </View>

          <FlatList
            data={leaguesHistoryData?.league_history}
            renderItem={({ item, index }) => this.renderLeagueMatches(item)}
          />
          {/* <Text style={styles.sectionHeader}>Premier League</Text>
          <FlatList data={[1, 1]} renderItem={this.renderLeagueMatches} /> */}
        </ScrollView>
      </View>
    );
  }
}


const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    // postsList: state.PostCreateReducer.postsList,
    // getPostCommentsData: state.PostCreateReducer.getPostCommentsData,
    // getPostCommentsData_list: state.PostCreateReducer.getPostCommentsData_list,
    // postLikeData: state.PostLikeReducer.postLikeData,
    // highlights: state.HighlightsReducer.highlights,
    // highlights_list: state.HighlightsReducer.highlights_list,
    // postsData: state.HighlightsReducer.postsData,
    leaguesHistoryData: state.UserReducer.leaguesHistoryData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    // postDelete: payload => dispatch(PostCreateMiddleware.postDelete(payload)),
    // postComment: payload => dispatch(PostCreateMiddleware.postComment(payload)),
    // getPostComments: payload =>
    //   dispatch(PostCreateMiddleware.getPostComments(payload)),
    // postLike: payload => dispatch(PostLikeMiddleware.postLike(payload)),
    // getHighlights: payload =>
    //   dispatch(HighlightsMiddleware.getHighlights(payload)),
    // getPostByUser: payload =>
    //   dispatch(HighlightsMiddleware.getPostByUser(payload)),

    leaguesHistory: payload => dispatch(UserMiddleware.leaguesHistory(payload)),

  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(LeagueHistory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  userDetailContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 20,
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
    color: Colors.GREEN,
    fontWeight: '600',
    alignSelf: 'center',
    fontSize: 18,
    paddingVertical: 5,
  },
  statsName: {
    color: Colors.GRAY_3,
    fontWeight: '500',
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.GRAY_3,
  },
  profileContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.GRAY_4,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginHorizontal: 4,
  },
  profileDetailContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  profileName: {
    color: Colors.GRAY_3,
    fontWeight: '500',
    fontSize: 16,
  },
  teamsContainer: {
    flexDirection: 'row',
  },
  matchDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    height: 15,
    width: 15,
    marginRight: 10,
  },
  featureImage: {
    height: 220,
    width: '100%',
    borderRadius: 15,
  },
});
