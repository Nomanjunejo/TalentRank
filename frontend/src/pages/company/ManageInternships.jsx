import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myInternships, deleteInternship } from '../../api/internshipApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function ManageInternships() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await myInternships();
      setItems(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this internship and all its applications?')) return;
    try {
      await deleteInternship(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-3xl font-bold dark:text-white">Manage Internships</h1>
        <Link to="/company/post" className="btn-primary">+ Post Internship</Link>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 mt-6">
          <EmptyState title="No internships yet" icon="📋"
            action={<Link to="/company/post" className="btn-primary">Post Your First</Link>} />
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Skills</th>
                <th className="text-left px-4 py-3">Posted</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium dark:text-white">{i.title}</td>
                  <td className="px-4 py-3 text-slate-500">{i.location}</td>
                  <td className="px-4 py-3 text-slate-500">{i.internship_type}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {i.required_skills.slice(0, 3).map((s) => <span key={s.id} className="skill-tag text-xs">{s.skill_name}</span>)}
                      {i.required_skills.length > 3 && <span className="text-xs text-slate-400 self-center">+{i.required_skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(i.created_at)}</td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    <Link to={`/company/internships/${i.id}/applicants`} className="text-brand-500 hover:underline text-sm">Applicants</Link>
                    <button onClick={() => remove(i.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
