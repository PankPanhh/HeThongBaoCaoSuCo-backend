import React from 'react';
import { Header } from 'zmp-ui';

const ReportFloodPage: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <Header title="Gửi báo cáo ngập nước" showBackIcon />

      <section className="bg-white p-4 rounded shadow" style={{ marginTop: '4rem' }}>
        <h1 className="text-xl font-semibold mb-2">Gửi báo cáo ngập nước</h1>
        <p className="text-sm text-gray-600 mb-4">Mở form báo cáo với GPS + upload ảnh (placeholder).</p>

        <div className="space-y-3">
          <button
            onClick={() => window.alert('Mở form báo cáo (placeholder)')}
            className="w-full bg-amber-600 text-white py-2 rounded"
          >
            Mở form báo cáo
          </button>

          <div className="text-sm text-gray-500">Hoặc gọi hotline nếu cần hỗ trợ khẩn cấp.</div>
        </div>
      </section>
    </main>
  );
};

export default ReportFloodPage;
