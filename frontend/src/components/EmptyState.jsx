import React from 'react';

export default function EmptyState({ title = 'Nothing here yet', message = '', action = null, icon = '📭' }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
