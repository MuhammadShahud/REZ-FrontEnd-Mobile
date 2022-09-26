import {CommonActions} from '@react-navigation/native';
import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Logo} from '../../Assets';
import {Colors} from '../../Styles';
class index extends Component {
  componentDidMount() {
    let role = this.props.role;
    let screenName = 'BottomTab';
    role == 'store' && (screenName = 'StoreBottomTabs');
    this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        CommonActions;
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: screenName}],
          }),
        );
      }, 0);
    });
  }

  render() {
    return (
      <>
        <LinearGradient
          start={{x: 0.8, y: 0.0}}
          end={{x: 0.1, y: 1.0}}
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
    role: state.Auth.role,
  };
};
const mapsDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
