import {LOGOUT, PLAYER_REQUEST_APPROVE} from '../Types/actions_type';

const initialState = {
  playerRequestApproveData: null,
};

const PlayerRequestApproveReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYER_REQUEST_APPROVE:
      state = {...state, playerRequestApproveData: action.payload};
      break;

    case LOGOUT:
      state = {playerRequestApproveData: null};
      break;

    default:
      break;
  }
  return state;
};

export default PlayerRequestApproveReducer;
