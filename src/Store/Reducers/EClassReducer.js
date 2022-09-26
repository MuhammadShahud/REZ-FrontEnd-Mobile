import {
  GET_ECLASSES,
  LOGOUT,
  RESET_ECLASS,
  UPDATE_ECLASS,
} from '../Types/actions_type';

let initialSate = {
  e_class: null,
  e_classes_list: [],
};

const EClassReducer = (state = initialSate, action) => {
  switch (action.type) {
    case GET_ECLASSES:
      let e_classes_list_copy = [];
      e_classes_list_copy = [...state.e_classes_list, ...action.payload.data];
      state = {
        ...state,
        e_class: action.payload,
        e_classes_list: e_classes_list_copy,
      };
      break;
    case UPDATE_ECLASS:
      let eclass_list = [...state.e_classes_list];
      let eclass_index = eclass_list.findIndex(x => x.id === action.payload.id);
      eclass_list.splice(eclass_index, 1, action.payload);
      state = {...state, e_classes_list: eclass_list};
      break;
    case RESET_ECLASS:
      state = {
        e_class: null,
        e_classes_list: [],
      };
      break;

    case LOGOUT:
      state = {
        e_class: null,
        e_classes_list: [],
      };
      break;
    default:
      break;
  }
  return state;
};

export default EClassReducer;
