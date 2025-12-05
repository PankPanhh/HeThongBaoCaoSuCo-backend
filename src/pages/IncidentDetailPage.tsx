import React from 'react';
import { Page, Box, Text, Button } from 'zmp-ui';
import ALL_MOCK_INCIDENTS from '@/data/mockIncidents';
import { Incident } from '@/types/incident';
import IncidentDetailComponent from '@/components/Incidents/IncidentDetailComponent';

const getStatusClasses = (status: Incident['status']) => {
  switch (status) {
    case 'Đã xử lý':
      return { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' };
    case 'Đang xử lý':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '⏳' };
    case 'Đã gửi':
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📤' };
  }
};

const IncidentDetailPage: React.FC = () => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const id = parts.length >= 2 ? parts[1] : parts[parts.length - 1] || '';

  const incident = ALL_MOCK_INCIDENTS.find((it) => it.id === id);

  if (!incident) {
    return (
      <Page>
        <Box className="p-4">
          <Text className="text-center text-gray-500">Không tìm thấy sự cố.</Text>
          <div className="mt-4 text-center">
            <Button onClick={() => window.history.back()}>Quay lại</Button>
          </div>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      <Box className="p-4 max-w-4xl mx-auto">
        <div style={{ marginTop: '3rem' }}>
          <IncidentDetailComponent incident={incident} onClose={() => window.history.back()} />
        </div>
      </Box>
    </Page>
  );
};

export default IncidentDetailPage;
