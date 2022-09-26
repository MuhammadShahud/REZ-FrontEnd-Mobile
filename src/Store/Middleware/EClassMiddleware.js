import Axios from 'axios';
import {getHeaders} from '../../Utils';
import EClassAction from '../Actions/EClassAction';
import Apis from '../Apis';

class EClassMiddleware {
  static createEClass = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          const {data} = await Axios.post(
            Apis.createEClass,
            formdata,
            await getHeaders(),
          );
          console.log('DATA ECLASS=>', data);
          if (data?.success) {
            alert(data?.message);
            dispatch(EClassMiddleware.getEClasses());
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
  static orderEClass = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          for (let key in payload) {
            formdata.append(key, payload[key]);
          }
          const {data} = await Axios.post(
            Apis.orderEClass,
            formdata,
            await getHeaders(),
          );
          console.log('data', data);
          if (data?.success) {
            alert(data?.message);
            dispatch(
              EClassMiddleware.getEClass({eclass_id: payload.eclass_id}),
            );
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
  static getEClasses = (next_page_url, searchText) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || searchText) {
            dispatch(EClassAction.resetEClasses());
          }
          let {data} = await Axios.get(
            Apis.getEclasses(next_page_url, searchText),
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(EClassAction.getEClasses(data.data));
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.warn('err =====', error);
        }
      });
    };
  };
  static getEClass = ({eclass_id}) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let {data} = await Axios.get(
            Apis.getEClass(eclass_id),
            await getHeaders(),
          );

          if (data?.success) {
            resolve(data?.data);
            dispatch(EClassAction.updateEClass(data?.data));
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.warn('err =====', error);
        }
      });
    };
  };
}

export default EClassMiddleware;
