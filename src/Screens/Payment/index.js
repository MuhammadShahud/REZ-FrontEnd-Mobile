import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Header} from '../../Components';
import {Colors} from '../../Styles';
import Tabs from './Tabs';

class index extends Component {
  render() {
    let showModal = this.props.route.params?.showModal;
    return (
      <View style={{flex: 1, backgroundColor: Colors.WHITE}}>
        <View style={{paddingHorizontal: 25}}>
          <Header
            title="Payment"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />
        </View>

        <Tabs
          screen={this.props.route.params?.screen}
          totalPrice={this.props.route.params?.total}
          shippingAddress={this.props.route.params?.shippingAddress}
          leagueId={this.props.route.params?.leagueId}
          role={this.props.role}
          showModal={showModal}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  role: state.Auth.role,
});

export default connect(mapStateToProps, null)(index);
