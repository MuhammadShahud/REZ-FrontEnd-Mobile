import {
  GET_BOOKING_HISTORY,
  GET_COACH_BOOKING,
  SET_COACH_POSITION,
  LOGOUT,
} from '../Types/actions_type';

let initialSate = {
  coachBooking: null,
  bookingHistory: [],
  coach_position: null,
};

const BookingReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_COACH_BOOKING:
      state = {...state, coachBooking: action.payload};
      break;
    case GET_BOOKING_HISTORY:
      state = {...state, bookingHistory: action.payload};
      break;
    case SET_COACH_POSITION:
      coach_position_copy = {...state.coach_position};
      coach_position_copy[action.payload.key] = action.payload.value;
      console.log('coach_position_copy=>', coach_position_copy);
      state = {...state, coach_position: coach_position_copy};
      break;
    case LOGOUT:
      state = {coachBooking: null, bookingHistory: [], coach_position: null};
      break;
    default:
      break;
  }
  return state;
};

export default BookingReducer;
