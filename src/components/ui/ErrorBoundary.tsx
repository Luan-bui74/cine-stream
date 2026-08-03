import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled App Runtime Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-brand-surface border border-brand-surface-border rounded-2xl p-8 shadow-2xl text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-lg">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-brand-text">
                Đã Có Lỗi Sự Cố Rất Tiếc!
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Ứng dụng gặp phải một lỗi hệ thống không lường trước. Vui lòng tải lại trang hoặc quay về trang chủ.
              </p>
              {this.state.error?.message && (
                <div className="p-3 bg-brand-surface-light rounded-xl border border-brand-surface-border text-[11px] text-red-300 font-mono text-left max-h-24 overflow-y-auto mt-2">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                leftIcon={<Home className="w-4 h-4" />}
                onClick={this.handleGoHome}
              >
                Trang Chủ
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={this.handleReload}
              >
                Tải Lại Trang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
