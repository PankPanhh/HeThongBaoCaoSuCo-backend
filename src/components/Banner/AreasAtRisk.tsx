import React from 'react';

interface Area {
  name: string;
  status: string;
}

interface Props {
  areas?: Area[];
}

const AreasAtRisk: React.FC<Props> = ({ areas = [] }) => {
  return (
    <div className="mt-4">
      <div className="font-medium text-gray-800 mb-2">Khu vực có nguy cơ / đã ghi nhận ngập</div>
      {areas.length === 0 ? (
        <div className="text-sm text-gray-600">Hiện chưa ghi nhận điểm ngập nào.</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {areas.map((a, i) => (
            <li key={i} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="font-medium text-gray-800">{a.name}</div>
              <div className="text-sm text-amber-700">{a.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AreasAtRisk;
