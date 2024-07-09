// import axios from 'axios';
// import { ASSET_TOKEN } from './constant';
import axios from 'axios';
import { getCookie, logout } from './helper';

const urlAPI = import.meta.env.VITE_APP_API_URL || 'http://localhost:5005/api';
let token = await getCookie('AUTH');

const restApi = axios.create({
    baseURL: urlAPI // Thay thế bằng URL API thực tế của bạn,
    // withCredentials: true,
});

// Request interceptor for API calls
restApi.interceptors.request.use(
    async (confi) => {
        confi.headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };
        return confi;
    },
    (error) => {
        Promise.reject(error);
    }
);
// Response interceptor for API calls
restApi.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401) {
            logout();
        }
        return error.response;
    }
);

export default restApi;
