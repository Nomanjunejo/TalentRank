import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import InternshipList from '../pages/InternshipList';
import InternshipDetails from '../pages/InternshipDetails';
import NotFound from '../pages/NotFound';

import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import CandidateProfile from '../pages/candidate/CandidateProfile';
import CandidateApplications from '../pages/candidate/CandidateApplications';

import CompanyDashboard from '../pages/company/CompanyDashboard';
import PostInternship from '../pages/company/PostInternship';
import ManageInternships from '../pages/company/ManageInternships';
import Applicants from '../pages/company/Applicants';
import HiringPipeline from '../pages/company/HiringPipeline';

export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/internships" element={<InternshipList />} />
        <Route path="/internships/:id" element={<InternshipDetails />} />

        {/* Candidate */}
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
        } />
        <Route path="/candidate/profile" element={
          <ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute role="candidate"><CandidateApplications /></ProtectedRoute>
        } />

        {/* Company */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>
        } />
        <Route path="/company/post" element={
          <ProtectedRoute role="company"><PostInternship /></ProtectedRoute>
        } />
        <Route path="/company/internships" element={
          <ProtectedRoute role="company"><ManageInternships /></ProtectedRoute>
        } />
        <Route path="/company/internships/:id/applicants" element={
          <ProtectedRoute role="company"><Applicants /></ProtectedRoute>
        } />
        <Route path="/company/pipeline" element={
          <ProtectedRoute role="company"><HiringPipeline /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}
