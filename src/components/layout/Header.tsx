import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Film,
  Search,
  Heart,
  History,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  ArrowLeft,
} from "lucide-react";
import { MAIN_NAV_ITEMS } from "../../lib/constants";
import { ROUTES } from "../../lib/routes";
import { useAppStore } from "../../store/AppContext";
import { getCategories, getCountries } from "../../api";
import { Category, Country } from "../../types/movie";
import { MobileMenu } from "./MobileMenu";

export interface HeaderProps {
  variant?: "full" | "compact";
}

export const Header: React.FC<HeaderProps> = ({ variant = "full" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<
    "cat" | "country" | null
  >(null);

  const { theme, toggleTheme, bookmarks } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (variant === "full") {
      getCategories().then((res) => {
        if (res.success && Array.isArray(res.data)) setCategories(res.data);
      });
      getCountries().then((res) => {
        if (res.success && Array.isArray(res.data)) setCountries(res.data);
      });
    }
  }, [variant]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(ROUTES.SEARCH(trimmed));
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-brand-surface/95 backdrop-blur-md border-b border-brand-surface-border py-2.5 shadow-xl"
            : "bg-gradient-to-b from-brand-bg via-brand-bg/85 to-transparent py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            {variant === "compact" && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surface-light transition-colors"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-accent flex items-center justify-center text-white shadow-accent-glow group-hover:scale-105 transition-transform duration-200">
                <Film className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-brand-text flex items-center gap-1">
                  Cine<span className="text-brand-accent">Stream</span>
                </span>
                {variant === "full" && (
                  <span className="text-[9px] font-medium text-brand-muted -mt-1 tracking-wider uppercase">
                    Vietsub HD
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {variant === "full" && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {MAIN_NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-brand-accent bg-brand-accent/10 font-semibold"
                        : "text-brand-muted hover:text-brand-text hover:bg-brand-surface-light"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Category Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("cat")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-brand-surface-light">
                  Thể Loại <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                {activeDropdown === "cat" && categories.length > 0 && (
                  <div className="absolute top-full left-0 w-64 p-3 bg-brand-surface border border-brand-surface-border rounded-xl shadow-2xl grid grid-cols-2 gap-1 animate-fade-in z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id || cat.slug}
                        to={ROUTES.CATEGORY(cat.slug)}
                        className="px-2.5 py-1.5 text-xs text-brand-muted hover:text-brand-accent hover:bg-brand-surface-light rounded-md truncate transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Country Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("country")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-brand-surface-light">
                  Quốc Gia <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                {activeDropdown === "country" && countries.length > 0 && (
                  <div className="absolute top-full left-0 w-56 p-3 bg-brand-surface border border-brand-surface-border rounded-xl shadow-2xl grid grid-cols-2 gap-1 animate-fade-in z-50">
                    {countries.map((c) => (
                      <Link
                        key={c._id || c.slug}
                        to={ROUTES.COUNTRY(c.slug)}
                        className="px-2.5 py-1.5 text-xs text-brand-muted hover:text-brand-accent hover:bg-brand-surface-light rounded-md truncate transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          )}

          {/* Search Bar & Right Controls */}
          <div className="flex items-center gap-2.5">
            <form
              onSubmit={handleSearchSubmit}
              className={`relative hidden ${variant === "full" ? "sm:block w-48 md:w-56 lg:w-64" : "sm:block w-52 md:w-64"}`}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm phim, diễn viên..."
                aria-label="Tìm kiếm phim"
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full bg-brand-surface-light border border-brand-surface-border text-brand-text placeholder-brand-dim focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
              />
              <Search className="w-4 h-4 text-brand-dim absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surface-light transition-colors"
              title={
                theme === "dark"
                  ? "Chuyển sang giao diện Sáng"
                  : "Chuyển sang giao diện Tối"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* History Link */}
            <Link
              to={ROUTES.HISTORY}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surface-light transition-colors"
              title="Lịch sử xem phim"
            >
              <History className="w-5 h-5 text-indigo-400" />
            </Link>

            {/* Bookmarks Link */}
            <Link
              to={ROUTES.FAVORITES}
              className="relative p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surface-light transition-colors"
              title="Danh sách phim yêu thích"
            >
              <Heart className="w-5 h-5 text-brand-accent fill-brand-accent/20 hover:fill-brand-accent" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-accent text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-accent-glow">
                  {bookmarks.length > 99 ? "99+" : bookmarks.length}
                </span>
              )}
            </Link>

            {/* Mobile Drawer Toggle */}
            {variant === "full" && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Mở menu di động"
                className="md:hidden p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surface-light focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {variant === "full" && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          categories={categories}
          countries={countries}
        />
      )}
    </>
  );
};
