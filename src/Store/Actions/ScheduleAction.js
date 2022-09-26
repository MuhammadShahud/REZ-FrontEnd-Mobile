import {
  GET_FILTER_SCHEDULE_LIST,
  GET_SCHEDULE_TYPES,
  LOGOUT,
  RESET_GET_FILTER_SCHEDULE_LIST,
} from '../Types/actions_type';

class ScheduleAction {
  static setScheduleTypes = payload => {
    return {
      type: GET_SCHEDULE_TYPES,
      payload: payload,
    };
  };
  static getFilterScheduleList = payload => {
    return {
      type: GET_FILTER_SCHEDULE_LIST,
      payload: payload,
    };
  };
  static resetGetFilterScheduleList = payload => {
    return {
      type: RESET_GET_FILTER_SCHEDULE_LIST,
    };
  };
  static resetSchedule = payload => {
    return {
      type: LOGOUT,
    };
  };
}

export default ScheduleAction;
