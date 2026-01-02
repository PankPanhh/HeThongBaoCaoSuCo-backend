import React from "react";
import { QuickReportFlow } from "@/components/QuickReport";
import { useNavigate } from "zmp-ui";

/**
 * Quick Report Page
 * Trang báo cáo sự cố nhanh - có thể truy cập trực tiếp
 */
const QuickReportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/"); // Về trang chủ
  };

  return (
    <div className="quick-report-page">
      <QuickReportFlow onClose={handleClose} />
    </div>
  );
};

export default QuickReportPage;
