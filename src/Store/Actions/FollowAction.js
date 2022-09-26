import {FOLLOW_USER} from '../Types/actions_type';

const FollowAction = {
    followUser: data => {
    return {
      type: FOLLOW_USER,
      payload: data,
    };
  },
  
};

export default FollowAction;
