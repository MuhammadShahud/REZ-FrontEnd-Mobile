import {SEARCH_ALL_USERS, RESET_SEARCH_ALL_USERS} from '../Types/actions_type';

const SearchAllUsersAction = {
  getSearchUser: data => {
    return {
      type: SEARCH_ALL_USERS,
      payload: data,
    };
  },
  resetSearchUser: () => {
    return {
      type: RESET_SEARCH_ALL_USERS,
    };
  },
};

export default SearchAllUsersAction;
