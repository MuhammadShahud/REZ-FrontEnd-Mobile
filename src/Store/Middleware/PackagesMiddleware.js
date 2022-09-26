import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import PackagesAction from '../Actions/PackagesAction';
import Apis from '../Apis';

class PackagesMiddleware {

    static getAllContracts = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await Axios.get(
                        `${Apis.getAllContract}?id=${id}`,
                        await getHeaders(),
                    );

                    console.warn('ress', response);
                    if (response.data.success) {
                        dispatch(PackagesAction.getContracts(response.data.data));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static createContract = ({
        ContractTitle,
        description,
        valid,
        renew,
        price,
        passes,
        ScheduleType,
        id,
    }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('name', ContractTitle);
                    formData.append('description', description);
                    formData.append('price', price);
                    formData.append('renewable', renew);
                    formData.append('validity', valid);
                    formData.append('no_of_passes', passes);
                    formData.append('schedule_type_id', ScheduleType);
                    console.warn(formData);

                    let response = await Axios.post(
                        Apis.createContract,
                        formData,
                        await getHeaders(),
                    );

                    console.log(response.data);
                    if (response.data.success) {
                        dispatch(PackagesMiddleware.getAllContracts({ id }));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static getAllPackages = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await Axios.get(
                        `${Apis.getAllPackages}?id=${id}`,
                        await getHeaders(),
                    );

                    console.warn('ress', response);
                    if (response.data.success) {
                        dispatch(PackagesAction.getPackages(response.data.data));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static createPackage = ({
        PackageTitle,
        description,
        valid,
        price,
        ScheduleType,
        id,
    }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('name', PackageTitle);
                    formData.append('description', description);
                    formData.append('price', price);

                    formData.append('validity', valid);

                    formData.append('schedule_type_id', ScheduleType);
                    console.warn(formData);

                    let response = await Axios.post(
                        Apis.createPackage,
                        formData,
                        await getHeaders(),
                    );

                    console.log(response.data);
                    if (response.data.success) {
                        dispatch(PackagesMiddleware.getAllPackages({ id }));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static getAllPasses = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let response = await Axios.get(
                        `${Apis.getAllPasses}?id=${id}`,
                        await getHeaders(),
                    );

                    console.warn('ress', response);
                    if (response.data.success) {
                        dispatch(PackagesAction.getPasses(response.data.data));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static createPasses = ({
        PassTitle,
        description,
        price,
        ScheduleType,
        id,
        visit
    }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('name', PassTitle);
                    formData.append('description', description);
                    formData.append('price', price);
                    formData.append('schedule_type_id', ScheduleType);
                    formData.append('visits', visit);
                    console.warn(formData);

                    let response = await Axios.post(
                        Apis.createPass,
                        formData,
                        await getHeaders(),
                    );

                    console.log(response.data);
                    if (response.data.success) {
                        dispatch(PackagesMiddleware.getAllPasses({ id }));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ===', error);
                }
            });
        };
    };

    static getUserMembership = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('facility_id', id);
                    let response = await Axios.post(
                        Apis.getUserContracts,
                        formData,
                        await getHeaders(),
                    );

                    console.warn('ress', response);
                    if (response.data.success) {
                        dispatch(PackagesAction.getUserMemberShipDetails(response.data.data));
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('errs ===', error);
                }
            });
        };
    };

    static subscribedPlans = ({ payid, amount, id, type }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('payment_method_id', payid);
                    formData.append('amount', amount);
                    formData.append('id', id);
                    formData.append('type', type);

                    let response = await Axios.post(
                        Apis.subscribedPlans,
                        formData,
                        await getHeaders(),
                    );

                    console.warn('ress', response);
                    if (response.data.success) {
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('errs ===', error);
                }
            });
        };
    };

    static deletePackage = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id);
                    let response = await Axios.post(
                        Apis.deletePackage,
                        formData,
                        await getHeaders(),
                    );

                    if (response.data.success) {
                        dispatch(PackagesAction.deletePackage(id));
                        resolve(response.data);
                    } else {
                        alert(response?.data.message)
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('errs ===', error);
                }
            });
        };
    };

    static deletePass = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id);
                    let response = await Axios.post(
                        Apis.deletePass,
                        formData,
                        await getHeaders(),
                    );

                    if (response.data.success) {
                        dispatch(PackagesAction.deletePass(id));
                        resolve(response.data);
                    } else {
                        alert(response?.data.message)
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('errs ===', error);
                }
            });
        };
    };
    
    static deleteContract = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData();
                    formData.append('id', id);
                    let response = await Axios.post(
                        Apis.deleteContract,
                        formData,
                        await getHeaders(),
                    );
                    if (response.data.success) {
                        dispatch(PackagesAction.deleteContract(id));
                        resolve(response.data);
                    } else {
                        alert(response?.data.message)
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('errs ===', error);
                }
            });
        };
    }

}

export default PackagesMiddleware;
