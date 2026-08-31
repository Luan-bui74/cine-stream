import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY > threshold);

    // Calculate scroll progress percentage for subtle progress ring
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100));
      setScrollProgress(progress);
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Calculate SVG stroke offset for progress circle (radius 18 => perimeter = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      } ${className}`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
        title="Cuộn lên đầu trang"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-brand-surface/90 backdrop-blur-md border border-brand-surface-border text-brand-text shadow-lg hover:border-brand-accent hover:text-brand-accent hover:shadow-accent-glow hover:-translate-y-1 active:translate-y-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-brand-surface-border/40 fill-none"
            strokeWidth="2.5"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-brand-accent fill-none transition-[stroke-dashoffset] duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Icon with subtle upward animation on hover */}
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
      </button>
    </div>
  );
};

export default BackToTop;
