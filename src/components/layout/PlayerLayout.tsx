import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const PlayerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans antialiased">
      <Header variant="compact" />
      <main className="flex-1 pt-16 pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout;
