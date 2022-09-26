import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {

  FacilityCard
} from '../../Components';
import { yellowShirt } from '../../Assets';
import { Header, SearchBar } from '../../Components';
import { Colors } from '../../Styles';
import GetFacilityMiddleware from '../../Store/Middleware/GetFacilityMiddleware';
import { connect } from 'react-redux';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';
import moment from 'moment';

class FacilitiesTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      searchText: null,
    };
  }
  componentDidMount() {
    // this.props
    //   .getSchedulesOther()
    //   .then(() => this.setState({ loader: false }))
    //   .catch(() => this.setState({ loader: false }));

    this.props
      .getAllFacility()
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressLoadMore = () => {
    // this.setState({ loader: true }, () => {
    //   const { getShedulesData } = this.props;
    //   this.props
    //     .getSchedulesOther(getShedulesData.next_page_url, '')
    //     .then(() => this.setState({ loader: false }))
    //     .catch(() => this.setState({ loader: false }));
    // });

    this.setState({ loader: true }, () => {
      const { getFacilityData } = this.props;
      this.props
        .getAllFacility(getFacilityData.next_page_url, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { getFacilityData } = this.props;
    const { loader } = this.state;
    return getFacilityData.next_page_url ? (
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

  renderUsersList = item => {
    console.log('new Date(item?.date).getDate()', item);
    return (
      console.warn('item:', item),
      (
        // <TouchableOpacity
        //   onPress={() => this.props.navigation.navigate('FacilityDetails', { item })}
        //   activeOpacity={0.7} style={styles.teamContainer}>
        //   <Image source={{
        //     uri: item?.profile_image
        //       ? img_url + item?.profile_image
        //       : dummyImage,
        //   }} style={styles.teamImage} />
        //   <Text style={styles.teamName}>{item.username}</Text>
        // </TouchableOpacity>

        //  <TouchableOpacity
        //           activeOpacity={0.7}
        //           style={styles.teamContainer}
        //           onPress={() =>
        //             this.props.navigation.navigate('FacilityEvents', {item})
        //           }>
        //           <View
        //             style={{
        //               width: '20%',
        //               alignItems: 'center',
        //               justifyContent: 'center',
        //               paddingVertical: 5,
        //             }}>
        //             <Text style={styles.eventDateText}>
        //               {new Date(item?.date).getDate()}
        //             </Text>
        //             <Text style={styles.eventDayText}>
        //               {moment(new Date(item?.date)).format('MMM')}
        //             </Text>
        //           </View>
        //           <Image
        //             source={{
        //               uri: item?.image ? img_url + item?.image : dummyImage,
        //             }}
        //             style={styles.teamImage}
        //           />
        //           <View style={{marginLeft: 8, width: '60%'}}>
        //             <Text
        //               numberOfLines={1}
        //               style={{fontSize: 15, fontWeight: 'bold', color: Colors.BLACK}}>
        //               {item?.title}
        //             </Text>
        //             <Text
        //               style={
        //                 styles.eventTime
        //               }>{`${item?.start_time} - ${item?.end_time}`}</Text>
        //             <Text
        //               style={{fontSize: 14, fontWeight: 'bold', color: Colors.GREEN}}>
        //               ${item?.price}
        //             </Text>
        //           </View>
        //         </TouchableOpacity>
        //          
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('FacilityEvents', { item })
          }>
          <FacilityCard
            profileImage={
              { uri: item?.profile_image ? img_url + item?.profile_image : dummyImage }
            }

            profileName={item?.username}
            profileStars={item?.rating}

          />
        </TouchableOpacity>

      )
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getAllFacility(undefined, '')
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };
  // onChangeSearchText = text => {
  //   this.setState({ loader: true, searchText: text }, () => {
  //     console.log(this.state.searchText, text, 'TEXT====>');
  //     this.props
  //       .getSchedulesOther(undefined, text)
  //       .then(() => this.setState({ loader: false }))
  //       .catch(() => this.setState({ loader: false }));
  //   });
  // };
  onChangeSearchText = () => {
    this.setState({ loader: true }, () => {
      this.props
        .getAllFacility(undefined, this.state.searchText)
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  render() {
    const { getFacilityData, getFacilityData_list, loader } = this.props;
    console.warn('Facilities', getFacilityData_list);
    return (
      <View style={styles.container}>
        <Header
          title={'Facilities'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />

        <SearchBar onSubmitEditing={this.onChangeSearchText}
          onChangeText={text => this.setState({ searchText: text })} />

        <View style={{ flex: 1, alignSelf: 'center' }}>
          {!getFacilityData ? (
            <ActivityIndicator
              size={'large'}
              color={Colors.BLUE}
              style={styles.loadMoreContentContainer}
            />
          ) : null}
          {getFacilityData_list && getFacilityData_list?.length ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={loader}
                  onRefresh={this.onRefreshEclass}
                />
              }
              style={{ flex: 1, marginBottom: 10 }}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              // data={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
              // renderItem={() => this.renderUsersList()}
              data={getFacilityData_list}
              renderItem={({ item }) => this.renderUsersList(item)}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    getFacilityData: state.GetFacilityReducer.getFacilityData,
    getFacilityData_list: state.GetFacilityReducer.getFacilityData_list,

    getShedulesData: state.GetFacilityReducer.getShedulesData,
    getShedulesData_list: state.GetFacilityReducer.getShedulesData_list,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getAllFacility: (payload, searchText) =>
      dispatch(GetFacilityMiddleware.getAllFacility(payload, searchText)),
    getSchedulesOther: payload =>
      dispatch(GetFacilityMiddleware.getSchedulesOther(payload)),
  };
};

export default connect(mapStateToProps, mapsDispatchToProps)(FacilitiesTypes);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  flex1: { flex: 1 },

  teamContainer: {
    marginVertical: 8,
    marginHorizontal: 5,
    backgroundColor: Colors.GRAY_4,
    flex: 1,
    elevation: 2,
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 5,
    flexDirection: 'row',
  },
  teamImage: {
    width: 50,
    height: 50,
    borderRadius: 360,
  },
  teamsListContainer: {
    justifyContent: 'space-between',
  },
  teamName: {
    padding: 8,
    fontSize: 12,
    color: Colors.BLACK,
    alignSelf: 'flex-start',
    fontWeight: '500',
  },
  eventDateText: {
    color: Colors.GREEN,
    fontSize: 20,
    fontWeight: '800',
  },
  eventDayText: {
    color: Colors.GRAY_1,
    fontSize: 12,
  },
  eventTime: {
    color: Colors.GRAY_5,
    fontWeight: 'bold',
    fontSize: 12,
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
