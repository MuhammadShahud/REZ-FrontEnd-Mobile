import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Tabs from './tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import { Header, Text } from '../../../Components';
import { Colors } from '../../../Styles';
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginHorizontal: 20 }}>
          <Header
            title={'Leagues'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <Tabs />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('CreateLeague')}
          activeOpacity={0.7}
          style={styles.fabBtn}>
          <Entypo name="plus" size={28} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
