import React from 'react';
import { Page, Header } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import SupportChat from '@/components/SupportChat/SupportChat';

export default function SupportChatPage() {
  const navigate = useNavigate();
  return (
    <Page className="min-h-screen bg-gray-50">
      <Header title="Hỗ trợ khách hàng" showBackIcon />
      <div className="w-full h-screen p-0 m-0">
        <SupportChat onClose={() => navigate(-1)} />
      </div>
    </Page>
  );
}
