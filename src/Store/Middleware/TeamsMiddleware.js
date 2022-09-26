import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import TeamsAction from '../Actions/TeamsAction';
import Apis from '../Apis';

class TeamsMiddleware {

  static getTeamsBysport = ({ name }) => {
console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData()
          formData.append('name', name)
          let response = await Axios.post(
            Apis.getTeamsBysport,
            formData,
            await getHeaders(),
          );
          console.warn("response team", response.data)
          if (response.data.success) {
            dispath(TeamsAction.getTeamsBysport(response.data.data));
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default TeamsMiddleware;
