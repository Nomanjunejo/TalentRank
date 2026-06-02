import client from './axiosClient';

export const getMyCandidate = () => client.get('/api/candidates/me');
export const updateMyCandidate = (data) => client.put('/api/candidates/me', data);
export const getCandidate = (id) => client.get(`/api/candidates/${id}`);
