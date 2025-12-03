import React from 'react';
import { Box, Text, Button } from 'zmp-ui';
import { Incident } from '@/types/incident';

interface Props {
  incident: Incident;
  onClose?: () => void;
}

const getStatusClasses = (status: Incident['status']) => {
  switch (status) {
    case 'Đã xử lý':
      return { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' };
    case 'Đang xử lý':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' };
    case 'Đã gửi':
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📤' };
  }
};

const IncidentDetailComponent: React.FC<Props> = ({ incident, onClose }) => {
  const statusClasses = getStatusClasses(incident.status);

  // Use incident.history from mock data if available, otherwise fallback
  const history = incident.history && incident.history.length > 0
    ? incident.history
    : [
        { time: incident.time, status: incident.status },
      ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <Text.Title size="small">{incident.type} tại {incident.location}</Text.Title>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${statusClasses.bg} ${statusClasses.text}`}>
              <span className="mr-2">{statusClasses.icon}</span>
              {incident.status}
            </span>
            <span className="ml-3 text-sm text-gray-500">{incident.time}</span>
          </div>
        </div>
        <div>
          <Button size="small" onClick={onClose}>Quay lại</Button>
        </div>
      </div>

      <div className="mt-3">
        <Text className="font-medium">Mô tả</Text>
        <Text className="text-sm text-gray-600 mt-1">{incident.description ?? 'Không có mô tả chi tiết cho sự cố này.'}</Text>
      </div>

      <div className="mt-4">
        <Text className="font-medium">Ảnh / Video</Text>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {incident.media && incident.media.length > 0 ? (
            incident.media.map((m, idx) => {
              const resolveUrl = (path: string) => {
                // If it's already absolute (http, data), return as-is
                if (/^(https?:|data:)/.test(path)) return path;
                
                // Prefix with origin to ensure correct absolute URL
                const fullUrl = window.location.origin + (path.startsWith('/') ? path : ('/' + path));
                console.log('Image URL:', fullUrl);
                return fullUrl;
              };

              const src = resolveUrl(m);

              const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="20">media-${idx}</text></svg>`;
              const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

              return (
                <div key={idx} className="bg-gray-100 h-40 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={src}
                    alt={`media-${idx}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      console.warn('Failed to load image:', target.src);
                      if (target.src !== placeholder) {
                        target.src = placeholder;
                      }
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-full mt-1 bg-gray-100 h-40 rounded flex items-center justify-center text-gray-400">Không có ảnh/video</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Text className="font-medium">Lịch sử cập nhật</Text>
        <ul className="mt-2 space-y-2">
          {history.map((h, idx) => (
            <li key={idx} className="flex items-center justify-between border rounded p-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{h.time}</span>
                <span className="text-sm font-medium">{h.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IncidentDetailComponent;
