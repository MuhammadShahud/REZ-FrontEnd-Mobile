import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import {
  dropdownIcon,
  check_box_checked,
  check_box_un_check,
} from '../../Assets';
import { Header, Loader } from '../../Components';
import { Colors } from '../../Styles';
import { connect } from 'react-redux';
import UserMiddleware from '../../Store/Middleware/UserMiddleware';
import { SelectUser } from './SelectUser';
import { dummyImage } from '../../Config';
import { img_url } from '../../Store/Apis';
import MeshCalenderMiddleware from '../../Store/Middleware/MeshCalenderMiddleware';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';

class index extends Component {
  state = {
    modal: false,
    categories: ['player', 'coach', 'parent'],
    currentDate: new Date(),
    names: ['Name', 'Sarah', 'John', 'Stacy Doe', 'Alex'],
    selectedRole: null,
    usersModal: false,
    selectedUsersIDs: [],
    selectedonlyIDs: [],
    date: new Date().toISOString(),
    isShowDateModal: false,

    coachModal: false,
    playerModal: false,
    facilityModal: false,
    parentModal: false,
    staffModal: false,
    loader: false,
  };

  componentDidMount() {
    const { role } = this.props;
    if (role == 'coach') {
      ['coach', 'player', 'facility'].map(x => {
        this.props.getUsersByType({ role: x }).then(users => {
          this.setState({ [x]: { list: users?.data?.data, users: users?.data } });
        });
      });
    }
    if (role == 'player') {
      ['player', 'coach', 'facility'].map(x => {
        this.props.getUsersByType({ role: x }).then(users => {
          this.setState({ [x]: { list: users?.data?.data, users: users?.data } });
        });
      });
    }
    if (role == 'facility') {
      ['facility'].map(x => {
        this.props.getUsersByType({ role: x }).then(users => {
          this.setState({ [x]: { list: users?.data?.data, users: users?.data } });
        });
      });
    }
    if (role == 'parent') {
      ['parent', 'coach', 'facility'].map(x => {
        this.props.getUsersByType({ role: x }).then(users => {
          this.setState({ [x]: { list: users?.data?.data, users: users?.data } });
        });
      });
    }
  }

  renderCategories = () => {
    return (
      <View style={styles.inputContainer}>
        <SelectDropdown
          data={this.state.categories}
          // defaultValue={this.state.categories[0]}
          defaultButtonText="Select Role"
          dropdownIconPosition="right"
          renderDropdownIcon={() => {
            return (
              <Image
                resizeMode="contain"
                source={dropdownIcon}
                style={styles.w20}
              />
            );
          }}
          buttonTextStyle={styles.dropDownBtnText}
          buttonStyle={styles.btnStyle}
          onSelect={(selectedItem, index) => {
            this.setState({ selectedRole: selectedItem, selectedUsersIDs: [] });
            this.props.getUsersByType({ role: selectedItem });
          }}
        />
      </View>
    );
  };

  // renderNames = () => {
  //   return (
  //     <View style={styles.inputContainer}>
  //       <SelectDropdown
  //         data={this.state.names}
  //         defaultValue={this.state.names[0]}
  //         dropdownIconPosition="right"
  //         renderDropdownIcon={() => {
  //           return (
  //             <Image
  //               resizeMode="contain"
  //               source={dropdownIcon}
  //               style={styles.w20}
  //             />
  //           );
  //         }}
  //         buttonTextStyle={styles.dropDownBtnText}
  //         buttonStyle={styles.btnStyle}
  //         onSelect={(selectedItem, index) => {
  //           this.setState({ name: selectedItem });
  //         }}
  //       />
  //     </View>
  //   );
  // };

  onPressLoadMore = (usersByTypePaginatedObj, key) => {
    this.setState({ loader: true }, () => {
      this.props
        .getUsersByType({
          role: key,
          next_page_url: usersByTypePaginatedObj?.next_page_url,
        })
        .then(users => {
          let obj = {
            list: [...this.state[key]?.['list'], ...users.data?.data],
            users: users,
          };
          this.setState({ loader: false, [key]: obj });
        })
        .catch(() => {
          this.setState({ loader: false });
        });
    });
  };

  renderLoaderMoreButton = (usersByTypePaginatedObj, key) => {
    // const {usersByTypePaginatedObj} = this.props;
    const { loader } = this.state;
    return usersByTypePaginatedObj?.next_page_url ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={Colors.BLUE}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={styles.loadMoreContentContainer}
          onPress={() => this.onPressLoadMore(usersByTypePaginatedObj, key)}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  onPressUser = item => {
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    selectedUsersIDsCopy.push(item);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
  };

  removeUserFromSelectedUserIds = item => {
    let selectedUsersIDsCopy = this.state.selectedUsersIDs;
    let foundIndex = selectedUsersIDsCopy.findIndex(x => x.id == item.id);
    selectedUsersIDsCopy.splice(foundIndex, 1);
    this.setState({ selectedUsersIDs: selectedUsersIDsCopy });
  };

  onPressSelect = modalName => {
    this.setState({
      [modalName]: false,
      selectedonlyIDs: this.state.selectedUsersIDs?.map(x => x.id),
    });
  };

  meshCalenderGenerator = () => {
    if (this.state.selectedonlyIDs?.length > 0 && this.state.date) {
      this.setState({ loader: true }, () => {
        this.props
          .meshCalenderGenerator({
            user_list: this.state.selectedonlyIDs,
            date: this.state.date
              ? this.state.date.split('T')[0]
              : this.state.date,
          })
          .then(data => {
            this.setState({ loader: false }, () => {
              this.props.navigation.navigate('MeshCalendarList', {
                item: this.props.meshCalenderData?.data,
              });
            });
          })
          .catch(() => {
            this.setState({ loader: false });
            alert('Something went wrong');
          });
      });
    } else {
      alert('All field is required');
    }
  };

  renderDateModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.isShowDateModal}
        mode={'date'}
        date={this.state.date ? new Date(this.state.date) : new Date()}
        minimumDate={new Date()}
        onConfirm={date => {
          this.setState({ date: date.toISOString(), isShowDateModal: false });
        }}
        onCancel={() => {
          this.setState({ isShowDateModal: false });
        }}
      />
    );
  };

  renderForCoach = () => {
    return (
      <>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.GRAY_1,
            borderRadius: 10,
            paddingVertical: 10,
            marginVertical: 5,
          }}>
          <View style={{}}>
            <Text style={{ paddingLeft: 8, color: Colors.BLACK }}>
              Select Coach
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ coachModal: true })}
              activeOpacity={0.7}
              style={styles.dateBtn}>
              <Text style={{ paddingLeft: 8 }}>Select Users</Text>
              <Feather name="calendar" size={20} color={Colors.BLUE} />
            </TouchableOpacity>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.selectedUsersIDs?.filter(
                x => x.role === 'coach',
              )}
              style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item.id}-friends`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Image
                      source={{
                        uri: item.profile_image
                          ? img_url + item.profile_image
                          : dummyImage,
                      }}
                      style={{ height: 25, width: 25 }}
                    // resizeMode={'contain'}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal
            visible={this.state.coachModal}
            style={{}}
            onRequestClose={() => this.setState({ coachModal: false })}
            animationType={'slide'}>
            {this.state['coach'] && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state['coach']['list']}
                style={styles.usersListContainer}
                ListFooterComponent={() =>
                  this.renderLoaderMoreButton(
                    this.state?.['coach']?.['users'],
                    'coach',
                  )
                }
                renderItem={({ item, index }) => {
                  console.warn('item', item);
                  const isCheck =
                    this.state.selectedUsersIDs?.findIndex(
                      x => x?.id == item.id,
                    ) !== -1
                      ? true
                      : false;
                  return (
                    <TouchableOpacity
                      key={`${item.id}-friends`}
                      onPress={() =>
                        isCheck
                          ? this.removeUserFromSelectedUserIds(item)
                          : this.onPressUser(item)
                      }
                      style={styles.userContainer}>
                      <Image
                        source={{
                          uri: item.profile_image
                            ? img_url + item.profile_image
                            : dummyImage,
                        }}
                        style={styles.avatarImage}
                      // resizeMode={'contain'}
                      />
                      <Text style={styles.name}>{item.username}</Text>
                      <Image
                        source={
                          isCheck ? check_box_checked : check_box_un_check
                        }
                        style={styles.checkunCheckImage}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View>
              <TouchableOpacity
                onPress={() => this.onPressSelect('coachModal')}
                activeOpacity={0.7}
                style={styles.selectBtn}>
                <Text style={{ paddingLeft: 8, color: Colors.WHITE }}>
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  };
  renderForPlayer = () => {
    return (
      <>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.GRAY_1,
            borderRadius: 10,
            paddingVertical: 10,
            marginVertical: 5,
          }}>
          <View style={{}}>
            <Text style={{ paddingLeft: 8, color: Colors.BLACK }}>
              Select Player
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ playerModal: true })}
              activeOpacity={0.7}
              style={styles.dateBtn}>
              <Text style={{ paddingLeft: 8 }}>Select Users</Text>
              <Feather name="calendar" size={20} color={Colors.BLUE} />
            </TouchableOpacity>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.selectedUsersIDs?.filter(
                x => x.role === 'player',
              )}
              style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item.id}-friends`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Image
                      source={{
                        uri: item.profile_image
                          ? img_url + item.profile_image
                          : dummyImage,
                      }}
                      style={{ height: 25, width: 25 }}
                    // resizeMode={'contain'}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal
            visible={this.state.playerModal}
            style={{}}
            onRequestClose={() => this.setState({ playerModal: false })}
            animationType={'slide'}>
            {this.state['coach'] && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state?.['player']?.['list']}
                style={styles.usersListContainer}
                ListFooterComponent={() =>
                  this.renderLoaderMoreButton(
                    this.state?.['player']?.['users'],
                    'player',
                  )
                }
                renderItem={({ item, index }) => {
                  console.warn('item', item);
                  const isCheck =
                    this.state.selectedUsersIDs?.findIndex(
                      x => x?.id == item.id,
                    ) !== -1
                      ? true
                      : false;
                  return (
                    <TouchableOpacity
                      key={`${item.id}-friends`}
                      onPress={() =>
                        isCheck
                          ? this.removeUserFromSelectedUserIds(item)
                          : this.onPressUser(item)
                      }
                      style={styles.userContainer}>
                      <Image
                        source={{
                          uri: item.profile_image
                            ? img_url + item.profile_image
                            : dummyImage,
                        }}
                        style={styles.avatarImage}
                      // resizeMode={'contain'}
                      />
                      <Text style={styles.name}>{item.username}</Text>
                      <Image
                        source={
                          isCheck ? check_box_checked : check_box_un_check
                        }
                        style={styles.checkunCheckImage}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View>
              <TouchableOpacity
                onPress={() => this.onPressSelect('playerModal')}
                activeOpacity={0.7}
                style={styles.selectBtn}>
                <Text style={{ paddingLeft: 8, color: Colors.WHITE }}>
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  };
  renderForFacility = () => {
    return (
      <>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.GRAY_1,
            borderRadius: 10,
            paddingVertical: 10,
            marginVertical: 5,
          }}>
          <View style={{}}>
            <Text style={{ paddingLeft: 8, color: Colors.BLACK }}>
              Select Facility
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ facilityModal: true })}
              activeOpacity={0.7}
              style={styles.dateBtn}>
              <Text style={{ paddingLeft: 8 }}>Select Users</Text>
              <Feather name="calendar" size={20} color={Colors.BLUE} />
            </TouchableOpacity>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.selectedUsersIDs?.filter(
                x => x.role === 'facility',
              )}
              style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item.id}-friends`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Image
                      source={{
                        uri: item.profile_image
                          ? img_url + item.profile_image
                          : dummyImage,
                      }}
                      style={{ height: 25, width: 25 }}
                    // resizeMode={'contain'}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal
            visible={this.state.facilityModal}
            style={{}}
            onRequestClose={() => this.setState({ facilityModal: false })}
            animationType={'slide'}>
            {this.state['facility'] && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state?.['facility']?.['list']}
                style={styles.usersListContainer}
                ListFooterComponent={() => {
                  return this.renderLoaderMoreButton(
                    this.state?.['facility']?.['users'],
                    'facility',
                  );
                }}
                renderItem={({ item, index }) => {
                  console.warn('item', item);
                  const isCheck =
                    this.state.selectedUsersIDs?.findIndex(
                      x => x?.id == item.id,
                    ) !== -1
                      ? true
                      : false;
                  return (
                    <TouchableOpacity
                      key={`${item.id}-friends`}
                      onPress={() =>
                        isCheck
                          ? this.removeUserFromSelectedUserIds(item)
                          : this.onPressUser(item)
                      }
                      style={styles.userContainer}>
                      <Image
                        source={{
                          uri: item.profile_image
                            ? img_url + item.profile_image
                            : dummyImage,
                        }}
                        style={styles.avatarImage}
                      // resizeMode={'contain'}
                      />
                      <Text style={styles.name}>{item.username}</Text>
                      <Image
                        source={
                          isCheck ? check_box_checked : check_box_un_check
                        }
                        style={styles.checkunCheckImage}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View>
              <TouchableOpacity
                onPress={() => this.onPressSelect('facilityModal')}
                activeOpacity={0.7}
                style={styles.selectBtn}>
                <Text style={{ paddingLeft: 8, color: Colors.WHITE }}>
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  };
  renderForParent = () => {
    return (
      <>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.GRAY_1,
            borderRadius: 10,
            paddingVertical: 10,
            marginVertical: 5,
          }}>
          <View style={{}}>
            <Text style={{ paddingLeft: 8, color: Colors.BLACK }}>
              Select Parent
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ parentModal: true })}
              activeOpacity={0.7}
              style={styles.dateBtn}>
              <Text style={{ paddingLeft: 8 }}>Select Users</Text>
              <Feather name="calendar" size={20} color={Colors.BLUE} />
            </TouchableOpacity>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.selectedUsersIDs?.filter(
                x => x.role === 'parent',
              )}
              style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item.id}-friends`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Image
                      source={{
                        uri: item.profile_image
                          ? img_url + item.profile_image
                          : dummyImage,
                      }}
                      style={{ height: 25, width: 25 }}
                    // resizeMode={'contain'}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal
            visible={this.state.facilityModal}
            style={{}}
            onRequestClose={() => this.setState({ facilityModal: false })}
            animationType={'slide'}>
            {this.state['parent'] && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state?.['parent']?.['list']}
                style={styles.usersListContainer}
                ListFooterComponent={() => {
                  return this.renderLoaderMoreButton(
                    this.state?.['parent']?.['users'],
                    'parent',
                  );
                }}
                renderItem={({ item, index }) => {
                  console.warn('item', item);
                  const isCheck =
                    this.state.selectedUsersIDs?.findIndex(
                      x => x?.id == item.id,
                    ) !== -1
                      ? true
                      : false;
                  return (
                    <TouchableOpacity
                      key={`${item.id}-friends`}
                      onPress={() =>
                        isCheck
                          ? this.removeUserFromSelectedUserIds(item)
                          : this.onPressUser(item)
                      }
                      style={styles.userContainer}>
                      <Image
                        source={{
                          uri: item.profile_image
                            ? img_url + item.profile_image
                            : dummyImage,
                        }}
                        style={styles.avatarImage}
                      // resizeMode={'contain'}
                      />
                      <Text style={styles.name}>{item.username}</Text>
                      <Image
                        source={
                          isCheck ? check_box_checked : check_box_un_check
                        }
                        style={styles.checkunCheckImage}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            )}
            <View>
              <TouchableOpacity
                onPress={() => this.onPressSelect('parentModal')}
                activeOpacity={0.7}
                style={styles.selectBtn}>
                <Text style={{ paddingLeft: 8, color: Colors.WHITE }}>
                  Select
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </>
    );
  };
  renderForStaff = () => {
    // console.log(this.props.user?.staffInfo?.length);
    return (
      <>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.GRAY_1,
            borderRadius: 10,
            paddingVertical: 10,
            marginVertical: 5,
          }}>
          <View style={{}}>
            <Text style={{ paddingLeft: 8, color: Colors.BLACK }}>
              Select Staff
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ staffModal: true })}
              activeOpacity={0.7}
              style={styles.dateBtn}>
              <Text style={{ paddingLeft: 8 }}>Select Users</Text>
              <Feather name="calendar" size={20} color={Colors.BLUE} />
            </TouchableOpacity>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.selectedUsersIDs?.filter(
                x => x.role === 'staff',
              )}
              style={{ paddingHorizontal: 10, paddingVertical: 5 }}
              renderItem={({ item, index }) => {
                return (
                  <View
                    key={`${item.id}-friends`}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Image
                      source={{
                        uri: item.profile_image
                          ? img_url + item.profile_image
                          : dummyImage,
                      }}
                      style={{ height: 25, width: 25 }}
                    // resizeMode={'contain'}
                    />
                    <Text style={styles.name}>{item.username}</Text>
                  </View>
                );
              }}
            />
          </View>
          <Modal
            visible={this.state.staffModal}
            style={{}}
            onRequestClose={() => this.setState({ staffModal: false })}
            animationType={'slide'}>
            {this.props.user?.staffInfo?.length > 0 ? (
              <>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.props.user?.staffInfo}
                  style={styles.usersListContainer}
                  ListEmptyComponent={<Text>Staffs not found</Text>}
                  // ListFooterComponent={this.renderLoaderMoreButton()}
                  renderItem={({ item, index }) => {
                    console.warn('item', item);
                    const isCheck =
                      this.state.selectedUsersIDs?.findIndex(
                        x => x?.id == item.id,
                      ) !== -1
                        ? true
                        : false;
                    return (
                      <TouchableOpacity
                        key={`${item.id}-friends`}
                        onPress={() =>
                          isCheck
                            ? this.removeUserFromSelectedUserIds(item)
                            : this.onPressUser(item)
                        }
                        style={styles.userContainer}>
                        <Image
                          source={{
                            uri: item.profile_image
                              ? img_url + item.profile_image
                              : dummyImage,
                          }}
                          style={styles.avatarImage}
                        // resizeMode={'contain'}
                        />
                        <Text style={styles.name}>{item.username}</Text>
                        <Image
                          source={
                            isCheck ? check_box_checked : check_box_un_check
                          }
                          style={styles.checkunCheckImage}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
                <View>
                  <TouchableOpacity
                    onPress={() => this.onPressSelect('staffModal')}
                    activeOpacity={0.7}
                    style={styles.selectBtn}>
                    <Text style={{ paddingLeft: 8, color: Colors.WHITE }}>
                      Select
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : <Text style={{ alignSelf: 'center', justifyContent: 'center', marginTop: 10 }}>Staffs not found</Text>}

          </Modal>
        </View>
      </>
    );
  };

  render() {
    const { date } = this.state;
    const { usersByType, meshCalenderData } = this.props;
    console.log('PLAYERS StATE=>', JSON.stringify(this.state.player));
    return (
      <ScrollView style={styles.container}>
        <Header
          title="Mesh Calendar"
          isShowLeftIcon={true}
          navigation={this.props.navigation}
        />

        <Text style={styles.title}>
          Select one which you want to merge your calendar
        </Text>

        {this.props.role === 'player' ||
          this.props.role === 'coach' ||
          this.props.role === 'parent'
          ? this.renderForCoach()
          : null}
        {this.props.role === 'player' || this.props.role === 'coach'
          ? this.renderForPlayer()
          : null}
        {this.renderForFacility()}
        {this.props.role === 'parent' ? this.renderForParent() : null}
        {this.props.role === 'facility' ? this.renderForStaff() : null}

        <TouchableOpacity
          onPress={() => this.setState({ isShowDateModal: true })}
          style={styles.dateBtn}>
          <Text style={{ paddingLeft: 8 }}>
            {date ? new Date(date).toLocaleDateString() : 'Select Date'}
          </Text>

          <Feather name="calendar" size={20} color={Colors.BLUE} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.meshCalenderGenerator()}
          style={styles.button}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>

        {this.renderDateModal()}
        <Loader loader={this.state.loader} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    coachSessionDetail: state.GetCoachesReducer.coachSessionDetail,
    user: state.Auth.user,
    usersByType: state.UserReducer.usersByType,
    usersByTypePaginatedObj: state.UserReducer.usersByTypePaginatedObj,
    role: state.Auth.role,
    meshCalenderData: state.MeshCalenderReducer.meshCalenderData,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    getUsersByType: payload => dispatch(UserMiddleware.getUsersByType(payload)),
    meshCalenderGenerator: payload =>
      dispatch(MeshCalenderMiddleware.meshCalenderGenerator(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);
const styles = StyleSheet.create({
  w20: { width: 16, tintColor: Colors.BLUE },
  container: { flex: 1, backgroundColor: Colors.WHITE, paddingHorizontal: 18 },
  title: {
    textAlign: 'center',
    paddingHorizontal: 55,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  dateBtn: {
    width: '90%',
    marginVertical: 6,
    paddingVertical: 15,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.GRAY_PRIMARY,
  },
  selectBtn: {
    width: '90%',
    marginVertical: 6,
    paddingVertical: 15,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BLUE,
    // position: 'absolute',
    // bottom: 0,
    // color: Colors.WHITE,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 14,
  },
  inputContainer: {
    marginVertical: 6,
  },
  dropDownBtnText: {
    color: Colors.GRAY_3,
    fontSize: 14,
    textAlign: 'left',
  },
  btnStyle: {
    backgroundColor: Colors.GRAY_PRIMARY,
    alignSelf: 'center',
    width: '90%',
  },
  button: {
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.BLUE,
    marginVertical: 14,
  },
  btnText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  bgWhite: {
    color: Colors.WHITE,
  },
  usersListContainer: {
    marginTop: 20,
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 110,
    marginBottom: 50,
    borderRadius: 5,
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  name: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 19,
    color: Colors.GRAY_3,
    fontWeight: 'bold',
  },
  checkunCheckImage: {
    height: 25,
    width: 25,
  },
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// export default index;
