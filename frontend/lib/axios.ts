import axios from 'axios';

const instance = axios.create({
    // রেলওয়ের ভেরিয়েবল থাকলে সেটা নেবে, না থাকলে লোকালহোস্ট নেবে
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Response Interceptor
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export const getCsrfToken = () => instance.get('/sanctum/csrf-cookie');

export default instance;