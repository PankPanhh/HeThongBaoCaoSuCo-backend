import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { Incident } from '@/types/incident';
import IncidentDetailComponent from '@/components/Incidents/IncidentDetailComponent';
import apiFetch from '@/lib/api';

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
  const navigate = useNavigate();
  const parts = window.location.pathname.split('/').filter(Boolean);
  const id = parts.length >= 2 ? parts[1] : parts[parts.length - 1] || '';

  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncident = async () => {
      if (!id) {
        setError('ID sự cố không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/incidents/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setIncident(result.data);
        } else {
          setError('Không tìm thấy sự cố');
        }
      } catch (err) {
        console.error('[IncidentDetailPage] Error:', err);
        setError('Không thể tải thông tin sự cố');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  if (isLoading) {
    return (
      <Page>
        <Box className="p-4">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <Text className="mt-3 text-gray-500">Đang tải...</Text>
          </div>
        </Box>
      </Page>
    );
  }

  if (error || error || !incident) {
    return (
      <Page>
        <Box className="p-4">
          <Text className="text-center text-gray-500">{error || 'Không tìm thấy sự cố.'}</Text>
          <div className="mt-4 text-center">
            <Button onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="bg-gray-50">
      <Box className="p-4 max-w-4xl mx-auto">
        <div style={{ marginTop: '3rem' }}>
          <IncidentDetailComponent incident={incident} onClose={() => navigate(-1)} />
        </div>
      </Box>
    </Page>
  );
};

export default IncidentDetailPage;
