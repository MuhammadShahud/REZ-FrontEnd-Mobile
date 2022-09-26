import CheckBox from '@react-native-community/checkbox';
import React, { Component } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import RenderHtml from 'react-native-render-html';

import {
  apple_logo,
  close,
  dropdownIcon,
  FbIcon,
  GoogleIcon,
  Logo,
  plus_circle_blue,
} from '../../../Assets';
import { Button, Calendar, Loader, TextInput } from '../../../Components';
import AuthAction from '../../../Store/Actions/AuthAction';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import { Colors } from '../../../Styles';
import { GamesList } from '../../';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-date-picker';
import GerneralMiddleware from '../../../Store/Middleware/GeneralMiddleware';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import moment from 'moment';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usercolor: '',
      email: '',
      phoneNumber: '',
      password: '',
      address: '',
      registeredAs: '',
      govID: '',
      taxID: '',
      enabled: false,
      childEmail: '',
      selectedChildList: [],
      registerAs: ['parent', 'player', 'facility', 'coach', 'store', 'team'],
      levels: ['Beginner', 'Intermediate', 'Expert'],
      selectedLevel: '',
      genders: ['male', 'female', 'others'],
      selectedSportTypeID: '',
      selectedGender: '',
      loader: false,
      dobModalVisible: false,
      dob: null,
      termsAndConditionModal: false,
      isCheckTermsAndCondition: false,
      termsAndCondition: '',
      sportTypeModal: false,
      description: '',
      color_code: '',
    };
  }
  componentDidMount() {
    const { social } = this.props;
    console.warn(social)
    this.setState({ email: social?.email, username: social?.name });
    this.props.getSportTypes();
    this.props.getColors();

    this.Terms();
  }
  Terms = () => {
    this.props.Terms({
      callback: response => {
        if (response) {
          console.warn('RES,', response);
          this.setState({
            termsAndCondition: response?.data?.data,
          });
        }
      },
    });
  };

  handleChangeUsername = value => {
    this.setState({ username: value });
    console.warn(value);
  };

  handleChangecolor = value => {
    this.setState({ usercolor: value });
    console.warn(value);
  };

  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };
  handleChangePhoneNumber = value => {
    this.setState({ phoneNumber: value });
    console.warn(value);
  };
  handleChangePassword = value => {
    this.setState({ password: value });
    console.warn(value);
  };
  handleChangeAddress = value => {
    this.setState({ address: value });
    console.warn(value);
  };
  handleChangeGovID = value => {
    this.setState({ govID: value });
    console.warn(value);
  };
  handleChangeTaxID = value => {
    this.setState({ taxID: value });
    console.warn(value);
  };

  toggleSwitch = () => {
    this.setState({ enabled: true });
  };

  onPressSignUp = () => {
    const {
      username,
      email,
      phoneNumber,
      password,
      address,
      selectedGender,
      govID,
      taxID,
      selectedLevel,
      selectedSportTypeID,
      registeredAs,
      dob,
      description,
      color_code,
    } = this.state;

    let min_dob = new Date();
    min_dob.setFullYear(min_dob.getFullYear() - 14);
    if (dob > min_dob) {
      alert('Age must be greater than 14 ');
      return;
    }

    if (this.props?.social) {
    } else {
      if (password.length < 8) {
        alert('Password must be alteast 8 characters!');
        return;
      }
    }

    if (
      (username &&
        email &&
        selectedSportTypeID &&
        registeredAs) ||
      color_code
    ) {
      let dobCopy = new Date(dob);

      let signUpObj = {
        username: username,
        email: email,
        password: password,
        phone: phoneNumber,
        address: address,
        role: registeredAs,
        level: selectedLevel,
        govt_id: govID,
        tax_id: taxID,
        gender: selectedGender,
        dob: `${dobCopy.getFullYear()}-${dobCopy.getMonth() + 1
          }-${dobCopy.getDate()}`,
        sport_type: selectedSportTypeID,
        childName: this.state.selectedChildList.map(x => x.id).join(','),
        description: description,
        color_code: color_code,
      };
      if (this.props.social) {
        signUpObj.platform = this.props.social?.platform;
      }

      // console.log(JSON.stringify(signUpObj));
      // return;
      if (this.state.isCheckTermsAndCondition) {
        this.setState({ loader: true }, () => {
          this.props
            .signUp(signUpObj)
            .then(data => {
              this.setState({ loader: false });
              this.props.navigation.goBack();
              this.props.setsocial(null)
            })
            .catch(err => {
              this.setState({ loader: false });
            });
        });
      } else {
        alert('Accept terms & condition');
      }
    } else {
      alert('All fields are required');
    }
  };

  onPressAddChildname = () => {
    const { childEmail } = this.state;
    this.setState({ loader: true }, () => {
      this.props
        .checkChildEmail(childEmail)
        .then(data => {
          let selectedChildListCopy = this.state.selectedChildList;
          const isFound = selectedChildListCopy.find(x => x.id === data.id);
          if (!isFound) {
            this.state.selectedChildList.push(data);
          }
          this.setState({ loader: false, childEmail: '' });
        })
        .catch(err => {
          this.setState({ loader: false });
        });
    });
  };

  onPressCroseChidlEmail = index => {
    let selectedChildListCopy = this.state.selectedChildList;
    selectedChildListCopy.splice(index, 1);
    this.setState({ selectedChildList: selectedChildListCopy });
  };

  onPressDOB = () => {
    this.setState({ dobModalVisible: true });
  };

  renderDOBModal = () => {
    return (
      <DatePicker
        modal
        open={this.state.dobModalVisible}
        mode={'date'}
        date={this.state.dob ? this.state.dob : new Date()}
        maximumDate={new Date()}
        onConfirm={date => {
          this.setState({ dobModalVisible: false, dob: date });
        }}
        onCancel={() => {
          this.setState({ dobModalVisible: false });
        }}
      />
    );
  };

  renderTermsAndCondition = () => {
    const source = {
      html: `${this.state.termsAndCondition}`,
    };

    return (
      <Modal
        visible={this.state.termsAndConditionModal}
        style={{}}
        animationType={'slide'}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ termsAndConditionModal: false });
          }}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 15,
            marginRight: 30,
          }}>
          <Image
            source={close}
            style={{ height: 20, width: 20 }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: Colors.WHITE,
              paddingHorizontal: 25,
            }}>
            <ScrollView style={{ flex: 1 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Terms of Service
                </Text>
                <RenderHtml contentWidth={'100%'} source={source} />
              </View>
            </ScrollView>

            <View style={{ marginVertical: 5 }}>
              <Button
                name={'Accept'}
                backgroundColor={Colors.BLUE}
                textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
                onPress={() => {
                  this.setState({
                    isCheckTermsAndCondition: true,
                    termsAndConditionModal: false,
                  });
                }}
              />
            </View>

            <View style={{ marginVertical: 5 }}>
              <Button
                name="Decline"
                backgroundColor={Colors.GREEN}
                textStyle={{ color: Colors.WHITE, fontWeight: 'bold' }}
                onPress={() =>
                  this.setState({
                    isCheckTermsAndCondition: false,
                    termsAndConditionModal: false,
                  })
                }
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  renderSelectSportType = () => {
    return (
      <Modal
        visible={this.state.sportTypeModal}
        style={{}}
        animationType={'slide'}>
        <GamesList
          onPressCloseIcon={() => this.setState({ sportTypeModal: false })}
          onPressSport={sport =>
            this.setState({
              selectedSportTypeID: sport.id,
              sportTypeModal: false,
            })
          }
        />
      </Modal>
    );
  };

  onPressGoogleSignIn = async () => {
    // Get the users ID token
    const gRes = await GoogleSignin.signIn();
    this.props
      .socialLogin({ email: gRes?.user?.email, platform: 'google' })
      .then(data => {
        console.log(data?.data);
        if (data?.data?.is_first_time) {
          this.setState({ email: gRes?.user?.email });
          console.warn(gRes?.user)
        }
      })
      .catch(err => { });
  };

  onPressFacebookLogin = () => {
    this.props
      .facebookLogin({})
      .then(fbdata => {
        this.props
          .socialLogin({ email: fbdata?.email, platform: 'facebook' })
          .then(data => {
            if (data?.data?.is_first_time) {
              this.setState({ email: fbdata?.email });
            }
          })
          .catch(err => { });
      })
      .catch(err => {
        console.log(err);
      });
  };
  onPressAppleSignin = () => {
    this.props
      .appleSignIn()
      .then(appledata => {
        this.props
          .socialLogin({ email: appledata?.email, platform: 'apple' })
          .then(data => {
            if (data?.data?.is_first_time) {
              this.setState({ email: appledata?.email });
            }
          })
          .catch(err => { });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { role, sportTypes, social } = this.props;
    const { loader, selectedChildList, dob } = this.state;
    console.log('selectedChildList', selectedChildList);
    let sportType = sportTypes.find(
      x => x.id === this.state.selectedSportTypeID,
    );

    let getcolors = this.props.getcolors?.map(item => {
      return item.name;
    })
    console.warn('SOCIAL=>', this.props.social);
    return (
      <>
        <LinearGradient
          start={{ x: 0.8, y: 0.0 }}
          end={{ x: 0.1, y: 1.0 }}
          locations={[0.4, 0.9]}
          colors={[Colors.GREEN, Colors.WHITE]}
          style={styles.linearGradient}>
          <View style={styles.container}>
            <ScrollView nestedScrollEnabled>
              <View>
                <Image resizeMode="contain" source={Logo} style={styles.logo} />
              </View>

              <View style={styles.whiteView}>
                <View style={styles.loginView}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={styles.loginText}>Signup</Text>
                  </View>
                  <SafeAreaView>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled
                      style={{ height: 400 }}>

                      <View style={{ alignItems: 'center' }}>
                        {this.props?.social == null ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>Username</Text>
                            <TextInput
                              placeholder="Enter User Name"
                              onChangeText={this.handleChangeUsername}
                              value={this.state.username}
                              style={{
                                backgroundColor: Colors.BLUE_LIGHT,
                              }}
                            />
                          </View>
                        ) : null}
                        {this.props?.social == null ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>Email</Text>
                            <TextInput
                              editable={this.props.social == null}
                              placeholder="Enter Email"
                              autoCapitalize="none"
                              onChangeText={this.handleChangeEmail}
                              value={this.state.email}
                              style={{
                                backgroundColor: Colors.BLUE_LIGHT,
                              }}
                            />
                          </View>
                        ) : null}

                        <View style={{ width: '100%', marginTop: 10 }}>
                          <Text style={{ color: Colors.GRAY_1 }}>
                            Phone Number
                          </Text>
                          <TextInput
                            placeholder="Enter Phone Number"
                            onChangeText={this.handleChangePhoneNumber}
                            keyboardType="phone-pad"
                            value={this.state.phoneNumber}
                            style={{
                              backgroundColor: Colors.BLUE_LIGHT,
                            }}
                          />
                        </View>

                        {this.props?.social == null ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>Password</Text>
                            <TextInput
                              placeholder="Enter Password"
                              secureTextEntry={true}
                              autoCapitalize="none"
                              onChangeText={this.handleChangePassword}
                              value={this.state.password}
                              style={{
                                backgroundColor: Colors.BLUE_LIGHT,
                              }}
                            />
                          </View>
                        ) : null}
                        {role === 'team' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>
                              Description
                            </Text>
                            <TextInput
                              placeholder={'Description'}
                              multiline
                              numberOfLines={3}
                              placeholderTextColor={Colors.GRAY_1}
                              style={{
                                height: 100,
                                backgroundColor: Colors.BLUE_LIGHT,
                                textAlignVertical: 'top',
                                padding: 10,
                                fontSize: 16,
                                marginVertical: 5,
                              }}
                              onChangeText={text => {
                                this.setState({ description: text });
                              }}
                              value={this.state.description}
                            />
                          </View>
                        ) : null}
                        {role !== 'store' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>Address</Text>
                            <TextInput
                              placeholder={'Address'}
                              multiline
                              numberOfLines={3}
                              placeholderTextColor={Colors.GRAY_1}
                              style={{
                                height: 100,
                                backgroundColor: Colors.BLUE_LIGHT,
                                textAlignVertical: 'top',
                                padding: 10,
                                fontSize: 16,
                                marginVertical: 5,
                                // color: Colors.GRAY_1,
                              }}
                              onChangeText={this.handleChangeAddress}
                              value={this.state.address}
                            />
                          </View>
                        ) : null}
                        <View style={{ width: '100%', marginTop: 10 }}>
                          <Text style={{ color: Colors.GRAY_1 }}>
                            Register As
                          </Text>

                          <SelectDropdown
                            data={this.state.registerAs}
                            dropdownIconPosition="right"
                            renderDropdownIcon={() => {
                              return (
                                <Image
                                  resizeMode="contain"
                                  source={dropdownIcon}
                                  style={{ width: 20 }}
                                />
                              );
                            }}
                            buttonTextStyle={{
                              textAlign: 'left',
                              color: Colors.GRAY_1,
                              fontSize: 16,
                            }}
                            buttonStyle={{
                              backgroundColor: Colors.BLUE_LIGHT,
                              width: '100%',
                              marginTop: 5,
                            }}
                            onSelect={(selectedItem, index) => {
                              this.props.setRole(selectedItem);
                              this.setState({ registeredAs: selectedItem });
                            }}
                          />
                        </View>
                        {role !== 'facility' &&
                          role !== 'store' &&
                          role !== 'team' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <View style={{ width: '100%', marginTop: 10 }}>
                              <Text style={{ color: Colors.GRAY_1 }}>
                                Date of birth
                              </Text>
                              <TouchableOpacity
                                onPress={this.onPressDOB}
                                style={{
                                  height: 50,
                                  backgroundColor: Colors.BLUE_LIGHT,
                                  padding: 10,
                                  fontSize: 16,
                                  marginVertical: 5,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={{ color: Colors.GRAY_1 }}>
                                  {dob
                                    ? moment(dob).format('MMM DD YYYY')
                                    : 'Select Date of birth'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                            <Text style={{ color: Colors.GRAY_1 }}>Gender</Text>
                            <SelectDropdown
                              data={this.state.genders}
                              dropdownIconPosition="right"
                              renderDropdownIcon={() => {
                                return (
                                  <Image
                                    resizeMode="contain"
                                    source={dropdownIcon}
                                    style={{ width: 20 }}
                                  />
                                );
                              }}
                              buttonTextStyle={{
                                textAlign: 'left',
                                color: Colors.GRAY_1,
                                fontSize: 16,
                              }}
                              buttonStyle={{
                                backgroundColor: Colors.BLUE_LIGHT,
                                width: '100%',
                                marginTop: 5,
                              }}
                              onSelect={(selectedItem, index) => {
                                this.setState({ selectedGender: selectedItem });
                              }}
                            />
                          </View>
                        ) : null}
                        <View style={{ width: '100%', marginTop: 10 }}>
                          <View style={{ width: '100%', marginTop: 10 }}>

                            <Text style={{ color: Colors.GRAY_1 }}>Select Color</Text>
                            {getcolors && getcolors.length > 0 ?
                              <SelectDropdown
                                data={getcolors}
                                dropdownIconPosition="right"
                                renderDropdownIcon={() => {
                                  return (
                                    <Image
                                      resizeMode="contain"
                                      source={dropdownIcon}
                                      style={{ width: 20 }}
                                    />
                                  );
                                }}
                                buttonTextStyle={{
                                  textAlign: 'left',
                                  color: Colors.GRAY_1,
                                  fontSize: 16,
                                }}
                                buttonStyle={{
                                  backgroundColor: Colors.BLUE_LIGHT,
                                  width: '100%',
                                  marginTop: 5,
                                }}
                                onSelect={(selectedItem, index) => {
                                  this.setState({ color_code: this.props.getcolors[index].code });
                                }}
                              /> : null}
                          </View></View>
                        {role !== 'store' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>
                              Select Sport Type
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({ sportTypeModal: true })
                              }
                              style={[
                                styles.dateContainer,
                                {
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                },
                              ]}>
                              <Text style={{ color: Colors.GRAY_1 }}>
                                {sportType ? sportType.sportname : 'Sport Type'}
                              </Text>
                              <Image
                                resizeMode="contain"
                                source={dropdownIcon}
                                style={{ height: 20, width: 20 }}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : null}



                        {/* {this.props.role == 'player' ||
                        this.props.role == 'team' ? (
                          <View style={{width: '100%'}}>
                            <View style={{width: '100%', marginTop: 10}}>
                              <Text style={{color: Colors.GRAY_1}}>Level</Text>
                              <SelectDropdown
                                data={this.state.levels}
                                dropdownIconPosition="right"
                                renderDropdownIcon={() => {
                                  return (
                                    <Image
                                      resizeMode="contain"
                                      source={dropdownIcon}
                                      style={{width: 20}}
                                    />
                                  );
                                }}
                                buttonTextStyle={{
                                  textAlign: 'left',
                                  color: Colors.GRAY_1,
                                  fontSize: 16,
                                }}
                                buttonStyle={{
                                  backgroundColor: Colors.BLUE_LIGHT,
                                  width: '100%',
                                  marginTop: 5,
                                }}
                                onSelect={(selectedItem, index) => {
                                  this.setState({selectedLevel: selectedItem});
                                }}
                              />
                            </View>
                          </View>
                        ) : null} */}

                        {role !== 'parent' &&
                          role !== 'player' &&
                          role !== 'team' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>
                              Government ID (Optional)
                            </Text>
                            <TextInput
                              placeholder="Enter ID"
                              // secureTextEntry={true}
                              onChangeText={this.handleChangeGovID}
                              value={this.state.govID}
                              style={{
                                backgroundColor: Colors.BLUE_LIGHT,
                              }}
                            />
                          </View>
                        ) : null}

                        {role === 'parent' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>
                              Add Child
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <TextInput
                                placeholder="Child Email"
                                onChangeText={text =>
                                  this.setState({ childEmail: text })
                                }
                                value={this.state.childEmail}
                                inputContainerStyle={{
                                  backgroundColor: Colors.BLUE_LIGHT,
                                  flex: 1,
                                }}
                              />
                              <TouchableOpacity
                                onPress={this.onPressAddChildname}>
                                <Image
                                  source={plus_circle_blue}
                                  style={{
                                    marginLeft: 10,
                                    width: 30,
                                    height: 30,
                                    alignSelf: 'center',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            {this.state.selectedChildList.map((x, i) => {
                              return (
                                <View style={styles.childEmailItemContainer}>
                                  <Text>{x.email}</Text>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.onPressCroseChidlEmail(i)
                                    }>
                                    <Image
                                      source={close}
                                      style={{ width: 10, height: 10 }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </View>
                        ) : null}

                        {role !== 'parent' &&
                          role !== 'player' &&
                          role !== 'team' ? (
                          <View style={{ width: '100%', marginTop: 10 }}>
                            <Text style={{ color: Colors.GRAY_1 }}>Tax ID (Optional)</Text>
                            <TextInput
                              placeholder="Enter ID"
                              secureTextEntry={false}
                              onChangeText={this.handleChangeTaxID}
                              value={this.state.taxID}
                              style={{
                                backgroundColor: Colors.BLUE_LIGHT,
                              }}
                            />
                          </View>
                        ) : null}

                        <View
                          style={{
                            flexDirection: 'row',
                            width: '100%',
                            marginTop: 10,
                          }}>
                          <CheckBox
                            style={{
                              height: 20,
                              width: 20,
                              marginLeft: 5,
                            }}
                            disabled={false}
                            value={this.state.isCheckTermsAndCondition}
                            tintColors
                            onValueChange={newValue => {
                              this.setState({ termsAndConditionModal: true });
                            }}
                          />

                          <TouchableOpacity
                            onPress={() => {
                              this.setState({ termsAndConditionModal: true });
                            }}
                            style={{ justifyContent: 'center' }}>
                            <Text
                              style={{
                                textDecorationLine: 'underline',
                                marginHorizontal: 10,
                              }}>
                              I Accept Terms & Conditions
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', marginTop: 5 }}>
                          <Button
                            height={50}
                            name={`Sign Up`}
                            textStyle={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: Colors.WHITE,
                            }}
                            onPress={this.onPressSignUp}
                          />
                        </View>

                        <Text style={{ color: Colors.GRAY_1, marginTop: 5 }}>
                          OR
                        </Text>
                        <View style={{ width: '100%', marginTop: 20 }}>
                          <Button
                            height={50}
                            name={'Log In'}
                            textStyle={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              color: Colors.GREEN,
                            }}
                            btnStyle={{}}
                            backgroundColor={Colors.BLUE_LIGHT}
                            onPress={() =>
                              this.props.navigation.navigate('Login')
                            }
                          />
                        </View>
                      </View>
                    </ScrollView>
                  </SafeAreaView>

                  <View style={{ alignItems: 'center' }}>
                    <View style={styles.underLine}></View>
                  </View>
                </View>

                <View style={{ marginTop: 20, height: 100 }}>
                  {/* <Text style={{ color: Colors.GRAY_1, fontWeight: 'bold' }}>
                    OR Connect with
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity onPress={this.onPressFacebookLogin}>
                      <Image
                        resizeMode="contain"
                        source={FbIcon}
                        style={{ width: 35 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onPressGoogleSignIn}>
                      <Image
                        resizeMode="contain"
                        source={GoogleIcon}
                        style={{ width: 35 }}
                      />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' && (
                      <TouchableOpacity
                        style={{ width: 35, height: 35, marginTop: 13 }}
                        onPress={this.onPressAppleSignin}>
                        <Image
                          resizeMode="contain"
                          source={apple_logo}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View> */}
                </View>
              </View>
            </ScrollView>
          </View>
          <Loader loader={loader} />
          {this.renderDOBModal()}
          {this.renderTermsAndCondition()}
          {this.renderSelectSportType()}
        </LinearGradient>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    role: state.Auth.role,
    sportTypes: state.Auth.sportTypes,
    getcolors: state.Auth.Colors,
    social: state.Auth.social,
  };
};
const mapsDispatchToProps = dispatch => {
  return {
    facebookLogin: payload => dispatch(AuthMiddleware.facebookLogin(payload)),
    socialLogin: payload => dispatch(AuthMiddleware.socialLogin(payload)),
    appleSignIn: payload => dispatch(AuthMiddleware.appleSignIn(payload)),

    setRole: payload => dispatch(AuthAction.setRole(payload)),
    isAuth: payload => dispatch(AuthAction.isAuth(payload)),
    signUp: payload => dispatch(AuthMiddleware.signUp(payload)),
    setsocial: payload => dispatch(AuthAction.socialLogin(payload)),
    onPressFacebookLogin: payload =>
      dispatch(AuthMiddleware.facebookLogin(payload)),
    getSportTypes: () => dispatch(AuthMiddleware.getSportTypes()),
    getColors: () => dispatch(AuthMiddleware.getColors()),

    checkChildEmail: payload =>
      dispatch(AuthMiddleware.checkChildEmail(payload)),
    Terms: paylaod => dispatch(GerneralMiddleware.Terms(paylaod)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignContent: 'flex-end'
    paddingTop: 50,
  },
  dateContainer: {
    backgroundColor: Colors.BLUE_LIGHT,
    padding: 15,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 5,
  },
  childEmailItemContainer: {
    backgroundColor: Colors.GRAY_2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 100,
    marginVertical: 10,
    // flex:0.4
  },
  input: {
    // height: 40,
    marginVertical: 5,
    // borderWidth: 1,
    padding: 10,
    backgroundColor: Colors.BLUE_LIGHT,
  },
  whiteView: {
    backgroundColor: Colors.WHITE,
    // flex:1,
    // height: 540,
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    alignItems: 'center',
    marginTop: 50,
  },
  loginView: {
    backgroundColor: Colors.WHITE,
    width: '80%',
    height: 480,
    // position: 'absolute',
    // bottom: 100,
    borderRadius: 30,
    elevation: 5,
    paddingHorizontal: 20,
    marginTop: -60,
  },
  loginText: {
    color: Colors.GREEN,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
  },
  underLine: {
    borderBottomWidth: 2,
    borderColor: Colors.GREEN,
    width: '40%',
    height: 20,
    position: 'absolute',
    bottom: -5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});
