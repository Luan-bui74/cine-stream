import axios, { AxiosError } from 'axios';
import { DEFAULT_API_BASE_URL } from '../lib/constants';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aliases for compatibility
export const axiosInstance = client;
export const apiClient = client;

// Response Interceptor for Error Standardization
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let message = 'Đã xảy ra lỗi khi kết nối tới máy chủ.';
    if (error.response) {
      message = `Lỗi máy chủ (${error.response.status}): Không thể lấy dữ liệu phim.`;
    } else if (error.request) {
      message = 'Không thể kết nối đến máy chủ API Phim. Vui lòng kiểm tra lại kết nối mạng.';
    }
    return Promise.reject(new Error(message));
  }
);

export type { AxiosError };
