import React from 'react';

const UserGuidance: React.FC = () => {
  const items = [
    'Tránh đi vào khu vực nước sâu',
    'Giữ tốc độ chậm khi di chuyển',
    'Chụp ảnh/ngắn video điểm ngập khi báo cáo',
    'Báo cáo khi an toàn',
  ];

  return (
    <div className="mt-4">
      <div className="font-medium text-gray-800 mb-2">Hướng dẫn hành vi</div>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserGuidance;
