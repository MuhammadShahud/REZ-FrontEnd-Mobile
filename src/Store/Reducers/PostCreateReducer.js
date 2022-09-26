import {
  GET_POST_COMMENTS,
  LOGOUT,
  POST_LIKE,
  RESET_POST_COMMENTS,
} from '../Types/actions_type';

let initialSate = {
  getPostCommentsData: null,
  getPostCommentsData_list: [],
  // postLikeData: null,
};

const PostCreateReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_POST_COMMENTS:
      let getPostCommentsData_list_copy = [];
      getPostCommentsData_list_copy = [
        ...state.getPostCommentsData_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        getPostCommentsData: action.payload,
        getPostCommentsData_list: getPostCommentsData_list_copy,
      };
      break;
    case RESET_POST_COMMENTS:
      state = {
        getPostCommentsData: null,
        getPostCommentsData_list: [],
      };
      break;
    case LOGOUT:
      state = {
        getPostCommentsData: null,
        getPostCommentsData_list: [],
      };
      break;
    // case POST_LIKE:
    //   state = { ...state, postLikeData: action.payload };
    //   break;
    default:
      break;
  }
  return state;
};

export default PostCreateReducer;
