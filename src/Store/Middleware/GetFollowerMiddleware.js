import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import GetFollowerAction from '../Actions/GetFollowerAction';

class GetFollowerMiddleware {
  //   static getFollowUser = ({ id }) => {
  // // console.warn("ghgjgj", name);
  //     return dispath => {
  //       return new Promise(async () => {
  //         try {
  //           let response = await Axios.get(
  //             `${Apis.getFollowUser}/${id}`,
  //             await getHeaders(),
  //           );
  //           console.warn("response=============", response)
  //           if (response.data.success) {
  //             dispath(GetFollowersAction.getFollowUser(response.data.data));
  //           }
  //         } catch (error) {
  //           console.warn('err ', error);
  //         }
  //       });
  //     };
  //   };

  static getFollowerUser = ({next_page_url, id}) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(GetFollowerAction.resetFollowerData());
          }
          let {data} = await Axios.get(
            // `${Apis.getFollowingUser(next_page_url,id)}`,
            Apis.getFollowerUser(next_page_url, id),
            await getHeaders(),
          );
          console.warn('resssppp===', data.data.follower);
          if (data?.success) {
            dispatch(GetFollowerAction.getFollowerUser(data.data.follower));
            resolve(data);
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
  };
}

export default GetFollowerMiddleware;
