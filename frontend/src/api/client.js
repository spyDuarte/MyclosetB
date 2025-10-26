import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchDashboard = () => client.get('/dashboard').then((res) => res.data);
export const createItem = (payload) => client.post('/items', payload).then((res) => res.data);
export const fetchItems = (params = {}) => client.get('/items', { params }).then((res) => res.data);
export const createLook = (payload) => client.post('/looks', payload).then((res) => res.data);

export default client;
