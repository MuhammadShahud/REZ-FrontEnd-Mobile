import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Header} from '../../../Components';
import {Colors} from '../../../Styles';
import Tabs from './tabs';
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
            title={'Event'}
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>
        <Tabs />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
