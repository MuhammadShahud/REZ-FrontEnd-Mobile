import {PLAYER_REQUEST_TEAM} from '../Types/actions_type';

const PlayerRequestTeamAction = {
    playerRequestTeam: data => {
    return {
      type: PLAYER_REQUEST_TEAM,
      payload: data,
    };
  },
  
};

export default PlayerRequestTeamAction;
