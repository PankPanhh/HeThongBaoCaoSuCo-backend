import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BannerComponentProps {
  show: boolean;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ show }) => {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-100 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">🌧</div>
        <div>
          <div className="font-medium text-amber-800">Dự báo mưa lớn</div>
          <div className="text-sm text-gray-600">Hãy báo cáo ngập nước để chúng tôi xử lý nhanh</div>
        </div>
      </div>
      <button
        onClick={() => navigate('/alerts/weather-detail')}
        className="text-sm text-amber-700 font-medium hover:text-amber-900 transition-colors"
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default BannerComponent;