import {
  GET_POST_BY_USER,
  GET_USERINFO_DATA,
  LOGOUT,
} from '../Types/actions_type';

const initialState = {
  getUserInfoData: null,
  getPostByUser: null,
};

const GetUserInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERINFO_DATA:
      // let getUserInfoData_Copy = [];
      // getUserInfoData_Copy = {...state?.getUserInfoData};
      state = {...state, getUserInfoData: action.payload};
      break;

    case LOGOUT:
      state = {getUserInfoData: null, getPostByUser: null};

    // case GET_POST_BY_USER:
    //   // let getUserInfoData_Copy = [];
    //   // getUserInfoData_Copy = {...state?.getUserInfoData};
    //   state = { ...state, getPostByUser: action.payload };
    //   break;

    default:
      break;
  }
  return state;
};

export default GetUserInfoReducer;
