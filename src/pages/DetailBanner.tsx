import React from 'react';
import { Header } from 'zmp-ui';
import { DetailBanner as BannerDetail } from '../components/Banner';

const DetailBannerPage: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <Header title="Chi tiết Cảnh báo" showBackIcon />

      <BannerDetail />
    </main>
  );
};

export default DetailBannerPage;
