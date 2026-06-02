import client from './axiosClient';

export const registerApi = (data) => client.post('/api/auth/register', data);
export const loginApi = (data) => client.post('/api/auth/login', data);
export const meApi = () => client.get('/api/auth/me');
