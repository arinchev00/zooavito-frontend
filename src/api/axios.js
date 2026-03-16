import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081/v1/api', // ваш бэкенд
  timeout: 10000,
  // ❌ УДАЛИТЕ эту строку:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Добавляем токен к каждому запросу
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url); // для отладки
    
    // ✅ НЕ устанавливайте Content-Type принудительно!
    // Пусть axios сам решает, какой Content-Type нужен
    // для FormData это будет multipart/form-data с правильной границей
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обрабатываем ответы
instance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status); // для отладки
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;