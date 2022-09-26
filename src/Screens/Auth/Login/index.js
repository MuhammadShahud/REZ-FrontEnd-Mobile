import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Button, Loader, TextInput } from '../../../Components';
import { apple_logo, close, FbIcon, GoogleIcon, Logo } from '../../../Assets';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../Styles';
import AuthMiddleware from '../../../Store/Middleware/AuthMiddleware';
import { connect } from 'react-redux';
import AuthAction from '../../../Store/Actions/AuthAction';
import { ScrollView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Settings } from 'react-native-fbsdk-next';
import { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

Settings.setAppID('3234975666732479');

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: '',
      email: '',
      password: '',
      //email: 'storeuser@gmail.com',
      // password: '',
      // email: 'nasircoach@gmail.com',
      // email: 'nasir20@gmail.com',
      password: '',

      forgotPassEmail: '',
      forgotPassCode: '',

      newPassword: '',
      confirmPassword: '',

      forgotModalVisible1: false,
      forgotModalVisible2: false,
      changePassModalVisible: false,

      loader: false,
    };
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '',
    });
  }
  handleChangeEmail = value => {
    this.setState({ email: value });
    console.warn(value);
  };

  handleChangePassword = value => {
    this.setState({ password: value });
  };

  handleChangeForgotPasswordEmail = value => {
    this.setState({ forgotPassEmail: value });
  };

  handleChangeForgotPasswordCode = value => {
    this.setState({ forgotPassCode: value });
  };

  handleChangeNewPassword = value => {
    this.setState({ newPassword: value });
  };

  handleChangeConfirmPassword = value => {
    this.setState({ confirmPassword: value });
  };

  onPressLogin = () => {
    const { email, password } = this.state;
    this.setState({ loader: true }, () => {
      let loginObj = {
        email,
        password,
      };
      this.props
        .login(loginObj)
        .then(data => {
          this.setState({ loader: false });
        })
        .catch(err => {
          this.setState({ loader: false });
        });
    });
  };

  onPressSentEmailForgetPass = () => {
    const { forgotPassEmail } = this.state;
    if (forgotPassEmail) {
      this.setState({ loader: true }, () => {
        this.props
          .forgetPassword({ email: forgotPassEmail })
          .then(data => {
            this.setState({ loader: false }, () => {
              this.setState({
                forgotModalVisible2: true,
                forgotModalVisible1: false,
              });
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    }
  };

  onPressVerifyForgetPassword = () => {
    const { forgotPassCode, forgotPassEmail } = this.state;
    if (forgotPassCode) {
      this.setState({ loader: true }, () => {
        console.log(
          'forgotPassCode, forgotPassEmail',
          forgotPassCode,
          forgotPassEmail,
        );
        this.props
          .verifyForgetPassword({ code: forgotPassCode, email: forgotPassEmail })
          .then(data => {
            console.log(data);
            this.setState({ loader: false }, () => {
              this.setState({
                forgotModalVisible2: false,
                changePassModalVisible: true,
              });
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    }
  };

  onPressUpdatePassword = () => {
    const { newPassword, confirmPassword, forgotPassEmail } = this.state;
    if (newPassword.length > 7) {
      this.setState({ loader: true }, () => {
        this.props
          .updatePassword({
            email: forgotPassEmail,
            password: newPassword,
            password_confirm: confirmPassword,
          })
          .then(data => {
            this.setState({ loader: false }, () => {
              this.setState({
                changePassModalVisible: false,
              });
            });
          })
          .catch(err => {
            this.setState({ loader: false });
          });
      });
    } else {
      alert('password should be at least 8 characters long');
    }
    if (newPassword === confirmPassword) {
    } else {
      alert('Password and confirm password should be match');
    }
  };

  onPressGoogleSignIn = async () => {
    // Get the users ID token
    const gRes = await GoogleSignin.signIn();
    this.props
      .socialLogin({ email: gRes?.user?.email, platform: 'google', name: gRes?.user?.name })
      .then(data => {
        if (data?.data?.is_first_time) {
          this.props.navigation.navigate('SignUp');
        }
      })
      .catch(err => { });
  };

  onPressFacebookLogin = () => {
    this.props
      .facebookLogin({})
      .then(data => {
        this.props
          .socialLogin({ email: data?.email, platform: 'facebook', name: data?.name })
          .then(data => {
            if (data?.data?.is_first_time) {
              this.props.navigation.navigate('SignUp');
            }
          })
          .catch(err => { });
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  onPressAppleSignIn = () => {
    this.props
      .appleSignIn()
      .then(data => {
        this.props
          .socialLogin({ email: data?.email, platform: 'apple', name: data?.name })
          .then(data => {
            if (data?.data?.is_first_time) {
              this.props.navigation.navigate('SignUp');
            }
          })
          .catch(err => { });
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { email, password, loader } = this.state;
    return (
      <>
        <LinearGradient
          start={{ x: 0.8, y: 0.0 }}
          end={{ x: 0.1, y: 1.0 }}
          locations={[0.4, 0.9]}
          colors={[Colors.GREEN, Colors.WHITE]}
          style={styles.linearGradient}>
          <View style={styles.container}>
            {/* ----------Modal For Email------------ */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.forgotModalVisible1}
              onRequestClose={() =>
                this.setState({ forgotModalVisible1: false })
              }>
              <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: Colors.GREEN,
                      }}>
                      Forgot Password?
                    </Text>
                    <TouchableOpacity
                      style={{ position: 'absolute', right: 20, top: 20 }}
                      onPress={() =>
                        this.setState({ forgotModalVisible1: false })
                      }>
                      <Image source={close} style={{ width: 15, height: 15 }} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.GRAY_1,
                        marginVertical: 10,
                        textAlign: 'center',
                      }}>
                      Enter registered Email Address to recover password.
                    </Text>

                    <View style={{ width: '100%', marginTop: 20 }}>
                      <Text style={{ color: Colors.GRAY_1 }}>Email</Text>
                      <TextInput
                        placeholder="Enter Email"
                        autoCapitalize="none"
                        onChangeText={this.handleChangeForgotPasswordEmail}
                        value={this.state.forgotPassEmail}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Button
                        height={50}
                        name={'Reset Password'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.WHITE,
                        }}
                        btnStyle={{}}
                        onPress={
                          () => {
                            this.onPressSentEmailForgetPass();
                          }
                          // this.setState({
                          //   forgotModalVisible1: false,
                          //   forgotModalVisible2: true,
                          // })
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            {/* ----------Modals for Email------------ */}

            {/* ----------Modal For Code------------ */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.forgotModalVisible2}
              onRequestClose={() =>
                this.setState({ forgotModalVisible2: false })
              }>
              <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: Colors.GREEN,
                      }}>
                      Forgot Password?
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.GRAY_1,
                        marginVertical: 10,
                        textAlign: 'center',
                      }}>
                      Enter the code which we sent on your registered Email
                      Address
                    </Text>

                    <View style={{ width: '100%', marginTop: 20 }}>
                      <Text style={{ color: Colors.GRAY_1 }}>Code</Text>
                      <TextInput
                        placeholder="Enter Code"
                        onChangeText={this.handleChangeForgotPasswordCode}
                        value={this.state.forgotPassCode}
                        keyboardType={'numeric'}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Button
                        height={50}
                        name={'Verify Code'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.WHITE,
                        }}
                        btnStyle={{}}
                        onPress={() => {
                          this.onPressVerifyForgetPassword();
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            {/* ----------Modal for Code------------ */}

            {/* ----------Modal For Change Password?------------ */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.changePassModalVisible}
              onRequestClose={() =>
                this.setState({ changePassModalVisible: false })
              }>
              <View style={{ backgroundColor: 'rgba(0, 0, 0, .5)', flex: 1 }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: 'bold',
                        color: Colors.GREEN,
                      }}>
                      Change Password?
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.GRAY_1,
                        marginVertical: 10,
                        textAlign: 'center',
                      }}>
                      Enter New Password
                    </Text>

                    <View style={{ width: '100%', marginTop: 20 }}>
                      {/* <Text style={{ color: Colors.GRAY_1 }}>Code</Text> */}
                      <TextInput
                        placeholder="New Password"
                        onChangeText={this.handleChangeNewPassword}
                        value={this.state.newPassword}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      {/* <Text style={{ color: Colors.GRAY_1 }}>Code</Text> */}
                      <TextInput
                        placeholder="Confirm Password"
                        onChangeText={this.handleChangeConfirmPassword}
                        value={this.state.confirmPassword}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Button
                        height={50}
                        name={'Update Password'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.WHITE,
                        }}
                        btnStyle={{}}
                        onPress={
                          () => {
                            this.onPressUpdatePassword();
                          }
                          // this.setState({changePassModalVisible: false})
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
            {/* ----------Modal for Change Password?------------ */}
            <ScrollView style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 0.2 }}>
                  <Image
                    resizeMode="contain"
                    source={Logo}
                    style={styles.logo}
                  />
                </View>

                <View style={styles.whiteView}>
                  <View style={styles.loginView}>
                    <Text style={styles.loginText}>Log In</Text>

                    <View style={{ width: '100%', marginTop: 30 }}>
                      <Text style={{ color: Colors.GRAY_1 }}>Email</Text>
                      <TextInput
                        placeholder="Enter Email"
                        autoCapitalize="none"
                        onChangeText={this.handleChangeEmail}
                        value={this.state.email}
                      />
                    </View>

                    <View style={{ width: '100%', marginTop: 10 }}>
                      <Text style={{ color: Colors.GRAY_1 }}>Password</Text>
                      <TextInput
                        placeholder="Enter Password"
                        secureTextEntry={true}
                        onChangeText={this.handleChangePassword}
                        value={this.state.password}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <View />
                      {/* <TouchableOpacity>
                        <Text
                          style={{
                            color: Colors.GRAY_1,
                            textDecorationLine: 'underline',
                          }}>
                          Remember me
                        </Text>
                      </TouchableOpacity> */}

                      <TouchableOpacity
                        onPress={() =>
                          this.setState({ forgotModalVisible1: true })
                        }>
                        <Text
                          style={{
                            color: Colors.GRAY_1,
                            textDecorationLine: 'underline',
                          }}>
                          Forget Password?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', marginTop: 20 }}>
                      <Button
                        height={50}
                        name={'Log In'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.WHITE,
                        }}
                        btnStyle={{}}
                        disabled={email && password ? false : true}
                        onPress={this.onPressLogin}
                      />
                    </View>

                    <Text style={{ color: Colors.GRAY_1, marginTop: 5 }}>OR</Text>

                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Button
                        height={50}
                        name={'Sign Up'}
                        textStyle={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: Colors.GREEN,
                        }}
                        backgroundColor={Colors.BLUE_LIGHT}
                        onPress={() => this.props.navigation.navigate('SignUp')}
                      />
                    </View>

                    <View style={styles.underLine}></View>
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text style={{ color: Colors.GRAY_1, fontWeight: 'bold' }}>
                      OR Connect with
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      {/* <TouchableOpacity onPress={this.onPressFacebookLogin}>
                        <Image
                          resizeMode="contain"
                          source={FbIcon}
                          style={{ width: 35 }}
                        />
                      </TouchableOpacity> */}

                      <TouchableOpacity onPress={this.onPressGoogleSignIn}>
                        <Image
                          resizeMode="contain"
                          source={GoogleIcon}
                          style={{ width: 35 }}
                        />
                      </TouchableOpacity>

                      {Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={{ width: 35, height: 35, marginTop: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: "#A2AAAD", borderRadius: 30, }}
                          onPress={this.onPressAppleSignIn}>
                          {/* <Image
                            resizeMode="contain"
                            source={apple_logo}
                            style={{
                              width: 40,
                              height: 40,
                            }}
                          /> */}
                          <FontAwesome
                            name={'apple'}
                            size={23}
                            color={'#fff'}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Text style={{ textAlign: 'center' }}>Version: 1.0.14</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <Loader loader={loader} />
        </LinearGradient>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
const mapsDispatchToProps = dispatch => {
  return {
    facebookLogin: payload => dispatch(AuthMiddleware.facebookLogin(payload)),
    appleSignIn: payload => dispatch(AuthMiddleware.appleSignIn(payload)),
    socialLogin: payload => dispatch(AuthMiddleware.socialLogin(payload)),
    login: payload => dispatch(AuthMiddleware.login(payload)),
    isAuth: payload => dispatch(AuthAction.isAuth(payload)),
    forgetPassword: payload => dispatch(AuthMiddleware.forgetPassword(payload)),
    updatePassword: payload => dispatch(AuthMiddleware.updatePassword(payload)),
    verifyForgetPassword: payload =>
      dispatch(AuthMiddleware.verifyForgetPassword(payload)),
  };
};
export default connect(mapStateToProps, mapsDispatchToProps)(index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'center'
  },
  linearGradient: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    borderRadius: 5,
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  input: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: Colors.BLUE_LIGHT,
  },
  whiteView: {
    flex: 0.8,
    backgroundColor: Colors.WHITE,
    // position: 'absolute',
    // bottom: 0,
    width: '100%',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    alignItems: 'center',
  },
  loginView: {
    backgroundColor: Colors.WHITE,
    width: '80%',
    borderRadius: 30,
    elevation: 5,
    alignItems: 'center',
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
