import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import PostLikeAction from '../Actions/PostLikeAction';

class PostLikeMiddleware {
  static postLike = ({id, type, postUserId}) => {
    // console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData();
          formData.append('id', id);
          formData.append('type', type);
          formData.append('post_user_id', postUserId);

          console.warn('formData', formData);
          let response = await Axios.post(
            Apis.postLike,
            formData,
            await getHeaders(),
          );
          console.warn('response=============', response.data);
          if (response.data.success) {
            dispath(PostLikeAction.postLike(response.data));
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default PostLikeMiddleware;
