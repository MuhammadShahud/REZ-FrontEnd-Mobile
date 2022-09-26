import {PLAYER_REQUEST_APPROVE} from '../Types/actions_type';

const PlayerRequestApproveAction = {
    playerRequestApprove: data => {
    return {
      type: PLAYER_REQUEST_APPROVE,
      payload: data,
    };
  },
  
};

export default PlayerRequestApproveAction;
