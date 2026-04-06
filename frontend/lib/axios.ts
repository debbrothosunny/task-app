import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true, // To send session cookies
    withXSRFToken: true,    // Required for CSRF protection
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});

// Response Interceptor: This will check every API response
instance.interceptors.response.use(
    (response) => {
        // If request is successful, return response directly
        return response;
    },
    (error) => {
        // If backend returns 401 Unauthorized error (e.g., private mode or session expired)
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized. Redirecting to login...");
            
            // Client-side redirect (to ensure logout flow)
            if (typeof window !== 'undefined') {
                window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

// Function to initialize CSRF token
export const getCsrfToken = () => instance.get('/sanctum/csrf-cookie');

export default instance;