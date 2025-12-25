import React from 'react';

interface Props {
  title?: string;
  severity?: string;
  updatedAt?: string;
}

const HeaderAlert: React.FC<Props> = ({
  title = 'Cảnh báo thời tiết: Mưa lớn',
  severity = 'High',
  updatedAt = '',
}) => {
  return (
    <div className="rounded-md bg-amber-50 border border-amber-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🌧️</div>
          <div>
            <div className="text-xl font-semibold text-amber-800">{title}</div>
            <div className="text-sm text-gray-600">Mức độ: <span className="font-medium">{severity}</span></div>
          </div>
        </div>
        <div className="text-sm text-gray-500">Cập nhật: {updatedAt || '—'}</div>
      </div>
    </div>
  );
};

export default HeaderAlert;
