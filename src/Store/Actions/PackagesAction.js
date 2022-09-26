import {
    GET_CONTRACTS,
    GET_PACKAGES,
    GET_PASSES,
    GET_USER_MEMBERSHIP,
    DELETE_CONTRACT,
    DELETE_PACKAGE,
    DELETE_PASS


} from '../Types/actions_type';

const PackagesAction = {

    getUserMemberShipDetails: data => {
        return {
            type: GET_USER_MEMBERSHIP,
            payload: data,
        };
    },
    getContracts: data => {
        return {
            type: GET_CONTRACTS,
            payload: data,
        };
    },

    getPackages: data => {
        return {
            type: GET_PACKAGES,
            payload: data,
        };
    },
    getPasses: data => {
        return {
            type: GET_PASSES,
            payload: data,
        };
    },
    deletePass: data => {
        return {
            type: DELETE_PASS,
            payload: data,
        };
    },
    deletePackage: data => {
        return {
            type: DELETE_PACKAGE,
            payload: data,
        };
    },
    deleteContract: data => {
        return {
            type: DELETE_CONTRACT,
            payload: data,
        };
    },

};

export default PackagesAction;
