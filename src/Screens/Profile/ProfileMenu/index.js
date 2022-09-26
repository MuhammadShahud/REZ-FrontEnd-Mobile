import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  contactIcon,
  dummy,
  helpIcon,
  historyIcon,
  inviteIcon,
  logoutIcon,
  membershipIcon,
  notificationIcon,
  person,
  ratingIcon,
  rightIcon,
} from '../../../Assets';
import { Header, Text } from '../../../Components';
import { dummyImage } from '../../../Config';
import AuthAction from '../../../Store/Actions/AuthAction';
import StoreAction from '../../../Store/Actions/StoreAction';
import { img_url } from '../../../Store/Apis';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import { Colors } from '../../../Styles';
import Storage from '../../../Utils/AsyncStorage';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
    };
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  onPressLogout = async () => {
    await Storage.clearStorage();
    this.props.isAuth(false);
    this.props.removeCartData([]);
    this.props.logout(false);
  };

  onPressDeleteAccount = () => {
    this.props.deleteAccount().then(() => {
      this.onPressLogout();
    })
  }

  renderStoreMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('StoreOrders')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Order History
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Ratings & Reviews
          </Text>
        </View>
        <View style={{position: 'absolute', right: 20, alignSelf: 'center'}}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  renderTeamMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('History')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            History
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EClass')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            E- Classes
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ActivePreviousEvents')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Events
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Ratings & Reviews
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyInvites')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={inviteIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Invite
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  renderPlayerMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('History')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            History
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EClass')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            E- Classes
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ActivePreviousEvents')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Events
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Ratings & Reviews
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyInvites')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={inviteIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Invite
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  renderParentMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('History')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            History
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EClass')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            E- Classes
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ActivePreviousEvents')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Events
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Ratings & Reviews
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyInvites')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={inviteIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Invite
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  renderCoachMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('FacilityBookingHistory')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Booking History
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('StoreOrders')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Order History
          </Text>
        </View>

        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AddScheduler')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Add to Schedule
          </Text>
        </View>

        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EClass')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            E- Classes
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Reviews
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyInvites')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={inviteIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Invite
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  renderFacilityMenu = () => (
    <>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MemberShip')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={membershipIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Membership
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      {this.props.role == 'facility' ?
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Packages')}
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.GRAY_2,
            paddingHorizontal: 20,
            height: 70,
            marginVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={membershipIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                color: Colors.GRAY_1,
              }}>
              Packages
            </Text>
          </View>
          <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity> : null}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('StoreOrders')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Order History
          </Text>
        </View>

        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('FacilityBookingHistory')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Booking History
          </Text>
        </View>

        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('History')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            History
          </Text>
        </View>
        <View style={{position: 'absolute', right: 20, alignSelf: 'center'}}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('AddScheduler')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Add to Schedule
          </Text>
        </View>

        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      {this.props.role == 'facility' ?
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('RoomList')}
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.GRAY_2,
            paddingHorizontal: 20,
            height: 70,
            marginVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={logoutIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                color: Colors.GRAY_1,
              }}>
              Rooms
            </Text>
          </View>
          <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity> : null}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('EClass')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            E- Classes
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyHighlights')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            My Events
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      {this.props.role == 'facility' ? (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('CreateLeague')}
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.GRAY_2,
            paddingHorizontal: 20,
            height: 70,
            marginVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={historyIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                color: Colors.GRAY_1,
              }}>
              Create League
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 20,
              alignSelf: 'center',
            }}>
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      {this.props.role == 'facility' ? (
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MyStaff')}
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.GRAY_2,
            paddingHorizontal: 20,
            height: 70,
            marginVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={historyIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                color: Colors.GRAY_1,
              }}>
              My Staff
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              right: 20,
              alignSelf: 'center',
            }}>
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </View>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ActivePreviousEvents')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Events
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('UploadLeagueStats')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Update League Status
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </View>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Appointments')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Appointments
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </View>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => this.props.navigation.navigate('RatingReviews')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ratingIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Ratings & Reviews
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ContactUs')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={contactIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Contact Us
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Help')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={helpIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Help
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Notifications')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={notificationIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>



      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('BlockList')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={historyIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Block List
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('MyInvites')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={inviteIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Invite
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
            alignSelf: 'center',
          }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('TermsCondition')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Terms and Condition
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('PrivacyPolicy')}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Privacy Policy
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressDeleteAccount}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Delete Account
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={this.onPressLogout}
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.GRAY_2,
          paddingHorizontal: 20,
          height: 70,
          marginVertical: 10,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={logoutIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
          <Text
            style={{
              marginHorizontal: 20,
              fontWeight: 'bold',
              fontSize: 15,
              color: Colors.GRAY_1,
            }}>
            Logout
          </Text>
        </View>
        <View style={{ position: 'absolute', right: 20, alignSelf: 'center' }}>
          <Image
            source={rightIcon}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
    </>
  );

  render() {
    let { role, user } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header
            title="Profile"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <TouchableOpacity
            onPress={() =>
              role === 'store'
                ? this.props.navigation.navigate('Profile')
                : this.props.navigation.navigate('UserProfile')
            }
            // disabled={role == 'store'}
            style={{ flexDirection: 'row', marginVertical: 20 }}>
            <Image
              source={{
                uri: user?.profile_image
                  ? img_url + user?.profile_image
                  : dummyImage,
              }}
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <View style={{ marginHorizontal: 20, alignSelf: 'center', width: '65%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                {user?.username}
              </Text>
              <Text style={{ fontSize: 12 }}>{user?.email}</Text>
            </View>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {role == 'store'
              ? this.renderStoreMenu()
              : role == 'parent'
                ? this.renderParentMenu()
                : role == 'team'
                  ? this.renderTeamMenu()
                  : role == 'coach'
                    ? this.renderCoachMenu()
                    : role == 'facility' || role == 'staff'
                      ? this.renderFacilityMenu()
                      : this.renderPlayerMenu()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLogin: state.Auth.isLogin,
    role: state.Auth.role,
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    isAuth: payload => dispatch(AuthAction.isAuth(payload)),
    removeCartData: payload =>
      dispatch(StoreAction.removeProductFromCart(payload)),
    logout: payload => dispatch(AuthAction.logout(payload)),
    deleteAccount: payload => dispatch(AuthMiddleware.deleteAccount(payload))
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  isSelectedView: {
    backgroundColor: Colors.GREEN,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  isNotSelectedView: {
    backgroundColor: Colors.GRAY_4,
    width: 100,
    height: 80,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
  confirmationSheetContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    height: 280,
    paddingHorizontal: 35,
    paddingTop: 20,
  },
  sheetBody: {
    marginVertical: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  closeImage: { width: 60, height: 20 },
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.BLUE,
    width: '20%',
    height: 20,
    position: 'absolute',
    bottom: -10,
  },
});
