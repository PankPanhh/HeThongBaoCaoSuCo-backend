import React from 'react';

const FloatingButtonComponent: React.FC = () => {
  return (
    <div className="fixed right-5 bottom-5 z-50 group">
      {/* Hover label (visible on larger screens) */}
      <div className="hidden md:flex absolute -right-28 bottom-6 items-center">
        <div className="bg-white text-sm text-gray-800 px-3 py-1 rounded-lg shadow-md border border-gray-100">
          Báo cáo nhanh
        </div>
      </div>

      <button
        onClick={() => console.log('Báo cáo nhanh')}
        aria-label="Báo cáo nhanh"
        title="Báo cáo nhanh"
        className="relative w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        {/* pulse ring behind button */}
        <span aria-hidden="true" className="absolute inline-block w-16 h-16 rounded-full bg-blue-500 opacity-20 animate-ping" />

        {/* Icon (centered, above ping) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 z-10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3l2-3h8l2 3h3a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>

        {/* Screen-reader label */}
        <span className="sr-only">Báo cáo nhanh (chụp ảnh và gửi báo cáo)</span>
      </button>
    </div>
  );
};

export default FloatingButtonComponent;