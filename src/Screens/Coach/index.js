import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Tag,
  Post,
  CoachProfile,
  SearchBar,
} from '../../Components';
import { dummy, searchIcon } from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Styles';
import Feed from '../../Components/Feed';
import SelectDropdown from 'react-native-select-dropdown';
import GetCoachesMiddleware from '../../Store/Middleware/GetCoachesMiddleware';
import { connect } from 'react-redux';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      searchText: null,
    };
  }
  componentDidMount() {
    this.props
      .getAllCoachs()
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { getCoachesData } = this.props;
      this.props
        .getAllCoachs(getCoachesData.next_page_url, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { getCoachesData } = this.props;
    const { loader } = this.state;
    return getCoachesData.next_page_url ? (
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
      onPress={() =>
        this.props.navigation.navigate('CoachTraining', { CoachItem: item })
      }>
      <CoachProfile
        profileImage={dummy}
        profileName={item?.username}
        profileSports={item?.sportname}
        profileCoaching={item?.experience}
        description={item?.description}
        profileStars={item?.rating}
      />
    </TouchableOpacity>
  );

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getAllCoachs(undefined, this.state.searchText)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };
  onChangeSearchText = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getAllCoachs(undefined, this.state.searchText)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  render() {
    const { getCoachesData, getCoachesData_list, loader } = this.props;
    console.warn('COaaaachesss', getCoachesData_list);
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Coach"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          {/* <View
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
                style={{height: 15, width: 15}}
                resizeMode={'contain'}
              />
            </View>
            <View style={{width: '90%'}}>
              <TextInput placeholder="Search here" />
            </View>
          </View> */}
          <SearchBar
            onSubmitEditing={this.onChangeSearchText}
            onChangeText={text => this.setState({ searchText: text })}
          />

          <View style={styles.mainView}>
            {!getCoachesData ? (
              <ActivityIndicator
                size={'large'}
                color={Colors.BLUE}
                style={styles.loadMoreContentContainer}
              />
            ) : null}
            {getCoachesData_list && getCoachesData_list?.length ? (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={loader}
                    onRefresh={this.onRefreshEclass}
                  />
                }
                style={{ marginBottom: 10 }}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                // data={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                // renderItem={() => this.renderUsersList()}
                data={getCoachesData_list}
                renderItem={({ item }) => this.renderUsersList(item)}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 40,
                    }}>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                      No Coach Found
                    </Text>
                  </View>
                }
              />
            ) : getCoachesData ? <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 40,
              }}>
              <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                Coach Not Found
              </Text>
            </View> : null}
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    getCoachesData: state.GetCoachesReducer.getCoachesData,
    getCoachesData_list: state.GetCoachesReducer.getCoachesData_list,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getAllCoachs: (payload, searchText) =>
      dispatch(GetCoachesMiddleware.getAllCoachs(payload, searchText)),
  };
};

export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  mainView: {
    flex: 1,
    alignSelf: 'center',
    // backgroundColor:'red'
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  isSelectedView: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  isNotSelectedView: {
    backgroundColor: Colors.GRAY_4,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  sheetBody: {
    marginVertical: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  closeImage: { width: 60, height: 20 },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    justifyContent:'center',

  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf:'center'
  },

  flex1: { flex: 1 },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
});
