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
  Alert,
  Dimensions
} from 'react-native';
import {
  Tag
} from '../../../Components';
import { yellowShirt, check_blue, close, dropdownIcon } from '../../../Assets';
import { Header, SearchBar } from '../../../Components';
import { Colors } from '../../../Styles';
import GetFacilityMiddleware from '../../../Store/Middleware/GetFacilityMiddleware';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import GetFacilityAction from '../../../Store/Actions/GetFacilityAction';
import RoomMiddleware from '../../../Store/Middleware/RoomMiddleware';
import { connect } from 'react-redux';
import { dummyImage } from '../../../Config';
import { img_url } from '../../../Store/Apis';
import moment from 'moment';
import StarRating from 'react-native-star-rating-widget';
import DatePicker from 'react-native-date-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown';

class FacilityEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      searchText: null,
      id: this.props.route?.params?.item?.id,
      filter: '',
      date: new Date(),
      isShowDateModal: false,
      isOpen: false,
      Room_id: '',
      subroom_id: '',
      isfetch: false,
      isProducts: false,
      selectedSport: '',
    };
  }
  componentDidMount() {
    let date = this.state.date;
    this.props.getRoom(this.props.route?.params?.item?.id)

    this.props.getScheduleTypes().then(sportTypes => {
      this.setState({ selectedSport: sportTypes[0]?.id }, () => {
        this.props
          .getSchedulesbyid({
            scheduletype: this.state.selectedSport,
            id: this.props.route?.params?.item?.id,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            filter: '',
            room_id: '',
            subroom_id: '',
          })
          .then(() => this.setState({ loader: false }))
          .catch(() => this.setState({ loader: false }));
      });
    });
    this.props
      .getFacilityProd({
        id: this.props.route?.params?.item?.id
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));

  }

  getSchedules = () => {
    let date = this.state.date;
    this.props.resetSession();
    const id = this.props.route?.params?.item?.id;
    this.props
      .getSchedulesbyid({
        scheduletype: this.state.selectedSport,
        id: id,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        filter:
          this.state.filter === 'Daily Hour'
            ? 'daily'
            : this.state.filter.toLowerCase(),
        room_id: this.state.Room_id,
        subroom_id: this.state.Subroom_id,
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  componentWillUnmount() {
    this.props.resetSession();
    this.props.resetProducts();
  }

  onChangeFilter = filter => {
    this.setState({ filter: filter });
  };

  clearFilter = () => {
    this.setState({ filter: '', date: new Date(), room_id: '', subroom_id: '' })

  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { getFacilityProduct } = this.props;
      this.props
        .getFacilityProd({
          next_page_url: getFacilityProduct.next_page_url,
          id: this.props.route?.params?.item?.id
        })
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  onPressScheduleType = (oneSport, index) => {
    this.props.resetSession();
    this.setState({ filter: '', date: new Date(), room_id: '', subroom_id: '', isProducts: false })

    this.setState({ selectedSport: oneSport.id }, () => {
      const id = this.props.route?.params?.item?.id;
      this.props
        .getSchedulesbyid({
          scheduletype: oneSport.id,
          id: id,
          date: '',
          filter: '',
          room_id: '',
          subroom_id: ''
        })
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });

    // this.props.getCoachSession({
    //   schedule_type: oneSport.id,
    //   coach_id: Item.user_id,
    // });

  };

  renderLoaderMoreButton = () => {
    const { getFacilityProduct } = this.props;
    const { loader } = this.state;
    return getFacilityProduct.next_page_url ? (
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

  renderScheduleList = item => {
    return (
      // console.warn('item:', item),
      (
        // <TouchableOpacity
        //   onPress={() => this.props.navigation.navigate('FacilityDetails', { item })}
        //   activeOpacity={0.7} style={styles.eventContainer}>
        //   <Image source={{
        //     uri: item?.profile_image
        //       ? img_url + item?.profile_image
        //       : dummyImage,
        //   }} style={styles.eventImage} />
        //   <Text style={styles.eventName}>{item.username}</Text>
        // </TouchableOpacity>


        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.eventContainer}
          onPress={() =>
            this.props.navigation.navigate('FacilityDetails', { item: item, facility_id: this.props.route?.params?.item?.id })
          }>
          <View
            style={{
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 5,
            }}>
            <Text style={styles.eventDateText}>
              {new Date(item?.date).getDate()}
            </Text>
            <Text style={styles.eventDayText}>
              {moment(new Date(item?.date)).format('MMM')}
            </Text>
          </View>
          <Image
            source={{
              uri: item?.image ? img_url + item?.image : dummyImage,
            }}
            style={styles.eventImage}
          />
          <View style={{ marginLeft: 8, width: '60%' }}>
            <Text
              numberOfLines={1}
              style={{ fontSize: 15, fontWeight: 'bold', color: Colors.BLACK }}>
              {item?.title}
            </Text>
            <Text
              style={
                styles.eventTime
              }>{`${moment(item?.start_time, 'hh:mm a').format('LT')} - ${moment(item?.end_time, 'hh:mm a').format('LT')}`}</Text>
            <Text
              style={{ fontSize: 14, fontWeight: 'bold', color: Colors.GREEN }}>
              ${item?.price}
            </Text>
          </View>
        </TouchableOpacity>
        // <TouchableOpacity
        //   onPress={() =>
        //     this.props.navigation.navigate('FacilityDetails', { item })
        //   }>
        //   <FacilityCard
        //     facilityImage={
        //       { uri: item?.image ? img_url + item?.image : dummyImage }
        //     }
        //     EventDate={item?.date}
        //     facilityName={item?.title}
        //     facilityTimings={`${item?.start_time} - ${item?.end_time}`}

        //     price={item?.price}

        //   />
        // </TouchableOpacity>

      )
    );
  };

  renderfacilityproducts = item => {
    return (
      // console.warn('item:', item),
      (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetail', { item })
          }
          activeOpacity={0.7}
          style={styles.productItemContainer}>
          <Image
            source={{ uri: img_url + item.product_img }}
            style={{ width: 130, height: 100 }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 6,
            }}>
            <Text style={styles.productName}>{item.product_name}</Text>
            {/* <View style={styles.ratingContainer}>
          <AirbnbRating
            size={10}
            reviewSize={25}
            showRating={false}
            //   onFinishRating={this.ratingCompleted}
            style={{paddingVertical: 10}}
          />
        </View> */}
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: Colors.BLACK,
              }}>
              ${item.product_price}
            </Text>
          </View>
        </TouchableOpacity>

      )
    );
  };

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.date ? this.state.date : new Date()}
        // minimumDate={new Date()}
        onConfirm={date => {
          this.setState({ isShowDateModal: false, date: date });
        }}
        onCancel={() => {
          this.setState({ isShowDateModal: false });
        }}
      />
    );
  };

  renderSubRoom = id => {
    this.setState({ isfetch: true })
    this.props.getSubRoom({ id, user: this.props.route?.params?.item?.id }).then((data) =>
      this.setState({ isfetch: false })
    )
      .catch(() => this.setState({ isfetch: false }));
  }

  renderContent = () => {
    const { scheduleTypes } = this.props;
    let Rooms = this.props.getRooms;
    let subRooms = this.props.getSubRooms;


    return (
      <View style={styles.confirmationSheetContainer}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ isOpen: false })
            this.BottomSheet_ref.snapTo(2);
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
          {/* <Text style={{fontSize:16,fontWeight:500, color:Colors.BLACK, marginBottom:10}}>Filters</Text> */}
          {scheduleTypes && !this.state.isProducts ? <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>

              <Tag
                key={1}
                isActive={this.state.filter === 'Daily'}
                text={'Daily'}
                onPress={() => this.onChangeFilter('Daily')}
              />
              <Tag
                key={2}
                isActive={this.state.filter === 'Weekly'}
                text={'Weekly'}
                onPress={() => this.onChangeFilter('Weekly')}
              />
              <Tag
                key={3}
                isActive={this.state.filter === 'Monthly'}
                text={'Monthly'}
                onPress={() => this.onChangeFilter('Monthly')}
              />


            </View>
            <View style={{ width: '100%', marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => this.setState({ isShowDateModal: true })}
                style={styles.dateContainer}>
                <Text style={{ color: Colors.GRAY_1 }}>
                  {this.state.date
                    ? moment(this.state.date).format('LL')
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
            : null}

          {Rooms && Rooms.length > 0 ?
            <View style={{ width: '100%', marginTop: 5 }}>
              <SelectDropdown
                data={Rooms}
                dropdownIconPosition="right"
                defaultButtonText='Select Room'
                renderDropdownIcon={() => {
                  return (
                    <Image
                      resizeMode="contain"
                      source={dropdownIcon}
                      style={{ width: 10, height: 10 }}
                    />
                  );
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.name;
                }}
                rowTextForSelection={(item, index) => {
                  return item.name
                }}
                buttonTextStyle={styles.dropDownBtnText}
                buttonStyle={styles.btnStyle}
                onSelect={(selectedItem, index) => {
                  this.setState({ Room_id: selectedItem.id }),
                    this.renderSubRoom(selectedItem.id)
                }}
              />
            </View>
            :
            null
          }
          {this.state.isfetch ? <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          />
            : null}

          {subRooms && this.state.Room_id && !this.state.isfetch ?
            <View style={{ width: '100%', marginTop: 5 }}>
              {subRooms.length > 0 ?
                <SelectDropdown
                  data={subRooms}
                  dropdownIconPosition="right"
                  defaultButtonText='Select Room'
                  renderDropdownIcon={() => {
                    return (
                      <Image
                        resizeMode="contain"
                        source={dropdownIcon}
                        style={{ width: 10, height: 10 }}
                      />
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.name;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.name
                  }}
                  buttonTextStyle={styles.dropDownBtnText}
                  buttonStyle={styles.btnStyle}
                  onSelect={(selectedItem, index) => {
                    this.setState({ Subroom_id: selectedItem.id });
                  }}
                /> : <Text style={{ textAlign: 'center' }}>This room doesn't have subroom</Text>}
            </View>
            : null}
          <View style={{ width: '100%', marginTop: 15 }}>
            <Tag
              key={1}
              isActiveBlue={true}
              text={"Apply Filter"}
              onPress={() => { this.BottomSheet_ref.snapTo(2), this.getSchedules(), this.setState({ isOpen: false }) }
              }
            />
          </View>
        </View>
      </View>
    );
  };

  onRefreshEclass = () => {
    this.setState({ loader: true }, () => {
      //   this.props
      //     .getSchedulesbyid(this.props.route?.params?.item?.id)
      //     .then(() => this.setState({ loader: false }))
      //     .catch(() => this.setState({ loader: false }));
      // });
      this.props.getScheduleTypes().then(sportTypes => {
        this.setState({ selectedSport: sportTypes[0]?.id }, () => {
          this.props
            .getSchedulesbyid({ scheduletype: this.state.selectedSport, id: this.props.route?.params?.item?.id })
            .then(() => this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
        });
      });
    });
  };

  render() {
    const { getShedulesData, getShedulesData_list, loader, getFacilityProduct, getFacilityProduct_list } = this.props;
    const { scheduleTypes } = this.props;

    //  console.warn('Facilities Products', getFacilityProduct);
    const item = this.props.route?.params?.item;
    let { height, width } = Dimensions.get('window');

    let products = {
      id: 5,
      title: 'Products'
    }
    return (
      <>
        <View style={styles.container}>
          <Header
            title={'Facilities'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          {/* <SearchBar onChangeText={this.onChangeSearchText} /> */}

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              alignItems: 'center',
              paddingVertical: 20,
            }}>
            <Image
              source={{ uri: item?.profile_image ? img_url + item?.profile_image : dummyImage }}
              style={{ width: 100, height: 100, marginHorizontal: 10, borderRadius: 100 }}
            />
            <View style={{ width: '60%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 5, marginBottom: 5 }}>
                {item?.username}
              </Text>
              <StarRating
                rating={item?.rating}
                onChange={() => null}
                color={Colors.GREEN}
                starSize={15}
                starStyle={{ width: '3%' }}
              />

            </View>
          </View>

          <View style={styles.tagsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {scheduleTypes &&
                scheduleTypes?.map((x, i) => {
                  return (
                    <Tag
                      key={x.id}
                      isActive={x.id === this.state.selectedSport}
                      text={x.title}
                      onPress={() => this.onPressScheduleType(x, i)}
                    />
                  );
                })}
              {this.state.selectedSport ?
                <Tag
                  key={products.id}
                  isActive={this.state.isProducts}
                  text={products.title}
                  onPress={() => this.setState({ isProducts: true, selectedSport: true })}
                /> : null}
            </ScrollView>

          </View>
          {scheduleTypes && !this.state.isProducts ? <>
            <View style={{ width: '100%', marginBottom: 10 }}>

              <Tag
                key={1}
                isActive={this.state.isOpen}
                text={'Filters'}
                onPress={() => { this.BottomSheet_ref.snapTo(1), this.setState({ isOpen: true }) }}
              />
              {/* <Tag
                key={2}
                isActive={this.state.filter === 'Weekly'}
                text={'Weekly'}
                onPress={() => this.onChangeFilter('Weekly')}
              />
              <Tag
                key={3}
                isActive={this.state.filter === 'Monthly'}
                text={'Monthly'}
                onPress={() => this.onChangeFilter('Monthly')}
              /> */}


            </View>
            {/* <View style={{ width: '100%', marginTop: 5 }}>
              <TouchableOpacity
                onPress={() => this.setState({ isShowDateModal: true })}
                style={styles.dateContainer}>
                <Text style={{ color: Colors.GRAY_1 }}>
                  {this.state.date
                    ? moment(this.state.date).format('LL')
                    : 'Select Date'}
                </Text>
              </TouchableOpacity>
            </View> */}
          </>
            :
            <ScrollView contentContainerStyle={{ height: 35 }} horizontal>
              <Tag
                key={'contract'}
                isActive={true}
                text={'Contract'}
                onPress={() => this.setState({ isProducts: true, selectedSport: true })}
              />
              <Tag
                key={'pass'}
                isActive={true}
                text={'Pass'}
                onPress={() => this.setState({ isProducts: true, selectedSport: true })}
              />
              <Tag
                key={'Package'}
                isActive={true}
                text={'Package'}
                onPress={() => this.setState({ isProducts: true, selectedSport: true })}
              />
              <Tag
                key={'EClass'}
                isActive={true}
                text={'E-Classes'}
                onPress={() => this.setState({ isProducts: true, selectedSport: true })}
              />
            </ScrollView>
          }

          <View style={{ flex: 1 }}>
            {!getShedulesData && !this.state.isProducts ? (
              <ActivityIndicator
                size={'large'}
                color={Colors.BLUE}
                style={styles.loadMoreContentContainer}
              />
            ) : !this.state.isProducts ?
              <FlatList
                key={"_"}
                // refreshControl={
                //   <RefreshControl
                //     refreshing={loader}
                //     onRefresh={this.onRefreshEclass}
                //   />
                // }
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                // numColumns={2}
                // data={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                // renderItem={() => this.renderScheduleList()}
                data={getShedulesData_list}
                renderItem={({ item }) => this.renderScheduleList(item)}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 40,
                    }}>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                      No Events Found
                    </Text>
                  </View>
                }

              /> : null
            }
            {this.state.isProducts && getFacilityProduct ?
              <FlatList
                // refreshControl={
                //   <RefreshControl
                //     refreshing={loader}
                //     onRefresh={this.onRefreshEclass}
                //   />
                // }
                key={"#"}
                style={{ flex: 1, paddingHorizontal: 5 }}
                contentContainerStyle={{ alignItems: 'center' }}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                // data={[1, 1, 1, 1, 1, 1, 1, 1, 1]}
                data={getFacilityProduct_list}
                renderItem={({ item }) => this.renderfacilityproducts(item)}
                ListEmptyComponent={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 40,
                    }}>
                    <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                      No Product Found
                    </Text>
                  </View>
                }
              />

              : null
            }
          </View>

          {this.renderDateModal()}
        </View>
        <BottomSheet
          ref={ref => (this.BottomSheet_ref = ref)}
          initialSnap={2}
          snapPoints={[250, 370, 0]}
          borderRadius={10}
          renderContent={this.renderContent}
        />

      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    getFacilityData: state.GetFacilityReducer.getFacilityData,
    getFacilityData_list: state.GetFacilityReducer.getFacilityData_list,
    getFacilityProduct: state.GetFacilityReducer.getfacilityProducts,
    getFacilityProduct_list: state.GetFacilityReducer.getfacilityProducts_list,
    scheduleTypes: state.ScheduleReducer.scheduleTypes,
    getShedulesData: state.GetFacilityReducer.getShedulesData,
    getShedulesData_list: state.GetFacilityReducer.getShedulesData_list,
    getRooms: state.RoomReducer.Rooms,
    getSubRooms: state.RoomReducer.SubRooms,

  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getScheduleTypes: () => dispatch(ScheduleMiddleware.getScheduleTypes()),
    getAllFacility: (payload, searchText) =>
      dispatch(GetFacilityMiddleware.getAllFacility(payload, searchText)),
    getSchedulesbyid: payload =>
      dispatch(GetFacilityMiddleware.getSchedulesbyid(payload)),
    getFacilityProd: payload => dispatch(GetFacilityMiddleware.getFacilityProd(payload)),
    resetProducts: () => dispatch(GetFacilityAction.resetFacilityProduct()),
    resetSession: () => dispatch(GetFacilityAction.resetAllSchedules()),

    getRoom: (payload) => dispatch(RoomMiddleware.GetAllRooms(payload)),
    getSubRoom: payload => dispatch(RoomMiddleware.GetAllSubRooms(payload)),


  };
};

export default connect(mapStateToProps, mapsDispatchToProps)(FacilityEvents);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  flex1: { flex: 1 },

  eventContainer: {
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
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: 360,
  },
  eventListContainer: {
    justifyContent: 'space-between',
  },
  eventName: {
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
  productItemContainer: {
    width: 130,
    marginVertical: 8,
    backgroundColor: Colors.GRAY_4,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    marginHorizontal: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 12,
    color: Colors.BLACK,
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.WHITE,
    height: 380,
    paddingHorizontal: 35,
    paddingTop: 20,
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
  checkImage: {
    width: 40,
    height: 40,
  },
  sheetHeading: {
    fontSize: 18,
    color: Colors.GRAY_3,
    paddingVertical: 5,
  },
  subHeading: {
    fontSize: 22,
    color: Colors.GRAY_3,
    fontWeight: '500',
  },
  dropDownBtnText: {
    textAlign: 'center',
    color: Colors.GRAY_1,
    fontSize: 16,
  },
  btnStyle: {
    backgroundColor: Colors.BLUE_LIGHT,
    width: '100%',
    marginTop: 5,
  },
  w20: {
    width: 20,
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
