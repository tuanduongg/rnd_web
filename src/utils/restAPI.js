// import axios from 'axios';
// import { ASSET_TOKEN } from './constant';
import axios from 'axios';
import { getCookie } from './helper';
import Cookies from 'js-cookie';

const urlAPI = import.meta.env.VITE_APP_API_URL || 'http://localhost:5005/api';
const restApi = axios.create({
    baseURL: urlAPI // Thay thế bằng URL API thực tế của bạn,
    // withCredentials: true,
});

// Request interceptor for API calls
const token = Cookies.get('token');
console.log('token',token);
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
      console.log('response',response.headers['set-cookie']);
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401) {
            console.log('401');
        }
        return error.response;
    }
);

export default restApi;
