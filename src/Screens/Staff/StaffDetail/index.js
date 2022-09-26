import React, {Component} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from 'react-native';
import {
  dummy,
  eye,
  filterIcon,
  map_marker,
  searchIcon,
  plus_white,
  calendar,
  clock,
} from '../../../Assets';
import {
  Header,
  TextInput,
  Text,
  SearchBar,
  Button,
  Loader,
  Tag,
} from '../../../Components';
import {Colors} from '../../../Styles';
import FollowMiddleware from '../../../Store/Middleware/FollowMiddleware';
import {connect} from 'react-redux';
import SearchAllUsersMiddleware from '../../../Store/Middleware/SearchAllUsersMiddleware';
import {dummyImage} from '../../../Config';
import {img_url} from '../../../Store/Apis';
import ScheduleMiddleware from '../../../Store/Middleware/ScheduleMiddleware';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';

class StaffDetail extends Component {
  state = {
    loader: false,
    searchText: '',
    followerSearchCopy: [],
    loaderIndex: undefined,
  };

  componentDidMount() {
    this.props.getScheduleTypes();
  }

  updateStaffPermission = (staff_id, permission_type, permission_id) => {
    let obj = {
      staff_id,
      permission_type,
      permission_id,
    };
    this.setState({loader: true}, () => {
      this.props
        .updateStaffPermission(obj)
        .then(() => {
          this.setState({loader: false, loaderIndex: undefined}, () => {
            alert('Staff Permission successfully update');
          });
        })
        .catch(() => {
          this.setState({loader: false, loaderIndex: undefined});
        });
    });
  };

  render() {
    const {loader} = this.state;
    const {user} = this.props;
    let staff = this.props.route?.params?.staff;
    staff = user?.staffInfo?.find(x => x.id === staff.id);

    console.log('staff 86=>', staff?.permissions);

    let e_class_permission = staff?.permissions?.find(
      x => x.permission_type === 'e_class',
    )
      ? true
      : false;
    let store_permission = staff?.permissions?.find(
      x => x.permission_type === 'store',
    )
      ? true
      : false;
    let league_permission = staff?.permissions?.find(
      x => x.permission_type === 'league',
    )
      ? true
      : false;
    return (
      <View style={styles.container}>
        <Header
          title={'Staff Detail'}
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: Colors.GRAY_2,
              borderRadius: 20,
              padding: 10,
              marginVertical: 10,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                alignItems: 'center',
                paddingVertical: 20,
              }}>
              <Image
                source={{
                  uri: staff?.profile_image
                    ? `${img_url}${staff?.profile_image}`
                    : dummyImage,
                }}
                style={{width: 100, height: 100, marginHorizontal: 10}}
              />
              <View style={{width: '60%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  {staff.username}
                </Text>
                <Text>{staff?.details}</Text>
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Tag
              text={'Order History'}
              isActive={true}
              onPress={() => {
                this.props.navigation.navigate('StoreOrders', {
                  staff_id: staff?.id,
                });
              }}
            />
            <Tag
              text={'Booking History'}
              isActive={true}
              onPress={() => {
                this.props.navigation.navigate('FacilityBookingHistory', {
                  staff_id: staff?.id,
                });
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              marginVertical: 15,
              borderRadius: 10,
            }}>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>
              {`Basic information`}
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'left'}}>Email</Text>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'right'}}>{staff?.email}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'left'}}>Contact</Text>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'right'}}>{staff?.phone}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'left'}}>Address</Text>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'right'}}>{staff?.address}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'left'}}>Government ID</Text>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'right'}}>{staff?.govt_id}</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'left'}}>Tax ID</Text>
                </View>
                <View style={{width: '50%'}}>
                  <Text style={{textAlign: 'right'}}>#{staff?.tax_id}</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {`Manage Access`}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontWeight: 'bold', marginHorizontal: 5}}>
              {`E-Class`}
            </Text>
            {this.state.loaderIndex !== 'e_class' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>No</Text>
                <Switch
                  trackColor={{true: Colors.GRAY_6}}
                  thumbColor={true ? Colors.BLUE : Colors.GRAY_4}
                  onValueChange={value => {
                    this.setState({loaderIndex: 'e_class'}, () => {
                      this.updateStaffPermission(
                        staff.id,
                        'e_class',
                        'e_class',
                      );
                    });
                  }}
                  value={e_class_permission}
                />
                <Text style={{fontWeight: 'bold'}}>Yes</Text>
              </View>
            ) : (
              <ActivityIndicator style={{marginRight: 7}} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontWeight: 'bold', marginHorizontal: 5}}>
              {`Store`}
            </Text>
            {this.state.loaderIndex !== 'store' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>No</Text>
                <Switch
                  trackColor={{true: Colors.GRAY_6}}
                  thumbColor={true ? Colors.BLUE : Colors.GRAY_4}
                  onValueChange={value => {
                    this.setState({loaderIndex: 'store'}, () => {
                      this.updateStaffPermission(staff.id, 'store', 'store');
                    });
                  }}
                  value={store_permission}
                />
                <Text style={{fontWeight: 'bold'}}>Yes</Text>
              </View>
            ) : (
              <ActivityIndicator style={{marginRight: 7}} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={{fontWeight: 'bold', marginHorizontal: 5}}>
              {`league`}
            </Text>
            {this.state.loaderIndex !== 'league' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}>No</Text>
                <Switch
                  trackColor={{true: Colors.GRAY_6}}
                  thumbColor={true ? Colors.BLUE : Colors.GRAY_4}
                  onValueChange={value => {
                    this.setState({loaderIndex: 'league'}, () => {
                      this.updateStaffPermission(staff.id, 'league', 'league');
                    });
                  }}
                  value={league_permission}
                />
                <Text style={{fontWeight: 'bold'}}>Yes</Text>
              </View>
            ) : (
              <ActivityIndicator style={{marginRight: 7}} />
            )}
          </View>

          {this.props.scheduleTypes?.map(x => {
            const schedule_permission = staff?.permissions?.find(y => {
              return y.permission_id == x.id;
            })
              ? true
              : false;
            console.log('schedule_permission=>', schedule_permission);
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontWeight: 'bold', marginHorizontal: 5}}>
                  {'Schedule Type: ' + x.title}
                </Text>
                {this.state.loaderIndex != x.id ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>No</Text>
                    <Switch
                      trackColor={{true: Colors.GRAY_6}}
                      thumbColor={true ? Colors.BLUE : Colors.GRAY_4}
                      onValueChange={value => {
                        this.setState({loaderIndex: x.id}, () => {
                          this.updateStaffPermission(
                            staff.id,
                            'schedule',
                            x.id,
                          );
                        });
                      }}
                      value={schedule_permission}
                    />
                    <Text style={{fontWeight: 'bold'}}>Yes</Text>
                  </View>
                ) : (
                  <ActivityIndicator style={{marginRight: 7}} />
                )}
              </View>
            );
          })}

          {/* <View style={{}}>
            <Button
              name="Save"
              backgroundColor={Colors.BLUE}
              textStyle={{color: Colors.WHITE}}
              onPress={() => {}}
            />
          </View> */}
        </ScrollView>
        <Loader loader={this.state.loader} />
        {/* <ActivityIndicator
            size={'large'}
            color={Colors.BLUE}
            style={styles.loadMoreContentContainer}
          /> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    scheduleTypes: state.ScheduleReducer.scheduleTypes,
    user: state.Auth.user,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getScheduleTypes: () => dispatch(ScheduleMiddleware.getScheduleTypes()),
    updateStaffPermission: payload =>
      dispatch(AuthMiddleware.updateStaffPermission(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(StaffDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: Colors.WHITE,
  },

  flex1: {flex: 1},
  userItemContainer: {
    alignSelf: 'center',
    paddingVertical: 14,
    flexDirection: 'row',
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  userNameContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.GRAY_3,
    fontWeight: '500',
    fontSize: 18,
  },
  userName: {
    color: Colors.GRAY_3,
    fontSize: 12,
  },

  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.BLUE,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  loadMoreText: {
    color: Colors.WHITE,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 5,
  },

  flex1: {flex: 1},
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 100,
    marginVertical: 20,
  },
});
