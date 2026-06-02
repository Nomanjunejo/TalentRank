export const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const statusColor = (status) => {
  switch (status) {
    case 'Applied': return 'bg-slate-100 text-slate-700';
    case 'Under Review': return 'bg-amber-100 text-amber-700';
    case 'Shortlisted': return 'bg-blue-100 text-blue-700';
    case 'Interview Scheduled': return 'bg-indigo-100 text-indigo-700';
    case 'Keep Improving': return 'bg-orange-100 text-orange-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    case 'Hired': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export const STATUSES = [
  'Applied', 'Under Review', 'Shortlisted',
  'Interview Scheduled', 'Keep Improving', 'Rejected', 'Hired',
];

export const calcProfileCompletion = (c) => {
  if (!c) return 0;
  const checks = [
    !!c.full_name, !!c.bio, !!c.education, !!c.resume,
    !!c.profile_picture, !!c.github_url, !!c.linkedin_url,
    (c.skills || []).length > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
};
