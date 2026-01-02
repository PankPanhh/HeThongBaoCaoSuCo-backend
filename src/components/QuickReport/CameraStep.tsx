import React, { useState, useRef, useEffect } from "react";
import { Camera, AlertCircle } from "lucide-react";

interface CameraStepProps {
  onCapture: (imageBlob: Blob) => void;
  isLoading?: boolean;
  error?: string;
}

/**
 * BƯỚC 2: Camera Capture Component
 * Người dùng chụp ảnh hiện trường
 */
const CameraStep: React.FC<CameraStepProps> = ({ onCapture, isLoading, error }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [useFileFallback, setUseFileFallback] = useState(false);

  useEffect(() => {
    if (!isCameraActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Back camera
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
        setUseFileFallback(false);
      } catch (err) {
        console.error("Camera error:", err);
        // enable fallback to file input capture which usually works in restrictive WebViews
        setCameraError((err as any)?.message || "Không thể mở camera. Vui lòng kiểm tra quyền truy cập.");
        setUseFileFallback(true);
      }
    };

    startCamera();

    // cleanup when isCameraActive changes or component unmounts
    return () => {
      if (streamRef.current) {
        try {
          streamRef.current.getTracks().forEach((t) => t.stop());
        } catch (e) {
          /* ignore */
        }
        streamRef.current = null;
      }
      if (videoRef.current) {
        try {
          (videoRef.current.srcObject as MediaStream | null) = null;
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            onCapture(blob);
            // stop camera explicitly after capture
            setIsCameraActive(false);
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((t) => t.stop());
              streamRef.current = null;
            }
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // pass file blob to onCapture
    onCapture(f);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
    // ensure camera is stopped when using file fallback
    setIsCameraActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Chụp ảnh hiện trường</h2>
          <p className="text-gray-600 mt-2">Hãy chụp ảnh rõ nét để giúp chúng tôi xử lý nhanh hơn</p>
        </div>

        {/* Camera Preview or Initial State */}
        {!isCameraActive ? (
          <>
            {/* Placeholder preview area - same aspect ratio as live camera */}
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-6 aspect-video flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>

            <div className="mb-6 text-center">
              <p className="text-gray-600">Bấm để mở camera</p>
            </div>

            <button
              onClick={() => setIsCameraActive(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-3"
            >
              Mở Camera
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition"
            >
              Quay lại
            </button>

            {/* Fallback: file input capture for restrictive WebViews (Zalo, in-app browsers) */}
            {useFileFallback && (
              <>
                <div className="mt-4 text-sm text-gray-500 text-center">Trình duyệt chặn camera, sử dụng phương án thay thế:</div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Mở Camera (dùng máy ảnh của thiết bị)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </>
            )}
          </>
        ) : (
          <>
            {/* Video Stream */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-6 aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Capture Crosshair */}
              <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none opacity-50" />
            </div>

            {/* Canvas for image capture (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Capture Button */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setIsCameraActive(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                onClick={handleCapture}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
              >
                {isLoading ? "Xử lý..." : "Chụp ảnh"}
              </button>
            </div>
          </>
        )}

        {/* Error Message */}
        {(error || cameraError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error || cameraError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraStep;
