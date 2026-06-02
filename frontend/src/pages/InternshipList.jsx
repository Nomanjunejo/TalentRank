import React, { useEffect, useState } from 'react';
import { listInternships } from '../api/internshipApi';
import InternshipCard from '../components/InternshipCard';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';

export default function InternshipList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [page, setPage] = useState(0);
  const limit = 9;

  const load = async () => {
    setLoading(true);
    try {
      const res = await listInternships({ search: search || undefined, skill: skill || undefined, skip: page * limit, limit });
      setItems(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  const onSubmit = (e) => { e.preventDefault(); setPage(0); load(); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Browse Internships</h1>
      <p className="text-slate-500 mt-1">Find the perfect internship match</p>

      <form onSubmit={onSubmit} className="card p-4 mt-6 grid md:grid-cols-[1fr_1fr_auto] gap-3">
        <input className="input" placeholder="Search title, location, description..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input className="input" placeholder="Filter by skill (e.g. React)" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <button className="btn-primary">Search</button>
      </form>

      <div className="mt-6">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="skeleton h-5 w-2/3 mb-3" />
                <div className="skeleton h-3 w-1/2 mb-4" />
                <div className="skeleton h-3 w-full mb-2" />
                <div className="skeleton h-3 w-5/6" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No internships found" message="Try adjusting your filters." icon="🔍" />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((i) => <InternshipCard key={i.id} internship={i} />)}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <button className="btn-secondary" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>← Previous</button>
              <span className="px-4 py-2 text-sm">Page {page + 1}</span>
              <button className="btn-secondary" disabled={items.length < limit} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
