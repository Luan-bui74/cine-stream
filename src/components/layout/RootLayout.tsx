import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text font-sans antialiased">
      <Header variant="full" />
      <main className="flex-1 pt-20 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Backwards compatibility default export & named export
export default RootLayout;
