import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <div className="text-7xl mb-3">🤷‍♂️</div>
      <h1 className="text-3xl font-bold dark:text-white">404 — Not Found</h1>
      <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Go Home</Link>
    </div>
  );
}
