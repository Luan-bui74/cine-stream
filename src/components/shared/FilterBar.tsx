import React, { useState } from 'react';
import { Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { Category, Country } from '../../types/movie';
import { Button } from '../ui/Button';
import { START_YEAR, LANG_OPTIONS, SORT_OPTIONS } from '../../lib/constants';
import { UI_MESSAGES } from '../../lib/messages';

export interface FilterState {
  category?: string;
  country?: string;
  year?: string;
  lang?: string;
  sortField?: string;
  sortType?: 'asc' | 'desc';
}

export interface FilterBarProps {
  categories: Category[];
  countries: Country[];
  selectedFilters: FilterState;
  onChange: (filters: FilterState) => void;
  lockedFilter?: 'category' | 'country';
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i)
);

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  countries,
  selectedFilters,
  onChange,
  lockedFilter,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const hasActiveFilters =
    (lockedFilter !== 'category' && Boolean(selectedFilters.category)) ||
    (lockedFilter !== 'country' && Boolean(selectedFilters.country)) ||
    Boolean(selectedFilters.year) ||
    Boolean(selectedFilters.lang) ||
    Boolean(selectedFilters.sortField);

  const handleReset = () => {
    onChange({
      category: lockedFilter === 'category' ? selectedFilters.category : '',
      country: lockedFilter === 'country' ? selectedFilters.country : '',
      year: '',
      lang: '',
      sortField: 'modified.time',
      sortType: 'desc',
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onChange({
      ...selectedFilters,
      [key]: value,
    });
  };

  const renderFilterControls = (isMobile = false) => (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-5 gap-3'}`}>
      {/* Category Select */}
      {lockedFilter !== 'category' && (
        <div>
          <label className="block text-[11px] font-semibold text-brand-dim mb-1 uppercase tracking-wider">
            Thể Loại
          </label>
          <select
            aria-label="Chọn thể loại"
            value={selectedFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full bg-brand-surface-light border border-brand-surface-border text-brand-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((c) => (
              <option key={c._id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Country Select */}
      {lockedFilter !== 'country' && (
        <div>
          <label className="block text-[11px] font-semibold text-brand-dim mb-1 uppercase tracking-wider">
            Quốc Gia
          </label>
          <select
            aria-label="Chọn quốc gia"
            value={selectedFilters.country || ''}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className="w-full bg-brand-surface-light border border-brand-surface-border text-brand-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
          >
            <option value="">Tất cả quốc gia</option>
            {countries.map((c) => (
              <option key={c._id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Year Select */}
      <div>
        <label className="block text-[11px] font-semibold text-brand-dim mb-1 uppercase tracking-wider">
          Năm Phát Hành
        </label>
        <select
          aria-label="Chọn năm phát hành"
          value={selectedFilters.year || ''}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="w-full bg-brand-surface-light border border-brand-surface-border text-brand-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
        >
          <option value="">Tất cả các năm</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      {/* Language Select */}
      <div>
        <label className="block text-[11px] font-semibold text-brand-dim mb-1 uppercase tracking-wider">
          Ngôn Ngữ
        </label>
        <select
          aria-label="Chọn ngôn ngữ"
          value={selectedFilters.lang || ''}
          onChange={(e) => handleFilterChange('lang', e.target.value)}
          className="w-full bg-brand-surface-light border border-brand-surface-border text-brand-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
        >
          {LANG_OPTIONS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Select */}
      <div>
        <label className="block text-[11px] font-semibold text-brand-dim mb-1 uppercase tracking-wider">
          Sắp Xếp
        </label>
        <select
          aria-label="Chọn tiêu chí sắp xếp"
          value={`${selectedFilters.sortField || 'modified.time'}:${selectedFilters.sortType || 'desc'}`}
          onChange={(e) => {
            const [field, type] = e.target.value.split(':');
            onChange({
              ...selectedFilters,
              sortField: field,
              sortType: type as 'asc' | 'desc',
            });
          }}
          className="w-full bg-brand-surface-light border border-brand-surface-border text-brand-text text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={`${s.field}:${s.type}`} value={`${s.field}:${s.type}`}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      {/* Desktop Filter Panel */}
      <div className="hidden md:block bg-brand-surface border border-brand-surface-border p-4 sm:p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-brand-surface-border/40">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-accent" />
            <h3 className="font-bold text-sm text-brand-text">Bộ Lọc Phim</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-brand-accent hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{UI_MESSAGES.RESET_FILTERS}</span>
            </button>
          )}
        </div>
        {renderFilterControls(false)}
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex items-center justify-between gap-3 bg-brand-surface border border-brand-surface-border p-3 rounded-xl">
        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-between"
          leftIcon={<SlidersHorizontal className="w-4 h-4 text-brand-accent" />}
          onClick={() => setMobileDrawerOpen(true)}
        >
          <span>Bộ Lọc Phim</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Mobile Drawer / Bottom Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-brand-surface border-t sm:border border-brand-surface-border rounded-t-2xl sm:rounded-2xl p-5 z-10 max-h-[85vh] overflow-y-auto space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-surface-border">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-brand-accent" />
                <h3 className="font-bold text-base text-brand-text">Bộ Lọc Phim</h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-brand-muted hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {renderFilterControls(true)}

            <div className="pt-3 border-t border-brand-surface-border flex items-center gap-3">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleReset();
                    setMobileDrawerOpen(false);
                  }}
                >
                  {UI_MESSAGES.RESET_FILTERS}
                </Button>
              )}
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Áp Dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
