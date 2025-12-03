// IncidentList.tsx

import React from 'react';
import { Box, Text } from 'zmp-ui';
import IncidentListItem from './IncidentListItem';
import { Incident } from '@/types/incident';

interface IncidentListProps {
  incidents: Incident[];
  isLoading: boolean;
  onLoadMore: () => void; 
  hasMore: boolean;
  onItemClick: (id: string) => void;
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents, isLoading, onLoadMore, hasMore, onItemClick }) => {
  return (
    <Box className="space-y-3 pt-3">
      {incidents.length > 0 ? (
        incidents.map((incident) => (
          <IncidentListItem 
            key={incident.id} 
            incident={incident} 
            onSelect={onItemClick} 
          />
        ))
      ) : (
        <Text className="text-center text-gray-500 italic py-6">
          Không tìm thấy sự cố nào phù hợp với bộ lọc.
        </Text>
      )}

      <Box className="text-center py-4">
        {isLoading && <Text.Title size="small">Đang tải...</Text.Title>}
        {!isLoading && hasMore && (
          <button 
            onClick={onLoadMore} 
            className="text-blue-600 font-medium active:text-blue-700"
          >
            Tải thêm sự cố
          </button>
        )}
        {!isLoading && !hasMore && incidents.length > 0 && (
          <Text size="xSmall" className="text-gray-500">Đã tải hết tất cả sự cố.</Text>
        )}
      </Box>
    </Box>
  );
};

export default IncidentList;