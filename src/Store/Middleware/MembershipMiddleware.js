import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import MembershipAction from '../Actions/MembershipAction'

export default {
  getAllSubscription: ({ next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("-----> ", next_page_url)
          if (next_page_url == undefined) {
            dispatch(MembershipAction.resetSubscription());
          }
          let data = await Axios.get(
            Apis.getAllSubscription(next_page_url),
            await getHeaders(),
          );
          console.warn("Response", data);
          if (data?.data?.success) {
            dispatch(MembershipAction.getAllSubscription(data?.data?.data));
            resolve(data?.data);
          } else {
            reject(data?.data);
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  },
  BookSubscription: ({ plan_id, payment_method_id, callback }) => {
    return async dispatch => {
      try {
        let formData = new FormData();
        formData.append('plan_id', plan_id);
        formData.append('payment_method_id', payment_method_id);
        console.warn('form data:', formData);
        let response = await Axios.post(
          Apis.bookSubscription,
          formData,
          await getHeaders(),
        );
        console.warn('responce:', response);
        if (response.data.success) {
          console.warn('responce success:', response);
          callback(response);
          alert('Subscribe Successfully!');
        }
      } catch (error) {
        callback(false);
        console.log('err ', JSON.stringify(error.response));
      }
    };
  },
};
