import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, ShieldCheck, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../lib/routes';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-surface border-t border-brand-surface-border mt-16 pt-12 pb-8 text-brand-muted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white shadow-accent-glow">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Cine<span className="text-brand-accent">Stream</span>
              </span>
            </Link>
            <p className="text-brand-muted text-xs leading-relaxed">
              Trải nghiệm xem phim Vietsub HD trực tuyến hoàn toàn miễn phí. Giao diện hiện đại, phát video mượt mà và cập nhật liên tục.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-brand-text">Danh Mục</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link to={ROUTES.LIST('phim-bo')} className="hover:text-brand-accent transition-colors">
                  Phim Bộ Mới
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LIST('phim-le')} className="hover:text-brand-accent transition-colors">
                  Phim Lẻ Chiếu Rạp
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LIST('hoat-hinh')} className="hover:text-brand-accent transition-colors">
                  Anime &amp; Hoạt Hình
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LIST('tv-shows')} className="hover:text-brand-accent transition-colors">
                  TV Shows &amp; Truyền Hình
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-brand-text">Thể Loại Hot</h4>
            <ul className="space-y-1.5 font-medium">
              <li>
                <Link to={ROUTES.CATEGORY('hanh-dong')} className="hover:text-brand-accent transition-colors">
                  Phim Hành Động
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('tinh-cam')} className="hover:text-brand-accent transition-colors">
                  Phim Tình Cảm
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('co-trang')} className="hover:text-brand-accent transition-colors">
                  Phim Cổ Trang
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('vien-tuong')} className="hover:text-brand-accent transition-colors">
                  Phim Viễn Tưởng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Disclaimer */}
          <div className="space-y-2 bg-brand-surface-light border border-brand-surface-border p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 text-brand-text font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Tuyên Bố Mới Bản Quyền</span>
            </div>
            <p className="text-[11px] text-brand-dim leading-relaxed">
              CineStream không lưu trữ bất kỳ tệp video nào trên máy chủ. Tất cả nội dung được cung cấp bởi các dịch vụ của bên thứ ba không thuộc liên kết.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-brand-surface-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-brand-dim">
          <p>© {currentYear} CineStream. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Phát triển với <Heart className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" /> cho người yêu phim
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
