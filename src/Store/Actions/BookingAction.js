import {
  GET_BOOKING_HISTORY,
  GET_COACH_BOOKING,
  SET_COACH_POSITION,
} from '../Types/actions_type';

const BookingAction = {
  getCoachBooking: data => {
    return {
      type: GET_COACH_BOOKING,
      payload: data,
    };
  },
  setCoachPosition: data => {
    return {
      type: SET_COACH_POSITION,
      payload: data,
    };
  },
  getBookingHistory: data => {
    return {
      type: GET_BOOKING_HISTORY,
      payload: data,
    };
  },
};

export default BookingAction;
