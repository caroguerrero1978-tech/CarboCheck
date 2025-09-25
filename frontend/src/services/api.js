import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const analyzeFood = async (imageUri) => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri.uri,
    type: 'image/jpeg',
    name: 'food.jpg',
  });

  const response = await api.post('/food/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const searchFood = async (name) => {
  const response = await api.get(`/food/search?name=${name}`);
  return response.data;
};
