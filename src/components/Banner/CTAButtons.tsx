import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTAButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
      <button
        onClick={() => navigate('/report/flood')}
        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-md font-medium"
      >
        📤 Gửi báo cáo ngập nước
      </button>
      <button
        onClick={() => window.alert('Hotline: 1900-XXX — Hoặc mở chat hỗ trợ')}
        className="flex-1 bg-white border border-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium"
      >
        📞 Liên hệ hỗ trợ
      </button>
    </div>
  );
};

export default CTAButtons;
