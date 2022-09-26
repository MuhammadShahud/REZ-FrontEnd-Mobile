import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import BookingAction from '../Actions/BookingAction';
import Apis from '../Apis';
import BookingReducer from '../Reducers/BookingReducer';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import database from '@react-native-firebase/database';
import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';

class BookingMidleware {
  static createBooking = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          // for (let key in payload) {
          console.log('PAYLOAD=>', payload);
          formdata.append('training_session_id', payload.training_session_id);
          formdata.append('privacy_type', payload.privacy_type);
          formdata.append('private_location', payload.private_location ? 1 : 0);
          formdata.append('location_address', payload.location_address);
          formdata.append('time_slot_id', payload.time_slot_id);
          payload?.payment_method_id != null ? formdata.append('payment_method_id', payload.payment_method_id) : null
          formdata.append('amount', payload.amount);
          formdata.append('booking_date', payload.booking_date);
          formdata.append('user_id', payload.user_id);
          formdata.append('parent_id', payload.parent_id);
          payload?.pass_id ? formdata.append('pass_id', payload.pass_id) : null;
          payload?.package_id ? formdata.append('package_id', payload.package_id) : null;
          payload?.contract_id ? formdata.append('contract_id', payload.contract_id) : null;
          if (payload.invite_list?.length > 0) {
            for (let i = 0; i < payload.invite_list.length; i++) {
              const user = payload.invite_list[i];
              formdata.append('invite_list[]', user.id);
            }
          }
          // }
          console.log('payload=>', formdata);

          const { data } = await Axios.post(
            Apis.createBooking,
            formdata,
            await getHeaders(),
          );
          console.warn('REsponse=>', data);
          if (data?.success) {
            resolve(data.data);
          } else {
            console.warn(data);
            reject(data);
          }
        } catch (error) {
          reject(error);
          console.log('error', error);
        }
      });
    };
  };
  static updateBookingStatus = ({ status, booking_id, reciever_user_id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('status', status);
          formdata.append('id', booking_id); // booking ID
          if (reciever_user_id) {
            formdata.append('reciever_user_id', reciever_user_id);
          }
          console.log('status, booking_id', status, booking_id);
          const { data } = await Axios.post(
            Apis.bookingStatusUpdate,
            formdata,
            await getHeaders(),
          );
          console.log('dataResponse ', data);
          if (data?.success) {
            dispatch(BookingMidleware.getCoachBooking());
            resolve(data.data);
          } else {
            alert('Network error');
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
  static updateBooking = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.log('payload', payload);
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }

          const { data } = await Axios.post(
            Apis.updateCoachBooking,
            formdata,
            await getHeaders(),
          );

          if (data?.success) {
            dispatch(BookingMidleware.getCoachBooking());
            resolve(data.data);
            alert(data.message);
          } else {
            alert('Network error');
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
  static getCoachBooking = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getCoachBooking,
            await getHeaders(),
          );
          console.log('datadatadata', data, await getHeaders());
          if (data?.success) {
            dispatch(BookingAction.getCoachBooking(data.data));
            resolve(data.data);
          } else {
            alert('Network Error');
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
  static getOneCoachBooking = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getOneCoachBooking(payload.booking_id),
            await getHeaders(),
          );
          console.log(
            'datadatadata getOneCoachBooking',
            data,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(BookingAction.getCoachBooking(data.data));
            resolve(data.data);
          } else {
            // alert('Network Error');
            reject(data);
          }
        } catch (error) {
          reject(error);
          // alert('Network Error');

          console.log('error', error);
        }
      });
    };
  };
  static getCoachTimeSlot = ({ session_id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getCoachTimeSlot(session_id),
            await getHeaders(),
          );
          if (data?.success) {
            resolve(data.data);
          } else {
            alert('Network Error');
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
  static BookingHistory = ({ staff_id, start_date, end_date, callback }) => {
    return async dispatch => {
      try {
        let formdata = new FormData();
        formdata.append('start_date', start_date);
        formdata.append('end_date', end_date);
        staff_id ? formdata.append('staff_id', staff_id) : null;

        let response = await Axios.post(
          Apis.getScheduleList,
          formdata,
          await getHeaders(),
        );

        console.log(
          'response?.data?.data=>',
          JSON.stringify(response?.data?.data),
        );
        if (response.data.success) {
          dispatch(BookingAction.getBookingHistory(response?.data?.data));
          callback && callback(response);
        }
      } catch (error) {
        callback && callback(false);
        console.warn('err ', error);
      }
    };
  };

  static startTrackingCoach = user_id => {
    return dispatch => {

      const getLoaction = () => {
        setInterval(() => {
          Geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              const reference = database().ref(`/users/${user_id}`);
              reference.set({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              });
            },
            error => {
              console.log(error);
            },
            {
              enableHighAccuracy: false,
              distanceFilter: 0,
              interval: 1000,
              fastestInterval: 2000,
            },
          );
        }, 5000);
      }

      if (Platform.OS === 'android') {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(data => {
            console.log(data);
            getLoaction();
          })
          .catch(err => {
            console.log(err);
          });
      } else if (Platform.OS === 'ios') {
        getLoaction()
      }

    };
  };
  static getCoachTracking = user_id => {
    // For getting live position
    return dispatch => {
      const reference = database().ref(`/users/${user_id}`);
      reference.once('value', snap => {
        if (snap) {
          dispatch(
            BookingAction.setCoachPosition({
              key: 'latitude',
              value: parseFloat(snap.val().latitude),
            }),
          );
          dispatch(
            BookingAction.setCoachPosition({
              key: 'longitude',
              value: parseFloat(snap.val().longitude),
            }),
          );
        } else {
          alert('Coach location not available');
        }
      });

      reference.on('child_changed', snap => {
        dispatch(
          BookingAction.setCoachPosition({
            key: snap.key,
            value: parseFloat(snap.val()),
          }),
        );
      });
    };
  };
  static stopCoachTracking = user_id => {
    // For getting live position
    return dispatch => {
      const reference = database().ref(`/users/${user_id}`);
      reference.off();
    };
  };
}

export default BookingMidleware;
