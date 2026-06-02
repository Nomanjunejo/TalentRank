import React from 'react';

export default function MatchBar({ percent = 0 }) {
  const color =
    percent >= 75 ? 'bg-emerald-500' :
    percent >= 50 ? 'bg-amber-500' : 'bg-red-400';
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">Skill Match</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
