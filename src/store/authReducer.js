// project imports
import config from 'config';

// action - state management
import * as actionTypes from './authAction';
import { getCookie, setCookie } from 'utils/helper';
export let initialState = {
    dataUser: null,
    token: ''
};

const token = getCookie('AUTH');
const DATA_USER = localStorage.getItem('DATA_USER');
if (token) {
    initialState.token = token;
}
if (DATA_USER) {
    const dataOBJ = JSON.parse(DATA_USER);
    initialState.dataUser = dataOBJ;
}
// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_DATA_USER:
            localStorage.setItem(
                'DATA_USER',
                JSON.stringify(
                    action?.dataUser
                )
            );
            return {
                ...state,
                dataUser: action?.dataUser
            };
        case actionTypes.SET_TOKEN:
            setCookie('AUTH',action?.token,1);
            return {
                ...state,
                token: action?.token
            };
        default:
            return state;
    }
};

export default authReducer;
