# 🎬 CineStream - Frontend Web Xem Phim Vietsub HD

Nền tảng xem phim trực tuyến hiện đại, mượt mà và chuẩn UI/UX được xây dựng bằng **Vite + React 18 + TypeScript + TailwindCSS v3 + React Router v6 + Hls.js**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Core**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS v3 (Dark-mode-first, Custom Color Palette Crimson `#ff3b5c`)
- **Routing**: React Router v6 (2 Layout Shells: `RootLayout` & `PlayerLayout`, Code-Splitting với `React.lazy`)
- **Video Player**: Hls.js (M3U8 Streaming + Auto Fallback Iframe Embed)
- **Icons**: Lucide React
- **HTTP Client**: Axios (Kèm Retry Interceptor & Request Timeout)
- **Testing & Quality**: Vitest, TypeScript strict check

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Khởi tạo môi trường
Yêu cầu Node.js v18 trở lên.

```bash
# Cài đặt các thư viện phụ thuộc
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc dự án:

```env
VITE_API_BASE_URL=https://phimapi.com
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Truy cập tại địa chỉ local: `http://localhost:5173`

### 4. Build sản phẩm (Production Build)
```bash
# Kiểm tra type và đóng gói sản phẩm
npm run build

# Chạy thử bản build production trên máy local
npm run preview
```

---

## 📁 Cấu Trúc Thư Mục Dự Án (Directory Structure)

```text
film/
├── public/
├── src/
│   ├── api/             # Lớp gọi PhimAPI (movies.ts, categories.ts, countries.ts, search.ts)
│   ├── components/      # UI components tái sử dụng
│   │   ├── home/        # HeroCarousel, FeaturedCategories
│   │   ├── layout/      # Header, Footer, MobileMenu, RootLayout, PlayerLayout
│   │   ├── movie/       # MovieCard, MovieGrid, EpisodeSelector, ServerTabs
│   │   ├── player/      # VideoPlayer (Hls.js + Embed), AutoPlayOverlay
│   │   ├── shared/      # FilterBar, SearchBar, Pagination, Breadcrumb
│   │   └── ui/          # Button, Badge, Chip, Skeleton, Spinner, Toast, ErrorBoundary
│   ├── hooks/           # Custom hooks (useFetch, useMovieListPage, useFavorites, useHistory)
│   ├── lib/             # Utility image resolver, constants, helpers
│   ├── pages/           # Trang ứng dụng (HomePage, MovieDetail, WatchPage, Listing, Favorites, History, 404)
│   ├── store/           # Context Providers (AppContext, FavoritesContext, HistoryContext)
│   ├── types/           # TypeScript interfaces & types
│   ├── App.tsx          # Router config & Code-splitting Suspense
│   └── main.tsx         # Entry point
├── index.html           # HTML template, SVG Favicon, Meta SEO
├── tailwind.config.js   # Tailwind custom design system tokens
├── vite.config.ts       # Vite config & Rollup manualChunks
└── README.md
```

---

## ⚠️ GHI CHÚ TODO QUAN TRỌNG CHO PRODUCTION (CRITICAL ARCHITECTURE TODO)

Dự án hiện tại hoạt động dưới dạng Frontend thuần giao tiếp trực tiếp với REST API công khai của bên thứ 3 (`phimapi.com`). Khi triển khai lên môi trường sản xuất thực tế, **BẮT BUỘC** cần phải dựng một **Backend Proxy Server** (Node.js / Go / Nginx / Cloudflare Workers) vì 3 lý do chiến lược sau:

1. **Tránh phụ thuộc SLA của bên thứ 3**: Domain API công khai có thể bị nghẽn mạng, thay đổi cấu trúc response hoặc bị chặn bất ngờ. Backend Proxy giúp ẩn URL gốc và bảo vệ ứng dụng khỏi nguy cơ bị gián đoạn dịch vụ.
2. **Xử lý triệt để CORS và HTTP Referer**: Rất nhiều nguồn phát file `.m3u8` hoặc `.ts` video chunk kiểm tra nghiêm ngặt HTTP Header `Referer` và `Origin`. Khi gọi trực tiếp từ trình duyệt người dùng sẽ bị chối CORS. Backend Proxy (route `/api/stream?url=...`) sẽ stream lại video dữ liệu kèm các header chuẩn.
3. **Bộ nhớ đệm Caching & Tăng tốc tối đa**: Backend Proxy có thể lưu cache (Redis/In-Memory) các danh sách phim, thể loại và tập phim, giảm số lần gọi tới PhimAPI từ hàng triệu người dùng xuống chỉ còn vài request mỗi phút.

---

## 📌 Hạng Mục Ưu Tiên Nâng Cấp Tiếp Theo (Next Recommended Steps)

1. **Phát triển Backend Proxy Server**: Đóng gói API Gateway kèm Redis Caching và M3U8 Stream Proxy.
2. **Server-Side Rendering (SSR / Next.js hoặc Remix)**: Chuyển đổi sang SSR/SSG nếu muốn tối ưu SEO điểm số cao trên Google cho từng trang chi tiết phim.
3. **Tài Khoản Người Dùng & Đồng Bộ Đa Thiết Bị**: Phát triển hệ thống Auth (JWT/OAuth) để lưu Tủ Phim Yêu Thích và Lịch Sử Xem lên Database thay vì lưu thuần `localStorage`.
4. **PWA (Progressive Web App)**: Cấu hình Service Worker cho phép cài đặt app lên thiết bị di động và lưu trữ offline danh sách phim.
