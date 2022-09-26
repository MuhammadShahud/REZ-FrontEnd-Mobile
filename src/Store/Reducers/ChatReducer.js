import {
  GET_CHATS_MESSAGES,
  GET_CHAT_HEADS,
  LOGOUT,
  RESET_CHAT,
  UPDATE_CHAT_MESSAGES,
  GET_GROUPCHAT_HEADS,
  GET_GROUPCHATS_MESSAGES,
  UPDATE_GROUPCHAT_MESSAGES,
} from '../Types/actions_type';

let initialSate = {
  chatHeads: null,
  chatMessages: [],
  chatMessagesPaginatedObj: null,
  GroupChatHeads: null,
  GroupMessages: [],
  GroupMessagePaginatedObj : null
};

const ChatReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_CHAT_HEADS:
      state = { ...state, chatHeads: action.payload };
      break;
    case GET_GROUPCHAT_HEADS:
      state = { ...state, GroupChatHeads: action.payload };
      break;
    case UPDATE_CHAT_MESSAGES:
      let messagesCopy = [...state.chatMessages];
      messagesCopy.unshift(action.payload);
      state = { ...state, chatMessages: messagesCopy };
      break;
    case GET_CHATS_MESSAGES:
      let chat_messages_list_copy = [];
      chat_messages_list_copy = [...state.chatMessages, ...action.payload.data];
      state = {
        ...state,
        chatMessagesPaginatedObj: action.payload,
        chatMessages: chat_messages_list_copy,
      };
      break;
    case GET_GROUPCHATS_MESSAGES:
      let Groupchat_messages_list_copy = [];
      Groupchat_messages_list_copy = [...state.GroupMessages, ...action.payload.data];
      state = {
        ...state,
        GroupMessagePaginatedObj : action.payload,
        GroupMessages: Groupchat_messages_list_copy,
      };
      break;

    case UPDATE_GROUPCHAT_MESSAGES:
      let GroupmessagesCopy = [...state.GroupMessages];
      GroupmessagesCopy.unshift(action.payload);
      state = { ...state, GroupMessages: GroupmessagesCopy };
      break;
    case RESET_CHAT:
      state = {
        ...state,
        chatMessagesPaginatedObj: null,
        GroupMessagePaginatedObj: null,
        chatMessages: [],
        GroupMessages: [],
      };
      break;

    case LOGOUT:
      state = {
        chatHeads: null,
        chatMessages: [],
        chatMessagesPaginatedObj: null,
      };
      break;

    default:
      break;
  }
  return state;
};

export default ChatReducer;
