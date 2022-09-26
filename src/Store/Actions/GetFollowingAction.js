import { GET_FOLLOWING_DATA ,RESET_FOLLOWING_DATA} from '../Types/actions_type';

const GetFollowingAction = {
  getFollowingUser: data => {
    return {
      type: GET_FOLLOWING_DATA,
      payload: data,
    };
  },
  resetFollowingData: () => {
    return {
      type: RESET_FOLLOWING_DATA,
    };
  },

};

export default GetFollowingAction;
