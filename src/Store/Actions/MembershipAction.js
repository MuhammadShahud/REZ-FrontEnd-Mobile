import {GET_ALL_SUBSCRIPTION, RESET_SUBSCRIPTION} from '../Types/actions_type';

const MembershipAction = {
    getAllSubscription: data => {
    return {
      type: GET_ALL_SUBSCRIPTION,
      payload: data,
    };
  },
  resetSubscription: () => {
    return {
      type: RESET_SUBSCRIPTION,
    };
  },
};

export default MembershipAction;
