import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
// import { Button, Text, Input, Header, ListItem } from '../../components';
// import { colors, WP, AntDesign } from '../../theme/theme';
import { Logo } from '../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import AuthAction from '../../Store/Actions/AuthAction';
import Storage from '../../Utils/AsyncStorage';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware';
import messaging from '@react-native-firebase/messaging';
import notifee from "@notifee/react-native";
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.checkPermission()
    messaging().registerDeviceForRemoteMessages();
    messaging().onMessage(this.onMessageReceived)
    setTimeout(async () => {
      const token = await Storage.getToken();
      const role = await Storage.get('@role');
      this.props.setRole(role);
      if (token) {
        this.props.getUserData();
        this.props.isAuth(true);
      } else {
        this.props.isAuth(false);
      }
    }, 0);
  }

  checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled != messaging.AuthorizationStatus.AUTHORIZED) {
      requestPermission();
    }
  }
  requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  onMessageReceived = async (message) => {
    // Do something
    let channelId = await notifee.createChannel({
      id: 'rez_app',
      name: 'Rez Channel',
      sound: "default",
      vibration: true,
      badge: true,
      importance: 4,
      visibility: 1,
      bypassDnd: true
    });
    // Display a notification
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId,
        importance: 4,
        sound: "default",
      },
    });

  }

  render() {
    return (
      <>
        <LinearGradient
          start={{ x: 0.8, y: 0.0 }}
          end={{ x: 0.1, y: 1.0 }}
          locations={[0.4, 0.9]}
          colors={[Colors.GREEN, Colors.BLUE]}
          style={styles.linearGradient}>
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image resizeMode="contain" source={Logo} style={styles.logo} />
            </View>
          </View>
        </LinearGradient>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  logo: {
    alignSelf: 'center',
    width: 300,
    marginBottom: 20,
    marginTop: 30,
  },
});

const mapStateToProps = state => {
  return {
    isLogin: state.Auth.isLogin,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    isAuth: payload => dispatch(AuthAction.isAuth(payload)),
    setRole: payload => dispatch(AuthAction.setRole(payload)),
    getUserData: () => dispatch(AuthMiddleware.getUserData()),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
