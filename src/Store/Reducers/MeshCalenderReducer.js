import {GET_MESH_CALENDER, LOGOUT} from '../Types/actions_type';

let initialSate = {
  meshCalenderData: null,
  //   bookingHistory: [],
};

const MeshCalenderReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_MESH_CALENDER:
      state = {...state, meshCalenderData: action.payload};
      break;
      
    case LOGOUT:
      state = {meshCalenderData: null};
      break;
    // case GET_BOOKING_HISTORY:
    //   state = {...state, bookingHistory: action.payload};
    //   break;

    default:
      break;
  }
  return state;
};

export default MeshCalenderReducer;
