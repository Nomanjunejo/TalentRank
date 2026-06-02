import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { bootstrap } = useAuth();

  useEffect(() => {
    // Apply persisted dark mode
    const dark = localStorage.getItem('tr_dark') === '1';
    if (dark) document.documentElement.classList.add('dark');
    bootstrap();
    // eslint-disable-next-line
  }, []);

  return <AppRoutes />;
}
