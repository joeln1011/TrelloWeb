import axios from 'axios';
import { toast } from 'react-toastify';
import { refreshTokenAPI } from '~/apis';
import { logoutUserAPI } from '~/redux/user/userSlice';
import { interceptorLoadingElements } from '~/utils/formatters';

let axiosReduxStore;
export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

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

let refreshTokenPromise = null;

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

    // If the error is 401 (Unauthorized), it means the token has expired
    if (error?.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    // If the error is 410 (Gone), call the api to refresh the accessToken
    const originalRequest = error.config;
    if (error?.response?.status === 410 && !originalRequest._retry) {
      // originalRequest._retry = true only get refresh token 1 time at a time
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // accessToken alredy updated in httpOnly cookie
            return data?.accessToken;
          })

          .catch((_error) => {
            // IF refresh token fails, logout the user
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            // Reset the refreshTokenPromise to null so it can be called again
            refreshTokenPromise = null;
          });
      }
      // Need to return the refreshTokenPromise to ensure that the next request waits for the token to be refreshed
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        // Return axios instance again and original request to call fail apis again
        return authorizeAxiosInstance(originalRequest);
      });
    }

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
