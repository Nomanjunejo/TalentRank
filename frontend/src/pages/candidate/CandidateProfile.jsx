import React, { useEffect, useState } from 'react';
import { getMyCandidate, updateMyCandidate } from '../../api/candidateApi';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../components/Spinner';

export default function CandidateProfile() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '', bio: '', education: '', resume: '',
    profile_picture: '', github_url: '', linkedin_url: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyCandidate();
        const c = res.data;
        setForm({
          full_name: c.full_name || '',
          bio: c.bio || '',
          education: c.education || '',
          resume: c.resume || '',
          profile_picture: c.profile_picture || '',
          github_url: c.github_url || '',
          linkedin_url: c.linkedin_url || '',
        });
        setSkills((c.skills || []).map((s) => s.skill_name));
      } finally { setLoading(false); }
    })();
  }, []);

  // 🛠️ NEW: Function to handle image upload & convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Validate that the file is actually an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Optional: Check if file is too large (e.g., limit to 2MB to save database space)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image is too large. Please select an image smaller than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Set the Base64 string directly into the profile_picture state
      setForm((prev) => ({ ...prev, profile_picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (skills.map((s) => s.toLowerCase()).includes(v.toLowerCase())) {
      toast.info('Skill already added');
      return;
    }
    setSkills([...skills, v]);
    setSkillInput('');
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyCandidate({ ...form, skills });
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to save');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold dark:text-white">My Profile</h1>
      <p className="text-slate-500 mt-1">Keep your profile updated for better matches</p>

      <form onSubmit={save} className="card p-6 mt-6 space-y-5">
        
        {/* 🛠️ UPDATED PROFILE PICTURE SECTION */}
        <div className="flex items-center gap-4">
          <img
            src={form.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.full_name || 'U')}&background=3b6ef5&color=fff`}
            alt="Profile Preview" 
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" 
          />
          <div className="flex-1">
            <label className="label block mb-1">Change Profile Picture</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-200 cursor-pointer" 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Resume URL / Filename</label>
            <input className="input" value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} placeholder="resume.pdf or https://..." />
          </div>
        </div>

        <div>
          <label className="label">Bio / About</label>
          <textarea className="input min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell companies about yourself..." />
        </div>

        <div>
          <label className="label">Education</label>
          <textarea className="input min-h-[80px]" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="BSc Computer Science, XYZ University, 2024" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">GitHub URL</label>
            <input className="input" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="label">LinkedIn URL</label>
            <input className="input" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="flex gap-2">
            <input className="input" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press Enter (e.g. React)" />
            <button type="button" className="btn-secondary" onClick={addSkill}>Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.length === 0 && <span className="text-xs text-slate-400">No skills yet.</span>}
            {skills.map((s) => (
              <span key={s} className="skill-tag flex items-center gap-1">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="text-brand-700 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button className="btn-primary" disabled={saving}>
            {saving ? <Spinner size="sm" /> : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}