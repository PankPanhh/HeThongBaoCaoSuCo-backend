import React from "react";
import { CheckCircle, Copy, Home, AlertCircle } from "lucide-react";

interface SuccessStepProps {
  incidentId: string;
  incidentType: string;
  onClose: () => void;
  error?: string | null;
}

/**
 * BƯỚC 6: Success/Result Screen
 * Hiển thị kết quả gửi báo cáo
 */
const SuccessStep: React.FC<SuccessStepProps> = ({
  incidentId,
  incidentType,
  onClose,
  error,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(incidentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-sm">
          {/* Error State */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Lỗi!</h2>
            <p className="text-red-600 mt-2 font-medium">{error}</p>
          </div>

          {/* Retry Button */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Quay lại và thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-sm">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">Thành công!</h1>
          <p className="text-gray-600 mt-2">Báo cáo của bạn đã được gửi</p>
        </div>

        {/* Report Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {/* Incident Type */}
            <div className="border-b pb-4">
              <p className="text-sm text-gray-500 mb-1">Loại sự cố</p>
              <p className="text-lg font-semibold text-gray-800">{incidentType}</p>
            </div>

            {/* Incident ID */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Mã sự cố (Ticket ID)</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                <code className="flex-1 font-mono text-sm font-semibold text-gray-800 break-all">
                  {incidentId}
                </code>
                <button
                  onClick={handleCopyId}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Copy ticket ID"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-2">✓ Đã sao chép</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tiếp theo</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Đội xử lý sẽ nhận báo cáo của bạn</li>
            <li>✓ Bạn sẽ nhận thông báo khi sự cố được cập nhật</li>
            <li>✓ Lưu mã sự cố để theo dõi tiến độ</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </button>
        </div>

        {/* Footer Info */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Cảm ơn bạn đã báo cáo! 🙏<br />
          Bạn có thể quay lại kiểm tra trạng thái bất kỳ lúc nào.
        </p>
      </div>
    </div>
  );
};

export default SuccessStep;
