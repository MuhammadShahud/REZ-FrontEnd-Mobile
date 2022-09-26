import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {dummy, eye, filterIcon, map_marker, searchIcon} from '../../Assets';
import {Header, SearchBar, TextInput} from '../../Components';
import {img_url} from '../../Store/Apis';
import BookingMidleware from '../../Store/Middleware/BookingMiddleware';
import {Colors} from '../../Styles';

class Appointments extends Component {
  componentDidMount() {
    this.props.getCoachBooking();
  }
  renderChatList = ({item, index}) => {
    console.warn(item)
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('AppointmentDetail', {
            appointment: item,
          })
        }
        activeOpacity={0.7}
        style={{
          alignSelf: 'center',
          paddingVertical: 14,
          flexDirection: 'row',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={{uri: img_url + item?.user?.profile_image}}
            style={{width: 65, height: 65, borderRadius: 100}}
          />
        </View>

        <View style={{marginLeft: 10, flex: 1, justifyContent: 'space-evenly'}}>
          <Text
            style={{color: Colors.GRAY_3, fontWeight: 'bold', fontSize: 18}}>
            {item?.user?.username}
          </Text>
          <Text style={{color: Colors.GRAY_3}}>{item.session_type}</Text>
        </View>
        <View
          style={{justifyContent: 'center', justifyContent: 'space-evenly'}}>
          {/* <Image
            source={eye}
            style={{width: 25, height: 25}}
            resizeMode={'contain'}
          /> */}
          <Image
            source={map_marker}
            style={{width: 25, height: 25}}
            resizeMode={'contain'}
          />
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {coachBooking} = this.props;
    return (
      <View
        style={{flex: 1, paddingHorizontal: 25, backgroundColor: Colors.WHITE}}>
        <Header
          title="Appointments"
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        {/* <SearchBar /> */}
        {coachBooking ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{marginBottom: 20}}
            data={coachBooking}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 40,
                }}>
                <Text style={{color: Colors.GRAY_3, fontSize: 17}}>
                  No Appointment Found
                </Text>
              </View>
            }
            renderItem={this.renderChatList}
          />
        ) : (
          <ActivityIndicator size={'large'} color={Colors.GREEN} />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    coachBooking: state.BookingReducer.coachBooking,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getCoachBooking: payload =>
      dispatch(BookingMidleware.getCoachBooking(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(Appointments);
