import {
    POST_CREATE,
    POST_UPDATE,
    POST_REMOVE,
    POST_COMMENT,
    GET_POST_COMMENTS,
    RESET_POST_COMMENTS,
    POST_LIKE,
  } from '../Types/actions_type';
  
  const PostCreateAction = {
    postCreate: data => {
      return {
        type: POST_CREATE,
        payload: data,
      };
    },
    postComment: data => {
      return {
        type: POST_COMMENT,
        payload: data,
      };
    },
    postUpdate: data => {
      return {
        type: POST_UPDATE,
        payload: data,
      };
    },
    postRemove: data => {
      // console.warn(data);
      return {
        type: POST_REMOVE,
        payload: data,
      };
    },
    getPostComments: data => {
      return {
        type: GET_POST_COMMENTS,
        payload: data,
      };
    },
    resetPostComments: () => {
      return {
        type: RESET_POST_COMMENTS,
      };
    },
    // postLike: data => {
    //   return {
    //     type: POST_LIKE,
    //     payload: data,
    //   };
    // },
  };
  
  export default PostCreateAction;
  