import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your API base URL
});

export default axiosInstance;