import React, { useState, useEffect } from 'react';
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
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const displayTime = incident.createdAt ? formatDate(incident.createdAt) : incident.time;
  
  const history = incident.history && incident.history.length > 0
    ? incident.history.map(h => ({
        ...h,
        time: h.time ? formatDate(h.time) : h.time
      }))
    : [
        { time: displayTime, status: incident.status },
      ];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const resolveUrl = (path: string) => {
    if (!path) return path;
    
    // If already absolute URL or data URL, return as-is
    if (/^(https?:|data:)/.test(path)) return path;
    
    // Handle old format
    if (path.includes('/assets/image/incidents/')) {
      path = path.replace('/assets/image/incidents/', '/static/incidents/');
    }
    
    // Ensure path starts with /
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    // Return relative path for local dev (will be proxied through Vite to backend:3001)
    return path;
  };

  const mediaUrls = (incident.media || []).map((m) => resolveUrl(m));

  const highlightKeywords = (text = '') => {
    const keywords = ['bật gốc', 'bật gốc do gió mạnh', 'đã được cắt', 'dọn'];
    let html = text;
    keywords.forEach((kw) => {
      const re = new RegExp(`(${kw})`, 'ig');
      html = html.replace(re, '<strong>$1</strong>');
    });
    return html;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : Math.min((incident.media || []).length - 1, i + 1)));
        if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : Math.max(0, i - 1)));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, incident.media]);

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <Text.Title size="small" className="text-gray-800">{incident.type} - {incident.location}</Text.Title>
            <div className="mt-3 flex items-start space-x-4">
              <div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${statusClasses.bg} ${statusClasses.text} whitespace-nowrap`}
                  role="status" aria-label={`Trạng thái: ${incident.status}`}>
                  <span className="text-sm leading-none">{statusClasses.icon}</span>
                  <span className="text-sm leading-none">{incident.status}</span>
                </span>
                <div className="text-sm text-gray-700 mt-1">{displayTime}</div>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0 flex items-start">
            <div className="flex gap-2">
              <Button size="small" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm transition-all" onClick={onClose}>Quay lại</Button>
              <Button size="small" className="bg-blue-600 text-white hover:bg-blue-700 shadow transition-all" onClick={() => { navigator.clipboard?.writeText(window.location.href); }}>Chia sẻ</Button>
            </div>
          </div>
        </div>

      <div className="mt-3">
        <Text className="font-medium text-gray-700">Mô tả</Text>
        <div className="text-sm text-gray-600 mt-2 leading-relaxed">
          {incident.description ? (
            <>
              <div className={`${showFullDesc ? '' : 'line-clamp-4'} `} dangerouslySetInnerHTML={{ __html: highlightKeywords(incident.description) }} />
              {incident.description.length > 220 && (
                <button
                  className="mt-2 text-sm text-blue-600 hover:underline"
                  onClick={() => setShowFullDesc((s) => !s)}
                >
                  {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </>
          ) : (
            <Text className="text-sm text-gray-600">Không có mô tả chi tiết cho sự cố này.</Text>
          )}
        </div>
      </div>

        <div className="mt-5">
        <Text className="font-medium text-gray-700">Ảnh / Video</Text>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mediaUrls.length > 0 ? (
            mediaUrls.map((src, idx) => {
              const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="20">media-${idx}</text></svg>`;
              const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

              return (
                <div key={idx} className="bg-gray-100 rounded-lg overflow-hidden relative group">
                  <div className="h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={src}
                      alt={`Ảnh sự cố ${idx + 1}`}
                      role="button"
                      aria-label={`Mở ảnh ${idx + 1}`}
                      onClick={() => setLightboxIndex(idx)}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src.includes('/static/incidents/')) {
                          // Sử dụng đường dẫn tương đối thay vì tuyệt đối
                          target.src = incident.media && incident.media[idx] ? incident.media[idx] : '';
                        } else if (target.src !== placeholder) {
                          target.src = placeholder;
                        }
                      }}
                    />
                  </div>
                  {incident.mediaCaptions && incident.mediaCaptions[idx] && (
                    <div className="p-2 text-xs text-gray-600">{incident.mediaCaptions[idx]}</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full mt-1 bg-gray-100 h-48 rounded-lg flex items-center justify-center text-gray-400">Không có ảnh/video</div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-60" onClick={() => setLightboxIndex(null)} />
          <div className="relative z-10 max-w-4xl w-full mx-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              <div className="p-2 flex items-center justify-between border-b">
                <div className="text-sm text-gray-700">{incident.type} — {incident.location}</div>
                <div className="space-x-2">
                  <button className="text-gray-600 px-2" onClick={() => setLightboxIndex((i) => (i === null ? null : Math.max(0, i - 1)))}>‹</button>
                  <button className="text-gray-600 px-2" onClick={() => setLightboxIndex((i) => (i === null ? null : Math.min((mediaUrls.length - 1), i + 1)))}>›</button>
                  <button className="text-gray-600 px-2" onClick={() => setLightboxIndex(null)}>✕</button>
                </div>
              </div>
              <div className="p-4 bg-black flex items-center justify-center">
                <img src={mediaUrls[lightboxIndex]} alt={`Ảnh ${lightboxIndex + 1}`} className="max-h-[70vh] w-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Text className="font-medium text-gray-700">Lịch sử cập nhật</Text>
        <div className="mt-3 space-y-4">
          {history.map((h, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                {idx < history.length - 1 && <div className="w-px h-8 bg-gray-200 mx-auto mt-1" />}
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-800">{h.status}</div>
                  <div className="text-sm text-gray-600 mt-1">{h.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailComponent;