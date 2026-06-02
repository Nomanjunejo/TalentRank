import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} TalentRank — Smart Internship Hiring Platform
      </div>
    </footer>
  );
}
