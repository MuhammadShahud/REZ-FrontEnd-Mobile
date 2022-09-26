import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StatusBar, View } from 'react-native'
import { Splash } from '../Screens';
import App from './AppStack';
import Auth from './AuthStack';

class AppNavigation extends Component {
  render() {
    const { isLogin } = this.props;
    return <>
      <StatusBar barStyle={'dark-content'} translucent={true} backgroundColor={'transparent'} />
      <SafeAreaView style={{ flex: 1 }}>{isLogin == undefined ? <Splash /> : isLogin ? <View style={{ flex: 1, marginTop: StatusBar.currentHeight + 5 }}><App /></View> : <Auth />}</SafeAreaView>
    </>
  }
}
const mapStateToProps = state => {
  return {
    isLogin: state.Auth.isLogin,
  };
};
const mapsDispatchToProps = () => {
  return {}
};
export default connect(mapStateToProps, mapsDispatchToProps)(AppNavigation);
