import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

export default function InternshipCard({ internship }) {
  return (
    <div className="card p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{internship.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {internship.company?.company_name || 'Company'} • {internship.location}
          </p>
        </div>
        <span className="badge bg-brand-50 text-brand-700">{internship.internship_type}</span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
        {internship.description || 'No description provided.'}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {(internship.required_skills || []).slice(0, 5).map((s) => (
          <span key={s.id} className="skill-tag">{s.skill_name}</span>
        ))}
        {(internship.required_skills || []).length > 5 && (
          <span className="text-xs text-slate-400 self-center">+{internship.required_skills.length - 5} more</span>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
        <span className="text-xs text-slate-400">Posted {formatDate(internship.created_at)}</span>
        <Link to={`/internships/${internship.id}`} className="btn-primary text-sm">View Details</Link>
      </div>
    </div>
  );
}
