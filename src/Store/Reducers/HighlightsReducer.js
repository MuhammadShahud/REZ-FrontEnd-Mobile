import {
  GET_HIGHLIGHTS_DATA,
  GET_MY_HIGHLIGHTS_DATA,
  GET_POST_BY_USER,
  LOGOUT,
  RESET_HIGHLIGHTS_DATA,
  RESET_MY_HIGHLIGHTS_DATA,
} from '../Types/actions_type';

let initialSate = {
  highlights: null,
  highlights_list: [],
  myhighlights: null,
  myhighlights_list: [],
  postsData: null,
};

const HighlightsReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_HIGHLIGHTS_DATA:
      let highlights_list_copy = [];
      highlights_list_copy = [...state.highlights_list, ...action.payload.data].filter(v => v !== null);
      // highlights_list_copy = [...state.highlights_list, ...action.payload.data];
      state = {
        ...state,
        highlights: action.payload,
        highlights_list: highlights_list_copy,
      };
      break;
    case RESET_HIGHLIGHTS_DATA:
      state = {
        highlights: null,
        highlights_list: [],
      };
      break;
    case GET_MY_HIGHLIGHTS_DATA:
      let myhighlights_list_copy = [];
      myhighlights_list_copy = [
        ...state.myhighlights_list,
        ...action.payload.data,
      ];
      state = {
        ...state,
        myhighlights: action.payload,
        myhighlights_list: myhighlights_list_copy,
      };
      break;
    case RESET_MY_HIGHLIGHTS_DATA:
      state = {
        myhighlights: null,
        myhighlights_list: [],
      };
      break;
    case GET_POST_BY_USER:
      state = { ...state, postsData: action.payload };
      break;
    case LOGOUT:
      state = {
        highlights: null,
        highlights_list: [],
        myhighlights: null,
        myhighlights_list: [],
        postsData: null,
      };
      break;

    default:
      break;
  }
  return state;
};

export default HighlightsReducer;
