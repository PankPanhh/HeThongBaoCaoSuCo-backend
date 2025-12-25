import React, { useState, useRef, useEffect } from 'react';

import NotificationComponent, { NotificationItem } from './ProgressAndNotification/NotificationComponent';
import Logo from './logo';

const HeaderComponent: React.FC = () => {
  // mock user (replace with real auth data)
  const user = { name: 'Phạm Nguyễn Ngọc Cường', avatar: '/static/user.jpg'};
  const [logoError, setLogoError] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Mock notifications (có thể thay bằng props hoặc state động)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Báo cáo mới từ khu vực A', message: 'Có 1 báo cáo cần xác minh', type: 'info', time: '2 phút trước', read: false },
    { id: '2', title: 'Sự cố điện', message: 'Mất điện khu B', type: 'warning', time: '15 phút trước', read: false },
    { id: '3', title: 'Đã xử lý xong', message: 'Sự cố 123 đã được đóng', type: 'success', time: '1 giờ trước', read: true },
    { id: '4', title: 'Lỗi hệ thống', message: 'Lỗi đăng nhập người dùng', type: 'danger', time: 'Hôm qua', read: true },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <header className="flex items-center justify-between py-4" style={{paddingTop: '3rem'}}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ background: 'transparent' }}>
          {!logoError ? (
            <img
              src="/static/logo.png"
              alt="Logo cơ quan"
              className="max-w-full max-h-full object-contain rounded-full"
              onError={() => setLogoError(true)}
            />
          ) : (
            <Logo />
          )}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Hệ thống báo cáo sự cố</h1>
          <p className="text-sm text-gray-600">Nhanh - Hiệu quả - Minh bạch</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <NotificationComponent
          notifications={Array.isArray(notifications) ? notifications : []}
          onMarkAllRead={handleMarkAllRead}
          onMarkRead={handleMarkRead}
        />

        <div className="relative" ref={menuRef}>
          <button
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="flex items-center space-x-2 p-1 rounded-full bg-black shadow hover:bg-gray-100"
          >
            <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20">
              <div className="p-3 border-b">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">Tài khoản người dùng</div>
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.history.pushState({}, '', '/user-profile');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    } catch (e) {
                      window.location.href = '/user-profile';
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Thông tin cá nhân
                </button>
                <button type="button" className="w-full text-left px-3 py-2 text-sm text-white bg-red-500 rounded mt-2">Đăng xuất</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;