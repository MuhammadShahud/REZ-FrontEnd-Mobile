import {
  GET_SPORT_TYPES,
  IS_AUTH,
  SET_ROLE,
  GET_USER_DATA,
  UPDATE_USER_PROFILE,
  LOGOUT,
  SOCIAL_LOGIN,
  GET_COLORS,
  BLOCK_LIST
} from '../Types/actions_type';

let initialSate = {
  isLogin: undefined,
  role: undefined,
  sportTypes: [],
  Colors: [],
  user: null,
  social: null,
  blockList : null
};

const AuthReducer = (state = initialSate, action) => {
  switch (action.type) {
    case IS_AUTH:
      state = {...state, isLogin: action.payload};
      break;
    case GET_USER_DATA:
      state = {...state, user: action.payload};
      break;
    case UPDATE_USER_PROFILE:
      state = {...state, user: action.payload};
      break;
    case SET_ROLE:
      state = {...state, role: action.payload};
      break;
    case GET_SPORT_TYPES:
      state = {...state, sportTypes: action.payload};
      break;
    case GET_COLORS:
      state = {...state, Colors: action.payload};
      break;
    case SOCIAL_LOGIN:
      state = {...state, social: action.payload};
      break;
      case BLOCK_LIST:
      state = {...state, blockList: action.payload};
      break;
    case LOGOUT:
      state = {
        role: undefined,
        sportTypes: [],
        user: null,
      };
      break;
    default:
      break;
  }
  return state;
};

export default AuthReducer;
