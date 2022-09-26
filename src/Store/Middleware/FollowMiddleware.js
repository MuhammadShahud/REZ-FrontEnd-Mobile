import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import FollowAction from '../Actions/FollowAction';

class FollowMiddleware {

  static followUser = ({ id }) => {
// console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData();
          formData.append('followed_user', id)
          let response = await Axios.post(
            Apis.followUser,
            formData,
            await getHeaders(),
          );
          console.warn("response=============", response)
          if (response.data.success) {
            dispath(FollowAction.followUser(response.data.data));
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default FollowMiddleware;
