import { ACTIVE_EVENTS, PAST_EVENTS, RESET_EVENTS_PAST , RESET_EVENTS_ACTIVE } from "../Types/actions_type";

const initialSate = {
    active_event: [],
    activeEvent_list: [],
    previous_event: [],
    previousEvent_list: []
};


const EventReducer = (state = initialSate, action) => {
    switch (action.type) {
        case ACTIVE_EVENTS:
            let activeEvent_list_copy = [];
            activeEvent_list_copy = [...state.activeEvent_list, ...action.payload.data];
            state = {
                ...state,
                active_event: action.payload,
                activeEvent_list: activeEvent_list_copy

            };
            break;
        case PAST_EVENTS:
            let previousEvent_list_copy = [];
            previousEvent_list_copy = [...state.previousEvent_list, ...action.payload.data];
            state = {
                ...state,
                previous_event: action.payload,
                previousEvent_list: previousEvent_list_copy

            };
            break;
        // case EVENT_DETAILS:
        //     let eclass_list = [...state.e_classes_list];
        //     let eclass_index = eclass_list.findIndex(x => x.id === action.payload.id);
        //     eclass_list.splice(eclass_index, 1, action.payload);
        //      state = {...state, e_classes_list: eclass_list};
        //     break;
        case RESET_EVENTS_ACTIVE:
            state = {
                ...state,
                active_event: [],
                activeEvent_list: [],
            };
            break;

        case RESET_EVENTS_PAST:
            state = {
                ...state,
                previous_event: [],
                previousEvent_list: []
            };
            break;
        default:
            break;

    }
    return state;
};
export default EventReducer;