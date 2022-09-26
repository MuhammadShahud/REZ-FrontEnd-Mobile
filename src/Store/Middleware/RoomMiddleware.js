import axios from 'axios';
import { Alert } from 'react-native';
import { getHeaders } from '../../Utils';
import PaymentAction from '../Actions/PaymentAction';
import RoomsActions from '../Actions/RoomsActions';
import Apis from '../Apis';

class RoomMiddleware {
  static GetAllRooms = (user) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            user ? `${Apis.GetRoom}?user_id=${user}` : Apis.GetRoom,
            await getHeaders(),
          );

          console.warn('ress', response);
          if (response.data.success) {
            dispatch(RoomsActions.getRooms(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static GetAllSubRooms = ({ id, user }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            user ? `${Apis.GetRoom}?room_id=${id}&user_id=${user}` : `${Apis.GetRoom}?room_id=${id}`,
            await getHeaders(),
          );

          console.warn('ress', response);
          if (response.data.success) {
            dispatch(RoomsActions.getSubRooms(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static StoreRoom = ({
    RoomTitle,
    discription,
    sportType,
    image,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('name', RoomTitle);
          formData.append('type', sportType);
          formData.append('description', discription);
          for (const [i, img] of image.entries()) {
            formData.append('images[]', img);
          }
          console.warn('sdasda', formData);
          let response = await axios.post(
            Apis.StoreRoom,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(RoomMiddleware.GetAllRooms());
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static StoreSubRoom = ({
    RoomTitle,
    discription,
    parent_id,
    image,
    Staffs,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('name', RoomTitle);
          formData.append('parent_id', parent_id);
          formData.append('description', discription);
          for (const [i, img] of image.entries()) {
            formData.append('images[]', img);
          }
          for (const [i, staff] of Staffs.entries()) {
            formData.append('staff[]', staff);
          }
          console.warn('sdasda', formData);
          let response = await axios.post(
            Apis.StoreSubRoom,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(RoomMiddleware.GetAllSubRooms(parent_id));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static UpdateRoom = ({
    id,
    RoomTitle,
    discription,
    type,
    image,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('id', id);
          formData.append('name', RoomTitle);
          formData.append('type', type);
          formData.append('description', discription);
          for (const [i, img] of image.entries()) {
            formData.append('images[]', img);
          }
          console.warn('sdasda', formData);
          let response = await axios.post(
            Apis.UpdateRoom,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(RoomMiddleware.GetAllRooms());
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static UpdateSubRoom = ({
    id,
    RoomTitle,
    discription,
    parent_id,
    image,
    Staffs,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('id', id);
          formData.append('name', RoomTitle);
          formData.append('parent_id', parent_id);
          formData.append('description', discription);
          for (const [i, img] of image.entries()) {
            formData.append('images[]', img);
          }
          for (const [i, staff] of Staffs.entries()) {
            formData.append('staff[]', staff);
          }
          console.warn('sdasda', formData);
          let response = await axios.post(
            Apis.UpdateSubRoom,
            formData,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(RoomMiddleware.GetAllSubRooms(parent_id));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

  static deleteRoom = ({ id, product }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('id', id);
          let response = await axios.post(
            Apis.RoomDelete,
            formData,
            await getHeaders(),
          );

          if (response.data.success) {
            resolve(response.data);
          } else {
            Alert.alert('Alert', response.data.message)
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };

  static deleteRoomImage = ({ id, room_id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.warn(room_id);
          let formData = new FormData();
          formData.append('id', id);
          let response = await axios.post(
            Apis.deleteRoomImage,
            formData,
            await getHeaders(),
          );

          if (response.data.success) {
            if (room_id != undefined) {
              dispatch(RoomMiddleware.GetAllSubRooms(room_id));
            } else {
              dispatch(RoomMiddleware.GetAllRooms());
            }
            resolve(response.data);
          } else {
            Alert.alert('Alert', response.data.message)
          }
        } catch (error) {
          reject(false);
          console.warn('error ==', error);
        }
      });
    };
  };
  static getRoomStaffs = (Room_id) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            `${Apis.getRoomStaffs}/${Room_id}`,
            await getHeaders(),
          );
          if (response.data.success) {
            dispatch(RoomsActions.getRoomStaffs(response.data.data));
            resolve(response.data);
          }
        } catch (error) {
          reject(false);
          console.warn('err ===', error);
        }
      });
    };
  };

}

export default RoomMiddleware;
