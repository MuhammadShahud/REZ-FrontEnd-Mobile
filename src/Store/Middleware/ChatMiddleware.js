import Axios from 'axios';
import { getHeaders, RNHeader } from '../../Utils';
import ChatAction from '../Actions/ChatAction';
import EClassAction from '../Actions/EClassAction';
import Apis from '../Apis';
import RNFetchBlob from 'rn-fetch-blob'

class ChatMiddleware {
  static getChatHeads = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(Apis.getChatHeads, await getHeaders());
          console.log('React native =>', data, await getHeaders());
          if (data?.success) {
            dispatch(ChatAction.getChatHeads(data.data));
            resolve(data.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error.response);
        }
      });
    };
  };
  static sendMessage = ({ chathead_id, recipient_user, message, content_id, media, media_type }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('chathead_id', chathead_id);
          formdata.append('id', recipient_user);
          if (message != null) {
            formdata.append('message', message);
          } else {
            formdata.append('content_id', content_id);
          }
          if (media) {
            formdata.append('media', media);
          }
          if (media_type)
            formdata.append('media_type', media_type);

          const { data } = await Axios.post(
            Apis.sendMessage,
            formdata,
            await getHeaders(),
          );
          console.log('Data=>', data);
          if (data?.success) {
            console.warn(data.data);
            dispatch(ChatAction.updateChatMessages(data.data));
            resolve(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error.response);
        }
      });
    };
  };
  static getChatMessages = ({ recipient_user, next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.log('next_page_url', next_page_url);
          let formdata = new FormData();
          formdata.append('id', recipient_user);

          const { data } = await Axios.post(
            Apis.getChatMessages(next_page_url),
            formdata,
            await getHeaders(),
          );
          console.log('datadata=>', data);
          if (data?.success) {
            dispatch(ChatAction.getChatMessages(data.data));
            resolve(data.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static getChatSession = ({ recipient_user_id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('id', recipient_user_id);

          const { data } = await Axios.post(
            Apis.createSession,
            formdata,
            await getHeaders(),
          );
          console.log('Data=>', data);
          if (data?.success) {
            resolve(data.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };

  static createGroup = ({ name, description, image, members }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('name', name);
          formdata.append('description', description);
          formdata.append('image', image);
          for (const [i, member] of members.entries()) {
            formdata.append('members[]', member);
          }
          console.warn(formdata);
          let response = await Axios.post(
            Apis.createGroupChat,
            formdata,
            await getHeaders(),
          );
          console.log('Data=>', response.data);
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads());
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          console.log(error);
        }
      });
    };
  };

  static getGroupChatHeads = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(Apis.getGroupChatHeads, await getHeaders());
          console.log('React native =>', data, await getHeaders());
          if (data?.success) {
            dispatch(ChatAction.getGroupChatHeads(data.data));
            resolve(data.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error.response);
        }
      });
    };
  };

  static getGroupChatMessages = ({ id, next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.warn("===>", next_page_url)
          let formdata = new FormData();
          formdata.append('id', id);
          let response = await Axios.post(
            Apis.getGroupMessages(next_page_url),
            formdata,
            await getHeaders(),
          );
          if (response.data?.success) {
            dispatch(ChatAction.getGroupChatMessages(response.data.data));
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error', error);
          console.log(error);
        }
      });
    };
  };

  static sendGroupMessage = ({ Group_id, message, content_id, media, media_type }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          console.log('messagemessagemessage', message);
          formdata.append('group_id', Group_id);
          if (message != null) {
            formdata.append('message', message);
          } else {
            formdata.append('content_id', content_id);
          }
          if (media) {
            formdata.append('media', media);
          }
          if (media_type)
            formdata.append('media_type', media_type);

          const { data } = await Axios.post(
            Apis.sendGroupMessage,
            formdata,
            await getHeaders(),
          );
          console.log('Data=>', data);
          if (data?.success) {

            resolve(data);
          }
        } catch (error) {
          reject(error);
          console.log(error.response);
        }
      });
    };
  };

  static readGroupChatMessages = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('id', id);
          let response = await Axios.post(
            Apis.readGroupMessages,
            formdata,
            await getHeaders(),
          );
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads())
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error', error);
          console.log(error);
        }
      });
    };
  };

  static deletGroupMember = ({ user_id, group_id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('user_id', user_id);
          formdata.append('group_id', group_id);

          let response = await Axios.post(
            Apis.deleteGroupMember,
            formdata,
            await getHeaders(),
          );
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads())
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error', error);
          console.log(error);
        }
      });
    };
  };

  static updateGroupInfo = ({ group_id, name, description, members, image }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('id', group_id);
          formdata.append('name', name);
          formdata.append('description', description);
          formdata.append('image', image)
          for (const [i, id] of members.entries()) {
            formdata.append('members[]', id);
          }
          console.warn(formdata);
          let response = await Axios.post(
            Apis.updateGroup,
            formdata,
            await getHeaders(),
          );
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads())
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          console.log(error);
        }
      });
    };
  };

  static leaveGroup = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('group_id', id);
          let response = await Axios.post(
            Apis.leaveGroup,
            formdata,
            await getHeaders(),
          );
          console.warn(response.data);
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads())
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error', error);
          console.log(error);
        }
      });
    };
  };

  static deleteGroup = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('id', id);
          let response = await Axios.post(
            Apis.deleteGroup,
            formdata,
            await getHeaders(),
          );
          console.warn(response.data);
          if (response.data?.success) {
            dispatch(ChatMiddleware.getGroupChatHeads())
            resolve(response.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error', error);
          console.log(error);
        }
      });
    };
  };

}

export default ChatMiddleware;
