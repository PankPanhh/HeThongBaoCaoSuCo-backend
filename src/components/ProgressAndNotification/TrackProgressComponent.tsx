import React, { useState, useEffect } from 'react';
import NotificationComponent, { NotificationItem } from './NotificationComponent';

// Định nghĩa 4 trạng thái cụ thể
type ReportStatus = 'Tất cả' | 'Chờ duyệt' | 'Đang xử lý' | 'Hoàn thành';

type ProgressItem = {
  id: string;
  reportId: string;
  title: string;
  location: string;
  status: ReportStatus;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  description?: string;
  history?: string[]; // Thêm lịch sử xử lý giả lập
};

// Dữ liệu mẫu phong phú hơn để test 4 trạng thái
const mockProgressItems: ProgressItem[] = [
  {
    id: '1',
    reportId: 'BC-001',
    title: 'Đèn đường hỏng tại ngã tư',
    location: 'Quận 1, TP.HCM',
    status: 'Đang xử lý',
    progress: 60,
    createdAt: '2 ngày trước',
    updatedAt: '1 giờ trước',
    description: 'Đội kỹ thuật đã tiếp cận hiện trường, đang thay thế bóng đèn và kiểm tra dây dẫn.',
  },
  {
    id: '2',
    reportId: 'BC-002',
    title: 'Ngập nước đường Nguyễn Hữu Thọ',
    location: 'Quận 7, TP.HCM',
    status: 'Chờ duyệt',
    progress: 0, // Đã sửa về 0
    createdAt: '30 phút trước',
    updatedAt: '30 phút trước',
    description: 'Người dân báo cáo ngập nặng do triều cường.',
  },
  {
    id: '3',
    reportId: 'BC-003',
    title: 'Cây xanh gãy đổ',
    location: 'Huyện Bình Chánh',
    status: 'Hoàn thành',
    progress: 100,
    createdAt: '1 tuần trước',
    updatedAt: '1 ngày trước',
    description: 'Đã dọn dẹp hiện trường và trồng lại cây con.',
  },
  {
    id: '4',
    reportId: 'BC-004',
    title: 'Hố ga mất nắp',
    location: 'Quận 3, TP.HCM',
    status: 'Chờ duyệt',
    progress: 0, // Đã sửa về 0
    createdAt: '1 ngày trước',
    updatedAt: '5 giờ trước',
    description: 'Đã xác minh thông tin là chính xác. Đang điều phối đơn vị thi công.',
  },
];

// Cấu hình màu sắc và icon cho từng trạng thái
const STATUS_CONFIG: Record<ReportStatus, { color: string; bg: string; icon: string; step: number }> = {
  'Tất cả': { 
    color: 'text-gray-600', 
    bg: 'bg-gray-100', 
    icon: '',
    step: 1 
  },
  'Chờ duyệt': { 
    color: 'text-blue-600', 
    bg: 'bg-blue-100', 
    icon: '', // Giả lập icon
    step: 2
  },
  'Đang xử lý': { 
    color: 'text-orange-600', 
    bg: 'bg-orange-100', 
    icon: '',
    step: 3
  },
  'Hoàn thành': { 
    color: 'text-green-600', 
    bg: 'bg-green-100', 
    icon: '',
    step: 4
  },
};

const TrackProgressPage: React.FC = () => {
    const [notification, setNotification] = useState<string | null>(null);
    // state to control notification panel open/close from this page header
    const [notifPanelOpen, setNotifPanelOpen] = useState<boolean>(false);

    // array of notifications created from progress events
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    // Tự động ẩn thông báo sau 3 giây
    useEffect(() => {
      if (!notification) return;
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }, [notification]);

    // Hàm hiển thị thông báo
    const showNotification = (msg: string) => {
      setNotification(msg);
    };

    // Push a structured notification coming from a report item
    const pushReportNotification = (it: ProgressItem, type: NotificationItem['type'], message?: string) => {
      const newNot: NotificationItem = {
        id: `${it.id}-${Date.now()}`,
        reportId: it.reportId,
        title: `${it.reportId} — ${it.title}`,
        message: message || `Cập nhật trạng thái cho ${it.reportId}`,
        type,
        time: 'vừa xong',
        read: false,
      };
      setNotifications((prev) => [newNot, ...prev]);
      // automatically open panel so user sees it
      setNotifPanelOpen(true);
    };
  const [items] = useState<ProgressItem[]>(mockProgressItems);
  const [activeStatus, setActiveStatus] = useState<ReportStatus>('Tất cả');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lọc danh sách theo Tab đang chọn
  const filteredItems = activeStatus.trim() === 'Tất cả'
    ? items
    : items.filter((item) => item.status === activeStatus);

  // Tìm item đang được chọn để hiển thị chi tiết
  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- HEADER CỦA PAGE --- */}
      <div className="bg-white shadow-sm border-b relative top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
             Quản lý Sự cố
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm text-gray-500 mr-2">
              Tổng số báo cáo: <span className="font-bold text-gray-800">{items.length}</span>
            </div>
            {/* Notification control in page header */}
            <div className="flex items-center gap-2">
              {/* close button visible when panel open */}
              {notifPanelOpen && (
                <button
                  aria-label="Đóng thông báo"
                  onClick={() => setNotifPanelOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                  title="Đóng bảng thông báo"
                >
                  ✕
                </button>
              )}

              <NotificationComponent
                notifications={notifications}
                onMarkAllRead={() => setNotifications((prev) => prev.map(n => ({ ...n, read: true })))}
                onMarkRead={(id) => setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n))}
                open={notifPanelOpen}
                onOpenChange={setNotifPanelOpen}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1 flex flex-col">
        
        {/* --- THANH TAB TRẠNG THÁI --- */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-4 no-scrollbar mb-4 border-b border-gray-200">
          {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((status) => {
            const isActive = activeStatus === status;
            const config = STATUS_CONFIG[status];
            // Nếu là tab 'Tất cả' thì hiển thị tổng số báo cáo, còn lại hiển thị số theo trạng thái
            const count = status.trim() === 'Tất cả' ? items.length : items.filter(i => i.status === status).length;
            return (
              <button
                key={status}
                onClick={() => {
                  setActiveStatus(status);
                  setSelectedId(null); // Reset selection khi chuyển tab
                }}
                className={`
                  flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all text-xs sm:text-sm font-medium border
                  ${isActive 
                    ? `border-blue-500 bg-blue-50 text-blue-700 shadow-sm` 
                    : 'border-transparent bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <span>{config.icon}</span>
                {status}
                <span className={`ml-1 text-xs px-1 sm:px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-200 text-blue-800' : 'bg-gray-200'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* --- NỘI DUNG CHÍNH (Layout 2 cột) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 h-full items-start">
          
          {/* Phần trên: Danh sách báo cáo */}
          <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 sm:py-10 bg-white rounded-lg border border-dashed border-gray-300">
                <div className="text-3xl sm:text-4xl mb-3 text-gray-300">📭</div>
                <div className="text-sm sm:text-base text-gray-500">Không có báo cáo nào ở trạng thái này</div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`
                    cursor-pointer p-3 sm:p-4 rounded-xl border transition-all hover:shadow-md bg-white
                    ${selectedId === item.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      {item.reportId}
                    </span>
                    <span className="text-xs text-gray-500">{item.createdAt}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1 text-sm sm:text-base">{item.title}</h3>
                  <div className="text-xs sm:text-sm text-gray-500 mb-3 flex items-center gap-1">
                    📍 {item.location}
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'Hoàn thành' ? 'bg-green-500' : 
                        item.status === 'Đang xử lý' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Phần dưới: Chi tiết báo cáo */}
          <div className="md:col-span-1 lg:col-span-7">
            {selectedItem ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
                {/* Header chi tiết */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start bg-gray-50/50 gap-2">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg sm:text-2xl font-bold text-gray-800">{selectedItem.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="font-mono bg-white border px-2 py-0.5 rounded">{selectedItem.reportId}</span>
                      <span>•</span>
                      <span>{selectedItem.location}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${STATUS_CONFIG[selectedItem.status].bg} ${STATUS_CONFIG[selectedItem.status].color} border-current opacity-80`}>
                    {selectedItem.status}
                  </div>
                </div>

                {/* Body chi tiết */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  
                  {/* STEPPER: Quy trình xử lý */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Quy trình xử lý</h4>
                    <div className="relative flex items-center justify-between z-0">
                      {/* Line background */}
                      <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
                      {(['Chờ duyệt', 'Đang xử lý', 'Hoàn thành'] as ReportStatus[]).map((stepLabel, index) => {
                        // Điều chỉnh lại chỉ số step cho đúng với mảng mới
                        const currentStepIndex = STATUS_CONFIG[selectedItem.status].step - 2; // 0-based, 'Chờ duyệt' là 0
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        return (
                          <div key={stepLabel} className="flex flex-col items-center bg-white px-1 sm:px-2">
                            <div className={`
                              w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                              ${isCompleted 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-300'}
                              ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                            `}>
                              {index + 1}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-blue-700' : 'text-gray-400'}`}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Thông tin mô tả */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Mô tả sự cố</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      {selectedItem.description || "Không có mô tả chi tiết."}
                    </p>
                  </div>

                  {/* Tiến độ chi tiết */}
                  <div>
                     <div className="flex justify-between text-xs sm:text-sm mb-2">
                        <span className="font-medium text-gray-700">Tiến độ thực tế</span>
                        <span className="font-bold text-blue-600">{selectedItem.progress}%</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-blue-600 striped-bg transition-all duration-700"
                          style={{ width: `${selectedItem.progress}%` }}
                        />
                     </div>
                     <p className="text-xs text-gray-400 mt-2 text-right">Cập nhật lần cuối: {selectedItem.updatedAt}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 text-sm sm:text-base"
                      onClick={() => {
                        const msg = `Đã gửi yêu cầu cập nhật trạng thái cho báo cáo ${selectedItem?.reportId}`;
                        showNotification(msg);
                        if (selectedItem) pushReportNotification(selectedItem, 'info', msg);
                      }}
                    >
                      Cập nhật trạng thái
                    </button>
                          {/* Thông báo nổi (toast/snackbar) */}
                          {notification && (
                            <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg animate-fade-in-up text-sm font-medium min-w-[220px] text-center">
                              {notification}
                            </div>
                          )}

                          {/* Hiệu ứng xuất hiện */}
                          <style>{`
                            @keyframes fade-in-up {
                              0% { opacity: 0; transform: translateY(40px) scale(0.98); }
                              100% { opacity: 1; transform: translateY(0) scale(1); }
                            }
                            .animate-fade-in-up {
                              animation: fade-in-up 0.3s cubic-bezier(.4,0,.2,1);
                            }
                          `}</style>
                    <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors text-sm sm:text-base">
                      Lịch sử
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              // Empty State cho phần chi tiết (khi chưa chọn item)
              <div className="h-64 sm:h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <svg className="w-12 sm:w-16 h-12 sm:h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-base sm:text-lg font-medium">Chọn một báo cáo để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS phụ trợ cho thanh progress bar sọc (optional) */}
      <style>{`
        .striped-bg {
          background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
          background-size: 1rem 1rem;
        }
        /* Ẩn scrollbar nhưng vẫn scroll được */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TrackProgressPage;
