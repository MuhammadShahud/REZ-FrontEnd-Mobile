import { GET_INVITATION_BY_USER, GET_INVITATION_SENT_BY_USER, GET_NOTIFICATION_BY_USER, RESET_INVITATION_BY_USER, RESET_NOTIFICATION_BY_USER, RESET_SENT_INVITATION_BY_USER } from '../Types/actions_type';

const NotificationByUserAction = {
  getNotificationByUser: data => {
    return {
      type: GET_NOTIFICATION_BY_USER,
      payload: data,
    };
  },
  resetNotificationByUser: () => {
    return {
      type: RESET_NOTIFICATION_BY_USER,
    };
  },

  getInvitationByUser: data => {
    return {
      type: GET_INVITATION_BY_USER,
      payload: data,
    };
  },
  resetInvitationByUser: () => {
    return {
      type: RESET_INVITATION_BY_USER,
    };
  },

  getSentInvitationByUser: data => {
    return {
      type: GET_INVITATION_SENT_BY_USER,
      payload: data,
    };
  },
  resetSentInvitationByUser: () => {
    return {
      type: RESET_SENT_INVITATION_BY_USER,
    };
  },

};

export default NotificationByUserAction;
