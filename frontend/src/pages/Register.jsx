import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'candidate' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await register(form);
      toast.success('Account created!');
      navigate(u.role === 'candidate' ? '/candidate/profile' : '/company/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">Create your account</h1>
        <p className="text-sm text-slate-500 mb-6">Join TalentRank in 30 seconds</p>

        <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
          {['candidate', 'company'].map((r) => (
            <button key={r} type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`py-2 rounded-md text-sm font-medium transition ${form.role === r ? 'bg-white dark:bg-slate-800 shadow text-brand-600' : 'text-slate-600 dark:text-slate-300'}`}>
              {r === 'candidate' ? '👤 Candidate' : '🏢 Company'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">{form.role === 'candidate' ? 'Full Name' : 'Company Name'}</label>
            <input className="input" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <p className="text-xs text-slate-400 mt-1">At least 6 characters</p>
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-brand-500 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
