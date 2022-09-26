import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import ScheduleAction from '../Actions/ScheduleAction';
import Apis from '../Apis';

class ScheduleMiddleware {
  static getScheduleTypes = () => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const { data } = await Axios.get(
            Apis.getScheduleTypes,
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(ScheduleAction.setScheduleTypes(data.data));
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
  static addSchedule = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let date = new Date(payload.date);
          let dateInFormat = `${date.getFullYear()}-${date.getMonth() + 1
            }-${date.getDate()}`;

          let startTime = new Date(payload.start_time);

          let startTimeInFormat = `${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`;
          let endTime = new Date(payload.end_time);
          let endTimeInFormat = `${endTime.getHours()}:${endTime.getMinutes()}:${startTime.getSeconds()}`;

          let formdata = new FormData();
          formdata.append('schedule_type_id', payload.schedule_type_id);
          formdata.append('title', payload.title);
          formdata.append('description', payload.description);
          formdata.append('date', dateInFormat);
          formdata.append('start_time', startTimeInFormat);
          formdata.append('end_time', endTimeInFormat);
          formdata.append('interval_break', payload.interval_break);
          formdata.append('interval_time', payload.interval_time);
          formdata.append('price', payload.price);
          formdata.append('address', payload.address);
          formdata.append('privacy', payload.privacy);
          formdata.append('participants', payload.participants);
          formdata.append('room_id', payload.room_id);
          formdata.append('subroom_id', payload.subroom_id);
          formdata.append('invited_coach_id', payload.coach_id);


          if (payload.image) formdata.append('image', payload.image);
          if (payload?.invited_user_id.length) {
            for (const iterator of payload.invited_user_id) {
              formdata.append('invited_user_id[]', iterator.id);
            }
          }
          console.warn("Data----", formdata);
          const { data } = await Axios.post(
            Apis.addSchedule,
            formdata,
            await getHeaders(),
          );
          console.warn('datadata=>', data);
          if (data?.success) {
            setTimeout(() => {
              dispatch(
                ScheduleMiddleware.getSchedulesByRole({ filter: '', date: '' }),
              );
            }, 0);
            // alert(data?.message);
            resolve(data?.data);
          } else {
            reject(error);
            console.log(error);
            // alert(data?.message);
          }
        } catch (error) {
          reject(error);
          // alert(JSON.stringify(error.response));
          console.log(error);
        }
      });
    };
  };
  static getFilterScheduleLis = payload => {
    // Will delete it later
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(ScheduleAction.resetGetFilterScheduleList());
          let formdata = new FormData();
          formdata.append('filter', payload.filter);
          formdata.append('date', payload.date);
          console.log('PAYLOAD : ', payload);
          const { data } = await Axios.post(
            Apis.getFilterScheduleList,
            formdata,
            await getHeaders(),
          );

          console.log('data=>', data);
          if (data?.success) {
            dispatch(ScheduleAction.getFilterScheduleList(data.data));
            resolve(data?.data);
          } else {
            reject(error);
            console.log(error);

            alert(data?.message);
          }
        } catch (error) {
          reject(error);
          alert('Network Error');
          console.log(error);
        }
      });
    };
  };
  static getSchedulesByRole = payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(ScheduleAction.resetGetFilterScheduleList());

          let formdata = new FormData();
          console.warn('payload?.date', payload);
          payload?.filter ? formdata.append('filter', payload?.filter) : null;
          payload?.date ? formdata.append('date', payload?.date) : null;
          // payload.room_id ? formdata.append('room_id', payload.room_id) : null;

          const { data } = await Axios.post(
            Apis.getSchedulesByRole,
            payload?.filter || payload?.date ? formdata : {},
            await getHeaders(),
          );
          console.warn('DATA=>', data);
          if (data?.success && data?.data) {
            let all_schedule_list = [];
            Object.keys(data.data).map(schedule_type => {
              let schedule_list = data.data[schedule_type];
              schedule_list.map(x => {
                let date = new Date();
                if (x?.type == 'sessions') {
                  date = x.date;
                }
                if (
                  x?.type == 'booked_sessions' ||
                  x?.type == 'schedule_list'
                ) {
                  date = x.booking_date;
                }
                if (x?.type == 'in_leagues') {
                  date = x?.start_date;
                }
                if (x?.type == 'eclasses' || x?.type == 'team_schedules') {
                  date = x?.date;
                }
                if (x?.type == undefined) {
                  date = x?.date
                }
                // if (x?.type == 'training') {
                //   date = x.date;
                // }
                x.date = new Date(date);
                all_schedule_list.push({ ...x, type: schedule_type });
              });
            });

            all_schedule_list.sort((a, b) => b.date - a.date);
            // all_schedule_list.map(x =>
            //   console.log('all_schedule_list=>', x.date),
            // );
            dispatch(ScheduleAction.getFilterScheduleList(all_schedule_list));
            console.warn("------->", all_schedule_list);
            resolve(data?.data);
          } else {
            dispatch(ScheduleAction.getFilterScheduleList([]));
            resolve(data?.data);
          }
        } catch (error) {
          reject(error);
          // alert(JSON.stringify(error.response));
          // alert('Network Error');
          console.log(error);
        }
      });
    };
  };
}

export default ScheduleMiddleware;
