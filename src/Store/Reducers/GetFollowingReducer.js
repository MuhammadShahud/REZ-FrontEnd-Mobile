import {
  GET_FOLLOWING_DATA,
  LOGOUT,
  RESET_FOLLOWING_DATA,
} from '../Types/actions_type';

// const initialState = {
//   getFollowersData: null,
// };

let initialSate = {
  getFollowingData: null,
  getFollowingData_list: [],
};

const GetFollowingReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_FOLLOWING_DATA:
      let getFollowingData_list_copy = [];
      getFollowingData_list_copy = [
        ...state.getFollowingData_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        getFollowingData: action.payload,
        getFollowingData_list: getFollowingData_list_copy,
      };
      break;
    case RESET_FOLLOWING_DATA:
      state = {
        getFollowingData: null,
        getFollowingData_list: [],
      };
      break;

    case LOGOUT:
      state = {
        getFollowingData: null,
        getFollowingData_list: [],
      };
      break;
    default:
      break;
  }
  return state;
};

export default GetFollowingReducer;
