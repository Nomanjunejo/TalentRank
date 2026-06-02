import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInternship } from '../api/internshipApi';
import { applyInternship } from '../api/applicationApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';
import { formatDate } from '../utils/helpers';

export default function InternshipDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getInternship(id);
        setInternship(res.data);
      } catch { toast.error('Failed to load internship'); }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line
  }, [id]);

  const apply = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'candidate') { toast.error('Only candidates can apply'); return; }
    setApplying(true);
    try {
      const res = await applyInternship(parseInt(id));
      toast.success(`Applied! Your match: ${res.data.match_percentage}%`);
      navigate('/candidate/applications');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to apply');
    } finally { setApplying(false); }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;
  if (!internship) return <div className="py-20 text-center">Internship not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">{internship.title}</h1>
            <p className="text-slate-500 mt-1">
              {internship.company?.company_name} · {internship.location} · {internship.internship_type}
            </p>
            <p className="text-xs text-slate-400 mt-1">Posted {formatDate(internship.created_at)}</p>
          </div>
          {(!user || user.role === 'candidate') && (
            <button onClick={apply} disabled={applying} className="btn-primary">
              {applying ? <Spinner size="sm" /> : 'Apply Now'}
            </button>
          )}
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2 dark:text-white">About the role</h2>
          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{internship.description || 'No description provided.'}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2 dark:text-white">Required Skills</h2>
          {internship.required_skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {internship.required_skills.map((s) => <span key={s.id} className="skill-tag">{s.skill_name}</span>)}
            </div>
          ) : <p className="text-sm text-slate-500">No specific skills listed.</p>}
        </div>

        {internship.company?.description && (
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <h2 className="font-semibold text-lg mb-2 dark:text-white">About {internship.company.company_name}</h2>
            <p className="text-slate-600 dark:text-slate-300">{internship.company.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
