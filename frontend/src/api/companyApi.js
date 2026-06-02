import client from './axiosClient';

export const getMyCompany = () => client.get('/api/companies/me');
export const updateMyCompany = (data) => client.put('/api/companies/me', data);
