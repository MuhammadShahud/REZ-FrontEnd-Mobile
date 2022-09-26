import {GET_ECLASSES, RESET_ECLASS, UPDATE_ECLASS} from '../Types/actions_type';

const EClassAction = {
  getEClasses: data => {
    return {
      type: GET_ECLASSES,
      payload: data,
    };
  },
  updateEClass: data => {
    return {
      type: UPDATE_ECLASS,
      payload: data,
    };
  },
  resetEClasses: () => {
    return {
      type: RESET_ECLASS,
    };
  },
};

export default EClassAction;
