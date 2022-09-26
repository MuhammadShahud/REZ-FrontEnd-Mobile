import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import MeshCalenderAction from '../Actions/MeshCalenderAction';
import Apis from '../Apis';
import BookingReducer from '../Reducers/BookingReducer';

class MeshCalenderMiddleware {
  static meshCalenderGenerator = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          // for (let key in payload) {
          console.log('PAYLOAD=>', payload);

          // formdata.append('user_list[]', 80);
          // formdata.append('user_list[]', 34);
          // formdata.append('date', '2022-01-30');
          // formdata.append('role', 'Player');

          payload.user_list.forEach(element => {
            formdata.append('user_list[]', element);
          });
          formdata.append('date', payload.date);
          //   formdata.append('role', payload.role);
          //   console.warn('payload=>', payload);
          //   console.warn('Formdata=>', formdata);

          let data = await Axios.post(
            Apis.meshCalenderGenerator,
            formdata,
            await getHeaders(),
          );
          console.warn('dataaaa', data.data);
          if (data.data?.success) {
            console.warn('dataaaa', data.data);
            dispatch(MeshCalenderAction.meshCalenderGenerator(data.data));
            resolve(data.data);
          } else {
            console.warn('else');
            reject(data);
          }
        } catch (error) {
          console.warn('catch');
          reject(error);
          alert('Error occured');
        }
      });
    };
  };
}

export default MeshCalenderMiddleware;
