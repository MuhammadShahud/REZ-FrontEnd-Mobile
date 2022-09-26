import {
  DELETE_STORE_PRODUCTS,
  GET_PRODUCT_CATEGORY,
  GET_STORE_PRODUCTS,
  GET_STORE_PRODUCTSLIST,
  LOGOUT,
  UPDATE_STORE_PRODUCTS,
  GET_USED_PRODUCTS,
  GET_PRODUCT_SIZES,
  DELETE_USED_PRODUCTS,
  UPDATE_USED_PRODUCTS
} from '../Types/actions_type';

const initialState = {
  productCategories: [],
  productSizes: [],
  productsList: [],
  storeProducts: undefined,
  UsedProducts: undefined,
};

const StoreReducer = (state = initialState, action) => {
  let store_product_copy = [];
  store_product_copy = { ...state.storeProducts };

  let store_product = [];
  store_product = { ...state.storeProducts };


  let Used_product_copy = [];
  Used_product_copy = { ...state.UsedProducts };


  let productListCopy = [];
  productListCopy = [...state.productsList];

  switch (action.type) {
    case GET_PRODUCT_CATEGORY:
      state = { ...state, productCategories: action.payload };
      break;
    case GET_PRODUCT_SIZES:
      state = { ...state, productSizes: action.payload };
      break;

    case GET_STORE_PRODUCTS:
      state = { ...state, storeProducts: action.payload };
      break;

    case GET_USED_PRODUCTS:
      state = { ...state, UsedProducts: action.payload };
      break;

    case UPDATE_STORE_PRODUCTS:
      let productCategoryIndex = store_product_copy.data.findIndex(
        item => item.id === action.payload.product.category_id,
      );

      let productIndex = store_product_copy.data[
        productCategoryIndex
      ]?.products.findIndex(item => item.id == action.payload.product.id);

      let productsListIndex = productListCopy.findIndex(
        item => item.id === action.payload.product.id,
      );

      store_product_copy.data[productCategoryIndex]?.products.splice(
        productIndex,
        1,
        action.payload.product,
      );

      productListCopy.splice(productsListIndex, 1, action.payload.product);

      console.warn('productListCopy', productsListIndex);

      state = {
        ...state,
        storeProducts: store_product_copy,
        productsList: productListCopy,
      };

      break;

    case UPDATE_USED_PRODUCTS:

      let UsedproductIndex = Used_product_copy.data.findIndex(item => item.id === action.payload.product.id);
      // console.warn("Find----",Used_product_copy.data[2]);
      Used_product_copy.data.splice(
        UsedproductIndex,
        1,
        action.payload.product,
      );

      state = {
        ...state,
        UsedProducts: Used_product_copy,
        productsList: productListCopy,
      };


      break;

    case DELETE_STORE_PRODUCTS:
      let productTypeIndex = store_product_copy.data.findIndex(
        item => item.id === action.payload.category_id,
      );

      let productItemIndex = store_product_copy.data[
        productTypeIndex
      ].products.findIndex(item => item.id === action.payload.id);

      let productListIndex = productListCopy.findIndex(
        item => item.id === action.payload.id,
      );

      store_product_copy.data[productTypeIndex].products.splice(
        productItemIndex,
        1,
      );

      productListCopy.splice(productListIndex, 1);

      state = {
        ...state,
        storeProducts: store_product_copy,
        productsList: productListCopy,
      };

      break;

    case DELETE_USED_PRODUCTS:
      let UsedprodIndex = Used_product_copy.data.findIndex(item => item.id === action.payload.id);

      Used_product_copy.data.splice(
        UsedprodIndex,
        1,
      );

      state = {
        ...state,
        UsedProducts: Used_product_copy,
        productsList: productListCopy,
      };

      break;

    case GET_STORE_PRODUCTSLIST:
      state = { ...state, productsList: action.payload };
      break;

    case LOGOUT:
      state = {
        productCategories: [],
        productsList: [],
        productSizes: [],
        storeProducts: undefined,
      };
      break;

    default:
      break;
  }
  return state;
};

export default StoreReducer;
