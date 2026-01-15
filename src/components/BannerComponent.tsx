import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveBanners, Alert } from '../lib/alert-api';

interface BannerComponentProps {
  show: boolean;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ show }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (show) {
      loadBanners();
    }
  }, [show]);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const loadBanners = async () => {
    try {
      const data = await getActiveBanners(5); // Get max 5 active banners
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!show || loading) return null;
  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'KHẨN CẤP';
      case 'warning':
        return 'CẢNH BÁO';
      case 'news':
        return 'TIN TỨC';
      case 'info':
        return 'THÔNG TIN';
      default:
        return 'THÔNG BÁO';
    }
  };

  // Get badge colors
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-600';
      case 'warning':
        return 'bg-amber-500';
      case 'news':
        return 'bg-blue-600';
      case 'info':
        return 'bg-gray-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Get appropriate emoji/icon based on banner type
  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'news':
        return '📰';
      case 'info':
        return 'ℹ️';
      default:
        return '🌧';
    }
  };

  // Get appropriate background color based on banner type
  const getBgColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'news':
        return 'bg-blue-50 border-blue-100';
      case 'info':
        return 'bg-gray-50 border-gray-100';
      default:
        return 'bg-amber-50 border-amber-100';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      case 'news':
        return 'text-blue-800';
      case 'info':
        return 'text-gray-800';
      default:
        return 'text-amber-800';
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-700 hover:text-red-900';
      case 'warning':
        return 'text-amber-700 hover:text-amber-900';
      case 'news':
        return 'text-blue-700 hover:text-blue-900';
      case 'info':
        return 'text-gray-700 hover:text-gray-900';
      default:
        return 'text-amber-700 hover:text-amber-900';
    }
  };

  return (
    <div 
      className="mt-4 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => navigate(`/alerts/${currentBanner.id || currentBanner._id}`)}
    >
      {/* Banner Image with Overlay Content */}
      {currentBanner.banner_image ? (
        <div className="relative w-full h-48">
          <img
            src={currentBanner.banner_image}
            alt={currentBanner.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load banner image:', currentBanner.banner_image);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Content Over Image */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            {/* Type Badge */}
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded text-white text-xs font-bold tracking-wider ${getBadgeColor(currentBanner.type)}`}>
                {getTypeLabel(currentBanner.type)}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 drop-shadow-lg">
              {currentBanner.title}
            </h3>

            {/* Content Preview */}
            <p className="text-white/90 text-sm line-clamp-1 drop-shadow-md mb-3">
              {currentBanner.content}
            </p>

            {/* Footer on Image */}
            <div className="flex items-center justify-between">
              {/* Navigation Dots */}
              {banners.length > 1 && (
                <div className="flex gap-1.5">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Go to banner ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* View Link */}
              <span className="text-white text-sm font-medium flex items-center gap-1">
                Xem chi tiết
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Fallback for banners without image */
        <div className="p-4">
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded text-white text-xs font-bold tracking-wider ${getBadgeColor(currentBanner.type)}`}>
              {getTypeLabel(currentBanner.type)}
            </span>
          </div>
          
          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
            {currentBanner.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {currentBanner.content}
          </p>

          <div className="flex items-center justify-between">
            {banners.length > 1 && (
              <div className="flex gap-1">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-4 bg-blue-600' : 'w-1.5 bg-gray-300'
                    }`}
                    aria-label={`Go to banner ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            <span className="text-sm font-medium text-blue-600">
              Xem chi tiết →
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerComponent;