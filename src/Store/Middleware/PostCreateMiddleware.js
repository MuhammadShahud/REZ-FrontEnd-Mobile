import Axios from 'axios';
import { getHeaders } from '../../Utils';
import PostCreateAction from '../Actions/PostCreateAction';
import Apis from '../Apis';

class PostCreateMiddleware {
  static PostCreate = ({ title, description, image }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          formData.append('image', image);
          let response = await Axios.post(
            Apis.postCreate,
            formData,
            await getHeaders(),
          );
          console.warn(formData);
          if (response.data.success) {
            // dispatch(PostCreateMiddleware.PostCreate());
            resolve(response.data.data);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static postComment = ({ id, comment, postUserId, postType }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('comment', comment);
          formData.append('id', id);
          formData.append('post_user_id', postUserId);
          // formData.append('postType', postType);
          let response = await Axios.post(
            Apis.postComment,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(PostCreateMiddleware.PostComment());
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static postDelete = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.warn('id ====', id);

          let response = await Axios.get(
            Apis.postDelete(id),
            await getHeaders(),
          );

          console.warn('ress ====', response);

          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static getPostComments = ({ next_page_url, id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(PostCreateAction.resetPostComments());
          }
          console.log('next_page_url 39=>', next_page_url);
          let { data } = await Axios.get(
            // `${Apis.getFollowingUser(next_page_url,id)}`,
            Apis.getPostComments(next_page_url, id),
            await getHeaders(),
          );
          console.warn('resssppp===', data.data);
          if (data?.success) {
            console.log(
              'middleware....',
              PostCreateAction.getPostComments(data.data),
            );
            dispatch(PostCreateAction.getPostComments(data.data));
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

  static postReport = ({ post_id, comment }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData()
          formdata.append('post_id', post_id)
          formdata.append('comment', comment)
          console.log(post_id, comment)
          let { data } = await Axios.post(
            Apis.postReport,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
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

  // static postLike = ({ id, type }) => {
  //   // console.warn("ghgjgj", name);
  //       return dispath => {
  //         return new Promise(async () => {
  //           try {
  //             let formData = new FormData();
  //             formData.append('id', id),
  //             formData.append('type', type)
  //             let response = await Axios.post(
  //               Apis.postLike,
  //               formData,
  //               await getHeaders(),
  //             );
  //             console.warn("response=============", response.data.data)
  //             if (response.data.success) {
  //               dispath(PostCreateAction.postLike(response.data.data));
  //             }
  //           } catch (error) {
  //             console.warn('err ', error);
  //           }
  //         });
  //       };
  //     };
}

export default PostCreateMiddleware;
