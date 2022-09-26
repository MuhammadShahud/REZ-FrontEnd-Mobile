import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import PlayerRequestTeamAction from '../Actions/PlayerRequestTeamAction';
import { resolvePlugin } from '@babel/core';

class PlayerRequestTeamMiddleware {

  static playerRequestTeam = ({ id }) => {
    // console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async (resolve) => {
        try {
          let formData = new FormData();
          formData.append('id', id)
          let response = await Axios.post(
            Apis.playerRequestToTeam,
            formData,
            await getHeaders(),
          );
          console.warn("response=============", response)
          if (response.data.success) {
            dispath(PlayerRequestTeamAction.playerRequestTeam(response.data.data));
            resolve(response.data.data)
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };

  static checkIsPlayerJoinTeam = () => {
    return dispath => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await Axios.get(
            Apis.checkIfTeamMember,
            await getHeaders(),
          );
          if (response.data.success) {
            resolve(response.data.data)
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default PlayerRequestTeamMiddleware;
