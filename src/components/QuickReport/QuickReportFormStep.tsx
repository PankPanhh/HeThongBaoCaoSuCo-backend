import React, { useState } from "react";
import { Send, AlertCircle } from "lucide-react";

// Mock data cho loại sự cố
const INCIDENT_TYPES = [
  { id: "dien", label: "🔌 Sự cố điện" },
  { id: "nuoc", label: "💧 Sự cố nước" },
  { id: "an-ninh", label: "🔒 Vấn đề an ninh" },
  { id: "giao-thong", label: "🚗 Giao thông" },
  { id: "moi-truong", label: "🌍 Môi trường" },
  { id: "khac", label: "📝 Khác" },
];

interface QuickReportFormStepProps {
  imageBlob: Blob;
  onSubmit: (data: {
    type: string;
    description?: string;
    location?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
  userLocation?: string;
}

/**
 * BƯỚC 4: Quick Report Form
 * Form rút gọn với auto-filled thông tin
 */
const QuickReportFormStep: React.FC<QuickReportFormStepProps> = ({
  imageBlob,
  onSubmit,
  isLoading,
  error,
  userLocation = "Vị trí hiện tại",
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const reader = new FileReader();
    reader.onload = () => {
      if (!mounted) return;
      setImageSrc(reader.result as string);
    };
    reader.onerror = () => {
      if (!mounted) return;
      setImageSrc(null);
    };
    reader.readAsDataURL(imageBlob);
    return () => {
      mounted = false;
      try {
        reader.abort();
      } catch (e) {
        // ignore
      }
    };
  }, [imageBlob]);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: userLocation,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Helper: fetch device location and optionally reverse-geocode
  const fetchAndSetLocation = async () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ vị trí");
      return;
    }
    setIsLocating(true);
    try {
      const pos: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000 });
      });
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      // set coords initially
      setFormData((prev) => ({ ...prev, location: `${lat}, ${lng}` }));

      // Reverse geocode via Nominatim (best-effort)
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`;
        const resp = await fetch(nomUrl);
        if (resp.ok) {
          const data = await resp.json();
          const display = data?.display_name;
          if (display) setFormData((prev) => ({ ...prev, location: display }));
        }
      } catch (rgErr) {
        console.warn("Reverse geocode failed", rgErr);
      }
    } catch (err: any) {
      console.error("Geolocation error:", err);
      setLocationError(err?.message || "Không thể lấy vị trí");
    } finally {
      setIsLocating(false);
    }
  };

  // Auto-fetch location on mount
  React.useEffect(() => {
    fetchAndSetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type) {
      alert("Vui lòng chọn loại sự cố");
      return;
    }

    await onSubmit(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Báo cáo sự cố</h2>
          <p className="text-gray-600 mt-2">Điền thông tin nhanh để chúng tôi xử lý</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Thumbnail */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 aspect-video flex items-center justify-center">
            {imageSrc ? (
              <img src={imageSrc} alt="Incident" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center text-gray-500">Đang tải ảnh...</div>
            )}
          </div>

          {/* Incident Type - Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại sự cố <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">-- Chọn loại sự cố --</option>
              {INCIDENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description - Optional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết (tùy chọn)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                if (e.target.value.length <= maxDescriptionLength) {
                  setFormData({ ...formData, description: e.target.value });
                }
              }}
              placeholder="Nhập mô tả ngắn..."
              maxLength={maxDescriptionLength}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {descriptionLength}/{maxDescriptionLength} ký tự
            </div>
          </div>

          {/* Location - Auto-filled */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khu vực <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading || isLocating}
              />
              <button
                type="button"
                onClick={fetchAndSetLocation}
                disabled={isLoading || isLocating}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm"
              >
                {isLocating ? "Đang lấy..." : "Cập nhật vị trí"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">📍 Có thể nhập hoặc chọn vị trí</p>
              {locationError && <p className="text-xs text-red-600">{locationError}</p>}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.type || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </form>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-xs text-blue-700">
          <p>💡 <strong>Mẹo:</strong> Vị trí được cập nhật tự động từ thiết bị. Kiểm tra và gửi báo cáo.</p>
        </div>
      </div>
    </div>
  );
};

export default QuickReportFormStep;
