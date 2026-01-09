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
    <div className={`mt-4 p-3 rounded-md border flex items-center justify-between ${getBgColor(currentBanner.type)}`}>
      <div className="flex items-center space-x-3 flex-1">
        <div className="text-2xl">{getIcon(currentBanner.type)}</div>
        <div className="flex-1">
          <div className={`font-medium ${getTextColor(currentBanner.type)}`}>
            {currentBanner.title}
          </div>
          <div className="text-sm text-gray-600 line-clamp-2">
            {currentBanner.content}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {banners.length > 1 && (
          <div className="flex items-center gap-1 mr-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-gray-600 w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => navigate(`/alerts/${currentBanner.id || currentBanner._id}`)}
          className={`text-sm font-medium transition-colors ${getButtonColor(currentBanner.type)}`}
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default BannerComponent;