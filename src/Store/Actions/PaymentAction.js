import {ADD_PAYMENT_CARD, GET_PAYMENT_CARDS, IS_BOOKING_CONFIRM} from '../Types/actions_type';

const PaymentAction = {
  Get_Payment_Card: data => {
    return {
      type: GET_PAYMENT_CARDS,
      payload: data,
    };
  },
  Add_Payment_card: data => {
    return {
      type: ADD_PAYMENT_CARD,
      payload: data,
    };
  },
  IS_BOOKING_CONFIRM: data => {
    console.warn(data);
    return {
      type: IS_BOOKING_CONFIRM,
      payload: data,
    };
  },
};

export default PaymentAction;
