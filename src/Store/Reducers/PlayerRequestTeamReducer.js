import {LOGOUT, PLAYER_REQUEST_TEAM} from '../Types/actions_type';

const initialState = {
  playerRequestTeamData: null,
};

const PlayerRequestTeamReducer = (state = initialState, action) => {
  switch (action.type) {
    case PLAYER_REQUEST_TEAM:
      state = {...state, playerRequestTeamData: action.payload};
      break;
    case LOGOUT:
      state = {playerRequestTeamData: null};
      break;

    default:
      break;
  }
  return state;
};

export default PlayerRequestTeamReducer;
