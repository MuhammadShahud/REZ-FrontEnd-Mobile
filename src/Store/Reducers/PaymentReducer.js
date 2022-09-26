import {
  ADD_PAYMENT_CARD,
  IS_BOOKING_CONFIRM,
  GET_PAYMENT_CARDS,
  LOGOUT,
} from '../Types/actions_type';

const initialState = {
  PaymentCards: [],
  isBookingConfirm: false,
};

const PaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PAYMENT_CARDS:
      state = {...state, PaymentCards: action.payload};
      break;

    case ADD_PAYMENT_CARD:
      state = {...state, PaymentCards: [...state.PaymentCards, action.payload]};
      break;

    case IS_BOOKING_CONFIRM:
      state = {...state, isBookingConfirm: action.payload};
      break;

    case LOGOUT:
      state = {PaymentCards: [], isBookingConfirm: false};
      break;

    default:
      break;
  }
  return state;
};

export default PaymentReducer;
