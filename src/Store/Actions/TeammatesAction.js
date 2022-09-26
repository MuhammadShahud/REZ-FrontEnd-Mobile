import {GET_TEAMMATES_DATA} from '../Types/actions_type';

const TeammatesAction = {
    getMyTeammates: data => {
    return {
      type: GET_TEAMMATES_DATA,
      payload: data,
    };
  },
  
};

export default TeammatesAction;
