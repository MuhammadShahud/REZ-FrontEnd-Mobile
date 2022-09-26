import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_STORE_CART,
} from '../Types/actions_type';

let initialSate = {
  storeCart: [],
};

const CartReducer = (state = initialSate, action) => {
  let store_cart_copy = [...state.storeCart];

  switch (action.type) {
    case ADD_TO_CART:
      state = { ...state, storeCart: [...state.storeCart, action.payload] };
      break;

    case UPDATE_STORE_CART:
      let cartIndex = store_cart_copy.findIndex(
        val => val.id === action.payload.id,
      );

      if (
        store_cart_copy[cartIndex]?.id === action.payload.id ||
        store_cart_copy[cartIndex]?.quantity > quantity ||
        store_cart_copy[cartIndex]?.quantity < quantity
      ) {
        let updateCart = {
          ...action.payload,
          price: action.payload.price,
          quantity: action.payload.quantity,
        };
        store_cart_copy.splice(cartIndex, 1, updateCart);
      }
      state = { ...state, storeCart: store_cart_copy };
      break;

    case REMOVE_FROM_CART:
      state = { ...state, storeCart: action.payload };
      break;

    default:
      break;
  }
  return state;
};

export default CartReducer;
