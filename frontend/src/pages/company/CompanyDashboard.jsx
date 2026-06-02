import React, { useEffect, useState } from 'react';
import { myApplications } from '../../api/applicationApi';
import Spinner from '../../components/Spinner';
import StatusBadge from '../../components/StatusBadge';
import MatchBar from '../../components/MatchBar';
import EmptyState from '../../components/EmptyState';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/helpers';

export default function CandidateApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await myApplications();
        setApps(res.data);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">My Applications</h1>
      <p className="text-slate-500 mt-1">Track the progress of your applications</p>

      {apps.length === 0 ? (
        <div className="card p-8 mt-6">
          <EmptyState title="No applications yet" icon="📭" message="Start applying to internships to see them here."
            action={<Link to="/internships" className="btn-primary">Browse Internships</Link>} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {apps.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/internships/${a.internship?.id}`} className="font-semibold text-lg hover:text-brand-500 dark:text-white">
                    {a.internship?.title}
                  </Link>
                  <p className="text-sm text-slate-500">{a.internship?.company?.company_name} · {a.internship?.location}</p>
                  <p className="text-xs text-slate-400 mt-1">Applied {formatDate(a.applied_at)}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="mt-4">
                <MatchBar percent={a.match_percentage} />
              </div>
              {a.status === 'Hired' && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                  🎉 <span><strong>Congratulations!</strong> You've been hired!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
