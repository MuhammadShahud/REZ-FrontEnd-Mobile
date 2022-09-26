import axios from 'axios';
import Axios from 'axios';
import { getHeaders } from '../../Utils';
import UserAction from '../Actions/UserAction';
import Apis from '../Apis';

class UserMiddleware {
  static getUsersByType = ({ role, next_page_url }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined) {
            dispatch(UserAction.resetUsersByType());
          }
          let formdata = new FormData();
          formdata.append('role', role);
          const { data } = await Axios.post(
            Apis.getUsersByType(next_page_url),
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(UserAction.setUsersByType(data.data));
            resolve(data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');

          console.log(error);
        }
      });
    };
  };

  static getLeagues = ({ type, callback }) => {
    return dispatch => {
      return new Promise(async (resolve, rejecet) => {
        try {
          let response = await axios.get(
            Apis.allLeagues(type),
            await getHeaders(),
          );

          console.warn('ress ==', type);
          if (response.data.success) {
            callback(response.data);
          } else {
            callback(response.data);
          }
        } catch (error) {
          callback(error);
          console.warn('err ==', error);
        }
      });
    };
  };

  static createLeague = ({
    leagueName,
    leagueDescription,
    startDate,
    endDate,
    leaguePrice,
    leagueLocation,
    leagueTime,
    teamOneId,
    teamTwoId,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          console.log(
            leagueName,
            leagueDescription,
            startDate,
            endDate,
            leaguePrice,
            leagueLocation,
            leagueTime,
            teamOneId,
            teamTwoId,
          );
          let formData = new FormData();
          formData.append('league_name', leagueName);
          formData.append('league_description', leagueDescription);
          formData.append('start_date', startDate);
          formData.append('end_date', endDate);
          formData.append('price', leaguePrice);
          formData.append('venue_address', leagueLocation);
          formData.append('start_time', leagueTime);

          // formData.append('team1_id', teamOneId);
          // formData.append('team2_id', teamTwoId);

          console.warn('formData', formData);
          // return;

          const response = await Axios.post(
            Apis.createLeague,
            formData,
            await getHeaders(),
          );

          console.warn('res --', response);
          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ==', error);
        }
      });
    };
  };

  static updateLeague = ({
    leagueId,
    leagueName,
    leagueDescription,
    leaguePrice,
    leagueTime,
    startDate,
    endDate,
    leagueLocation,
    teamOneId,
    teamTwoId,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('id', leagueId);
          formData.append('league_name', leagueName);
          formData.append('league_description', leagueDescription);
          formData.append('start_date', startDate);
          formData.append('end_date', endDate);
          formData.append('price', leaguePrice);
          formData.append('venue_address', leagueLocation);
          formData.append('start_time', leagueTime);
          // formData.append('team1_id', teamOneId);
          // formData.append('team2_id', teamTwoId);

          console.warn('formData', formData);

          const response = await Axios.post(
            Apis.updateLeague,
            formData,
            await getHeaders(),
          );

          console.warn('ress ---', response);
          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('errr', error);
        }
      });
    };
  };

  static leagueDetail = ({ id }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.leagueDetail(id),
            await getHeaders(),
          );

          if (response.data.success) {
            dispatch(UserAction.saveLeagueDetails(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ==', error);
        }
      });
    };
  };

  static joinLeague = ({ cardId, leagueId, coachId, amount }) => {
    return disptach => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('coach_id', coachId);
          formData.append('league_id', leagueId);
          formData.append('card_id', cardId);
          formData.append('amount', amount);

          console.warn('frmDAya', formData);

          let response = await axios.post(
            Apis.bookingLeague,
            formData,
            await getHeaders(),
          );

          console.warn('ress ==', response);

          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('eerr ==', error);
        }
      });
    };
  };

  static inviteTeamsInLeague = ({ coachId, leagueId, teamsIds }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('coach_id', coachId);
          formData.append('league_id', leagueId);
          formData.append('team_id', JSON.stringify(teamsIds));

          console.warn(formData);

          let response = await axios.post(
            Apis.inviteTeams,
            formData,
            await getHeaders(),
          );

          console.warn('dsada', response);
          if (response.data.success) {
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

  static joinCoachLeague = ({ notificationId, contentId, approvalStatus }) => {
    return disptach => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('notification_id', notificationId);
          formData.append('content_id', contentId);
          formData.append('approvalStatus', approvalStatus);

          console.warn('formData', formData);

          let response = await axios.post(
            Apis.acceptLeague,
            formData,
            await getHeaders(),
          );

          console.warn('response ===', response);
        } catch (error) {
          console.warn('err ==', error);
        }
      });
    };
  };

  static updateScore = ({
    teamOneId,
    teamTwoId,
    league_id,
    teamOneScore,
    teamTwoScore,
  }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('team1_id', teamOneId);
          formData.append('team2_id', teamTwoId);
          formData.append('league_id', league_id);
          formData.append('teamscore1', teamOneScore);
          formData.append('teamscore2', teamTwoScore);
          console.warn('formData', formData);

          let response = await axios.post(
            Apis.updateLeagueScore,
            formData,
            await getHeaders(),
          );
          console.warn('ress', response);

          if (response.data.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ==', error);
        }
      });
    };
  };

  static leaguesHistory = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await axios.get(
            Apis.leaguesHistory,
            // `${Apis.leaguesHistory}`,
            await getHeaders(),
          );
          // console.warn('response', response.data);
          if (response.data.success) {
            console.warn('response', response.data.data);
            dispatch(UserAction.LeagueHistory(response.data.data));
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
          console.warn('err ==', error);
        }
      });
    };
  };

  static getUsersByRole = ({ role }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formdata = new FormData();
          formdata.append('role', role);
          const { data } = await Axios.post(
            Apis.getUsersByRole,
            formdata,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(UserAction.getUser(data.data))
            resolve(data.data);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
        }
      });
    };
  };
}

export default UserMiddleware;
