import React, { Component } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { Text } from '..';
import { arrow_left, bell, menu } from '../../Assets';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';
import { Colors } from '../../Styles';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { title, isShowLeftIcon, navigation, onPressBack, user } = this.props;
    return (
      <View style={styles.container}>
        <View>
          {isShowLeftIcon ? (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
              }}
              onPress={() =>
                onPressBack ? onPressBack() : navigation.goBack()
              }>
              <Image
                source={arrow_left}
                style={styles.icon}
                resizeMode={'contain'}
              />
              {this.props.role == 'facility' ? (
                <View style={styles.icon} />
              ) : null}
            </TouchableOpacity>
          ) : (
            <View style={styles.icon} />
          )}
        </View>

        <Text style={{ ...styles.headerText, ...Platform.OS == "ios" ? { marginLeft: 50 } : {} }}>{title}</Text>

        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <Image source={bell} style={styles.icon} resizeMode={'contain'} />
          </TouchableOpacity>

          {this.props.role === 'team' ||
            this.props.role == 'player' ||
            this.props.role == 'parent' ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('ShowCart')}
              activeOpacity={0.7}
              style={styles.cartBtn}>
              <Feather name="shopping-cart" size={20} color={Colors.BLACK} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={() => navigation.navigate('ProfileMenu')}>
            <Image
              source={{
                uri: user?.profile_image
                  ? img_url + user?.profile_image
                  : dummyImage,
              }}
              style={[styles.iconProfile, styles.marginLeft10]}
            // resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
  user: state.Auth.user,
});

export default connect(mapStateToProps, null)(Header);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    height: 22,
    width: 20,
    position: 'relative',
  },
  iconProfile: {
    //   height: 30,
    //   width: 30,
    // position: 'relative',
    // borderRadius:30,
    // backgroundColor:'red',
    width: 20,
    height: 22,
    borderRadius: 100,
  },
  marginLeft10: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.GRAY_3,
    textAlign: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  cartBtn: {
    marginLeft: 10,
  },
});
