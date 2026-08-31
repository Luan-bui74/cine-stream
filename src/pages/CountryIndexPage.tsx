import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ChevronRight } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { getCountries } from '../api';
import { Breadcrumb } from '../components/shared/Breadcrumb';
import { ErrorState } from '../components/ui/ErrorState';
import { Skeleton } from '../components/ui/Skeleton';
import { SEO } from '../components/shared/SEO';
import { ROUTES } from '../lib/routes';

export const CountryIndexPage: React.FC = () => {
  const { data: countries, loading, error, refetch } = useFetch(() => getCountries(), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      <SEO
        title="Danh Sách Phim Theo Quốc Gia"
        description="Khám phá điện ảnh phong phú từ khắp nơi trên thế giới. Xem phim Hàn Quốc, Trung Quốc, Âu Mỹ, Nhật Bản, Thái Lan vietsub mới nhất trên CineStream."
        keywords="phim quoc gia, phim han quoc, phim trung quoc, phim au my, phim thai lan, phim nhat ban"
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Quốc Gia Phim' }]} />

      {/* Page Heading */}
      <div className="space-y-2 border-b border-brand-surface-border/50 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-brand-accent" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Danh Sách Phim Theo Quốc Gia
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-muted max-w-3xl leading-relaxed">
          Khám phá điện ảnh phong phú từ khắp nơi trên thế giới. Lựa chọn quốc gia sản xuất để thưởng thức những bộ phim Vietsub chất lượng nhất.
        </p>
      </div>

      {/* Grid of Countries */}
      {error ? (
        <ErrorState
          title="Không thể tải danh sách quốc gia"
          message={error}
          onRetry={refetch}
        />
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {countries?.map((country) => (
            <Link
              key={country._id || country.slug}
              to={ROUTES.COUNTRY(country.slug)}
              className="group p-4 rounded-xl bg-brand-surface border border-brand-surface-border hover:border-brand-accent/60 hover:shadow-accent-glow transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-brand-surface-light text-brand-accent flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                  {country.name.charAt(0)}
                </div>
                <span className="font-semibold text-sm text-brand-text group-hover:text-brand-accent transition-colors truncate">
                  {country.name}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-dim group-hover:text-brand-accent transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
