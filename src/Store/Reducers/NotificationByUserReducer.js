import {
  GET_INVITATION_BY_USER,
  GET_INVITATION_SENT_BY_USER,
  GET_NOTIFICATION_BY_USER,
  LOGOUT,
  RESET_INVITATION_BY_USER,
  RESET_NOTIFICATION_BY_USER,
  RESET_SENT_INVITATION_BY_USER,
} from '../Types/actions_type';

let initialSate = {
  notification_by_user: null,
  notification_by_user_list: [],

  invitation_by_user: null,
  invitation_by_user_list: [],

  invitation_sent_by_user: null,
  invitation_sent_by_user_list: []
};

const NotificationByUserReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_BY_USER:
      let notification_by_user_list_copy = [];
      notification_by_user_list_copy = [
        ...state.notification_by_user_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        notification_by_user: action.payload,
        notification_by_user_list: notification_by_user_list_copy,
      };
      break;
    case RESET_NOTIFICATION_BY_USER:
      state = {
        notification_by_user: null,
        notification_by_user_list: [],
      };
      break;
    case GET_INVITATION_BY_USER:
      let invitation_by_user_list_copy = [];
      invitation_by_user_list_copy = [
        ...state.invitation_by_user_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        invitation_by_user: action.payload,
        invitation_by_user_list: invitation_by_user_list_copy,
      };
      break;
    case RESET_INVITATION_BY_USER:
      state = {
        invitation_by_user: null,
        invitation_by_user_list: [],
      };
      break;
    case GET_INVITATION_SENT_BY_USER:
      let invitation_sent_by_user_list_copy = [
        ...state.invitation_sent_by_user_list,
        ...action.payload.data,
      ];
      console.warn("state in reducer", invitation_sent_by_user_list_copy)
      state = {
        ...state,
        invitation_sent_by_user: action.payload,
        invitation_sent_by_user_list: invitation_sent_by_user_list_copy,
      };
      break;
    case RESET_SENT_INVITATION_BY_USER:
      state = {
        invitation_sent_by_user: null,
        invitation_sent_by_user_list: [],
      };
      break;
    case LOGOUT:
      state = {
        notification_by_user: null,
        notification_by_user_list: [],
        invitation_by_user: null,
        invitation_by_user_list: [],
        invitation_sent_by_user: null,
        invitation_sent_by_user_list: [],
      };
      break;
    default:
      break;
  }
  return state;
};

export default NotificationByUserReducer;
