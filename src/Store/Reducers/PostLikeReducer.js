import {LOGOUT, POST_LIKE} from '../Types/actions_type';

const initialState = {
  postLikeData: null,
};

const PostLikeReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_LIKE:
      state = {...state, postLikeData: action.payload};
      break;
    case LOGOUT:
      state = {postLikeData: null};
      break;

    default:
      break;
  }
  return state;
};

export default PostLikeReducer;
