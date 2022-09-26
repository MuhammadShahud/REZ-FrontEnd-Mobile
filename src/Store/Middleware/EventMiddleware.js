import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import EventAction from '../Actions/EventAction';

export default {
  ActiveEvents: ({ next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(EventAction.resetEventsActive());
          }
          let { data } = await Axios.get(
            Apis.ActiveEvents(next_page_url),
            await getHeaders(),
          );

          if (data?.success) {

            resolve(data?.data?.active);
            dispatch(EventAction.ActiveEvents(data?.data?.active));
            // console.log('dattttaaa', data?.data?.active);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.warn('err =====', error);
        }
      });
    };
  },
  PastEvents: ({ next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(EventAction.resetEventsPast());
          }
          let { data } = await Axios.get(
            Apis.PastEvents(next_page_url),
            await getHeaders(),
          );
          console.log(data.data.past)
          if (data?.success) {
            resolve(data?.data?.past);

            dispatch(EventAction.PastEvents(data?.data?.past));

            // console.log('dattttaaa', data?.data?.past);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          // alert('yehi aya ha')
          console.warn('err =====', error);
        }
      });
    };
  },
  EventDetail: ({ event_id, callback }) => {
    return async dispatch => {
      try {
        let response = await Axios.get(
          `${Apis.EventDetails + event_id}`,
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


};
