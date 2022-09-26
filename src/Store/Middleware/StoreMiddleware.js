import axios from 'axios';
import { getHeaders } from '../../Utils';
import PaymentAction from '../Actions/PaymentAction';
import StoreAction from '../Actions/StoreAction';
import Apis from '../Apis';

class StoreMiddleware {
  static GetProductCategory = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.getProductCategories,
            await getHeaders(),
          );
          console.warn('ress', response);
          if (response.data.success) {
            dispatch(StoreAction.getProductCategory(response.data.data));
          }
        } catch (error) {
          console.warn('err ===', error);
        }
      });
    };
  };

  static GetProductSizes = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.getProductSizes,
            await getHeaders(),
          );
          console.warn('ress', response);
          if (response.data.success) {
            dispatch(StoreAction.getProductsizes(response.data.data));
          }
        } catch (error) {
          console.warn('err ===', error);
        }
      });
    };
  };


  static AddCategory = (
    name,
  ) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('name', name);
          console.warn("FormData----------", formData);
          let response = await axios.post(
            Apis.AddProductCategories,
            formData,
            await getHeaders(),
          );
          console.warn("Category add", response.data.data);
          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static GetStoreProduts = ({ text,
    productName,
    categoryId,
    minPrice,
    maxPrice, }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          if (text) formData.append('search', text);
          if (categoryId) formData.append('category', categoryId);
          if (categoryId) formData.append('product_name', productName);
          if (minPrice) formData.append('min', minPrice);
          if (maxPrice) formData.append('max', maxPrice);
          console.warn(formData);
          let response = await axios.post(
            `${Apis.getStoreProducts}`,
            text || categoryId || minPrice || maxPrice ? formData : {},
            await getHeaders(),
          );

          console.warn('ress', response);
          if (response.data.success) {
            dispatch(StoreAction.getStoreProducts(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  // static GetStoreProduts = ({
  //   text,
  //   productName,
  //   categoryId,
  //   minPrice,
  //   maxPrice,
  // }) => {
  //   return dispatch => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         let formData = new FormData();
  //         if (text) formData.append('search', text);
  //         if (categoryId) formData.append('category', categoryId);
  //         if (categoryId) formData.append('product_name', productName);
  //         if (minPrice) formData.append('min', minPrice);
  //         if (maxPrice) formData.append('max', maxPrice);

  //         console.warn('formData', formData);
  //         let response = await axios.post(
  //           Apis.getStoreProducts,
  //           text || categoryId || minPrice || maxPrice ? formData : {},
  //           await getHeaders(),
  //         );

  //         // console.warn('ress =======', response.data.data);
  //         if (response.data.success) {
  //           dispatch(StoreAction.getUsedProducts(response.data.data));
  //           resolve(response.data);
  //         } else {
  //           reject(false);
  //         }
  //       } catch (error) {
  //         reject(false);
  //         console.warn('err ===', error);
  //       }
  //     });
  //   };
  // };

  static getAllStoreProductsForUsers = ({
    text,
    productName,
    categoryId,
    minPrice,
    maxPrice,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          if (text) formData.append('search', text);
          if (categoryId) formData.append('category', categoryId);
          if (categoryId) formData.append('product_name', productName);
          if (minPrice) formData.append('min', minPrice);
          if (maxPrice) formData.append('max', maxPrice);

          console.warn('formData', formData);
          let response = await axios.post(
            `${Apis.getAllStoreProductsForUsers}`,
            text || categoryId || minPrice || maxPrice ? formData : {},
            await getHeaders(),
          );

          console.warn('Response =======', response.data.data);
          if (response.data.success) {
            dispatch(StoreAction.getStoreProducts(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static getAllUsedProductsForUsers = ({
    text,
    productName,
    categoryId,
    minPrice,
    maxPrice,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          if (text) formData.append('search', text);
          if (categoryId) formData.append('category', categoryId);
          if (categoryId) formData.append('product_name', productName);
          if (minPrice) formData.append('min', minPrice);
          if (maxPrice) formData.append('max', maxPrice);

          console.warn('formData', formData);
          let response = await axios.post(
            `${Apis.getAllUsedProductsForUsers}`,
            text || categoryId || minPrice || maxPrice ? formData : {},
            await getHeaders(),
          );

          // console.warn('ress =======', response.data.data);
          if (response.data.success) {
            dispatch(StoreAction.getUsedProducts(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static getProductsWithoutCategory = ({ productCategoryId, type, name }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('id', productCategoryId);
          formData.append('type', type);
          formData.append('name', name);

          console.warn('formDAta----', formData);

          let response = await axios.post(
            Apis.getProductsWithoutCategory,
            productCategoryId || name || type ? formData : {},
            await getHeaders(),
          );

          console.warn('ress ==', response);

          if (response.data.success) {
            dispatch(StoreAction.getStoreProductList(response.data.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error -=', error);
        }
      });
    };
  };

  static UploadStoreProduct = ({
    productTitle,
    productPrice,
    productColor,
    productTypeId,
    discription,
    selectedSizes,
    image,
    type,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('product_name', productTitle);
          formData.append('product_price', productPrice);
          formData.append('product_description', discription);
          formData.append('category_id', productTypeId);
          formData.append('color', productColor);
          formData.append('size', JSON.stringify(selectedSizes));
          formData.append('product_img', image);
          formData.append('type', type);


          console.warn('sdasda', formData);
          let response = await axios.post(
            Apis.uploadStoreProduct,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(StoreMiddleware.GetStoreProduts({ text: '' }));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static updateProduct = ({
    productName,
    productPrice,
    productSize,
    productColor,
    productDescription,
    category_id,
    productId,
    image,
    type,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('product_name', productName);
          formData.append('product_price', productPrice);
          formData.append('product_description', productDescription);
          formData.append('id', productId);
          formData.append('category_id', category_id);
          formData.append('color', productColor);
          formData.append('size', JSON.stringify(productSize));
          formData.append('product_img', image);
          formData.append('type', type);
          console.warn("FormData----------", formData);

          let response = await axios.post(
            Apis.updateStoreProduct,
            formData,
            await getHeaders(),
          );
          console.warn(response.data.data);
          if (response.data.success) {
            if (type === 'new') {
              dispatch(StoreAction.updateStoreProducts(response.data.data));
            } else {
              dispatch(StoreAction.updateUsedProducts(response.data.data));
            }
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static deleteProduct = ({ id, product }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.delete(
            Apis.productDelete(id),
            await getHeaders(),
          );

          if (response.data.success) {
            if (type === 'new') {
              dispatch(StoreAction.deleteStoreProducts(product));
            } else {
              dispatch(StoreAction.deleteUsedProducts(product));
            }
          } else {
          }
        } catch (error) {
          console.warn('error ==', error);
        }
      });
    };
  };

  static orderHistory = ({ callback }) => {
    return async dispatch => {
      try {
        let response = await axios.get(
          `${Apis.orderHistory}`,
          await getHeaders(),
        );
        if (response.data.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        console.warn('err ', error);
      }
    };
  };

  static addPaymentCard = ({ cardName, cardNumber, expiryDate, cvv }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('name', cardName);
          formData.append('exp_date', expiryDate);
          formData.append('cvc', cvv);
          formData.append('card_number', cardNumber);

          console.warn(formData);

          let response = await axios.post(
            Apis.addPaymentCard,
            formData,
            await getHeaders(),
          );

          console.warn('ress ========', response);

          if (response.data.success) {
            dispatch(PaymentAction.Add_Payment_card(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.log('error ==', JSON.stringify(error.response));
        }
      });
    };
  };

  static getPaymentCardList = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.getUserPaymentCardList,
            await getHeaders(),
          );

          console.warn('ress ====', response);

          if (response.data.success) {
            dispatch(PaymentAction.Get_Payment_Card(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static getPaymentCardList = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.getUserPaymentCardList,
            await getHeaders(),
          );

          console.warn('ress ====', response);

          if (response.data.success) {
            dispatch(PaymentAction.Get_Payment_Card(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static deleteCard = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.warn('id ====', id);

          let response = await axios.delete(
            Apis.deletePaymentCard(id),
            await getHeaders(),
          );

          console.warn('ress ====', response);

          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static orderProductsItems = ({
    card_id,
    totalPrice,
    shippingAddress,
    cartProducts,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('card_id', card_id);
          formData.append('total_price', totalPrice);
          formData.append('shipping_address', shippingAddress);
          formData.append('orderItem', JSON.stringify(cartProducts));
          console.warn(formData);

          let response = await axios.post(
            Apis.orderProducts,
            formData,
            await getHeaders(),
          );

          console.warn('response==', response);

          if (response.data.success) {
            dispatch(StoreAction.removeProductFromCart([]));
            resolve(response.data);
          } else {
            alert(response.data.message);
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static getStoreOrderListing = ({
    staff_id,
    start_date,
    end_date,
    callback,
  }) => {
    return async dispatch => {
      try {
        const formdata = new FormData();
        formdata.append('start_date', start_date);
        formdata.append('end_date', end_date);
        staff_id ? formdata.append('staff_id', staff_id) : null;
        let response = await axios.post(
          `${Apis.storeOrderListing}`,
          formdata,
          await getHeaders(),
        );
        console.warn('Response', response);
        if (response.data.success) {
          callback(response?.data);
        }
      } catch (error) {
        callback(false);
        console.log('err ', JSON.stringify(error.response));
      }
    };
  };
}

export default StoreMiddleware;
