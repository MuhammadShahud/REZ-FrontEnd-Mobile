import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../Styles';
import { eyeIcon } from '../../Assets';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { calendar } from '../../Assets';
import { img_url } from '../../Store/Apis';
import { dummyImage } from '../../Config';
export class LeaguesCard extends Component {
  render() {
    const {
      heading,
      club1Image,
      club1Name,
      club2Image,
      club2Name,
      daysRemaining,
      date,
      upcoming,
      is_joined,
      club1Score,
      club2Score,
    } = this.props;

    console.warn(heading);
    return (
      <View style={styles.container}>
        <View style={styles.ImagesView}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Image
              source={{ uri: club1Image ? img_url + club1Image : dummyImage }}
              style={styles.ImgView1}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.clubName}>
              {club1Name}
            </Text>
          </View>
          {upcoming ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <Text style={styles.DaysText}>{daysRemaining}</Text>
              <Text style={styles.RemainingText}>Remaining</Text>
            </View>
          ) : (
            <View
              style={{
                marginHorizontal: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {!upcoming ? (
                <Text style={styles.DaysText}>
                  {club1Score ? club1Score : 0} - {club2Score ? club2Score : 0}
                </Text>
              ) : null}
              {/* <Text style={styles.DaysText}>
                {club1Score} - {club2Score}
              </Text> */}
            </View>
          )}
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Image
              source={{ uri: club2Image ? img_url + club2Image : dummyImage }}
              style={styles.ImgView2}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.clubName}>
              {club2Name}
            </Text>
          </View>
        </View>
        <View style={styles.headingView}>
          <View style={styles.headDate}>
            <Text style={styles.HeadingText}>{heading}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Image source={calendar} style={styles.iconImg} />
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>
          {/* {!upcoming ? (
            // <View>
            //   {is_joined ? (
            //     <TouchableOpacity
            //       onPress={this.props.onPressJoin}
            //       style={styles.Btn}>
            //       <Text style={styles.BtnText}>Joined</Text>
            //     </TouchableOpacity>
            //   ) : (
            //     <TouchableOpacity
            //       disabled
            //       onPress={this.props.onPressInvite}
            //       style={styles.BtnInvite}>
            //       <Text style={styles.BtnInviteText}>Expired</Text>
            //     </TouchableOpacity>
            //   )}
            // </View>
          ) : null} */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: Colors.GRAY_2,
    marginTop: 3,
  },
  ImagesView: {
    flexDirection: 'row',

    justifyContent: 'space-evenly',
    marginVertical: 5,
  },
  ImgView1: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ImgView2: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  DaysText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.GREEN,
  },
  RemainingText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  clubName: {
    fontSize: 13,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  headingView: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  headDate: {
    //flexDirection: 'column',
    width: '75%',
    paddingVertical: 5,
    //justifyContent: 'center',
    // backgroundColor: 'red',
  },
  HeadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: 'normal',
    color: Colors.BLACK,
  },
  Btn: {
    marginTop: 10,
    width: 75,
    height: 30,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
  },
  BtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  BtnInvite: {
    marginTop: 10,
    width: 75,
    height: 30,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN,
  },
  BtnInviteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  iconImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
});
export default LeaguesCard;
