import {
  SEARCH_ALL_USERS,
  RESET_SEARCH_ALL_USERS,
  LOGOUT,
} from '../Types/actions_type';

let initialSate = {
  searchUser: null,
  searchUser_list: [],
};

const SearchAllUsersReducer = (state = initialSate, action) => {
  switch (action.type) {
    case SEARCH_ALL_USERS:
      let searchUser_list_copy = [];
      searchUser_list_copy = [...state.searchUser_list, ...action.payload.data];
      state = {
        ...state,
        searchUser: action.payload,
        searchUser_list: searchUser_list_copy,
      };
      break;
    case RESET_SEARCH_ALL_USERS:
      state = {
        searchUser: null,
        searchUser_list: [],
      };
      break;
    case LOGOUT:
      state = {
        searchUser: null,
        searchUser_list: [],
      };
      break;
    default:
      break;
  }
  return state;
};

export default SearchAllUsersReducer;
