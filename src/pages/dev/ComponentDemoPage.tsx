import React, { useState } from "react";
import { Play, Heart, Download, Share2, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Chip } from "../../components/ui/Chip";
import { Skeleton } from "../../components/ui/Skeleton";
import { SkeletonCard } from "../../components/ui/SkeletonCard";
import { Spinner } from "../../components/ui/Spinner";
import { MovieGrid } from "../../components/movie/MovieGrid";
import { ServerTabs } from "../../components/movie/ServerTabs";
import { EpisodeSelector } from "../../components/movie/EpisodeSelector";
import { Breadcrumb } from "../../components/shared/Breadcrumb";
import { SearchBar } from "../../components/shared/SearchBar";
import { FilterBar, FilterState } from "../../components/shared/FilterBar";
import { Pagination } from "../../components/shared/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import {
  Category,
  Country,
  MovieSummary,
  ServerDataItem,
} from "../../types/movie";

const DEMO_MOVIE_1: MovieSummary = {
  _id: "674e1234abc1",
  name: "Trò Chơi Con Mực 2",
  origin_name: "Squid Game Season 2",
  slug: "tro-choi-con-muc-2",
  year: 2024,
  poster_url: "https://phimimg.com/upload/poster-1.jpg",
  thumb_url: "https://phimimg.com/upload/poster-1.jpg",
  quality: "FHD",
  lang: "Vietsub",
  episode_current: "Tập 6/6",
};

const DEMO_MOVIE_2: MovieSummary = {
  _id: "674e1234abc2",
  name: "Đảo Hải Tặc (One Piece)",
  origin_name: "One Piece Live Action",
  slug: "one-piece-live-action",
  year: 2024,
  poster_url: "https://phimimg.com/upload/poster-2.jpg",
  thumb_url: "https://phimimg.com/upload/poster-2.jpg",
  quality: "4K",
  lang: "Thuyết Minh",
  episode_current: "Hoàn Tất",
};

const MOCK_CATEGORIES: Category[] = [
  { _id: "cat1", name: "Hành Động", slug: "hanh-dong" },
  { _id: "cat2", name: "Tình Cảm", slug: "tinh-cam" },
  { _id: "cat3", name: "Cổ Trang", slug: "co-trang" },
  { _id: "cat4", name: "Viễn Tưởng", slug: "vien-tuong" },
];

const MOCK_COUNTRIES: Country[] = [
  { _id: "cou1", name: "Hàn Quốc", slug: "han-quoc" },
  { _id: "cou2", name: "Trung Quốc", slug: "trung-quoc" },
  { _id: "cou3", name: "Mỹ", slug: "my" },
  { _id: "cou4", name: "Nhật Bản", slug: "nhat-ban" },
];

const MOCK_EPISODES: ServerDataItem[] = Array.from({ length: 16 }, (_, i) => ({
  name: String(i + 1),
  slug: `tap-${i + 1}`,
  filename: `Episode ${i + 1}`,
  link_embed: "https://example.com/embed",
  link_m3u8: "https://example.com/stream.m3u8",
}));

export const ComponentDemoPage: React.FC = () => {
  const [activeChip, setActiveChip] = useState(false);
  const [activeServer, setActiveServer] = useState("#Vietsub 1");
  const [currentEp, setCurrentEp] = useState("tap-1");
  const [filters, setFilters] = useState<FilterState>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOutput, setSearchOutput] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-brand-bg text-brand-text">
      {/* Title */}
      <div className="border-b border-brand-surface-border pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-brand-accent" /> UI Design System
          Showcase
        </h1>
        <p className="text-sm text-brand-muted mt-1">
          Bảng xem trước toàn bộ UI components chuẩn màu Dark-mode &amp; Crimson
          Flame accent (`#ff3b5c`).
        </p>
      </div>

      {/* 1. Navigation & Breadcrumb */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          1. Breadcrumb Navigation
        </h2>
        <div className="p-4 bg-brand-surface border border-brand-surface-border rounded-xl">
          <Breadcrumb
            items={[
              { label: "Phim Bộ", href: "/danh-sach/phim-bo" },
              { label: "Hàn Quốc", href: "/quoc-gia/han-quoc" },
              { label: "Trò Chơi Con Mực 2" },
            ]}
          />
        </div>
      </section>

      {/* 2. SearchBar */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">2. SearchBar</h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl space-y-3">
          <SearchBar
            placeholder="Phim hành động 2024"
            onSearchSubmit={(encoded: string) =>
              setSearchOutput(`Encoded submit string: ${encoded}`)
            }
          />
          {searchOutput && (
            <p className="text-xs text-emerald-400 font-mono text-center">
              {searchOutput}
            </p>
          )}
        </div>
      </section>

      {/* 3. FilterBar */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          3. FilterBar (Desktop + Mobile Drawer)
        </h2>
        <FilterBar
          categories={MOCK_CATEGORIES}
          countries={MOCK_COUNTRIES}
          selectedFilters={filters}
          onChange={setFilters}
        />
        <div className="p-3 bg-brand-surface-light rounded-lg text-xs font-mono text-brand-muted">
          Active Filters State: {JSON.stringify(filters)}
        </div>
      </section>

      {/* 4. MovieCard & MovieGrid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          4. MovieCard &amp; MovieGrid
        </h2>
        <MovieGrid
          items={[
            DEMO_MOVIE_1,
            DEMO_MOVIE_2,
            DEMO_MOVIE_1,
            DEMO_MOVIE_2,
            DEMO_MOVIE_1,
            DEMO_MOVIE_2,
          ]}
        />
      </section>

      {/* 5. ServerTabs & EpisodeSelector */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          5. ServerTabs &amp; EpisodeSelector
        </h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl space-y-6">
          <ServerTabs
            servers={["#Vietsub 1", "#Vietsub 2", "#Thuyết Minh"]}
            activeServer={activeServer}
            onChange={setActiveServer}
          />

          <EpisodeSelector
            episodes={[
              { server_name: activeServer, server_data: MOCK_EPISODES },
            ]}
            currentEpisodeSlug={currentEp}
            onSelect={(ep) => setCurrentEp(ep.slug)}
          />
        </div>
      </section>

      {/* 6. Pagination */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">6. Pagination</h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl">
          <Pagination
            currentPage={currentPage}
            totalPages={20}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* 7. Buttons Showcase */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          7. Button Variants &amp; Sizes
        </h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl flex flex-wrap gap-4 items-center">
          <Button
            variant="primary"
            leftIcon={<Play className="w-4 h-4 fill-current" />}
          >
            Xem Phim
          </Button>
          <Button variant="secondary" leftIcon={<Heart className="w-4 h-4" />}>
            Yêu Thích
          </Button>
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Tải Phim
          </Button>
          <Button variant="ghost" leftIcon={<Share2 className="w-4 h-4" />}>
            Chia Sẻ
          </Button>
          <Button variant="danger">Xóa Tất Cả</Button>
          <Button variant="primary" isLoading>
            Đang Tải
          </Button>
        </div>
      </section>

      {/* 8. Badges & Chips */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          8. Badges &amp; Chips
        </h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="accent">FHD</Badge>
            <Badge variant="sub">Vietsub</Badge>
            <Badge variant="gold">★ 9.5</Badge>
            <Badge variant="dark">Tập 12/12</Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Chip active={false}>Hành Động</Chip>
            <Chip active={true}>Tình Cảm</Chip>
            <Chip
              active={activeChip}
              onClick={() => setActiveChip(!activeChip)}
            >
              Toggle Interactive Chip
            </Chip>
          </div>
        </div>
      </section>

      {/* 9. Skeletons & Spinners */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-brand-accent">
          9. Loading Skeletons &amp; Spinners
        </h2>
        <div className="p-6 bg-brand-surface border border-brand-surface-border rounded-xl space-y-6">
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>

      {/* 10. EmptyState & ErrorState */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-brand-accent">
          10. EmptyState &amp; ErrorState
        </h2>
        <EmptyState
          title="Không tìm thấy kết quả"
          description="Rất tiếc, chúng tôi không tìm thấy bộ phim nào phù hợp với từ khóa của bạn."
          actionLabel="Khám phá phim mới"
          onAction={() => alert("Navigate home")}
        />

        <ErrorState
          title="Lỗi tải dữ liệu từ máy chủ"
          message="Không thể kết nối đến API PhimAPI. Vui lòng kiểm tra lại kết nối mạng."
          onRetry={() => alert("Refetch triggered")}
        />
      </section>
    </div>
  );
};
