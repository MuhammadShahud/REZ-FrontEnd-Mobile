import Axios from 'axios';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AuthAction from '../Actions/AuthAction';
import HighlightsAction from '../Actions/HighlightsAction';
import Apis from '../Apis';

class HighlightsMiddleware {
    //   static getHighlights = next_page_url => {
    //     return dispatch => {
    //       return new Promise(async (resolve, reject) => {
    //         try {
    //           console.log('GET hiGhLIGHTS=>');
    //           if (next_page_url == undefined) {
    //             dispatch(HighlightsAction.resetHighlights());
    //           }
    //           let {data} = await Axios.get(
    //             Apis.getHighlights(next_page_url),
    //             await getHeaders(),
    //           );
    //           console.warn('Middlewareeeeee', data);

    static getHighlights = (next_page_url) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(HighlightsAction.resetHighlights());
                    }
                    let { data } = await Axios.get(
                        Apis.getHighlights(next_page_url),
                        await getHeaders(),
                    );
                    console.log("---------",data)
                    if (data?.success) {
                        dispatch(HighlightsAction.getHighlights(data.data));
                        // console.warn('HighlightsMiddlewaree', data);
                        resolve(data);
                    } else {
                        // alert(data?.message);
                        reject(data);
                    }
                } catch (error) {
                    reject(error);
                    console.warn('err =====', error);
                }
            });
        };
    };

    static getMyHighlights = (next_page_url) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    if (next_page_url == undefined) {
                        dispatch(HighlightsAction.resetMyHighlights());
                    }
                    let { data } = await Axios.get(
                        Apis.getMyHighlights(next_page_url),
                        await getHeaders(),
                    );
                    if (data?.success) {
                        dispatch(HighlightsAction.getMyHighlights(data.data));
                        // console.warn('HighlightsMiddlewaree', data);
                        resolve(data);
                    } else {
                        // alert(data?.message);
                        reject(data);
                    }
                } catch (error) {
                    reject(error);
                    console.warn('err =====', error);
                }
            });
        };
    };

    // static getPostByUser = () => {
    //     // console.warn("ghgjgj", name);
    //     return dispath => {
    //         return new Promise(async () => {
    //             try {
    //                 let response = await Axios.get(
    //                     Apis.getPostByUser(),
    //                     await getHeaders(),
    //                 );
    //                 console.warn("response getPostByUser=============", response)
    //                 if (response.data.success) {
    //                     dispath(HighlightsAction.getPostByUser(response.data.data));
    //                 }
    //             } catch (error) {
    //                 console.warn('err ', error);
    //             }
    //         });
    //     };
    // };

    static getPostByUser = ({ id }) => {
        return dispath => {
            return new Promise(async (resolve, reject) => {
                try {

                    let response = await Axios.get(
                        Apis.getPostByUser(id),
                        await getHeaders(),
                    );
                    console.warn("response team", response.data)
                    if (response.data.success) {
                        dispath(HighlightsAction.getPostByUser(response.data.data));
                        resolve(response.data);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ', error);
                }
            });
        };
    };

    static deleteLeague = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.warn('id ====', id);

                    let response = await Axios.get(
                        Apis.deleteLeague(id),
                        await getHeaders(),
                    );

                    console.warn('ress ====', response);

                    if (response.data.success) {
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('error ==', error);
                }
            });
        };
    };

    static sharePost = ({ id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.warn(id);
                    let formdata = new FormData();
                    formdata.append('id', id);
                    let response = await Axios.post(
                        Apis.sharePost,
                        formdata,
                        await getHeaders(),
                    );

                    console.warn('ress ====', response);

                    if (response.data.success) {
                        resolve(response.data);
                    } else {
                        resolve(response.data);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('error ==', error);
                }
            });
        };
    };
};

export default HighlightsMiddleware;
