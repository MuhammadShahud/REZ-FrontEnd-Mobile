import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {redShirt} from '../../Assets';
import {Header, Text} from '../../Components';
import {Colors} from '../../Styles';
import Tabs from './HistoryTabs';

export default class EClass extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          title={'History'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />
        <Tabs />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  buyNowContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  buyNowText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: {flex: 1},
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
    backgroundColor: Colors.BLUE_LIGHT,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 2,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.BLACK,
    fontWeight: '500',
    fontSize: 18,
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },
  followContainer: {
    justifyContent: 'center',
    justifyContent: 'space-evenly',
  },
  plusImage: {
    width: 13,
    height: 13,
  },
  price: {
    color: Colors.BLACK,
    fontSize: 18,
    fontWeight: 'bold',
  },
  fabBtn: {
    width: 56,
    height: 56,
    bottom: 15,
    right: 15,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
    position: 'absolute',
  },
});
