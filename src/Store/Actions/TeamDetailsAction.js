import {TEAM_DETAILS} from '../Types/actions_type';

const TeamDetailsAction = {
  teamDetails: data => {
    return {
      type: TEAM_DETAILS,
      payload: data,
    };
  },
  
};

export default TeamDetailsAction;
