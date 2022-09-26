import {DELETE_LEAGUE, GET_HIGHLIGHTS_DATA, GET_MY_HIGHLIGHTS_DATA, GET_POST_BY_USER, RESET_HIGHLIGHTS_DATA, RESET_MY_HIGHLIGHTS_DATA} from '../Types/actions_type';

const HighlightsAction = {
  getHighlights: data => {
    return {
      type: GET_HIGHLIGHTS_DATA,
      payload: data,
    };
  },
  resetHighlights: () => {
    return {
      type: RESET_HIGHLIGHTS_DATA,
    };
  },
  getMyHighlights: data => {
    return {
      type: GET_MY_HIGHLIGHTS_DATA,
      payload: data,
    };
  },
  resetMyHighlights: () => {
    return {
      type: RESET_MY_HIGHLIGHTS_DATA,
    };
  },
  getPostByUser: data => {
    return {
      type: GET_POST_BY_USER,
      payload: data,
    };
  },
  deleteLeague: data => {
    // console.warn(data);
    return {
      type: DELETE_LEAGUE,
      payload: data,
    };
  },
};

export default HighlightsAction;
