import React from 'react';
import { useParams } from 'react-router-dom';

export const ListPage: React.FC = () => {
  const { typeSlug } = useParams<{ typeSlug: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Danh Sách Phim</h1>
      <p className="text-sm text-brand-muted">Loại danh sách: <code className="text-brand-accent">{typeSlug}</code></p>
    </div>
  );
};
