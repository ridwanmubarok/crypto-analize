import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { logOnDev } from "@/utils/logger";
import { env } from '@/config/env.mjs';

const Client = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    withCredentials: false,
  },
});

Client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = 'Bearer '+token
      }
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});
const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  logOnDev(
    `🚀 [API REQRES] ${method?.toUpperCase()} ${url} | Response ${status}`
  );
  return response;
};

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const { status } = (error.response as AxiosResponse) ?? {};

    if (status === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.clear()
        window.location.href = '/auth/signin'
      }
    }
    logOnDev(
      `🚨 [API REQRES] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
    );

    switch (status) {
      case 401: {
        // "Login required"
        break;
      }
      case 403: {
        // "Permission denied"
        break;
      }
      case 404: {
        // "Invalid request"
        break;
      }
      case 500: {
        // "Server error"
        break;
      }
      default: {
        // "Unknown error occurred"
        break;
      }
    }
  } else {
    logOnDev(`🚨 [API REQRES] | Error ${error.message}`);
  }
  return Promise.reject(error);
};

Client.interceptors.response.use(onResponse, onErrorResponse);

export default Client;