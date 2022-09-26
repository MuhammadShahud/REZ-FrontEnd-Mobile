import {FOLLOW_USER, LOGOUT} from '../Types/actions_type';

const initialState = {
  followUserData: null,
};

const FollowReducer = (state = initialState, action) => {
  switch (action.type) {
    case FOLLOW_USER:
      state = {...state, followUser: action.payload};
      break;
    case LOGOUT:
      state = {followUserData: null};
      break;

    default:
      break;
  }
  return state;
};

export default FollowReducer;
