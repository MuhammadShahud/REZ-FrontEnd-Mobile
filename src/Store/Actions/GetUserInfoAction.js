import {GET_USERINFO_DATA,GET_POST_BY_USER} from '../Types/actions_type';

const GetUserInfoAction = {
  getUserInfoById: data => {
    return {
      type: GET_USERINFO_DATA,
      payload: data,
    };
  },

  // getPostByUser: data => {
  //   return {
  //     type: GET_POST_BY_USER,
  //     payload: data,
  //   };
  // },
  
};

export default GetUserInfoAction;
