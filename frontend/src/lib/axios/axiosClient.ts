import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthTokenFromStorage } from "../utils/auth";

abstract class AxiosClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      (config) => {
        // Get token from Redux Persist storage
        const token = getAuthTokenFromStorage();
        
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  private _handleResponse = ({ data }: AxiosResponse): any => data;

  protected _handleError = (error: AxiosError): Promise<AxiosError> => {
    // Handle 401 errors (unauthorized)
    // The auth slice will handle clearing the state via Redux
    // Redux Persist will automatically clear persisted state when auth state is cleared
    if (error.response?.status === 401) {
      // You can dispatch logout action here if needed, but it's better
      // to handle this in the component that receives the error
    }
    return Promise.reject(error);
  };
}

export default AxiosClient;
