import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Header } from '../../../Components';
import { Colors } from '../../../Styles';
import Swiper from 'react-native-swiper';
import { Text } from '../../../Components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  footballBg,
  hockeyBg,
  redShirt,
  calendar,
  clock,
  map_marker,
  price,
  lock,
} from '../../../Assets/index';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Event: [
        {
          image: footballBg,
        },
        {
          image: hockeyBg,
        },
        {
          image: redShirt,
        },
      ],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Header
            title={'Event'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View style={{ height: 360 }}>
              <Swiper
                style={styles.wrapper}
                index={0}
                autoplayTimeout={5}
                showsPagination={true}
                dotColor={Colors.GRAY_2}
                activeDotColor={Colors.GRAY_1}
                paginationStyle={{ top: '102%' }}
                loop={true}
                autoplay={true}>
                {this.state.Event.map((v, key) => (
                  <View style={styles.MainView}>
                    <Text>{v.title}</Text>
                    <Image source={v.image} style={styles.imgPromo} />
                  </View>
                ))}
              </Swiper>
            </View>

            <View style={styles.DetailBody}>
              <Text style={styles.HeadingBlue}>Sports</Text>
              <Text style={styles.Heading}>Football Practice</Text>
              {/* <Text style={styles.DetailPara}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </Text> */}
              <View style={styles.OptionView}>
                <Image source={calendar} style={styles.iconImg} />
                <Text style={styles.ShortHeading}>
                  Date: <Text style={styles.ShortHeadingInner}>Sep 15' 21</Text>
                </Text>
              </View>
              <View style={styles.OptionView}>
                <Image source={clock} style={styles.iconImg} />
                <Text style={styles.ShortHeading}>
                  Time:{' '}
                  <Text style={styles.ShortHeadingInner}>
                    08:00 to 09:00 PM
                  </Text>
                </Text>
              </View>
              <View style={styles.OptionView}>
                <Image source={price} style={styles.iconImg} />
                <Text style={styles.ShortHeading}>
                  Price: <Text style={styles.ShortHeadingInner}>$12</Text>
                </Text>
              </View>
              <View style={styles.OptionView}>
                <Image source={map_marker} style={styles.iconImg} />
                <Text style={styles.ShortHeading}>
                  Location:{' '}
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.ShortHeadingInner}>
                    New York
                  </Text>
                </Text>
              </View>
              <View style={styles.OptionView}>
                <Image source={lock} style={styles.iconImg} />
                <Text style={styles.ShortHeading}>
                  Privacy:{' '}
                  <Text style={styles.ShortHeadingInner}>Private Solo</Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

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

  MainView: {
    width: '100%',
    height: '95%',
    borderRadius: 12,
    backgroundColor: Colors.GRAY_2,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    marginVertical: 10,
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
  HeadingBlue: {
    fontSize: 14,
    color: Colors.BLUE,
    textTransform: 'uppercase',
    marginTop: 20,
    fontWeight: 'bold',
  },
  Heading: {
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 10,
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
    marginVertical: 3,
  },
  iconImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
