import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicantsForInternship, updateApplicationStatus } from '../../api/applicationApi';
import { getInternship } from '../../api/internshipApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/Spinner';
import MatchBar from '../../components/MatchBar';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { STATUSES } from '../../utils/helpers';

export default function Applicants() {
  const { id } = useParams();
  const toast = useToast();
  const [internship, setInternship] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = async () => {
    setLoading(true);
    try {
      const [i, a] = await Promise.all([getInternship(id), applicantsForInternship(id)]);
      setInternship(i.data);
      setApps(a.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const changeStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  const filtered = filter === 'All' ? apps : apps.filter((a) => a.status === filter);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link to="/company/internships" className="text-sm text-brand-500 hover:underline">← Back to internships</Link>
          <h1 className="text-3xl font-bold mt-1 dark:text-white">Applicants for {internship?.title}</h1>
          <p className="text-slate-500 mt-1">Ranked by skill match · {apps.length} total</p>
        </div>
        <select className="input max-w-[200px]" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 mt-6">
          <EmptyState title="No applicants yet" icon="👥" />
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {filtered.map((a, idx) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">#{idx + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg dark:text-white">{a.candidate?.full_name}</div>
                    <div className="text-sm text-slate-500">{a.candidate?.bio?.slice(0, 100) || 'No bio'}</div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(a.candidate?.skills || []).map((s) => <span key={s.id} className="skill-tag text-xs">{s.skill_name}</span>)}
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-slate-500">
                      {a.candidate?.github_url && <a href={a.candidate.github_url} target="_blank" rel="noreferrer" className="hover:text-brand-500">GitHub ↗</a>}
                      {a.candidate?.linkedin_url && <a href={a.candidate.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-brand-500">LinkedIn ↗</a>}
                      {a.candidate?.resume && <span>📄 {a.candidate.resume}</span>}
                    </div>
                  </div>
                </div>
                <div className="md:w-64">
                  <MatchBar percent={a.match_percentage} />
                  <div className="mt-3 flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    <select className="input py-1 text-xs flex-1" value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
