import React, { useEffect, useState } from 'react';
import { allCompanyApplications, updateApplicationStatus } from '../../api/applicationApi';
import Spinner from '../../components/Spinner';
import { useToast } from '../../context/ToastContext';
import { STATUSES, statusColor } from '../../utils/helpers';
import EmptyState from '../../components/EmptyState';

export default function HiringPipeline() {
  const toast = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await allCompanyApplications(); setApps(res.data); }
      finally { setLoading(false); }
    })();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  if (apps.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold dark:text-white">Hiring Pipeline</h1>
        <div className="card p-8 mt-6"><EmptyState title="No applications yet" icon="📊" /></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Hiring Pipeline</h1>
      <p className="text-slate-500 mt-1">Drag-free kanban view of every applicant across all roles.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {STATUSES.map((status) => {
          const list = apps.filter((a) => a.status === status);
          return (
            <div key={status} className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`badge ${statusColor(status)}`}>{status}</span>
                <span className="text-xs text-slate-400">{list.length}</span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {list.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Empty</p>}
                {list.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                    <div className="font-medium text-sm dark:text-white">{a.candidate?.full_name}</div>
                    <div className="text-xs text-slate-500">{a.internship?.title}</div>
                    <div className="text-xs mt-1 font-semibold text-brand-500">{a.match_percentage}% match</div>
                    <select className="input py-1 text-xs mt-2" value={a.status} onChange={(e) => changeStatus(a.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
