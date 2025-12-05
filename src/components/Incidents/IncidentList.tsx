import React from 'react';
import { Box, Text, Icon } from 'zmp-ui'; // Import Icon
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
    <Box className="space-y-4 pt-3 max-w-4xl mx-auto">
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

      <Box className="text-center py-6">
        {isLoading && incidents.length === 0 && (
          <div className="space-y-3">
            {[1,2,3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-4 max-w-4xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && hasMore && (
          <button
            onClick={onLoadMore}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition-all shadow"
          >
            Tải thêm sự cố
          </button>
        )}

        {!isLoading && !hasMore && incidents.length > 0 && (
          <div className="inline-block bg-gray-100 text-gray-600 rounded-lg px-4 py-2">Đã tải hết tất cả sự cố.</div>
        )}
      </Box>
    </Box>
  );
};

export default IncidentList;