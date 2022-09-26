import {LOGOUT, TEAM_DETAILS} from '../Types/actions_type';

const initialState = {
  teamDetailsData: null,
};

const TeamDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TEAM_DETAILS:
      state = {...state, teamDetailsData: action.payload};
      break;
    case LOGOUT:
      state = {teamDetailsData: null};
      break;

    default:
      break;
  }
  return state;
};

export default TeamDetailsReducer;
