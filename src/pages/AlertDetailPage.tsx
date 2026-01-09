import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from 'zmp-ui';
import { getBannerDetail, Alert } from '../lib/alert-api';

const AlertDetailPage: React.FC = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    if (alertId) {
      loadAlertDetail();
    }
  }, [alertId]);

  const loadAlertDetail = async () => {
    if (!alertId) return;

    try {
      const data = await getBannerDetail(alertId);
      setAlert(data);
    } catch (error) {
      console.error('Error loading alert detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'news':
        return '📰';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'Khẩn cấp';
      case 'warning':
        return 'Cảnh báo';
      case 'news':
        return 'Tin tức';
      case 'info':
        return 'Thông tin';
      default:
        return 'Thông báo';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'news':
        return 'bg-blue-50 border-blue-200';
      case 'info':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      case 'news':
        return 'text-blue-800';
      case 'info':
        return 'text-gray-800';
      default:
        return 'text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Page className="page bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (!alert) {
    return (
      <Page className="page bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông báo
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Thông báo này có thể đã bị xóa hoặc không còn khả dụng
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </Page>
    );
  }

  return (
    <Page className="page bg-gray-50">
      <div className="min-h-screen pb-6">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center p-4">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-lg font-bold flex-1">Chi tiết thông báo</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Type Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getBgColor(alert.type)}`}>
            <span className="text-2xl">{getIcon(alert.type)}</span>
            <span className={`font-medium ${getTextColor(alert.type)}`}>
              {getTypeLabel(alert.type)}
            </span>
          </div>

          {/* Banner Image */}
          {alert.banner_image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={alert.banner_image}
                alt={alert.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Gallery */}
          {alert.gallery && alert.gallery.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              <h3 className="font-semibold text-gray-900 mb-3 px-4 pt-4">
                Thư viện hình ảnh
              </h3>
              <div className="grid grid-cols-2 gap-3 px-4 pb-4">
                {alert.gallery.map((mediaUrl, index) => {
                  const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                  return isVideo ? (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedMediaIndex(index);
                        setShowPreview(true);
                      }}
                      className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                    >
                      <video
                        className="w-full h-24 object-cover"
                      >
                        <source src={mediaUrl} />
                        Trình duyệt của bạn không hỗ trợ video
                      </video>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedMediaIndex(index);
                        setShowPreview(true);
                      }}
                      className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group"
                    >
                      <img
                        src={mediaUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H7"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {alert.title}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(alert.created_at)}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Nội dung</h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {alert.content}
            </div>
          </div>

          {/* Article Link */}
          {alert.article_url && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                📰 Bài báo chính thống
              </h3>
              <a
                href={alert.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all w-full justify-center font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Đọc bài báo
              </a>
            </div>
          )}

          {/* Validity Period */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Thời gian hiệu lực</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium mr-2">Bắt đầu:</span>
                {formatDate(alert.start_time)}
              </div>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium mr-2">Kết thúc:</span>
                {formatDate(alert.end_time)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => setShowActionModal(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Báo cáo sự cố
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && alert?.gallery && alert.gallery.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-51 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Media Display */}
            <div
              className="w-full h-full flex items-center justify-center max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const mediaUrl = alert.gallery[selectedMediaIndex];
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                return isVideo ? (
                  <video
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg"
                  >
                    <source src={mediaUrl} />
                    Trình duyệt của bạn không hỗ trợ video
                  </video>
                ) : (
                  <img
                    src={mediaUrl}
                    alt={`Preview ${selectedMediaIndex + 1}`}
                    className="max-w-full max-h-full rounded-lg object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                    }}
                  />
                );
              })()}
            </div>

            {/* Navigation Controls */}
            {alert.gallery && alert.gallery.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMediaIndex(
                      selectedMediaIndex === 0
                        ? (alert.gallery?.length || 1) - 1
                        : selectedMediaIndex - 1
                    );
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Counter */}
                <span className="text-white text-sm font-medium px-3 py-1 bg-white bg-opacity-20 rounded-full">
                  {selectedMediaIndex + 1} / {alert.gallery.length}
                </span>

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMediaIndex(
                      selectedMediaIndex === (alert.gallery?.length || 1) - 1
                        ? 0
                        : selectedMediaIndex + 1
                    );
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-white w-full rounded-t-2xl p-6 animate-in slide-in-from-bottom">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Báo cáo sự cố liên quan
              </h2>
              <p className="text-gray-600 mb-6">
                Chọn cách thức báo cáo sự cố của bạn:
              </p>

              <div className="space-y-3">
                {/* Quick Report Option */}
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    navigate('/quick-report');
                  }}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Báo cáo nhanh</h3>
                    <p className="text-sm text-gray-500">
                      Điền thông tin cơ bản nhanh chóng
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Detailed Report Option */}
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    navigate('/user-report');
                  }}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Báo cáo chi tiết</h3>
                    <p className="text-sm text-gray-500">
                      Điền form đầy đủ với tất cả chi tiết
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default AlertDetailPage;
