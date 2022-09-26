import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {Colors} from '../../Styles';

class index extends Component {
  onPressBtn = () => {
    let screen = this.props.route.params?.screen;
    if (screen == 'store' && this.props.role !== 'store') {
      this.props.navigation.navigate('BottomTab');
    } else {
      this.props.navigation.navigate('StoreBottomTabs');
    }
  };
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
              <FontAwesome name="check" size={35} color="#1D9CD9" />
            </View>

            <Text style={styles.title}>Order Successfull</Text>

            <View style={styles.textContainer}>
              {/* <Text style={{textAlign: 'center', color: Colors.WHITE}}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </Text> */}
            </View>

            <TouchableOpacity onPress={this.onPressBtn} style={styles.button}>
              <Text style={styles.btnText}>Back to home</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
  PaymentCard: state.PaymentReducer.PaymentCards,
});

export default connect(mapStateToProps, null)(index);

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
    width: 120,
    height: 120,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.WHITE,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.WHITE,
    marginVertical: 30,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D9CD9',
  },
  textContainer: {width: '75%', alignSelf: 'center'},
});
