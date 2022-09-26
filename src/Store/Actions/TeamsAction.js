import {GET_TEAMS_DATA} from '../Types/actions_type';

const TeamsAction = {
    getTeamsBysport: data => {
    return {
      type: GET_TEAMS_DATA,
      payload: data,
    };
  },
  
};

export default TeamsAction;
