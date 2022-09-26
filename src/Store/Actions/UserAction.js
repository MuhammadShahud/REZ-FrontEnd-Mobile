import {
  GET_LEAGUE_DETAIL,
  GET_LEAGUE_HISTORY,
  GET_USERS_BY_TYPES,
  RESET_USERS_BY_TYPE,
  UPDATE_LEAGUE_DETAIL,
  GET_USER
} from '../Types/actions_type';

const UserAction = {
  setUsersByType: data => {
    return {
      type: GET_USERS_BY_TYPES,
      payload: data,
    };
  },

  resetUsersByType: data => {
    return {
      type: RESET_USERS_BY_TYPE,
    };
  },

  saveLeagueDetails: data => {
    return {
      type: GET_LEAGUE_DETAIL,
      payload: data,
    };
  },

  LeagueHistory: data => {
    return {
      type: GET_LEAGUE_HISTORY,
      payload: data,
    };
  },

  getUser: data => {
    return {
      type: GET_USER,
      payload: data,
    };
  },
};

export default UserAction;
