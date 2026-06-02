import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 via-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
              Smarter Internship Hiring with <span className="text-yellow-300">AI-Powered Matching</span>
            </h1>
            <p className="mt-5 text-lg text-white/90 max-w-xl">
              TalentRank ranks candidates automatically by skill match — helping startups hire faster and helping students get discovered.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100">Get Started Free</Link>
              <Link to="/internships" className="border border-white/40 px-6 py-3 rounded-lg font-semibold hover:bg-white/10">Browse Internships</Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <div className="bg-white text-slate-800 rounded-xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Frontend Intern</div>
                    <div className="text-xs text-slate-500">Acme Corp · Remote</div>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-700">92% Match</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }} /></div>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  <span className="skill-tag">React</span><span className="skill-tag">Tailwind</span><span className="skill-tag">JS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-3 dark:text-white">Built for modern hiring teams</h2>
        <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">From posting an internship to hiring the right candidate — TalentRank automates the boring parts.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Auto Skill Matching', desc: 'Applications are scored & ranked automatically based on required vs candidate skills.' },
            { icon: '📋', title: 'Hiring Pipeline', desc: 'Track applicants through every stage — Applied, Shortlisted, Interview, Hired.' },
            { icon: '⚡', title: 'Fast & Modern', desc: 'A snappy SaaS-style dashboard built for both companies and candidates.' },
          ].map((f) => (
            <div key={f.title} className="card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg dark:text-white">{f.title}</h3>
              <p className="text-slate-500 text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
