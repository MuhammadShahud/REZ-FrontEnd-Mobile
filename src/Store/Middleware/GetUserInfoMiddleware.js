import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import GetUserInfoAction from '../Actions/GetUserInfoAction';
import Apis from '../Apis';

class GetUserInfoMiddleware {

  static getUserInfoById = ({ id }) => {
    // console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async () => {
        try {
          let response = await Axios.get(
            `${Apis.getUserInfoById}/${id}`,
            await getHeaders(),
          );
          // console.warn("response=============", response)
          if (response.data.success) {
            dispath(GetUserInfoAction.getUserInfoById(response.data.data));
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };

  // static getPostByUser = () => {
  //   // console.warn("ghgjgj", name);
  //   return dispath => {
  //     return new Promise(async () => {
  //       try {
  //         let response = await Axios.get(
  //           Apis.getPostByUser(),
  //           await getHeaders(),
  //         );
  //         // console.warn("response=============", response)
  //         if (response.data.success) {
  //           dispath(GetUserInfoAction.getPostByUser(response.data.data));
  //         }
  //       } catch (error) {
  //         console.warn('err ', error);
  //       }
  //     });
  //   };
  // };

  // static getPostByUser = () => {
  //   return dispatch => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         let { data } = await Axios.get(
  //           Apis.getMyHighlights(),
  //           await getHeaders(),
  //         );
  //         if (data?.success) {
  //           dispatch(GetUserInfoAction.getPostByUser(data.data));
  //           console.warn('getPostByUser', data);
  //           resolve(data);
  //         } else {
  //           // alert(data?.message);
  //           reject(data);
  //         }
  //       } catch (error) {
  //         reject(error);
  //         console.warn('err =====', error);
  //       }
  //     });
  //   };
  // };
}

export default GetUserInfoMiddleware;
