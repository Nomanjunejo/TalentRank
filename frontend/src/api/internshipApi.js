import client from './axiosClient';

export const listInternships = (params = {}) => client.get('/api/internships', { params });
export const getInternship = (id) => client.get(`/api/internships/${id}`);
export const myInternships = () => client.get('/api/internships/mine');
export const createInternship = (data) => client.post('/api/internships', data);
export const updateInternship = (id, data) => client.put(`/api/internships/${id}`, data);
export const deleteInternship = (id) => client.delete(`/api/internships/${id}`);
