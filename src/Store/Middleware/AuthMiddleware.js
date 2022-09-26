import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import Apis from '../Apis';
import {
  LoginManager,
  Profile,
  GraphRequest,
  AccessToken,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import BookingMidleware from './BookingMiddleware';
import messaging from '@react-native-firebase/messaging';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import jwt_decode from "jwt-decode";

async function getFCMToken() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    messaging()
      .getToken()
      .then(async data => {
        let formdata = new FormData();
        formdata.append('token', data);
        const { data: resData } = await Axios.post(
          Apis.updatefcmtoken,
          formdata,
          await getHeaders(),
        );
        console.log('resData=>', resData);
      });
    console.log('Authorization status:', authStatus);
  }
}
class AuthMiddleware {
  static appleSignIn = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
          let name = appleAuthRequestResponse.fullName;
          const { email, fullName } = jwt_decode(appleAuthRequestResponse.identityToken);
          resolve({ email: email, name: name.givenName ? name.givenName + " " + name.familyName : fullName ? fullName : "User" });
          //   // get current authentication state for user
          //   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
          //   const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
          // console.log("credentialState=>", credentialState)
          //   // use credentialState response to ensure the user is authenticated
          //   if (credentialState === appleAuth.State.AUTHORIZED) {
          //     // user is authenticated
          //   }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.log('error 64=>', JSON.stringify(error.response));
        }
      });
    };
  };
  static signUp = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          console.log('formdata', formdata);
          const { data } = await Axios.post(
            Apis.sign_up,
            formdata,
            await getHeaders(),
          );
          console.log('data 64=>', JSON.stringify(data));

          if (data?.success) {
            alert(data?.message);
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log('error 64=>', JSON.stringify(error.response));
        }
      });
    };
  };
  static registerStaff = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          console.log('formdata', formdata);
          const { data } = await Axios.post(
            Apis.sign_up,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            alert('Staff add successfully');
            dispatch(AuthMiddleware.getUserData()).then(() => {
              resolve(data);
            });
          } else {
            alert(data?.message);
            console.log('error', JSON.stringify(data));

            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log('error', JSON.stringify(error.response));
        }
      });
    };
  };
  static updateStaffPermission = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          console.log('formdata', formdata);
          const { data } = await Axios.post(
            Apis.staffPermission,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(AuthMiddleware.getUserData()).then(() => {
              resolve(data);
            });
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log('error', JSON.stringify(error.response));
        }
      });
    };
  };
  static login = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          const { data } = await Axios.post(
            Apis.login,
            formdata,
            await getHeaders(),
          );

          if (data?.success) {
            // alert(data?.message);
            await Storage.setToken(data.data.token);
            await Storage.set('@role', data.data.user.role);
            getFCMToken();

            dispatch(AuthAction.setRole(data.data.user.role));
            dispatch(AuthMiddleware.getUserData()).then(() => {
              dispatch(AuthAction.isAuth(true));
              resolve(data);
            });
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');
          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static deleteAccount = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.deleteAccount,
            await getHeaders(),
          );

          if (data?.success) {
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');
          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static socialLogin = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          const { data } = await Axios.post(
            Apis.socialLogin,
            formdata,
            await getHeaders(),
          );
          console.log(JSON.stringify(data));
          if (data?.success) {
            if (data?.data?.is_first_time) {
              dispatch(AuthAction.socialLogin({ ...data?.data, ...payload }));
              resolve(data);
            } else if (data?.data?.is_first_time == false) {
              await Storage.setToken(data.data.token);
              await Storage.set('@role', data.data.user.role);
              getFCMToken();

              dispatch(AuthAction.setRole(data.data.user.role));
              dispatch(AuthMiddleware.getUserData()).then(() => {
                dispatch(AuthAction.isAuth(true));
                resolve(data);
              });
            }
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');
          reject(error);

          console.log('error 195=>', JSON.stringify(error.response));
        }
      });
    };
  };
  static updateSportType = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('sport_type', payload.sportTypeID);
          const { data } = await Axios.post(
            Apis.updateSportType,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            alert(data?.message);
            dispatch(AuthMiddleware.getUserData());
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');
          reject(error);
          console.log('error', error);
        }
      });
    };
  };
  static getSportTypes = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getSportTypes,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(AuthAction.getSportTypes(data.data));
          }
        } catch (error) {
          reject(error);
          alert('Network Error');

          console.log(error);
        }
      });
    };
  };
  static getColors = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getColors,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(AuthAction.getColors(data.data));
          }
        } catch (error) {
          reject(error);
          alert('Network Error');

          console.log(error);
        }
      });
    };
  };
  static checkChildEmail = email => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('email', email);
          const { data } = await Axios.post(
            Apis.checkChildEmail,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data.data);
          } else {
            alert('Player not found');
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');

          console.log('error', error);
        }
      });
    };
  };
  static getUserData = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await Axios.post(
            Apis.getUserData,
            {},
            await getHeaders(),
          );
          getFCMToken();
          console.warn('response.data.data', response);
          if (response.data.success) {
            dispatch(AuthAction.getUserData(response.data.data));
            if (response.data?.data?.role === 'coach') {
              dispatch(
                BookingMidleware.startTrackingCoach(response.data?.data?.id),
              );
            }
            resolve();
          }
        } catch (error) {
          reject(error);

          console.log('err =====', JSON.stringify(error.response));
        }
      });
    };
  };
  static updateUserProfile = ({
    username,
    description,
    selectedLevel,
    image,
    gender,
    contact,
    detail,
    address,
    govtId,
    taxId,
    dob,
    color_code,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          if (username) formData.append('username', username);
          if (description) formData.append('description', description);
          if (selectedLevel) formData.append('level', selectedLevel);
          if (image) formData.append('image', image);
          if (gender) formData.append('gender', gender);
          if (contact) formData.append('phone', contact);
          if (detail) formData.append('detail', detail);
          if (address) formData.append('address', address);
          if (govtId) formData.append('govt_id', govtId);
          if (taxId) formData.append('tax_id', taxId);
          if (dob) formData.append('dob', dob);
          if (color_code) formData.append('color_code', color_code);

          console.log('ress ==============', formData);

          let response = await Axios.post(
            Apis.updateUser,
            formData,
            await getHeaders(),
          );

          if (response.data.success) {
            console.log("------------------------", response.data);
            dispatch(AuthAction.updateUserProfile(response.data.data));
            resolve(response.data.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('errr', error);
        }
      });
    };
  };
  static facebookLogin = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            result => {
              if (result.isCancelled) {
                console.log('Login cancelled');
              } else {
                Profile.getCurrentProfile().then(currentProfile => {
                  AccessToken.getCurrentAccessToken().then(token => {
                    new GraphRequestManager()
                      .addRequest(
                        new GraphRequest(
                          '/me',
                          {
                            accessToken: token?.accessToken,
                            parameters: {
                              fields: {
                                string: 'email',
                              },
                            },
                          },
                          (err, res) => {
                            resolve(res);
                            if (err) {
                              alert('Something went wrong');
                              reject(null);
                            } else {
                            }
                          },
                        ),
                      )
                      .start();
                  });
                });
              }
            },
            function (error) {
              reject(null);
              console.log('Login fail with error: ' + error);
            },
          );

          // let formdata = new FormData();
          // for (let key in payload) {
          //   formdata.append(key, payload[key]);
          // }
          // const {data} = await Axios.post(
          //   Apis.login,
          //   formdata,
          //   await getHeaders(),
          // );

          // if (data?.success) {
          //   // alert(data?.message);
          //   await Storage.setToken(data.data.token);
          //   await Storage.set('@role', data.data.user.role);
          //   dispatch(AuthAction.isAuth(true));
          //   dispatch(AuthAction.setRole(data.data.user.role));
          //   dispatch(AuthMiddleware.getUserData());
          //   resolve(data);
          // } else {
          //   alert(data?.message);
          //   reject(data);
          // }
        } catch (error) {
          alert('Network Error');
          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static forgetPassword = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('email', payload.email);
          console.warn(formdata);
          const { data } = await Axios.post(
            Apis.forget_password,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');

          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static verifyForgetPassword = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.log('payload payload=>', payload);
          let formdata = new FormData();
          formdata.append('code', Number(payload.code));
          formdata.append('email', payload.email);

          const { data } = await Axios.post(
            Apis.verifyCode,
            formdata,
            await getHeaders(),
          );

          console.log(
            'datadatadatadatadatadatadatadatadatadatadatadata=>',
            data,
          );
          if (data?.success) {
            resolve(data);
          } else {
            console.log(data);
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');

          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static updatePassword = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('email', payload.email);
          formdata.append('password', payload.password);
          formdata.append('password_confirm', payload.password_confirm);

          const { data } = await Axios.post(
            Apis.update_password,
            formdata,
            await getHeaders(),
          );

          if (data?.success) {
            resolve(data);
            alert(data?.message);
          } else {
            console.log(data);
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          alert('Network Error');

          reject(error);

          console.log('error', error);
        }
      });
    };
  };
  static getUser = ({ email }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('email', email);
          const { data } = await Axios.post(
            Apis.getUser,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data.data);
          } else {
            reject(data);
          }
        } catch (error) {
          reject(error);

        }
      });
    };
  };

  static checkBlockStatus = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('user_id', id)
          const { data } = await Axios.post(
            Apis.checkIfUserBlock,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data)
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
        }
      });
    };
  };

  static blockUser = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('user_id', id)
          const { data } = await Axios.post(
            Apis.blockUser,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            console.log(data)
            resolve(data)
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
        }
      });
    };
  };
  static getBlockList = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getBlockList,
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data.data)
            dispatch(AuthAction.getBlockList(data.data))
          }
        } catch (error) {
          reject(error);
          alert('Network Error');

          console.log(error);
        }
      });
    };
  };

}

export default AuthMiddleware;
