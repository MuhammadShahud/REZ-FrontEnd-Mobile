import {
  GET_LEAGUE_DETAIL,
  GET_USERS_BY_TYPES,
  LOGOUT,
  RESET_USERS_BY_TYPE,
  UPDATE_LEAGUE_DETAIL,
  GET_LEAGUE_HISTORY,
  GET_USER
} from '../Types/actions_type';

let initialSate = {
  usersByType: [],
  usersByTypePaginatedObj: null,
  leagueDetail: null,
  leaguesHistoryData: null,
  getUsers: null
};

const UserReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_USERS_BY_TYPES:
      let users_by_type = [];
      users_by_type = [...state.usersByType, ...action.payload.data];
      state = {
        ...state,
        usersByType: users_by_type,
        usersByTypePaginatedObj: action.payload,
      };
      break;

    case RESET_USERS_BY_TYPE:
      state = { usersByType: [], usersByTypePaginatedObj: null };
      break;

    case GET_LEAGUE_DETAIL:
      state = { ...state, leagueDetail: action.payload };
      break;

    case GET_USER:
      state = { ...state, getUsers: action.payload };
      break;
    case LOGOUT:
      state = {
        usersByType: [],
        usersByTypePaginatedObj: null,
        leagueDetail: null,
      };
      break;

    case GET_LEAGUE_HISTORY:
      state = { ...state, leaguesHistoryData: action.payload };
      break;

    default:
      break;
  }
  return state;
};

export default UserReducer;
