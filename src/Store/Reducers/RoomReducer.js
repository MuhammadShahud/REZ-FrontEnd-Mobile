import {
  GET_ROOMS,
  GET_SUBROOMS,
  UPDATE_ROOMS,
  LOGOUT,
  DELETE_ROOM,
  ROOM_STAFFS
} from '../Types/actions_type';

const initialState = {
  RoomList: [],
  SubRoomList: [],
  Rooms: undefined,
  SubRooms: undefined,
  RoomStaffList: undefined,

};

const RoomReducer = (state = initialState, action) => {
  let Rooms_copy = [];
  Rooms_copy = { ...state.Rooms };

  switch (action.type) {
    case GET_ROOMS:
      state = { ...state, Rooms: action.payload };
      break;

    case GET_SUBROOMS:
      state = { ...state, SubRooms: action.payload };
      break;

    case UPDATE_ROOMS:
      break;
    case DELETE_ROOM:
      let RoomIndex = state.Rooms.findIndex(
        item => item.id === action.payload.id,
      );
      state.Rooms.splice(RoomIndex, 1);

      state = {
        ...state,
        Rooms: state.Rooms,
      };

      break;
    case ROOM_STAFFS:
      state = { ...state, RoomStaffList: action.payload };
      break;
    case LOGOUT:
      state = {
        RoomList: [],
        Rooms: undefined,
      };
      break;

    default:
      break;
  }
  return state;
};

export default RoomReducer;
