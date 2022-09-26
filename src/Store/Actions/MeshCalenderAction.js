import { GET_MESH_CALENDER } from '../Types/actions_type';

const MeshCalenderAction = {
    meshCalenderGenerator: data => {
    return {
      type: GET_MESH_CALENDER,
      payload: data,
    };
  },
};

export default MeshCalenderAction;
