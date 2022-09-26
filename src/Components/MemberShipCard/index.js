import React, {Component} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../Styles';
import {Text} from '../';
import {dummy, king} from '../../Assets';
import Share from 'react-native-share';
import MembershipMiddleware from '../../Store/Middleware/MembershipMiddleware';
import {connect} from 'react-redux';
import AuthMiddleware from '../../Store/Middleware/AuthMiddleware';

const shareTitle = 'Share Referral Link';

class MemberShipCard extends Component {
  onPressMembershipCard = () => {
    Share.open({title: shareTitle,url:shareTitle});
  };
  render() {
    const {title, price, type, description, navigation, plan_id, purchased} =
      this.props;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this.onPressMembershipCard}>
        <View style={styles.memberShipDetailContainer}>
          <View style={styles.packageImageContainer}>
            <Image
              source={king}
              style={styles.packageImage}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.packageTitleContainer}>
            <Text style={styles.packageTitle}>{title}</Text>
            <Text style={styles.packageDesc}>Membership</Text>
          </View>
        </View>
        <View style={styles.descContainer}>
          <Text style={styles.descHeading}>Description & Price </Text>
          <Text style={styles.desc}>{description}</Text>
          <Text style={styles.moreDetail}>More Details</Text>
        </View>
        <View style={styles.hrWhite} />
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceText}>${price}</Text>
            <Text style={styles.priceDuration}>Per {type}</Text>
          </View>
          {!purchased ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Payment', {
                    screen: 'MemberShip',
                    showModal: card_id => {
                      // plan_id,
                      // payment_method_id: card_id,

                      this.setState({loader: true}, () => {
                        this.props.BookSubscription({
                          plan_id,
                          payment_method_id: card_id,
                          callback: response => {
                            if (response) {
                              console.warn('RES,', response);
                              this.setState(
                                {
                                  loader: false,
                                },
                                () => {
                                  this.props.updateUserData();
                                },
                              );
                            } else {
                              this.setState({loader: false, refreshing: false});
                            }
                          },
                        });
                      });
                    },
                  })
                }
                style={styles.buyNowContainer}>
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 14,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: 'green',
                }}>
                Active
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
const mapsDispatchToProps = dispatch => {
  return {
    updateUserData: () => dispatch(AuthMiddleware.getUserData()),
    BookSubscription: payload =>
      dispatch(MembershipMiddleware.BookSubscription(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(MemberShipCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.BLUE,
    borderRadius: 10,
    // paddingVertical: 10,
    marginVertical: 15,
  },
  memberShipDetailContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  packageImageContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 200,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageImage: {
    width: 32,
    height: 32,
  },
  packageTitleContainer: {
    paddingHorizontal: 15,
  },
  packageTitle: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  packageDesc: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  descContainer: {
    paddingHorizontal: 20,
  },
  descHeading: {
    color: Colors.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.WHITE,
    marginVertical: 10,
  },
  moreDetail: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  hrWhite: {
    height: 0.5,
    backgroundColor: Colors.WHITE,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  priceText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  priceDuration: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  buyNowContainer: {
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buyNowText: {
    // color: Colors.BLUE,
    fontWeight: '500',
    fontSize: 16,
  },
});
