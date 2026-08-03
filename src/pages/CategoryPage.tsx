import React from 'react';
import { useParams } from 'react-router-dom';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Thể Loại Phim</h1>
      <p className="text-sm text-brand-muted">Mã thể loại: <code className="text-brand-accent">{slug}</code></p>
    </div>
  );
};
