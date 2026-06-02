import client from './axiosClient';

export const applyInternship = (internship_id) => client.post('/api/applications', { internship_id });
export const myApplications = () => client.get('/api/applications/mine');
export const applicantsForInternship = (id) => client.get(`/api/applications/internship/${id}`);
export const allCompanyApplications = () => client.get('/api/applications/company/all');
export const updateApplicationStatus = (id, status) =>
  client.patch(`/api/applications/${id}/status`, { status });
