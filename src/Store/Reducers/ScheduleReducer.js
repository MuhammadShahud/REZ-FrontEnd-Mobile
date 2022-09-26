import {
  GET_FILTER_SCHEDULE_LIST,
  GET_SCHEDULE_TYPES,
  LOGOUT,
  RESET_GET_FILTER_SCHEDULE_LIST,
} from '../Types/actions_type';

let initialSate = {
  scheduleTypes: [],
  filterSchedules: null,
};

const ScheduleReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_SCHEDULE_TYPES:
      state = {...state, scheduleTypes: action.payload};
      break;
    case GET_FILTER_SCHEDULE_LIST:
      state = {...state, filterSchedules: action.payload};
      break;
    case RESET_GET_FILTER_SCHEDULE_LIST:
      state = {...state, filterSchedules: null};
      break;
    case LOGOUT:
      state = {scheduleTypes: [], filterSchedules: null};
      break;
    default:
      break;
  }
  return state;
};

export default ScheduleReducer;
