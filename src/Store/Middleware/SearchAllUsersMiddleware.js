import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import SearchAllUsersAction from '../Actions/SearchAllUsersAction';
import Apis from '../Apis';

class SearchAllUsersMiddleware {

  static getSearchUser = (next_page_url, searchText) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || searchText) {
            dispatch(SearchAllUsersAction.resetSearchUser());
          }
          let {data} = await Axios.get(
            Apis.getSearchUser(next_page_url, searchText),
            await getHeaders(),
          );
          if (data?.success) {
            dispatch(SearchAllUsersAction.getSearchUser(data.data));
            resolve(data);
          } else {
            alert(data?.message);
            reject(data);
          }
        } catch (error) {
          reject(error);
          console.warn('err =====', error);
        }
      });
    };
  };
}

export default SearchAllUsersMiddleware;
