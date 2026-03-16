import api from './axios';

export const getAllCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// Новые функции для админ-панели
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Функции для подкатегорий
export const getAllSubcategories = () => api.get('/subcategories');
export const getSubcategoriesByCategoryId = (categoryId) => 
  api.get(`/subcategories/by-category/${categoryId}`);
export const createSubcategory = (data) => api.post('/subcategories', data);
export const updateSubcategory = (id, data) => api.put(`/subcategories/${id}`, data);
export const deleteSubcategory = (id) => api.delete(`/subcategories/${id}`);