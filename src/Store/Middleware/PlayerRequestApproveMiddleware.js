import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import Apis from '../Apis';
import PlayerRequestApproveAction from '../Actions/PlayerRequestApproveAction';

class PlayerRequestApproveMiddleware {

  static playerRequestApprove = ({ id, cid, type, action }) => {
    // console.warn("ghgjgj", name);
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData();
          formData.append('id', id)
          formData.append('content_id', cid)
          formData.append('content_type', type)
          formData.append('content_action', action)

          console.warn(formData);

          let response = await Axios.post(
            Apis.playerRequestApproved,
            formData,
            await getHeaders(),
          );
          console.log("response=============", response.data)
          if (response.data.success) {
            dispath(PlayerRequestApproveAction.playerRequestApprove(response.data.data));
          } else {
            alert(data?.message)
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };

  static cancelInvite = ({ id, schedule_id }) => {
    return dispath => {
      return new Promise(async () => {
        try {
          let formData = new FormData();
          formData.append('id', id)
          formData.append('schedule_id', schedule_id)
          let response = await Axios.post(
            Apis.cancelInvite,
            formData,
            await getHeaders(),
          );
          console.log("response=============", response.data)
          if (response.data.success) {
            dispath(PlayerRequestApproveAction.playerRequestApprove(response.data.data));
          } else {
            alert(data?.message)
          }
        } catch (error) {
          console.warn('err ', error);
        }
      });
    };
  };
}

export default PlayerRequestApproveMiddleware;
