import {
    GET_ALL_SUBSCRIPTION,
    RESET_SUBSCRIPTION
} from '../Types/actions_type';

let initialSate = {
    subscription: [],
    subscription_list: [],
};

const MembershipReducer = (state = initialSate, action) => {
    // console.log('state',state);
    // console.log('action',action);
    switch (action.type) {
        case GET_ALL_SUBSCRIPTION:
            let subscription_list_copy = [];
            subscription_list_copy = [...state.subscription_list, ...action.payload.data];
            state = {
                ...state,
                subscription: action.payload,
                subscription_list: subscription_list_copy,
            };
            break;
        //   case UPDATE_ECLASS:
        //     let eclass_list = [...state.e_classes_list];
        //     let eclass_index = eclass_list.findIndex(x => x.id === action.payload.id);
        //     eclass_list.splice(eclass_index, 1, action.payload);
        //     state = {...state, e_classes_list: eclass_list};
        //     break;
        case RESET_SUBSCRIPTION:
            state = {
                subscription: [],
                subscription_list: [],
            };
            break;
        default:
            break;
    }
    return state;
};

export default MembershipReducer;
