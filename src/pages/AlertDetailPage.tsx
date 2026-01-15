import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from 'zmp-ui';
import { getBannerDetail, getUrlMetadata, Alert, UrlMetadata } from '../lib/alert-api';

const AlertDetailPage: React.FC = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [urlMetadata, setUrlMetadata] = useState<UrlMetadata | null>(null);
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
      if (data?.article_url) {
        getUrlMetadata(data.article_url).then(setUrlMetadata);
      }
    } catch (error) {
      console.error('Error loading alert detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTheme = (type: string) => {
    switch (type) {
      case 'urgent':
        return {
          wrapper: 'bg-red-50 ring-1 ring-red-100',
          iconBg: 'bg-red-600 shadow-md shadow-red-400/50',
          text: 'text-red-800'
        };
      case 'warning':
        return {
          wrapper: 'bg-amber-50 ring-1 ring-amber-100',
          iconBg: 'bg-amber-500 shadow-md shadow-amber-400/50',
          text: 'text-amber-800'
        };
      case 'news':
        return {
          wrapper: 'bg-blue-50 ring-1 ring-blue-100',
          iconBg: 'bg-blue-600 shadow-md shadow-blue-400/50',
          text: 'text-blue-800'
        };
      case 'info':
      default:
        return {
          wrapper: 'bg-gray-50 ring-1 ring-gray-100',
          iconBg: 'bg-gray-600 shadow-md shadow-gray-400/50',
          text: 'text-gray-800'
        };
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'news':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent': return 'KHẨN CẤP';
      case 'warning': return 'CẢNH BÁO';
      case 'news': return 'TIN TỨC';
      case 'info': return 'THÔNG TIN';
      default: return 'THÔNG BÁO';
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'news': return 'bg-blue-50 border-blue-200';
      case 'info': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-800';
      case 'warning': return 'text-amber-800';
      case 'news': return 'text-blue-800';
      case 'info': return 'text-gray-800';
      default: return 'text-gray-800';
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy thông báo</h2>
          <p className="text-gray-600 mb-6 text-center">Thông báo này có thể đã bị xóa hoặc không còn khả dụng</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
            <button onClick={() => navigate(-1)} className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-bold flex-1">Chi tiết thông báo</h1>
          </div>
        </div>

        <div className="space-y-4">
          {/* Banner Image - Full Width */}
          {alert.banner_image && (
            <div className="w-full">
              <img
                src={alert.banner_image}
                alt={alert.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  console.error('Failed to load banner image:', alert.banner_image);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => console.log('Banner loaded:', alert.banner_image)}
              />
            </div>
          )}

          <div className="px-4 space-y-4">
            {/* Type Badge */}
            <div className="mb-2">
              <div className={`inline-flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full ${getTheme(alert.type).wrapper}`}>
                <div className={`p-1.5 rounded-full text-white ${getTheme(alert.type).iconBg}`}>
                  {getBadgeIcon(alert.type)}
                </div>
                <span className={`font-bold text-sm tracking-widest uppercase ${getTheme(alert.type).text}`}>
                  {getTypeLabel(alert.type)}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{alert.title}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(alert.created_at)}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Nội dung</h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{alert.content}</div>
            </div>

            {/* Gallery */}
            {alert.gallery && alert.gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Thư viện hình ảnh ({alert.gallery.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {alert.gallery.map((mediaUrl, index) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                    return (
                      <div
                        key={index}
                        onClick={() => { setSelectedMediaIndex(index); setShowPreview(true); }}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer relative group border border-gray-200 hover:border-blue-400 transition-all"
                      >
                        {isVideo ? (
                          <>
                            <video className="w-full h-full object-cover">
                              <source src={mediaUrl} />
                            </video>
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={mediaUrl}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                console.error(`Failed to load gallery image ${index}:`, mediaUrl);
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23999"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /%3E%3C/svg%3E';
                                target.classList.add('p-6');
                              }}
                              onLoad={() => console.log(`Gallery ${index} loaded:`, mediaUrl)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Article Link Preview */}
            {alert.article_url && (
              <div className="bg-white rounded-2xl shadow-sm p-4 ring-1 ring-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📰</span> Bài báo liên quan
                </h3>
                
                <a
                  href={alert.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors ring-1 ring-gray-200"
                >
                  {urlMetadata?.image && (
                    <div className="w-full h-48 overflow-hidden relative">
                        <img 
                            src={urlMetadata.image} 
                            alt={urlMetadata.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                        />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">
                      {urlMetadata?.siteName || new URL(alert.article_url).hostname}
                    </div>
                    
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors text-base">
                      {urlMetadata?.title || alert.article_url}
                    </h4>
                    
                    {urlMetadata?.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                        {urlMetadata.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-blue-600 text-sm font-medium gap-1">
                      Đọc chi tiết
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* Validity Period */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Thời gian hiệu lực</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium mr-2">Bắt đầu:</span>
                  {formatDate(alert.start_time)}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium mr-2">Kết thúc:</span>
                  {formatDate(alert.end_time)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button onClick={() => setShowActionModal(true)} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
                Báo cáo sự cố liên quan
              </button>
              <button onClick={() => navigate('/')} className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Quay lại trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && alert?.gallery && alert.gallery.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center p-4" onClick={() => setShowPreview(false)}>
            <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 z-51 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center max-w-4xl" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const mediaUrl = alert.gallery[selectedMediaIndex];
                const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
                return isVideo ? (
                  <video controls autoPlay className="max-w-full max-h-full rounded-lg">
                    <source src={mediaUrl} />
                  </video>
                ) : (
                  <img src={mediaUrl} alt={`Preview ${selectedMediaIndex + 1}`} className="max-w-full max-h-full rounded-lg object-contain" />
                );
              })()}
            </div>
            {alert.gallery && alert.gallery.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
                <button onClick={(e) => { e.stopPropagation(); setSelectedMediaIndex(selectedMediaIndex === 0 ? (alert.gallery?.length || 1) - 1 : selectedMediaIndex - 1); }} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-white text-sm font-medium px-3 py-1 bg-white bg-opacity-20 rounded-full">
                  {selectedMediaIndex + 1} / {alert.gallery.length}
                </span>
                <button onClick={(e) => { e.stopPropagation(); setSelectedMediaIndex(selectedMediaIndex === (alert.gallery?.length || 1) - 1 ? 0 : selectedMediaIndex + 1); }} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-white w-full rounded-t-2xl p-6 animate-in slide-in-from-bottom">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Báo cáo sự cố liên quan</h2>
              <p className="text-gray-600 mb-6">Chọn cách thức báo cáo sự cố của bạn:</p>
              <div className="space-y-3">
                <button onClick={() => { setShowActionModal(false); navigate('/quick-report'); }} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Báo cáo nhanh</h3>
                    <p className="text-sm text-gray-500">Điền thông tin cơ bản nhanh chóng</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button onClick={() => { setShowActionModal(false); navigate('/user-report'); }} className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Báo cáo chi tiết</h3>
                    <p className="text-sm text-gray-500">Điền form đầy đủ với tất cả chi tiết</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <button onClick={() => setShowActionModal(false)} className="w-full mt-4 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium">
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
