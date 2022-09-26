import {
  GET_COACHES_DATA,
  GET_COACH_SESSIONS,
  GET_COACH_SESSION_DETAIL,
  RESET_COACHES_DATA,
  RESET_COACH_SESSIONS,
} from '../Types/actions_type';

const GetCoachesAction = {
  getAllCoachs: data => {
    return {
      type: GET_COACHES_DATA,
      payload: data,
    };
  },
  resetAllCoachs: () => {
    return {
      type: RESET_COACHES_DATA,
    };
  },
  getCoachSession: payload => {
    return {
      type: GET_COACH_SESSIONS,
      payload: payload,
    };
  },
  resetCoachSession: () => {
    return {
      type: RESET_COACH_SESSIONS,
    };
  },
  getSessionDetail: payload => {
    return {
      type: GET_COACH_SESSION_DETAIL,
      payload: payload,
    };
  },
};

export default GetCoachesAction;
