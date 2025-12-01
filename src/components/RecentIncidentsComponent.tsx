import React from 'react';

type Incident = {
  id: string;
  type: string;
  location: string;
  status: string;
  time: string;
};

const sample: Incident[] = [
  { id: '1', type: 'Ngập nước', location: 'Quận 1', status: 'Đang xử lý', time: '1 giờ trước' },
  { id: '2', type: 'Đèn đường hỏng', location: 'Quận 3', status: 'Đã xử lý', time: '2 giờ trước' },
  { id: '3', type: 'Rác tràn', location: 'Huyện A', status: 'Đã gửi', time: '4 giờ trước' },
];

const RecentIncidentsComponent: React.FC = () => {
  return (
    <div className="mt-6 bg-white rounded-md shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Sự cố gần đây</h3>
        <button className="text-sm text-blue-600">Xem tất cả</button>
      </div>

      <ul className="space-y-3">
        {sample.map((it) => (
          <li key={it.id} className="flex items-start space-x-3">
            <div className="w-2 h-8 rounded bg-gray-200 mt-1" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.type} • <span className="text-sm text-gray-500">{it.location}</span></div>
                <div className="text-sm text-gray-500">{it.time}</div>
              </div>
              <div className="text-sm mt-1">
                <span className={`px-2 py-0.5 rounded text-xs ${it.status === 'Đã xử lý' ? 'bg-green-100 text-green-700' : it.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                  {it.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentIncidentsComponent;
