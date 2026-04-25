import api from './api.js';

export async function getProducts() {
  const response = await api.get('/products/');
  return response;
}

export async function getCategories() {
  const response = await api.get('/products/categories');
  return response;
}

export async function getInventory() {
  const response = await api.get('/inventory/');
  return response;
}

export async function getOrders() {
  const response = await api.get('/orders/');
  return response;
}

