import { ACTIVE_EVENTS, PAST_EVENTS, RESET_EVENTS_PAST, RESET_EVENTS_ACTIVE, EVENT_DETAILS } from '../Types/actions_type';

const EventAction = {
    ActiveEvents: data => {
        return {
            type: ACTIVE_EVENTS,
            payload: data,
        };
    },
    PastEvents: data => {
        return {
            type: PAST_EVENTS,
            payload: data,
        };
    },
    resetEventsPast: () => {
        return {
            type: RESET_EVENTS_PAST,
        };
    },

    resetEventsActive: () => {
        return {
            type: RESET_EVENTS_ACTIVE,
        };
    },
    // EventDetail: (data) => {
    //   return {
    //     type: EVENT_DETAILS,
    //     payload: data
    //   };
    // },
};

export default EventAction;
