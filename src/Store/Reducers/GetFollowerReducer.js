import {
  GET_FOLLOWER_DATA,
  LOGOUT,
  RESET_FOLLOWER_DATA,
} from '../Types/actions_type';

// const initialState = {
//   getFollowersData: null,
// };

let initialSate = {
  getFollowerData: null,
  getFollowerData_list: [],
};

const GetFollowerReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_FOLLOWER_DATA:
      let getFollowerData_list_copy = [];
      getFollowerData_list_copy = [
        ...state.getFollowerData_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        getFollowerData: action.payload,
        getFollowerData_list: getFollowerData_list_copy,
      };
      break;
    case RESET_FOLLOWER_DATA:
      state = {
        getFollowerData: null,
        getFollowerData_list: [],
      };
      break;

    case LOGOUT:
      state = {
        getFollowerData: null,
        getFollowerData_list: [],
      };
      break;
    default:
      break;
  }
  return state;
};

export default GetFollowerReducer;
