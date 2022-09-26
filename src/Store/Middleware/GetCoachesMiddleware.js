import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import GetCoachesAction from '../Actions/GetCoachesAction';
import Apis from '../Apis';

class GetCoachesMiddleware {
  static getAllCoachs = (next_page_url, searchText) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || searchText) {
            dispatch(GetCoachesAction.resetAllCoachs());
          }
          let {data} = await Axios.get(
            Apis.getAllCoachs(next_page_url, searchText),
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(GetCoachesAction.getAllCoachs(data.data));
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

  static getCoachSession = ({schedule_type, coach_id,filter ,date}) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(GetCoachesAction.resetCoachSession());
          let {data} = await Axios.get(
            Apis.getCoachSession(schedule_type, coach_id, filter , date),
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(GetCoachesAction.getCoachSession(data.data));
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

  static getSessionDetail = ({session_id}) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let {data} = await Axios.get(
            Apis.getSessionDetail(session_id),
            await getHeaders(),
          );
          console.log('data.data', data.data);
          if (data?.success) {
            dispatch(GetCoachesAction.getSessionDetail(data.data));
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

  static GetReviews = ({callback}) => {
    return async dispatch => {
      try {
        let response = await Axios.get(Apis.getReviews, await getHeaders());
        console.log('response=>', response?.data);
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  };

  static setReview = ({coach_id, rating, review, callback}) => {
    return async dispatch => {
      try {
        let formData = new FormData();
        formData.append('coach_id', coach_id);
        formData.append('rating', rating);
        formData.append('review', review);
        console.warn('form Data:', formData);
        let response = await Axios.post(
          Apis.setReview,
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
  };
}

export default GetCoachesMiddleware;
