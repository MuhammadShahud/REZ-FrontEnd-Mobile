import {
  GET_FACILITY_DATA,
  GET_SCHEDULES_DATA,
  RESET_FACILITY_DATA,
  RESET_SCHEDULES_DATA,
  GET_FACILITY_PRODUCT,
  RESET_FACILITY_PRODUCT,
} from '../Types/actions_type';

const GetFacilityAction = {
  getAllFacility: data => {
    return {
      type: GET_FACILITY_DATA,
      payload: data,
    };
  },
  resetAllFacility: () => {
    return {
      type: RESET_FACILITY_DATA,
    };
  },

  getAllSchedules: data => {
    return {
      type: GET_SCHEDULES_DATA,
      payload: data,
    };
  },
  resetAllSchedules: () => {
    return {
      type: RESET_SCHEDULES_DATA,
    };
  },

getFacilityProduct: data => {
  return {
    type: GET_FACILITY_PRODUCT,
    payload: data,
  };
},

resetFacilityProduct: () => {
  return {
    type: RESET_FACILITY_PRODUCT,
  };
},
};
export default GetFacilityAction;
