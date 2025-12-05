import React from 'react';
import { Box, Text, Icon } from 'zmp-ui'; // Import Icon
import { Incident } from '@/types/incident';

interface IncidentListItemProps {
  incident: Incident;
  onSelect: (id: string) => void;
}

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

const getIncidentIcon = (type: Incident['type']) => {
    switch (type) {
        case 'Ngập nước': return 'zi-droplet';
        case 'Đèn đường hỏng': return 'zi-bulb';
        case 'Rác tràn': return 'zi-trash';
        case 'Cây đổ': return 'zi-leaf';
        case 'Hư hỏng mặt đường': return 'zi-road';
        default: return 'zi-placeholder';
    }
};

const IncidentListItem: React.FC<IncidentListItemProps> = ({ incident, onSelect }) => {
  

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
      onClick={() => onSelect(incident.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(incident.id); }}
    >
      <div className="flex justify-between items-start">
        <Box className="flex items-center flex-1 min-w-0 pr-3">
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Icon icon={getIncidentIcon(incident.type) as any} className="text-lg" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Text.Title size="small" className="truncate text-gray-800 font-semibold">
              {incident.type}
            </Text.Title>
            <Text size="xSmall" className="text-gray-500 mt-1 truncate">
              {incident.location}
            </Text>
          </div>
        </Box>

        <Text size="xSmall" className="text-gray-500 flex-shrink-0 ml-2 pt-1">
          {incident.time}
        </Text>
      </div>

      <Box className="mt-3 pl-12 flex items-center space-x-3">
        <span className={`inline-block w-2 h-2 rounded-full ${getStatusClasses(incident.status).split(' ')[0] === 'bg-green-100' ? 'bg-green-500' : getStatusClasses(incident.status).split(' ')[0] === 'bg-yellow-100' ? 'bg-yellow-500' : 'bg-gray-400'}`} aria-hidden="true" />
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusClasses(incident.status)}`}
        >
          {incident.status}
        </span>
      </Box>
    </div>
  );
};

export default IncidentListItem;