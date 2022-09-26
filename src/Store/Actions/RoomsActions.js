import {
    GET_ROOMS,
    GET_SUBROOMS,
    UPDATE_ROOMS,
    UPDATE_SUBROOMS,
    DELETE_ROOM,
    ROOM_STAFFS,
} from '../Types/actions_type';

const RoomsActions = {
    getRooms: data => {
        return {
            type: GET_ROOMS,
            payload: data,
        };
    },
    updateRooms: data => {
        return {
            type: UPDATE_ROOMS,
            payload: data,
        };
    },

    getSubRooms: data => {
        return {
            type: GET_SUBROOMS,
            payload: data,
        };
    },
    updateSubRooms: data => {
        return {
            type: UPDATE_SUBROOMS,
            payload: data,
        };
    },


    deleteRoom: data => {
        return {
            type: DELETE_ROOM,
            payload: data,
        };
    },

    getRoomStaffs: data => {
        return {
            type: ROOM_STAFFS,
            payload: data,
        };
    },
};

export default RoomsActions;
