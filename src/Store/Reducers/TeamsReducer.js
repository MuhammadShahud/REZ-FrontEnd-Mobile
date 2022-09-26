import {GET_TEAMS_DATA, LOGOUT} from '../Types/actions_type';

const initialState = {
  teamsData: null,
};

const TeamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMS_DATA:
      state = {...state, teamsData: action.payload};
      break;
    case LOGOUT:
      state = {teamsData: null};
      break;

    default:
      break;
  }
  return state;
};

export default TeamsReducer;
