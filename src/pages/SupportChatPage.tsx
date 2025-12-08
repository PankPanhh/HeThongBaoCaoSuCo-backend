import React from 'react';
import { Page, Header } from 'zmp-ui';
import SupportChat from '@/components/SupportChat/SupportChat';

export default function SupportChatPage() {
  return (
    <Page className="min-h-screen bg-gray-50">
      <Header title="Hỗ trợ khách hàng" showBackIcon />
      <div className="w-full h-screen p-0 m-0">
        <SupportChat onClose={() => window.history.back()} />
      </div>
    </Page>
  );
}
