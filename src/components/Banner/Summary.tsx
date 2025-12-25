import React from 'react';

interface Props {
  text?: string;
}

const Summary: React.FC<Props> = ({
  text = 'Mưa lớn có khả năng kéo dài trong 1–3 giờ tới. Một số khu vực có thể xuất hiện ngập cục bộ. Người dùng được khuyến nghị lưu ý khi di chuyển và báo cáo nếu phát hiện điểm ngập.',
}) => {
  return (
    <div className="mt-3 text-gray-700 text-sm">
      {text}
    </div>
  );
};

export default Summary;
