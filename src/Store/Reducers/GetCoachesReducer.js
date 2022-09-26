import {
  GET_COACHES_DATA,
  GET_COACH_SESSIONS,
  GET_COACH_SESSION_DETAIL,
  LOGOUT,
  RESET_COACHES_DATA,
  RESET_COACH_SESSIONS,
} from '../Types/actions_type';

let initialSate = {
  getCoachesData: null,
  getCoachesData_list: [],

  coachSessions: null,
  coachSessions_list: [],
  coachSessionDetail: null,
};

const GetCoachesReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_COACHES_DATA:
      let getCoachesData_list_copy = [];
      getCoachesData_list_copy = [
        ...state.getCoachesData_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        getCoachesData: action.payload,
        getCoachesData_list: getCoachesData_list_copy,
      };
      break;
    case RESET_COACHES_DATA:
      state = {
        ...state,
        getCoachesData: null,
        getCoachesData_list: [],
      };
      break;
    case RESET_COACH_SESSIONS:
      state = {
        ...state,
        coachSessions: null,
        coachSessions_list: [],
      };
      break;
    case GET_COACH_SESSION_DETAIL:
      state = {
        ...state,
        coachSessionDetail: action.payload,
      };
      break;
    case GET_COACH_SESSIONS:
      let coachSessions_list_copy = [];
      coachSessions_list_copy = [
        ...state.coachSessions_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        coachSessions: action.payload,
        coachSessions_list: coachSessions_list_copy,
      };
      break;

    case LOGOUT:
      state = {
        getCoachesData: null,
        getCoachesData_list: [],
        coachSessions: null,
        coachSessions_list: [],
        coachSessionDetail: null,
      };
    default:
      break;
  }
  return state;
};

export default GetCoachesReducer;
