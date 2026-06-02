import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyCandidate } from '../../api/candidateApi';
import { myApplications } from '../../api/applicationApi';
import { calcProfileCompletion } from '../../utils/helpers';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

export default function CandidateDashboard() {
  const [candidate, setCandidate] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, a] = await Promise.all([getMyCandidate(), myApplications()]);
        setCandidate(c.data);
        setApps(a.data);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  const completion = calcProfileCompletion(candidate);
  const hired = apps.filter((a) => a.status === 'Hired').length;
  const interviewing = apps.filter((a) => a.status === 'Interview Scheduled').length;
  const shortlisted = apps.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Hi, {candidate?.full_name} 👋</h1>
      <p className="text-slate-500 mt-1">Here's what's happening with your applications.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Applications" value={apps.length} icon="📨" />
        <StatCard label="Shortlisted" value={shortlisted} icon="⭐" />
        <StatCard label="Interviews" value={interviewing} icon="💬" />
        <StatCard label="Hired" value={hired} icon="🎉" />
      </div>

      {/* Profile completion */}
      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg dark:text-white">Profile Completion</h2>
            <p className="text-sm text-slate-500">A complete profile gets better matches.</p>
          </div>
          <Link to="/candidate/profile" className="btn-secondary text-sm">Edit Profile</Link>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Progress</span><span className="font-semibold">{completion}%</span></div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg dark:text-white">Recent Applications</h2>
          <Link to="/candidate/applications" className="text-sm text-brand-500 hover:underline">View All</Link>
        </div>
        {apps.length === 0 ? (
          <EmptyState title="No applications yet" message="Apply to internships to track them here." icon="📭"
            action={<Link to="/internships" className="btn-primary">Browse Internships</Link>} />
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {apps.slice(0, 5).map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium dark:text-white">{a.internship?.title}</div>
                  <div className="text-xs text-slate-500">{a.internship?.company?.company_name} · Match {a.match_percentage}%</div>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-5">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold dark:text-white">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
