import React, { useEffect, useRef, useState } from 'react';

export type NotificationItem = {
  id: string;
  reportId?: string;
  title: string;
  message?: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  time: string;
  read?: boolean;
};

interface NotificationComponentProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const typeIcon = (t: NotificationItem['type']) => {
  switch (t) {
    case 'info':
      return 'ℹ️';
    case 'warning':
      return '⚠️';
    case 'success':
      return '✅';
    case 'danger':
      return '❌';
    default:
      return '🔔';
  }
};

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  notifications,
  onMarkAllRead,
  onMarkRead,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOpen = typeof controlledOpen === 'boolean' ? controlledOpen : internalOpen;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (typeof controlledOpen === 'boolean') onOpenChange?.(false);
        else setInternalOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, controlledOpen, onOpenChange]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const toggleOpen = () => {
    if (typeof controlledOpen === 'boolean') onOpenChange?.(!controlledOpen);
    else setInternalOpen(v => !v);
  };

  const closePanel = () => {
    if (typeof controlledOpen === 'boolean') onOpenChange?.(false);
    else setInternalOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={closePanel} />
          <div
            ref={menuRef}
            className="fixed top-0 right-0 w-full h-full bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* close button - moved to top */}
            <button
              onClick={closePanel}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
            >
              ✕
            </button>

            {/* header - moved down with padding */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2 pr-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔔</span>
                  <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
                  {unreadCount > 0 && <span className="text-sm text-gray-600">({unreadCount})</span>}
                </div>
              </div>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={onMarkAllRead}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Đánh dấu tất cả
                </button>
              )}
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto">
              {(!notifications || notifications.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6">
                  <span className="text-5xl mb-4">🔕</span>
                  <p className="text-lg font-medium">Không có thông báo</p>
                  <p className="text-sm mt-2">Thông báo mới sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">{typeIcon(n.type)}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">{n.title}</h3>
                          {n.reportId && (
                            <p className="text-xs text-gray-500 mb-2">
                              Mã báo cáo: {n.reportId}
                            </p>
                          )}
                          {n.message && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {n.message}
                            </p>
                          )}
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="text-xs text-gray-400">{n.time}</span>
                            {!n.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkRead?.(n.id);
                                }}
                                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                          </div>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:underline mt-2"
                          >
                            Xem chi tiết →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Hiển thị {notifications.length} thông báo
                  {unreadCount > 0 && <span> • {unreadCount} chưa đọc</span>}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationComponent;