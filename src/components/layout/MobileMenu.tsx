import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronRight, Film, Heart, History, Sun, Moon } from 'lucide-react';
import { MAIN_NAV_ITEMS } from '../../lib/constants';
import { Category, Country } from '../../types/movie';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../ui/Button';
import { ROUTES } from '../../lib/routes';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  countries: Country[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  categories,
  countries,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'countries'>('menu');
  const [search, setSearch] = useState('');
  const { theme, toggleTheme, bookmarks } = useAppStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      navigate(ROUTES.SEARCH(trimmed));
      setSearch('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end md:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Full-height Drawer */}
      <div className="relative w-full max-w-xs bg-brand-surface border-l border-brand-surface-border h-full flex flex-col z-10 p-5 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-surface-border">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-accent" />
            <span className="font-bold text-brand-text text-base">Menu Phim</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="p-1 rounded-lg text-brand-muted hover:text-white hover:bg-brand-surface-light"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="my-4 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm phim, diễn viên..."
            aria-label="Tìm kiếm phim"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-brand-surface-light border border-brand-surface-border text-brand-text placeholder-brand-dim focus:outline-none focus:border-brand-accent"
          />
          <Search className="w-4 h-4 text-brand-dim absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Theme Toggle & Quick Links Row */}
        <div className="flex flex-col gap-2 mb-4 p-2 bg-brand-surface-light/60 border border-brand-surface-border/50 rounded-xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Giao diện Sáng</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Giao diện Tối</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between border-t border-brand-surface-border/40 pt-2 px-1 text-xs">
            <Link
              to={ROUTES.HISTORY}
              onClick={onClose}
              className="flex items-center gap-1.5 text-indigo-400 font-medium hover:underline"
            >
              <History className="w-4 h-4" />
              <span>Lịch sử xem</span>
            </Link>

            <Link
              to={ROUTES.FAVORITES}
              onClick={onClose}
              className="flex items-center gap-1.5 text-brand-accent font-semibold hover:underline"
            >
              <Heart className="w-4 h-4 fill-brand-accent" />
              <span>Yêu thích ({bookmarks.length})</span>
            </Link>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex rounded-lg bg-brand-surface-light p-1 mb-4 border border-brand-surface-border/50 text-xs">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'menu' ? 'bg-brand-accent text-white' : 'text-brand-muted'
            }`}
          >
            Danh Mục
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'categories' ? 'bg-brand-accent text-white' : 'text-brand-muted'
            }`}
          >
            Thể Loại
          </button>
          <button
            onClick={() => setActiveTab('countries')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'countries' ? 'bg-brand-accent text-white' : 'text-brand-muted'
            }`}
          >
            Quốc Gia
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-1">
          {activeTab === 'menu' && (
            <div className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-surface-light"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-brand-dim" />
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-2 gap-1.5 py-1">
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={ROUTES.CATEGORY(cat.slug)}
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-brand-muted hover:text-brand-accent bg-brand-surface-light/40 hover:bg-brand-surface-light rounded-lg truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {activeTab === 'countries' && (
            <div className="grid grid-cols-2 gap-1.5 py-1">
              {countries.map((c) => (
                <Link
                  key={c._id || c.slug}
                  to={ROUTES.COUNTRY(c.slug)}
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-brand-muted hover:text-brand-accent bg-brand-surface-light/40 hover:bg-brand-surface-light rounded-lg truncate"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
