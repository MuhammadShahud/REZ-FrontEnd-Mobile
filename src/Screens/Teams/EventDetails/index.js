import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Header, Button } from '../../../Components';
import { Colors } from '../../../Styles';
import Swiper from 'react-native-swiper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import { Text } from '../../../Components';
import {
  footballBg,
  hockeyBg,
  redShirt,
  calendar,
  clock,
  map_marker,
  price,
  lock,
  graph,
  person
} from '../../../Assets/index';
import { connect } from 'react-redux';
import EventMiddleware from '../../../Store/Middleware/EventMiddleware';
import { img_url } from '../../../Store/Apis';
import moment from 'moment';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heading: '',
      description: '',
      data: '',
      time: '',
      address: '',
      image: '',
      participants: '',
      refreshing: false,
      user: null,
      item: null
    };
  }
  componentDidMount = () => {
    this.EventDetail();
  };

  EventDetail = () => {
    let event_id =
      this.props.route.params.type == 'highlights'
        ? (id = this?.props?.route?.params?.event_id)
        : (id = this?.props?.route?.params?.event_id);
    // let event_id = this?.props?.route?.params?.event_id
    this.props.EventDetail({
      event_id,
      callback: response => {
        if (response) {
          let item = response?.data?.data;
          console.warn('Event Detail RES,', item);
          this.setState({
            heading:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.title
                : item?.event_name,
            description:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.description
                : item?.description,
            data:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.date
                : item?.event_date,
            time:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.start_time
                : item?.event_time,
            address:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.address
                : item.event_address,
            participants:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.participants
                : item.participants,
            image:
              this.props.route.params.type == 'highlights' || event_id
                ? item?.image
                : item.event_image,

            user: item.user,

            item: item,
            // description: item.description,
            // data: item.event_date,
            // time: item.event_time,
            // address: item.event_address,
            // image: item.event_image,
            refreshing: false,
          });
        } else {
          this.setState({ loading: false, refreshing: false });
        }
      },
    });
  };

  render() {
    let screen = this.props?.route?.params?.screen
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Header
            title={'Event Details'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          {this.state.item ?
            <View style={styles.body}>
              {this.state.image !== '' ? (
                <View style={{ height: 200 }}>
                  <Image
                    source={{ uri: img_url + this.state.image }}
                    style={styles.imgPromo}
                  />
                </View>
              ) : null}
              <View style={styles.DetailBody}>
                <Text style={styles.HeadingBlack}>{this.state.heading}</Text>
                <Text style={styles.Heading}>Event Details</Text>
                <Text style={styles.DetailPara}>{this.state.description}</Text>
                <View style={styles.OptionView}>
                  <Image source={calendar} style={styles.iconImg} />
                  <Text style={styles.ShortHeadingInner}>
                    {this.state?.data
                      ? moment(this.state?.data).format('MM DD YYYY')
                      : ''}
                  </Text>
                </View>
                <View style={styles.OptionView}>
                  <Image source={clock} style={styles.iconImg} />
                  <Text style={styles.ShortHeadingInner}>{moment(this.state.time, 'hh:mm a').format('LT')}</Text>
                </View>

                <View style={styles.OptionView}>
                  <Image source={map_marker} style={styles.iconImg} />
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.ShortHeadingInner}>
                    {this.state.address}
                  </Text>
                </View>
                {this.state.participants != 0 ?
                  <View style={styles.OptionView}>
                    <Image source={person} style={styles.iconImg} />
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={styles.ShortHeadingInner}>
                      {this.state.participants}
                    </Text>
                  </View> : null}

                {this.state?.user.id != this.props.user.id && screen == 'highlights' ?
                  <Button
                    height={50}
                    name={'Book'}
                    textStyle={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: Colors.WHITE,
                    }}
                    btnStyle={{ marginVertical: 10 }}
                    backgroundColor={Colors.BLUE}
                    onPress={() => this.state.user?.role == 'facility' ?
                      this.props.navigation.navigate('FacilityDetails', {
                        item: { ...this.state.item, id: this.props.route?.params?.event_id },
                        facility_id: this.state.user?.id,
                        screen: 'EventDetail'
                      })
                      : this.state.user?.role == 'coach' ?
                        this.props.navigation.navigate('CoachParticipant', {
                          session: this.state.item,
                          coach: this.state.user,
                        }) : null
                    }
                  /> :
                  null}

              </View>
            </View>
            :
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size={'large'} color={Colors.BLUE} />
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  user: state.Auth.user
});
const mapDispatchToProps = dispatch => ({
  EventDetail: paylaod => dispatch(EventMiddleware.EventDetail(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(index);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  body: {
    flex: 1,
    marginHorizontal: 20,
    // backgroundColor: 'pink',
    paddingBottom: 10,
  },

  imgPromo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
  DetailBody: {
    flex: 0.5,
  },
  HeadingBlack: {
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 20,
    fontWeight: 'bold',
  },
  Heading: {
    fontSize: 16,
    color: Colors.BLACK,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  DetailPara: {
    fontSize: 13,
    color: Colors.GRAY_1,
    marginBottom: 10,
  },
  ShortHeading: {
    fontSize: 15,
    color: Colors.GRAY_5,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  ShortHeadingInner: {
    fontSize: 14,
    color: Colors.GRAY_1,
    marginHorizontal: 5,
    fontWeight: 'normal',
  },
  OptionView: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
