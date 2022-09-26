import { GET_FOLLOWER_DATA ,RESET_FOLLOWER_DATA} from '../Types/actions_type';

const GetFollowerAction = {
  getFollowerUser: data => {
    return {
      type: GET_FOLLOWER_DATA,
      payload: data,
    };
  },
  resetFollowerData: () => {
    return {
      type: RESET_FOLLOWER_DATA,
    };
  },

};

export default GetFollowerAction;
