import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Text,
} from 'react-native';
import { Button, Header, Tag, Post } from '../../../Components';
import {
  baseball,
  basketball,
  cricket,
  cricketBg,
  dummy,
  editIcon,
  eyeIcon,
  FbIcon,
  filterIcon,
  followButton,
  football,
  footballBg,
  GoogleIcon,
  hockey,
  hockeyBg,
  homeBg1,
  imageIcon,
  Logo,
  modalBarIcon,
  options,
  searchIcon,
} from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../Styles';
import Feed from '../../../Components/Feed';
import { connect } from 'react-redux';
import { img_url } from '../../../Store/Apis';
import { dummyImage } from '../../../Config';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import moment from 'moment';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      selectedSport: 'football',
    };
  }

  async componentDidMount() {
    await this.props.getSportCategory();
  }

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  renderStoreProfileItems = () => {
    let { user } = this.props;
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '30%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>
          <View style={{ width: '70%' }}>
            <Text style={{ textAlign: 'right' }}>{user.email}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Contact</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.phone}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Government ID</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>#{user?.roleInfo?.govt_id}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Tax ID</Text>
          </View>

          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>#{user?.roleInfo?.tax_id}</Text>
          </View>

        </View>
      </>
    );
  };

  renderFacilityProfileItems = () => {
    let { user } = this.props;

    console.warn(user.roleInfo);
    return (
      <>
        {/* <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'left'}}>User Name</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'right'}}>Johndoe</Text>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.email}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Contact</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.phone}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Address</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.address}</Text>
          </View>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'left'}}>Team</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'right'}}>Big Blues</Text>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Government ID</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.govt_id}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Tax ID</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>
              {user?.roleInfo?.tax_id ? `#${user?.roleInfo?.tax_id}` : ''}
            </Text>
          </View>

        </View>
        {user?.color_code ?
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Color </Text>
            </View>
            <View style={{ width: '50%' }}>
              <View style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                borderRadius: 10,
                backgroundColor: user?.color_code ? user?.color_code : null
              }}></View>
            </View>

          </View> : null}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Detail</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }} numberOfLines={2}>
              {user?.roleInfo?.details}
            </Text>
          </View>
        </View>
      </>
    );
  };

  renderTeamProfileItems = category => {
    let { user } = this.props;

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Team Name</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.username}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Categories</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{category?.sportname}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Level</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.level}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.email}</Text>
          </View>
        </View>
        {user?.color_code ?
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Color </Text>
            </View>
            <View style={{ width: '50%' }}>
              <View style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                borderRadius: 10,
                backgroundColor: user?.color_code ? user?.color_code : null
              }}></View>
            </View>

          </View> : null}

      </>
    );
  };

  renderParentProfile = () => {
    let { user } = this.props;
    let userDob = new Date(user?.roleInfo?.dob).toDateString().slice(4, 15);
    console.warn(user);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Gender</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.gender}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Birthday</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>
              {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            // width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '30%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>
          <View style={{ width: '70%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.email}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Contact</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.phone}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Address</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.address}</Text>
          </View>
        </View>

        {user?.color_code ?
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Color </Text>
            </View>
            <View style={{ width: '50%' }}>
              <View style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                borderRadius: 10,
                backgroundColor: user?.color_code ? user?.color_code : null
              }}></View>
            </View>

          </View> : null}

        {user?.childInfo?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Childs</Text>
            </View>

            <View style={{ width: '50%' }}>
              {user?.childInfo.map((item, index) => {
                return (
                  <Text style={{ textAlign: 'right' }}>
                    {item.username}
                    {index == 0 ? '' : ','}
                  </Text>
                );
              })}
            </View>
          </View>
        ) : null}
      </>
    );
  };

  renderCoachProfileItem = () => {
    let { user } = this.props;
    let userDob = new Date(user?.roleInfo?.dob).toDateString().slice(4, 15);
    console.warn('dsa', moment(user.roleInfo?.dob).format('MMM DD YYYY'));
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Gender</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.gender}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Birthday</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>
              {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            // width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '30%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>
          <View style={{ width: '70%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.email}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Contact</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.phone}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Address</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.address}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Government ID</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.govt_id}</Text>
          </View>
        </View>

        {user?.color_code ?
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Color </Text>
            </View>
            <View style={{ width: '50%' }}>
              <View style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                borderRadius: 10,
                backgroundColor: user?.color_code ? user?.color_code : null
              }}></View>
            </View>

          </View> : null}

      </>
    );
  };

  renderPlayerProfileItem = () => {
    let { user } = this.props;
    let userDob = new Date(user.roleInfo.dob).toDateString().slice(4, 15);

    console.warn(user);

    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>User Name</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.username}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Gender</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user.roleInfo?.gender}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Birthday</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>
              {moment(user.roleInfo?.dob).format('MMM DD YYYY')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Email</Text>
          </View>

          <View>
            <Text>{user.email}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Contact</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.phone}</Text>
          </View>
        </View>

        {user?.color_code ?
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Color </Text>
            </View>
            <View style={{ width: '50%' }}>
              <View style={{
                width: 15,
                height: 15,
                alignSelf: 'flex-end',
                borderRadius: 10,
                backgroundColor: user?.color_code ? user?.color_code : null
              }}></View>
            </View>

          </View> : null}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Address</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.address}</Text>
          </View>
        </View>

        {user?.isteamjoin ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>Team</Text>
            </View>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'right' }}>{user?.teamname}</Text>
            </View>
          </View>
        ) : null}

        {user?.isleaguejoin ? (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'left' }}>League</Text>
            </View>
            <View style={{ width: '50%' }}>
              <Text style={{ textAlign: 'right' }}>{user.leaguename}</Text>
            </View>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Level</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.level}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'left' }}>Government ID</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ textAlign: 'right' }}>{user?.roleInfo?.govt_id}</Text>
          </View>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'left'}}>Ranks</Text>
          </View>
          <View style={{width: '50%'}}>
            <Text style={{textAlign: 'right'}}>1st</Text>
          </View>
        </View> */}
      </>
    );
  };

  render() {
    const { role, user } = this.props;
    console.log('this.props.getSportType', this.props.getSportType);
    let category = this.props.getSportType.find(item => {
      if (item.id === user.sport_type) {
        return item;
      }
    });

    return (
      <>
        <View style={styles.container}>
          <Header
            title="Profile"
            isShowLeftIcon={true}
            navigation={this.props.navigation}
          />

          <View
            style={{
              backgroundColor: Colors.GRAY_2,
              borderRadius: 20,
              // padding: 10,
              flex: 0.95,
              marginTop: 80,
            }}>
            <View style={{ marginTop: -70, alignItems: 'center' }}>
              <Image
                source={{
                  uri: user?.profile_image
                    ? img_url + user?.profile_image
                    : dummyImage,
                }}
                style={{ width: 130, height: 130, borderRadius: 100 }}
              />
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {user?.username}
                </Text>
              </View>
              {user?.description ?
                <View style={{ marginTop: 5 }}>
                  <Text style={{ fontSize: 14 }}>
                    {user?.description}
                  </Text>
                </View>
                : null}
            </View>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('EditProfile')}
              style={{ position: 'absolute', top: 20, right: 20 }}>
              <Image
                source={editIcon}
                resizeMode="contain"
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: Colors.WHITE,
                // alignItems: 'center',
                // justifyContent: 'center',
                margin: 15,
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 10,
                flex: 1,
              }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {role == 'player'
                  ? this.renderPlayerProfileItem()
                  : role == 'parent'
                    ? this.renderParentProfile()
                    : role == 'team'
                      ? this.renderTeamProfileItems(category)
                      : role == 'store'
                        ? this.renderStoreProfileItems()
                        : role == 'facility' || role == 'staff'
                          ? this.renderFacilityProfileItems()
                          : role == 'coach'
                            ? this.renderCoachProfileItem()
                            : null}
              </ScrollView>

              {/* {role == 'store' ? renderStoreProfileItems : null}

              {role == 'facility' ? this.renderFacilityProfileItems() : null} */}
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={styles.underLine}></View>
            </View>
          </View>
        </View>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    user: state.Auth.user,
    getSportType: state.Auth.sportTypes,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getSportCategory: () => dispatch(AuthMiddleware.getSportTypes()),
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
    bottom: 0,
  },
});
