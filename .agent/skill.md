# Frontend Coding Rules — React + TypeScript + Tailwind

Bộ quy tắc này tổng hợp từ các best practice hiện hành cho React/TypeScript năm 2026, điều chỉnh phù hợp với stack bạn đang dùng (React + TS + Tailwind + Supabase). Có thể dùng làm file `CLAUDE.md` / `.cursorrules` cho dự án.

## 1. TypeScript — cấu hình & type safety

- Bật `strict: true` và `noUncheckedIndexedAccess` trong `tsconfig.json` — bắt lỗi `undefined`/`null` sớm thay vì runtime.
- Cấm dùng `any`; nếu chưa biết type, dùng `unknown` rồi narrow xuống.
- Dùng `import type { X }` cho type-only import để tránh kéo runtime code không cần thiết.
- Dùng `satisfies` thay vì ép kiểu (`as`) khi định nghĩa config/object có shape cố định — vẫn giữ được inference chính xác.
- Khai báo return type rõ ràng cho các hàm/component được export (không để TS tự suy luận ở public API).
- Với state có nhiều trạng thái (loading/success/error), dùng discriminated union thay vì nhiều boolean rời rạc:
  ```ts
  type FetchState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: string };
  ```

## 2. Component & cấu trúc

- Không cần `import React` ở đầu file nữa (React 17+ JSX transform) — bỏ để code gọn.
- Định nghĩa props bằng `interface`, có `?` rõ ràng cho optional, tránh field kiểu `any`.
- Component chỉ nên làm một việc; nếu file > ~150–200 dòng hoặc có > 2 concern (fetch + render + logic phức tạp), tách ra custom hook hoặc component con.
- Ưu tiên function component + hooks; tránh viết mới class component.
- Tổ chức thư mục theo tính năng (feature-based), không theo loại file (`components/`, `hooks/` chung chung cho cả app) khi dự án đã lớn — nhóm theo domain (vd: `features/products/`, `features/auth/`).
- Dùng absolute import (`@/features/...`) thay vì `../../../` lồng nhau.

## 3. State management

- State cục bộ (UI-only) → `useState`/`useReducer`. Không đẩy lên global store nếu chỉ 1 component dùng.
- State dùng chung nhiều nơi, ít thay đổi (auth, theme) → Context.
- Server state (dữ liệu từ Supabase/API) → tách riêng khỏi client state, cân nhắc lib như React Query/TanStack Query để có cache, refetch, loading/error tự động thay vì tự quản lý bằng `useEffect` + `useState`.
- Tránh derive state trùng lặp — nếu tính được từ props/state khác, tính trực tiếp lúc render thay vì lưu thêm state.

## 4. Error handling

- Không nuốt lỗi (`catch {}` rỗng). Luôn log hoặc surface lỗi cho người dùng.
- Bọc phần UI dễ vỡ bằng Error Boundary, có fallback UI rõ ràng thay vì trắng trang.
- Với async/await, luôn có try/catch ở nơi gọi (fetch, Supabase query), không để lỗi rơi tự do lên tới React render.

## 5. Performance

- Dùng `useMemo`/`useCallback` **có mục đích** (khi truyền xuống component con được memo hoá, hoặc tính toán nặng) — không lạm dụng cho mọi thứ, vì bản thân memo hoá cũng có chi phí.
- Lazy load route/component nặng (`React.lazy` + `Suspense`) thay vì bundle hết vào 1 chunk.
- Debounce/throttle các sự kiện tần suất cao (search input, scroll, resize).
- Với danh sách dài (vd: bảng sản phẩm PC/linh kiện), dùng virtualization (`react-virtual`, `react-window`) thay vì render toàn bộ DOM.

## 6. Tailwind

- Không viết class trùng lặp logic ở nhiều nơi — trích thành component (`<Button variant="primary" />`) khi pattern lặp lại ≥ 3 lần.
- Dùng `clsx`/`tailwind-merge` khi có class động/điều kiện, tránh nối string tay gây trùng/ghi đè class không mong muốn.
- Định nghĩa design tokens (màu, spacing, font) trong `tailwind.config` thay vì hard-code giá trị arbitrary (`text-[#1a1a1a]`) rải rác khắp nơi.

## 7. Chất lượng & bảo trì

- Comment giải thích **tại sao**, không giải thích **cái gì** (code đã tự nói cái gì). Comment ngắn gọn, không lỗi thời theo thời gian.
- Refactor mạnh dạn khi thấy code trùng lặp hoặc rối, không giữ lại code "phòng khi cần" (dead code, flag không dùng).
- Đặt tên biến/hàm theo hành vi người dùng thấy được (`saveChanges`, không phải `submitWebhook`), nhất quán tên xuyên suốt flow (nút "Lưu" → toast "Đã lưu").
- Luôn xử lý trạng thái rỗng/lỗi trong UI như một phần thiết kế, không chỉ code cho "happy path".

## 8. Accessibility & responsive (tối thiểu)

- Mọi phần tử tương tác phải có focus state hiển thị rõ (không tắt outline mà không thay bằng style khác).
- Responsive xuống tối thiểu màn hình mobile phổ biến, test thật chứ không chỉ resize trình duyệt.
- Tôn trọng `prefers-reduced-motion` nếu có animation.

---

_Tổng hợp từ các nguồn thực hành React/TypeScript 2026 (cấu hình strict TypeScript, quy ước component, quản lý state, và tối ưu hiệu năng), điều chỉnh theo bối cảnh dự án React + TS + Tailwind + Supabase._
