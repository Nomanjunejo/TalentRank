import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDark = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('tr_dark', isDark ? '1' : '0');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white">T</div>
          <span className="text-slate-800 dark:text-white">Talent<span className="text-brand-500">Rank</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/internships" className="text-sm font-medium hover:text-brand-500">Internships</Link>
          {user && user.role === 'candidate' && (
            <>
              <Link to="/candidate/dashboard" className="text-sm font-medium hover:text-brand-500">Dashboard</Link>
              <Link to="/candidate/applications" className="text-sm font-medium hover:text-brand-500">My Applications</Link>
              <Link to="/candidate/profile" className="text-sm font-medium hover:text-brand-500">Profile</Link>
            </>
          )}
          {user && user.role === 'company' && (
            <>
              <Link to="/company/dashboard" className="text-sm font-medium hover:text-brand-500">Dashboard</Link>
              <Link to="/company/internships" className="text-sm font-medium hover:text-brand-500">My Internships</Link>
              <Link to="/company/pipeline" className="text-sm font-medium hover:text-brand-500">Pipeline</Link>
            </>
          )}
          <button onClick={toggleDark} className="text-sm px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">🌓</button>
          {user ? (
            <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary text-sm">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 px-4 py-3 space-y-2 bg-white dark:bg-slate-800">
          <Link onClick={() => setOpen(false)} to="/internships" className="block py-1">Internships</Link>
          {user?.role === 'candidate' && (
            <>
              <Link onClick={() => setOpen(false)} to="/candidate/dashboard" className="block py-1">Dashboard</Link>
              <Link onClick={() => setOpen(false)} to="/candidate/applications" className="block py-1">My Applications</Link>
              <Link onClick={() => setOpen(false)} to="/candidate/profile" className="block py-1">Profile</Link>
            </>
          )}
          {user?.role === 'company' && (
            <>
              <Link onClick={() => setOpen(false)} to="/company/dashboard" className="block py-1">Dashboard</Link>
              <Link onClick={() => setOpen(false)} to="/company/internships" className="block py-1">My Internships</Link>
              <Link onClick={() => setOpen(false)} to="/company/pipeline" className="block py-1">Pipeline</Link>
            </>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            {user ? (
              <button onClick={() => { logout(); setOpen(false); navigate('/'); }} className="btn-secondary w-full">Logout</button>
            ) : (
              <div className="flex gap-2">
                <Link onClick={() => setOpen(false)} to="/login" className="btn-secondary flex-1 text-center">Login</Link>
                <Link onClick={() => setOpen(false)} to="/register" className="btn-primary flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
