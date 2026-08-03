import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../lib/routes';
import { UI_MESSAGES } from '../lib/messages';

export const NotFoundPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 - Không Tìm Thấy Trang | CineStream';
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(ROUTES.SEARCH(trimmed));
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-brand-surface border border-brand-surface-border p-8 rounded-3xl shadow-2xl animate-fade-in">
        {/* SVG Compass Illustration */}
        <div className="w-20 h-20 rounded-2xl bg-brand-surface-light border border-brand-surface-border text-brand-accent flex items-center justify-center mx-auto shadow-accent-glow">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-accent">
            Lỗi 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
            Không Tìm Thấy Trang Bạn Yêu Cầu
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Đường dẫn bạn truy cập không tồn tại, đã bị thay đổi hoặc gỡ bỏ khỏi hệ thống.
          </p>
        </div>

        {/* Inline Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Thử tìm kiếm tên phim..."
            aria-label="Tìm kiếm phim"
            className="w-full pl-9 pr-24 py-2.5 text-xs rounded-xl bg-brand-surface-light border border-brand-surface-border text-brand-text placeholder-brand-dim focus:outline-none focus:border-brand-accent"
          />
          <Search className="w-4 h-4 text-brand-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="absolute right-1 top-1 bottom-1 text-xs px-3"
          >
            Tìm
          </Button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            {UI_MESSAGES.BACK}
          </Button>
          <Link to={ROUTES.HOME} className="flex-1">
            <Button
              variant="primary"
              className="w-full"
              leftIcon={<Home className="w-4 h-4" />}
            >
              {UI_MESSAGES.GO_HOME}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
