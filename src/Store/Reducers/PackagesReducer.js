import {
    GET_CONTRACTS,
    GET_PACKAGES,
    GET_PASSES,
    GET_USER_MEMBERSHIP,
    DELETE_CONTRACT,
    DELETE_PACKAGE,
    DELETE_PASS
} from '../Types/actions_type';

const initialState = {
    ContractList: [],
    PackagesList: [],
    PassesList: [],

    Contracts: undefined,
    Packages: undefined,
    Passes: undefined,
    userPackageDetail: undefined,


};

const PackagesReducer = (state = initialState, action) => {

    switch (action.type) {
        case GET_CONTRACTS:
            state = { ...state, Contracts: action.payload };
            break;
        case GET_PACKAGES:
            state = { ...state, Packages: action.payload };
            break;
        case GET_PASSES:
            state = { ...state, Passes: action.payload };
            break;
        case DELETE_PACKAGE:
            let pkgList = [...state.Packages]
            let index = pkgList.findIndex(item => item.id == action.payload)
            pkgList.splice(index, 1)

            state = {
                ...state,
                Packages: pkgList
            };
            break;

        case DELETE_CONTRACT:
            let contList = [...state.Contracts]
            let cindex = contList.findIndex(item => item.id == action.payload)
            contList.splice(cindex, 1)

            state = {
                ...state,
                Contracts: contList
            };
            break;
        case DELETE_PASS:
            let passList = [...state.Passes]
            let pindex = passList.findIndex(item => item.id == action.payload)
            passList.splice(pindex, 1)

            state = {
                ...state,
                Passes: passList
            };
            break;
        case GET_USER_MEMBERSHIP:
            state = { ...state, userPackageDetail: action.payload };
            break;

        default:
            break;
    }
    return state;
};

export default PackagesReducer;
