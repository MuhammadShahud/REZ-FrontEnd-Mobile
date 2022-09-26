import React, {Component} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {Header, Button, Text} from '../../../Components';
import {Colors} from '../../../Styles';
import Swiper from 'react-native-swiper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import {footballBg} from '../../../Assets';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{marginHorizontal: 20}}>
          <Header
            title={'Event Details'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            <View style={{height: 220}}>
              <Image source={footballBg} style={styles.imgPromo} />
            </View>

            <View style={styles.DetailBody}>
              <Text style={styles.HeadingBlack}>UEFA Champions League</Text>
              <Text style={styles.Heading}>Event Details</Text>
              {/* <Text style={styles.DetailPara}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.
              </Text> */}

              {/* <Text style={styles.DetailPara}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </Text> */}
              <View style={styles.OptionView}>
                <FontAwesome5
                  name={'calendar-check'}
                  size={20}
                  color={Colors.GRAY_5}
                />
                <Text style={styles.ShortHeading}>
                  Date: <Text style={styles.ShortHeadingInner}>Sep 15' 21</Text>
                </Text>
              </View>
              <View style={styles.OptionView}>
                <AntDesign
                  name={'clockcircle'}
                  size={20}
                  color={Colors.GRAY_5}
                />
                <Text style={styles.ShortHeading}>
                  Time:{' '}
                  <Text style={styles.ShortHeadingInner}>08:00 - 09:00 PM</Text>
                </Text>
              </View>

              <View style={styles.OptionView}>
                <Ionicons name={'location'} size={22} color={Colors.GRAY_5} />
                <Text style={styles.ShortHeading}>
                  Location:
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={styles.ShortHeadingInner}>
                    New York, U.S
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.flexRow}>
            <Button
              btnStyle={styles.actionBtnLeft}
              name={'ACCEPT'}
              backgroundColor={Colors.BLUE}
              textStyle={styles.colorWhite}
            />
            <Button
              btnStyle={styles.actionBtnRight}
              name={'REJECT'}
              textStyle={styles.colorWhite}
            />
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
  flexRow: {
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
    /// position: 'absolute',
    flexDirection: 'row',
    marginVertical: 15,
  },
  actionBtnLeft: {
    flex: 1,
    marginRight: 3,
  },
  actionBtnRight: {
    flex: 1,
    marginLeft: 3,
  },
  colorWhite: {
    color: Colors.WHITE,
  },
});
