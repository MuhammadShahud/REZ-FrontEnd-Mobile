import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import FollowAction from '../Actions/FollowAction';

export default {
  Privacy: ({callback}) => {
    return async dispatch => {
      try {
        let response = await Axios.get(
          `${Apis.getPrivacyPolicy}`,
          await getHeaders(),
        );
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  },

  Terms: ({callback}) => {
    return async dispatch => {
      try {
        let response = await Axios.get(
          `${Apis.getTermsCondition}`,
          await getHeaders(),
        );
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  },
  ContactUs: ({name, email, description, callback}) => {
    return async dispatch => {
      try {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('description', description);
        let response = await Axios.post(
          Apis.contactUs,
          formData,
          await getHeaders(),
        );
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  },
  sendHelp: ({name, email, description, callback}) => {
    return async dispatch => {
      try {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('description', description);
        let response = await Axios.post(
          Apis.sendHelp,
          formData,
          await getHeaders(),
        );
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  },
  getCountryList: () => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await Axios.get(Apis.countryList, await getHeaders());
          if (response.data.success) {
            resolve(response?.data?.data);
          }
        } catch (error) {
          reject(false);
          console.warn('err ', error);
        }
      });
    };
  },
  getStateList: country_id => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await Axios.get(
            Apis.stateList(country_id),
            await getHeaders(),
          );
          if (response.data.success) {
            resolve(response?.data?.data);
          }
        } catch (error) {
          reject(false);
          console.warn('err ', error);
        }
      });
    };
  },
  getCitiesList: state_id => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await Axios.get(
            Apis.citiesList(state_id),
            await getHeaders(),
          );
          if (response.data.success) {
            resolve(response?.data?.data);
          }
        } catch (error) {
          reject(false);
          console.warn('err ', error);
        }
      });
    };
  },
  addBankAccount: payload => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          for (const key in payload) {
            formData.append(key, payload[key]);
          }
          console.log('formData=>', formData);
          let response = await Axios.post(
            Apis.addBankAccount,
            formData,
            await getHeaders(),
          );
          console.log('responseresponse=>', response.data);
          if (response.data.success) {
            resolve(response?.data?.data);
          } else {
            alert(response.data.message);
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.log('err ', JSON.stringify(error.response));
        }
      });
    };
  },
};
