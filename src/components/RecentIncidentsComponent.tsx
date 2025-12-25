import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ALL_MOCK_INCIDENTS from '@/data/mockIncidents';
import IncidentDetailComponent from '@/components/Incidents/IncidentDetailComponent';
import { Incident } from '@/types/incident';

const typeIcon = (type: string) => {
  switch (type) {
    case 'Ngập nước':
      return '💧';
    case 'Đèn đường hỏng':
      return '💡';
    case 'Rác tràn':
      return '🗑️';
    case 'Cây đổ':
      return '🌳';
    case 'Hư hỏng mặt đường':
      return '🛣️';
    default:
      return '❗';
  }
};

const RecentIncidentsComponent: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Incident | null>(null);

  const handleViewAll = () => {
    navigate('/incidents');
  };

  const openDetail = (incident: Incident) => {
    setSelected(incident);
  };

  const closeDetail = () => setSelected(null);

  // show first 3 recent incidents
  const recent = ALL_MOCK_INCIDENTS.slice(0, 3);

  return (
    <div className="mt-6 bg-white rounded-md shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Sự cố gần đây</h3>
        <button onClick={handleViewAll} className="text-sm text-blue-600">Xem tất cả</button>
      </div>

      <ul className="space-y-3">
        {recent.map((it) => (
          <li key={it.id} className="flex items-start space-x-3 cursor-pointer" onClick={() => openDetail(it)}>
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-2xl">
              {typeIcon(it.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">{it.type} • <span className="text-sm text-gray-500">{it.location}</span></div>
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

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={closeDetail} />
          <div className="relative w-full max-w-lg p-4">
            <IncidentDetailComponent incident={selected} onClose={closeDetail} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentIncidentsComponent;
