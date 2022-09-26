import {
  ADD_TO_CART,
  CART_TOTAL_PRICE,
  UPDATE_STORE_CART,
} from '../Types/actions_type';

const CartAction = {
  addToCart: data => {
    return {
      type: ADD_TO_CART,
      payload: data,
    };
  },
  
  updateProductCart: data => {
    return {
      type: UPDATE_STORE_CART,
      payload: data,
    };
  },
};

export default CartAction;
