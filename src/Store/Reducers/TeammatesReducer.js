import {GET_TEAMMATES_DATA, LOGOUT} from '../Types/actions_type';

const initialState = {
  teammatesData: null,
};

const TeammatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TEAMMATES_DATA:
      state = {...state, teammatesData: action.payload};
      break;
    case LOGOUT:
      state = {teammatesData: null};
      break;

    default:
      break;
  }
  return state;
};

export default TeammatesReducer;
