import axios from 'axios';
import { toast } from 'react-toastify';
import { interceptorLoadingElements } from '~/utils/formatters';
let authorizeAxiosInstance = axios.create();

// Maximum time for 1 request is 10 minutes
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10; // 10 minutes

authorizeAxiosInstance.defaults.withCredentials = true;

// Interceptor Request: intervenes between API requests and the server
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    //Block spam clicks on buttons
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

//  Interceptor Response: intervenes between API responses and the client
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    //Block spam clicks on buttons
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    //Block spam clicks on buttons
    interceptorLoadingElements(false);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let errorMessage = error?.message;
    if (error?.response?.data?.message) {
      errorMessage = error?.response?.data?.message;
    }

    //Using toastify to display error messages - except error 410 - GONE
    if (error?.response?.status !== 410) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default authorizeAxiosInstance;
