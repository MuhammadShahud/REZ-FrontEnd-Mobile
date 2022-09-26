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
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Tag,
  Post,
  CoachProfile,
  SearchBar,
  Loader,
} from '../../../Components';
import { calendar, clock, dummy, map_marker, searchIcon } from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../Styles';
import Feed from '../../../Components/Feed';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import GetCoachesMiddleware from '../../../Store/Middleware/GetCoachesMiddleware';
import moment from 'moment';
import { img_url } from '../../../Store/Apis';
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
    };
  }

  componentDidMount() {
    let session = this.props.route.params.session;
    this.setState({ loader: true }, () => {
      this.props
        .getSessionDetail({ session_id: session.id })
        .then(() => this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  }
  renderUsersList = ({ item, index }) => {
    return (
      <View>
        <Image
          source={
            item?.profile_image ? { uri: img_url + item?.profile_image } : dummy
          }
          style={{
            width: 60,
            height: 60,
            marginHorizontal: 10,
            borderRadius: 100,
          }}
        />
      </View>
    );
  };

  render() {
    const { coachSessionDetail } = this.props;
    console.log('coachSessionDetail =>60', coachSessionDetail);
    return (
      <>
        <View style={styles.container}>
          <Header
            title="Coach"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          {coachSessionDetail && (
            <View style={styles.mainView}>
              <View
                style={{
                  backgroundColor: Colors.GRAY_2,
                  borderRadius: 20,
                  padding: 10,
                  marginVertical: 10,
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
                      coachSessionDetail?.session?.image
                        ? { uri: img_url + coachSessionDetail?.session?.image }
                        : dummy
                    }
                    style={{ width: 100, height: 100, marginHorizontal: 10 }}
                  />
                  <View style={{ width: '60%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {coachSessionDetail?.session?.title}
                    </Text>
                    <Text>{coachSessionDetail?.session?.description}</Text>
                  </View>
                </View>
              </View>

              <View style={{ marginVertical: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Participants
                </Text>
                <View>
                  <FlatList
                    style={{ marginVertical: 20 }}
                    horizontal
                    data={coachSessionDetail?.participants}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderUsersList}
                    ListEmptyComponent={<Text>Participants Not Found</Text>}
                  />
                </View>
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={calendar}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {moment(coachSessionDetail?.session?.date).format('LL')}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={clock}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {`${coachSessionDetail?.session?.start_time} - ${coachSessionDetail?.session?.end_time}`}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Image
                    source={map_marker}
                    style={{ height: 30, width: 30 }}
                    resizeMode={'contain'}
                  />
                  <Text style={{ fontWeight: 'bold', marginHorizontal: 5 }}>
                    {coachSessionDetail?.session?.address}
                  </Text>
                </View>
              </View>

              <View style={{ position: 'absolute', bottom: 20, width: '100%' }}>
                <Button
                  name="Book Now"
                  backgroundColor={Colors.BLUE}
                  textStyle={{ color: Colors.WHITE }}
                  onPress={() => {
                    let coach = this.props.route.params.coach;
                    this.props.navigation.navigate('SelectBookAppointment', {
                      coach,
                    });
                  }}
                />
              </View>
            </View>
          )}
          <Loader loader={this.state.loader} />
        </View>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    coachSessionDetail: state.GetCoachesReducer.coachSessionDetail,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getSessionDetail: payload =>
      dispatch(GetCoachesMiddleware.getSessionDetail(payload)),
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
    marginTop: 20,
    // alignSelf: 'center',
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
});
