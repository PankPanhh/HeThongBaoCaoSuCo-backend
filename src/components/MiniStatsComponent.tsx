import React from 'react';

const MiniStatsComponent: React.FC = () => {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
      <div className="bg-white rounded-md p-3 shadow hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold text-blue-600">12</div>
        <div className="text-sm text-gray-600">Đã xử lý hôm nay</div>
      </div>
      <div className="bg-white rounded-md p-3 shadow hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold text-orange-600">5</div>
        <div className="text-sm text-gray-600">Đang xử lý</div>
      </div>
      <div className="bg-white rounded-md p-3 shadow hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold text-green-600">3</div>
        <div className="text-sm text-gray-600">Trong khu vực của bạn</div>
      </div>
    </div>
  );
};

export default MiniStatsComponent;