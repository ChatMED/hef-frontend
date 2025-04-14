import axios from 'axios';

export const AUTH_TOKEN = 'serviceToken';

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_GATEWAY}`,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        if (error?.response?.status === 403) {
            localStorage.removeItem(AUTH_TOKEN);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    config => config,
    error => {
        const isLoggedIn = localStorage.getItem("user");
        if (isLoggedIn && (error?.response?.status === 403 || error?.response?.status === 400)) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;
