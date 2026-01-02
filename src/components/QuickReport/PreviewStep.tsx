import React from "react";
import { RotateCcw, ArrowRight } from "lucide-react";

interface PreviewStepProps {
  imageBlob: Blob;
  onRetake: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * BƯỚC 3: Preview & Confirm Image
 * Hiển thị ảnh vừa chụp, cho phép chụp lại hoặc tiếp tục
 */
const PreviewStep: React.FC<PreviewStepProps> = ({
  imageBlob,
  onRetake,
  onConfirm,
  isLoading,
}) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if (!imageBlob) {
      setImageSrc(null);
      return;
    }

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Xác nhận ảnh</h2>
          <p className="text-gray-600 mt-2">Hình ảnh này có rõ ràng không?</p>
        </div>

        {/* Image Preview - same aspect ratio as camera live preview */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 aspect-video flex items-center justify-center">
          {imageSrc ? (
            <img src={imageSrc} alt="Preview" className="w-full h-auto object-cover" />
          ) : (
            <div className="flex items-center justify-center text-gray-500">Đang tải ảnh...</div>
          )}
        </div>

        {/* Image Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-sm text-blue-700">
          <p>✓ Ảnh được chụp lúc: <strong>{new Date().toLocaleTimeString('vi-VN')}</strong></p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetake}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            Chụp lại
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            <ArrowRight className="w-4 h-4" />
            {isLoading ? "Tiếp tục..." : "Tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
