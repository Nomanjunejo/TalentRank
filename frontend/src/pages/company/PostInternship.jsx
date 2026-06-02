import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInternship } from '../../api/internshipApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/Spinner';

export default function PostInternship() {
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({
    title: '', description: '', location: 'Remote', internship_type: 'Full-time',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.map((s) => s.toLowerCase()).includes(v.toLowerCase())) return;
    setSkills([...skills, v]);
    setSkillInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (skills.length === 0) { toast.error('Add at least one required skill'); return; }
    setSaving(true);
    try {
      await createInternship({ ...form, required_skills: skills });
      toast.success('Internship posted!');
      navigate('/company/internships');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to post');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Post a New Internship</h1>
      <p className="text-slate-500 mt-1">Reach top candidates ranked by skill match.</p>

      <form onSubmit={submit} className="card p-6 mt-6 space-y-5">
        <div>
          <label className="label">Title *</label>
          <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Developer Intern" />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Role description, responsibilities, requirements..." />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote, New York, Bengaluru" />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.internship_type} onChange={(e) => setForm({ ...form, internship_type: e.target.value })}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Required Skills *</label>
          <div className="flex gap-2">
            <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="e.g. React, FastAPI, PostgreSQL" />
            <button type="button" className="btn-secondary" onClick={addSkill}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((s) => (
              <span key={s} className="skill-tag flex items-center gap-1">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-brand-700 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn-primary" disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  );
}
