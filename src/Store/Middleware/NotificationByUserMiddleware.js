import Axios from 'axios';
import { getHeaders } from '../../Utils';
import NotificationByUserAction from '../Actions/NotificationByUserAction';
import Apis from '../Apis';

class NotificationByUserMiddleware {

  static getNotificationByUser = (next_page_url) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(NotificationByUserAction.resetNotificationByUser());
          }
          //   console.log('searchTextsearchText=>', searchText);
          console.log('Apis=>)', next_page_url, Apis.getNotificationByUser(next_page_url));
          let { data } = await Axios.get(
            Apis.getNotificationByUser(next_page_url),
            await getHeaders(),
          );

          // return
          if (data?.success) {

            dispatch(NotificationByUserAction.getNotificationByUser(data.data));
            resolve(data);
            console.log('InvitesMiddlewareeeeee', data);

          } else {
            console.warn('NotificationByUserMiddlewareeeeee', data);
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.log('err ===== 34', error);
        }
      });
    };
  };

  static getInvitationByUser = (next_page_url) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(NotificationByUserAction.resetInvitationByUser());
          }
          let { data } = await Axios.get(
            Apis.getInvitationByUser(next_page_url),
            await getHeaders(),
          );

          console.log("---------------->",data)

          // return
          if (data?.success) {

            dispatch(NotificationByUserAction.getInvitationByUser(data.data));
            resolve(data);
            console.log('InvitesMiddlewareeeeee', data);

          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.log('err ===== 34', error);
        }
      });
    };
  };

  static getSentInvitationByUser = (next_page_url) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(NotificationByUserAction.resetSentInvitationByUser());
          }
          let { data } = await Axios.get(
            Apis.getInvitationOfUser(next_page_url),
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(NotificationByUserAction.getSentInvitationByUser(data.data));
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.log('err ===== 34', error);
        }
      });
    };
  };

  // static getInvitationByUser = ( next_page_url ) => {
  //   return dispatch => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         if (next_page_url == undefined ) {
  //           dispatch(InvitesAction.getInvitationByUser());
  //         }
  //         console.log('next_page_url 39=>', next_page_url);
  //         let { data } = await Axios.get(
  //           // `${Apis.getFollowingUser(next_page_url,id)}`,
  //           Apis.getInvitationByUser(next_page_url),
  //           await getHeaders(),
  //         );
  //         console.warn("resssppp===", data);
  //         if (data?.success) {
  //           console.log('InvitesAction....',InvitesAction.getInvitationByUser(data.data))
  //           dispatch(InvitesAction.getInvitationByUser(data.data));
  //           resolve(data);
  //         } else {
  //           alert(data?.message);
  //           reject(data);
  //         }
  //       } catch (error) {
  //         reject(error);
  //         // alert('Network Error');
  //         console.warn('err =====', error);
  //       }
  //     });
  //   };
  // };
}

export default NotificationByUserMiddleware;
