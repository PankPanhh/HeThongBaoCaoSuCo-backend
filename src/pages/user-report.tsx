import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IncidentStatus } from "@/types/incident";
import { toast } from "sonner";

// Incident types based on mock data
const INCIDENT_TYPES = [
  "Cây đổ",
  "Hư hỏng mặt đường",
  "Ngập nước",
  "Đèn đường hỏng",
  "Rác tràn",
  "Khác",
];

function UserReport() {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    media: [] as File[],
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 5 images
    const validFiles = files.slice(0, 5 - formData.media.length);

    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...validFiles],
    }));

    // Create preview URLs using FileReader for better compatibility
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.location) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demonstration
          const isSuccess = Math.random() > 0.1; // 90% success rate

          if (isSuccess) {
            console.log("Submitting incident report:", {
              ...formData,
              status: "Đã gửi" as IncidentStatus,
              time: "Vừa xong",
              id: Date.now().toString(),
            });
            resolve(true);
          } else {
            reject(new Error("Không thể kết nối đến máy chủ"));
          }
        }, 1500);
      });

      toast.success("Gửi báo cáo thành công!", {
        description: "Cảm ơn bạn đã góp phần cải thiện cơ sở hạ tầng",
        duration: 3000,
      });

      // Reset form
      setFormData({
        type: "",
        location: "",
        description: "",
        media: [],
      });
      // Clean up preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Gửi báo cáo thất bại", {
        description:
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Báo Cáo Sự Cố
          </h1>
          <p className="text-gray-600">
            Gửi thông tin sự cố để chúng tôi xử lý nhanh chóng
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Thông Tin Sự Cố</CardTitle>
            <CardDescription>
              Điền đầy đủ thông tin để giúp chúng tôi xử lý sự cố hiệu quả hơn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Incident Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Loại Sự Cố <span className="text-red-500">*</span>
                </Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="">-- Chọn loại sự cố --</option>
                  {INCIDENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Vị Trí <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="VD: Quận 1, Đường Nguyễn Huệ"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  required
                />
                <p className="text-xs text-gray-500">
                  Nhập địa chỉ cụ thể để chúng tôi dễ dàng tìm thấy
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả Chi Tiết</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về sự cố (tùy chọn)..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label htmlFor="media">Hình Ảnh (Tối đa 5 ảnh)</Label>
                <div className="space-y-3">
                  <Input
                    id="media"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={formData.media.length >= 5}
                    className="cursor-pointer"
                  />

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Đã tải: {formData.media.length}/5 ảnh
                </p>
              </div>

              {/* Status Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Trạng thái báo cáo
                    </h4>
                    <p className="text-sm text-blue-700">
                      Sau khi gửi, báo cáo sẽ có trạng thái "
                      <strong>Đã gửi</strong>". Chúng tôi sẽ cập nhật thành "
                      <strong>Đang xử lý</strong>" khi bắt đầu và "
                      <strong>Đã xử lý</strong>" khi hoàn tất.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi Báo Cáo"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      type: "",
                      location: "",
                      description: "",
                      media: [],
                    });
                    setPreviewImages([]);
                  }}
                  size="lg"
                >
                  Xóa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Mọi thông tin báo cáo sẽ được xử lý nhanh chóng trong vòng 24-48 giờ
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserReport;
