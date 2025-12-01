import React, { useState, useRef, useEffect } from 'react';

const HeaderComponent: React.FC = () => {
  // mock user (replace with real auth data)
  const user = { name: 'Nguyễn Phương Anh', avatar: 'www/assets/image/avatar.png' };
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="flex items-center justify-between py-4" style={{paddingTop: '3rem'}}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ background: 'transparent' }}>
          <img src="www/assets/image/logo.png" alt="Logo cơ quan" className="max-w-full max-h-full object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Hệ thống báo cáo sự cố</h1>
          <p className="text-sm text-gray-600">Nhanh - Hiệu quả - Minh bạch</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          aria-label="Thông báo"
          className="p-2 rounded-md bg-white shadow hover:bg-gray-100 transition-colors"
        >
          🔔
        </button>

        <div className="relative" ref={menuRef}>
          <button
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="flex items-center space-x-2 p-1 rounded-md bg-white shadow hover:bg-gray-100"
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
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Thông tin cá nhân</button>
                <button className="w-full text-left px-3 py-2 text-sm text-white bg-red-500 rounded mt-2">Đăng xuất</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;