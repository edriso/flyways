import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://flight-api-placeholder.com/api',
});
