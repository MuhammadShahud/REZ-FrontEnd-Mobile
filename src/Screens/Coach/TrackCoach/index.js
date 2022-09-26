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
  Dimensions,
  NativeModules,
  Platform
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
  chat_active,
  chat_inactive,
  clock,
  close,
  dummy,
  map_marker,
  modalBarIcon,
  playBlueIcon,
  searchIcon,
} from '../../../Assets';
import BottomSheet from 'reanimated-bottom-sheet';
import { Colors } from '../../../Styles';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import database from '@react-native-firebase/database';
import { connect } from 'react-redux';
import BookingMidleware from '../../../Store/Middleware/BookingMiddleware';
import ChatMiddleware from '../../../Store/Middleware/ChatMiddleware';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI';
const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };

class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coordinates: [
        'Twitter HQ, Market Street, San Francisco, CA, USA',
        'Apple Park Visitor Center',
      ],
      currentPosition: null,
    };

    this.mapView = null;
  }

  onReady = result => {
    this.mapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    });
  };

  onError = errorMessage => {
    console.log(errorMessage); // eslint-disable-line no-console
  };
  componentWillUnmount() {
    this.props.stopCoachTracking();
  }
  setDistance(distance, duration_in_traffic) {
    this.setState({
      distance: parseFloat(distance),
      durationInTraffic: parseInt(duration_in_traffic),
    });
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  onPressChat = () => {
    const params = this.props.route?.params;
    this.setState({ loader: true, btnIndex: 0 }, () => {
      this.props
        .getChatSession({
          recipient_user_id: params.coach_id
        })
        .then(chatHead => {
          this.setState({ loader: false });
          this.props.navigation.navigate('Chat', { chatHead: chatHead });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };


  renderContent = () => {
    const params = this.props.route?.params;
    return (
      <View style={styles.confirmationSheetContainer}>
        <View
          style={{
            alignItems: 'center',
            borderBottomWidth: 1,
            borderColor: Colors.GRAY_2,
            paddingBottom: 20,
          }}>
          {/* <View style={{position: 'absolute', left: 5, top: 10}}>
            <TouchableOpacity
              onPress={() => {
                this.sheetRef.snapTo(1);
              }}>
              <Image
                source={close}
                style={{width: 15, height: 15}}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View> */}
          <TouchableOpacity
          // onPress={() => {
          //   this.sheetRef.snapTo(1);
          // }}
          >
            <Image
              source={modalBarIcon}
              style={styles.closeImage}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {/* <Text style={{fontWeight: 'bold'}}>In This Post</Text> */}
        </View>
        <View style={styles.sheetBody}>
          <TouchableOpacity
            disabled
            // onPress={() => this.props.navigation.navigate('UserProfile', {})}
            style={{ flexDirection: 'row' }}>
            <Image source={dummy} style={{ width: 80, height: 80 }} />
            <View style={{ marginHorizontal: 20, alignSelf: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {params?.username}
              </Text>
              <Text style={{ fontSize: 12 }}> {params?.email}</Text>
            </View>

            <TouchableOpacity style={{ right: 0, position: 'absolute', alignSelf: 'center' }}
              onPress={this.onPressChat}
            >
              <Image
                source={chat_inactive}
                style={{ width: 30, height: 30 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  componentDidMount() {
    if(Platform.OS == "android"){
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        console.log(data);
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            this.setState({
              currentPosition: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              },
            });
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: false,
            distanceFilter: 0,
            interval: 1000,
            fastestInterval: 2000,
          },
        );
      })
      .catch(err => {
        console.log(err);
      });
    console.log(
      'this.props.route?.params?.coach_id',
      this.props.route?.params?.coach_id,
    );
    }else if(Platform.OS == "ios"){
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.setState({
            currentPosition: {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            },
          });
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: false,
          distanceFilter: 0,
          interval: 1000,
          fastestInterval: 2000,
        },
      );
    }
    // this.props
    //   .getCoachTracking(this.props.route?.params?.coach_id)
    //   .then(() => {})
    //   .catch(() => {
    //     this.mapView.fitToCoordinates(result.coordinates, {
    //       edgePadding: {
    //         right: width / 10,
    //         bottom: height / 10,
    //         left: width / 10,
    //         top: height / 10,
    //       },
    //     });
    //   });
    this.sheetRef.snapTo(0);
  }

  render() {
    // console.log('coach_position=>', this.props.coach_position);
    // console.log('CURERNT POSITION=>', this.state.currentPosition);
    // console.log('this.props.route?.params?=>', this.props.route?.params);
    const params = this.props.route?.params;
    return (
      <>
        <View style={styles.container}>
          <View style={{ paddingHorizontal: 25 }}>
            <Header
              title="Track Coach"
              isShowLeftIcon={true}
              navigation={this.props.navigation}
            />
          </View>

          <View style={styles.mainView}>
            <View style={{ flex: 0.75 }}>
              <MapView
                initialRegion={{
                  latitude: LATITUDE,
                  longitude: LONGITUDE,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
                style={StyleSheet.absoluteFill}
                ref={c => (this.mapView = c)} // eslint-disable-line react/jsx-no-bind
              >
                <MapViewDirections
                  origin={
                    this.state.currentPosition
                      ? this.state.currentPosition
                      : null
                  }
                  destination={
                    this.props.coach_position
                      ? this.props.coach_position
                      : { latitude: 24.8649006, longitude: 67.0600049 }
                  }
                  waypoints={this.state.coordinates.slice(1, -1)}
                  mode="DRIVING"
                  apikey={GOOGLE_MAPS_APIKEY}
                  language="en"
                  strokeWidth={4}
                  strokeColor="black"
                  onStart={params => {
                    console.log(
                      `Started routing between "${params.origin}" and "${params.destination
                      }"${params.waypoints.length
                        ? ' using waypoints: ' + params.waypoints.join(', ')
                        : ''
                      }`,
                    );
                  }}
                  onReady={this.onReady}
                  onError={errorMessage => {
                    console.log(errorMessage);
                  }}
                  resetOnChange={false}
                />
              </MapView>
            </View>

            <BottomSheet
              ref={ref => (this.sheetRef = ref)}
              snapPoints={[190, 0]}
              borderRadius={10}
              renderContent={this.renderContent}
            />
          </View>
        </View>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.Auth.user,
    coach_position: state.BookingReducer.coach_position,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getCoachTracking: payload =>
      dispatch(BookingMidleware.getCoachTracking(payload)),
    stopCoachTracking: () => dispatch(BookingMidleware.stopCoachTracking()),
    getChatSession: payload => dispatch(ChatMiddleware.getChatSession(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 25,
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
  versionBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  versionText: {
    padding: 4,
    backgroundColor: '#FFF',
    color: '#000',
  },
});
