import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { searchMovies } from '../../api';
import { MovieSummary } from '../../types/movie';
import { resolveImage } from '../../lib/utils';
import { ROUTES } from '../../lib/routes';
import { TIMING } from '../../lib/constants';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (keyword: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm phim, diễn viên...',
  className = '',
  onSearchSubmit,
}) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Auto-complete Suggestion API call
  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const res = await searchMovies(trimmed, 1);
      if (res.success && res.data.items) {
        setSuggestions(res.data.items.slice(0, 5));
      } else {
        setSuggestions([]);
      }
      setLoading(false);
    }, TIMING.DEBOUNCE_SEARCH_MS);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [keyword]);

  // Hide dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      setShowDropdown(false);
      if (onSearchSubmit) {
        onSearchSubmit(trimmed);
      } else {
        navigate(ROUTES.SEARCH(trimmed));
      }
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    setShowDropdown(false);
    setKeyword('');
    navigate(ROUTES.MOVIE(slug));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-brand-surface-light border border-brand-surface-border text-brand-text placeholder-brand-dim focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
        />
        <Search className="w-4 h-4 text-brand-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
        {keyword && (
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dim hover:text-brand-text"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </form>

      {/* Auto-complete Dropdown */}
      {showDropdown && keyword.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-brand-surface border border-brand-surface-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
          {loading ? (
            <div className="p-4 text-center text-xs text-brand-muted flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
              <span>Đang tìm kiếm...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-brand-surface-border/40">
              {suggestions.map((movie) => (
                <button
                  key={movie._id || movie.slug}
                  onClick={() => handleSelectSuggestion(movie.slug)}
                  className="w-full p-2.5 flex items-center gap-3 hover:bg-brand-surface-light text-left transition-colors cursor-pointer"
                >
                  <img
                    src={resolveImage(movie.poster_url)}
                    alt={movie.name}
                    className="w-8 h-11 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-brand-text truncate">
                      {movie.name}
                    </h4>
                    <p className="text-[11px] text-brand-muted truncate italic">
                      {movie.origin_name}
                    </p>
                    <span className="text-[10px] text-brand-accent font-semibold">
                      {movie.year || 2024}
                    </span>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full py-2 text-center text-xs font-bold text-brand-accent hover:bg-brand-surface-light transition-colors"
              >
                Xem tất cả kết quả cho &quot;{keyword}&quot; &rarr;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-brand-muted">
              Không tìm thấy phim phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
};
