import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, Text, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { Header, MemberShipCard } from '../../Components';
import MembershipMiddleware from '../../Store/Middleware/MembershipMiddleware';
import { Colors } from '../../Styles';

class MemberShip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      loadmore: false
    };
  }
  _renderItem1 = ({ item }) => {
    return (
      <MemberShipCard
        plan_id={item?.id}
        navigation={this.props.navigation}
        price={item?.price}
        title={item?.membership_name}
        description={item?.description}
        type={item?.type}
        purchased={item?.purchased}
      />
    );
  };
  componentDidMount = () => {
    this.OnMembership();

  }
  OnMembership = () => {
    this.props.getAllSubscription({
      next_page_url: undefined
    });
  }

  RefreshState = () => {
    this.setState({ refreshing: true })
    this.props.getAllSubscription({
      next_page_url: undefined
    }).then(() => this.setState({ refreshing: false }))
      .catch(() => this.setState({ refreshing: false }))
  }


  onPressLoadMore = () => {
    this.setState({ loadmore: true }, () => {
      const { subscription } = this.props;
      this.props
        .getAllSubscription({ next_page_url: subscription.next_page_url })
        .then(() => this.setState({ loadmore: false }))
        .catch(() => this.setState({ loadmore: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { subscription } = this.props;
    const { loadmore } = this.state;
    return subscription.next_page_url ? (
      loadmore ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={styles.loadMoreContentContainer}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          title={'Membership'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />

        <FlatList
          data={this.props.subscription_list}
          ListHeaderComponent={() => <Text style={styles.headerText}>{'Select Your Membership'}</Text>}
          renderItem={this._renderItem1}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.RefreshState}
            />}
          ListEmptyComponent={() =>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 12,
                  color: Colors.black,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                Membership not found
              </Text>
            </View>}

          ListFooterComponent={this.renderLoaderMoreButton()}
        />

      </View>
    );
  }
}
const mapStateToProps = state => {
  return {

    role: state.Auth.role,
    user: state.Auth.user,
    subscription: state.MembershipReducer.subscription,
    subscription_list: state.MembershipReducer.subscription_list,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getAllSubscription: payload => dispatch(MembershipMiddleware.getAllSubscription(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(MemberShip);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.GRAY_3,
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    alignSelf: 'center'
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 120,
    marginVertical: 20,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
});


