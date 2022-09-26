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
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Tag,
  Post,
  CoachProfile,
  SearchBar,
  TrainingSession,
} from '../../../Components';
import {
  calendar,
  clock,
  dummy,
  map_marker,
  playBlueIcon,
  searchIcon,
} from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../Styles';
import Feed from '../../../Components/Feed';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import GetFacilityMiddleware from '../../../Store/Middleware/GetFacilityMiddleware';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import GetCoachesMiddleware from '../../../Store/Middleware/GetCoachesMiddleware';
import GetCoachesAction from '../../../Store/Actions/GetCoachesAction';
import GetFacilityAction from '../../../Store/Actions/GetFacilityAction';
import { img_url } from '../../../Store/Apis';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';


class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSport: undefined,
      loader: false,
      filter: '',
      filter: '',
      date: new Date(),
      isShowDateModal: false,
      isProducts: false,
    };
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
  };

  renderSessionList = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          const Item = this.props.route.params.CoachItem;
          console.log('6r', Item, item);
          // return;
          this.props.navigation.navigate('CoachParticipant', {
            session: item,
            coach: Item,
          });
        }}>
        <TrainingSession
          trainingImage={item.image ? { uri: img_url + item.image } : dummy}
          trainingType={item.title}
          trainingPrice={`$${item.price}`}
          sessionTime={item.duration}
        />
      </TouchableOpacity>
    );
  };

  renderproducts = item => {
    // console.log('new Date(item?.date).getDate()', item);
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

  componentDidMount() {
    let date = this.state.date;

    let Item = this.props.route.params.CoachItem;
    this.props.getScheduleTypes().then(sportTypes => {
      this.setState({ selectedSport: sportTypes[0]?.id }, () => {
        this.props.getCoachSession({
          schedule_type: this.state.selectedSport,
          coach_id: Item.user_id ? Item.user_id : Item?.id,
          date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
          filter: '',
        });
      });
    });
    this.props
      .getFacilityProd({
        id: Item.user_id ? Item.user_id : Item?.id
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));

  }
  componentWillUnmount() {
    this.props.resetCoachSession();
    this.props.resetProducts();
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

  getSessions = () => {
    let date = this.state.date;
    this.props.resetCoachSession();
    let Item = this.props.route.params.CoachItem;
    this.props
      .getCoachSession({
        schedule_type: this.state.selectedSport,
        coach_id: Item.user_id,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        filter:
          this.state.filter === 'Daily Hour'
            ? 'daily'
            : this.state.filter.toLowerCase(),
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressScheduleType = (oneSport, index) => {
    this.props.resetCoachSession();
    this.setState({ filter: '', date: new Date(), isProducts: false })

    this.setState({ selectedSport: oneSport.id }, () => {
      let Item = this.props.route.params.CoachItem;
      this.props.getCoachSession({
        schedule_type: oneSport.id,
        coach_id: Item.user_id,
        filter: '',
        date: '',
      });
    });
  };
  onChangeFilter = filter => {
    this.setState({ filter }, () => this.getSessions())
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

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.date ? this.state.date : new Date()}
        // minimumDate={new Date()}
        onConfirm={date => {
          this.setState({ isShowDateModal: false, date: date }, () =>
            this.getSessions(),
          );
        }}
        onCancel={() => {
          this.setState({ isShowDateModal: false });
        }}
      />
    );
  };



  render() {
    const Item = this.props.route.params.CoachItem;
    const { scheduleTypes, coachSessions_list, coachSessions, getFacilityProduct, getFacilityProduct_list } = this.props;
    let products = {
      id: 5,
      title: 'Products'
    }
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Coach"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <ScrollView style={styles.mainView}>
            <View
              style={{
                borderRadius: 20,
                width: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  alignItems: 'center',
                  paddingVertical: 20,
                }}>
                <Image
                  source={
                    Item?.profile_image
                      ? { uri: img_url + Item?.profile_image }
                      : dummy
                  }
                  style={{ width: 100, height: 100, marginHorizontal: 10 }}
                />
                <View style={{ width: '60%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {Item.username}
                  </Text>
                  <Text>{Item.sportname + ' Trainer'}</Text>
                  {/* <Text>{'Coaching : ' + Item.experience + ' Years'}</Text> */}
                </View>
              </View>

              <View>
                <Text>{Item.description}</Text>
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

            <View style={{ width: '100%' }}>
              {!coachSessions && !this.state.isProducts ? (
                <ActivityIndicator color={Colors.BLUE} size={'large'} />
              ) : !this.state.isProducts ?
                <FlatList
                  style={{ flex: 1, paddingHorizontal: 5 }}
                  showsVerticalScrollIndicator={false}
                  data={coachSessions_list}
                  renderItem={this.renderSessionList}
                  ListEmptyComponent={
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 40,
                      }}>
                      <Text style={{ color: Colors.GRAY_3, fontSize: 17 }}>
                        No Session Found
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
                  renderItem={({ item }) => this.renderproducts(item)}
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
          </ScrollView>
          {this.renderDateModal()}

        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    scheduleTypes: state.ScheduleReducer.scheduleTypes,
    coachSessions_list: state.GetCoachesReducer.coachSessions_list,
    coachSessions: state.GetCoachesReducer.coachSessions,
    getFacilityProduct: state.GetFacilityReducer.getfacilityProducts,
    getFacilityProduct_list: state.GetFacilityReducer.getfacilityProducts_list,

  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getScheduleTypes: () => dispatch(ScheduleMiddleware.getScheduleTypes()),
    resetCoachSession: () => dispatch(GetCoachesAction.resetCoachSession()),
    getCoachSession: payload =>
      dispatch(GetCoachesMiddleware.getCoachSession(payload)),
    getFacilityProd: payload => dispatch(GetFacilityMiddleware.getFacilityProd(payload)),
    resetProducts: () => dispatch(GetFacilityAction.resetFacilityProduct()),

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
    // marginTop:20
    // alignSelf: 'center',
    // backgroundColor:'red'
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
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
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    justifyContent:'center'
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
    justifyContent:'center',

  },
});
