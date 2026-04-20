import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Use o IP que você encontrou no CMD
  baseURL: 'http://192.168.15.8:3000/api', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@appscholar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;