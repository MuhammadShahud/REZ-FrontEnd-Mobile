import Axios from 'axios';
import {getHeaders} from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import TeammatesAction from '../Actions/TeammatesAction';
import Apis from '../Apis';

class TeammatesMiddleware {
  static getMyTeammates = ({name}) => {
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData();
          formData.append('name', name);
          let response = await Axios.post(
            Apis.getMyTeammates,
            formData,
            await getHeaders(),
          );
          console.warn('response team', response.data.data);
          if (response.data.success) {
            dispath(TeammatesAction.getMyTeammates(response.data.data));
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default TeammatesMiddleware;
