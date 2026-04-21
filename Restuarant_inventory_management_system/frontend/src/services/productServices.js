// Product services
import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

export const getInventory = async () => {
  const response = await api.get('/inventory/');
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};
