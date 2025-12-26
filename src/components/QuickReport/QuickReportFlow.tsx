import React, { useState } from "react";
import { apiFetch, getApiBase, testConnectivity } from "../../lib/api";
import { AlertCircle } from "lucide-react";
import CameraStep from "./CameraStep";
import PreviewStep from "./PreviewStep";
import QuickReportFormStep from "./QuickReportFormStep";
import SuccessStep from "./SuccessStep";

type QuickReportStep = "camera" | "preview" | "form" | "success" | "error";

interface QuickReportFlowProps {
  onClose?: () => void;
  userLocation?: string;
}

/**
 * MAIN: Quick Report Flow Container
 * Điều phối toàn bộ luồng báo cáo nhanh
 * 
 * Sử dụng MOCK DATA cho development
 */
const QuickReportFlow: React.FC<QuickReportFlowProps> = ({
  onClose,
  userLocation = "Vị trí hiện tại",
}) => {
  const [currentStep, setCurrentStep] = useState<QuickReportStep>("camera");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [successData, setSuccessData] = useState<{
    incidentId: string;
    incidentType: string;
  } | null>(null);

  // Diagnostic state
  const [diagnosticInfo, setDiagnosticInfo] = useState<{
    apiBase: string;
    connectivityTest?: { success: boolean; message: string; details?: any };
  }>({
    apiBase: getApiBase(),
  });

  // Run connectivity test on mount
  React.useEffect(() => {
    const runDiagnostics = async () => {
      console.log("[QuickReportFlow] Running diagnostics...");
      const connectivity = await testConnectivity();
      setDiagnosticInfo(prev => ({
        ...prev,
        connectivityTest: connectivity,
      }));
    };

    runDiagnostics();
  }, []);

  // BƯỚC 2: Handle image capture from camera
  const handleCameraCapture = async (blob: Blob) => {
    setImageBlob(blob);
    setCurrentStep("preview");
    setError(undefined);
  };

  // BƯỚC 3: Handle retake
  const handleRetake = () => {
    setImageBlob(null);
    setCurrentStep("camera");
  };

  // BƯỚC 3: Handle preview confirm
  const handlePreviewConfirm = () => {
    setCurrentStep("form");
  };

  // BƯỚC 4 & 5: Handle form submit - call real backend API
  const handleFormSubmit = async (formData: {
    type: string;
    description?: string;
    location?: string;
  }) => {
    if (!imageBlob) {
      setError("Ảnh không tồn tại. Vui lòng chụp lại.");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      // STEP 1: Upload image to backend
      const uploadForm = new FormData();
      uploadForm.append("file", imageBlob);

      const uploadResponse = await apiFetch("/api/incidents/upload-image", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadResponse.ok) {
        // Try to parse JSON error, otherwise read text (HTML) for diagnosis
        let errText = undefined as string | undefined;
        try {
          const errData = await uploadResponse.json();
          errText = errData?.error || JSON.stringify(errData);
        } catch (e) {
          try {
            errText = await uploadResponse.text();
          } catch (_) {
            errText = undefined;
          }
        }
        throw new Error(errText || "Lỗi tải ảnh");
      }

      let uploadedData: any;
      try {
        uploadedData = await uploadResponse.json();
      } catch (e) {
        const text = await uploadResponse.text().catch(() => "(no body)");
        console.error("Upload response is not JSON:", text);
        throw new Error("Invalid JSON response from upload endpoint: " + (text || "(empty)"));
      }
      const imageUrl = uploadedData?.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("Không nhận được URL ảnh từ server");
      }

      // STEP 2: Create quick report with image URL
      const quickReportBody = {
        imageUrl,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        timestamp: new Date().toISOString(),
      };

      const reportResponse = await apiFetch("/api/incidents/quick-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quickReportBody),
      });

      if (!reportResponse.ok) {
        let errText = undefined as string | undefined;
        try {
          const errData = await reportResponse.json();
          errText = errData?.error || JSON.stringify(errData);
        } catch (e) {
          errText = await reportResponse.text().catch(() => undefined);
        }
        throw new Error(errText || "Lỗi tạo báo cáo");
      }

      let reportData: any;
      try {
        reportData = await reportResponse.json();
      } catch (e) {
        const text = await reportResponse.text().catch(() => "(no body)");
        console.error("Report response is not JSON:", text);
        throw new Error("Invalid JSON response from report endpoint: " + (text || "(empty)"));
      }
      const incidentId = reportData?.data?.id;

      // Get type label for display
      const typeLabels: Record<string, string> = {
        "dien": "🔌 Sự cố điện",
        "nuoc": "💧 Sự cố nước",
        "an-ninh": "🔒 Vấn đề an ninh",
        "giao-thong": "🚗 Giao thông",
        "moi-truong": "🌍 Môi trường",
        "khac": "📝 Khác",
      };

      console.log("✅ Quick Report Created", {
        incidentId,
        type: formData.type,
        typeLabel: typeLabels[formData.type],
        description: formData.description,
        location: formData.location,
        imageSize: imageBlob.size,
        imageUrl,
        timestamp: quickReportBody.timestamp,
      });

      // Show success
      setSuccessData({
        incidentId: incidentId || `INC-${Date.now()}`,
        incidentType: typeLabels[formData.type] || formData.type,
      });
      setCurrentStep("success");
    } catch (err: any) {
      console.error("Report submission error:", err);
      // Network / CORS failures surface as TypeError: Failed to fetch
      const errMsg = err?.message?.toLowerCase() || "";
      if (err instanceof TypeError && (errMsg.includes("failed to fetch") || errMsg.includes("network"))) {
        setError(
          "❌ Không thể kết nối tới server.\n\n" +
          "Nguyên nhân có thể:\n" +
          "• API_BASE chưa được cấu hình cho môi trường Zalo\n" +
          "• Backend chưa cho phép CORS từ origin này\n" +
          "• Mạng hiện tại bị chặn hoặc không ổn định\n\n" +
          "Vui lòng liên hệ admin để kiểm tra cấu hình."
        );
      } else {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle close/back to home
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Navigate to home or reset state
      setCurrentStep("camera");
      setImageBlob(null);
        setError(undefined);
      setSuccessData(null);
    }
  };

  // Render current step
  return (
    <div className="quick-report-flow">
      {currentStep === "camera" && (
        <CameraStep onCapture={handleCameraCapture} error={error} />
      )}

      {currentStep === "preview" && imageBlob && (
        <PreviewStep
          imageBlob={imageBlob}
          onRetake={handleRetake}
          onConfirm={handlePreviewConfirm}
          isLoading={isLoading}
        />
      )}

      {currentStep === "form" && imageBlob && (
        <QuickReportFormStep
          imageBlob={imageBlob}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
          userLocation={userLocation}
        />
      )}

      {currentStep === "success" && successData && (
        <SuccessStep
          incidentId={successData.incidentId}
          incidentType={successData.incidentType}
          onClose={handleClose}
          error={error}
        />
      )}

      {/* Permission Error State */}
      {currentStep === "error" && error && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Không thể gửi báo cáo</h2>
              <p className="text-red-600 mt-2">{error}</p>
            </div>

            {/* Diagnostic Information */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4 text-xs">
              <h3 className="font-semibold mb-2">🔍 Thông tin chẩn đoán:</h3>
              <div className="space-y-1">
                <p><strong>API Base:</strong> {diagnosticInfo.apiBase}</p>
                <p><strong>Connectivity:</strong> {
                  diagnosticInfo.connectivityTest ?
                    (diagnosticInfo.connectivityTest.success ? "✅ OK" : "❌ Failed") :
                    "⏳ Testing..."
                }</p>
                {diagnosticInfo.connectivityTest && !diagnosticInfo.connectivityTest.success && (
                  <p><strong>Connectivity Error:</strong> {diagnosticInfo.connectivityTest.message}</p>
                )}
                <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickReportFlow;
