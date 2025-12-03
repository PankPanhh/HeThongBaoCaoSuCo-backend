// IncidentListItem.tsx

import React from 'react';
import { Box, Text } from 'zmp-ui';
import { Incident } from '@/types/incident';

interface IncidentListItemProps {
  incident: Incident;
  onSelect: (id: string) => void;
}

const IncidentListItem: React.FC<IncidentListItemProps> = ({ incident, onSelect }) => {
  const getStatusClasses = (status: Incident['status']) => {
    switch (status) {
      case 'Đã xử lý':
        return 'bg-green-100 text-green-700';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-700';
      case 'Đã gửi':
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-3 border-l-4 border-blue-500 active:bg-gray-50"
      onClick={() => onSelect(incident.id)} 
    >
      <div className="flex justify-between items-start">
        <Box className="flex-1 min-w-0 pr-2">
          <Text.Title size="small" className="truncate text-blue-800">
            {incident.type}
          </Text.Title>
          <Text size="xSmall" className="text-gray-500 mt-0.5 truncate">
            {incident.location}
          </Text>
        </Box>
        
        <Text size="xSmall" className="text-gray-500 flex-shrink-0">
          {incident.time}
        </Text>
      </div>

      <Box className="mt-2">
        <span 
          className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusClasses(incident.status)}`}
        >
          {incident.status}
        </span>
      </Box>
    </div>
  );
};

export default IncidentListItem;