// IncidentFilterBar.tsx

import React from 'react';
import { Box, Button, Icon } from 'zmp-ui';

type Status = 'all' | 'Đã gửi' | 'Đang xử lý' | 'Đã xử lý';
type IncidentType = 'all' | 'Ngập nước' | 'Đèn đường hỏng' | 'Rác tràn' | 'Cây đổ' | 'Hư hỏng mặt đường';

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'Đã gửi', label: 'Đã gửi' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đã xử lý', label: 'Đã xử lý' },
];

const TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
  { value: 'all', label: 'Tất cả loại sự cố' },
  { value: 'Ngập nước', label: 'Ngập nước' },
  { value: 'Đèn đường hỏng', label: 'Đèn đường hỏng' },
  { value: 'Rác tràn', label: 'Rác tràn' },
  { value: 'Cây đổ', label: 'Cây đổ' },
  { value: 'Hư hỏng mặt đường', label: 'Hư hỏng mặt đường' },
];

interface IncidentFilterBarProps {
  onApplyFilters: (filters: { status: Status; type: IncidentType }) => void;
}

const IncidentFilterBar: React.FC<IncidentFilterBarProps> = ({ onApplyFilters }) => {
  const [filters, setFilters] = React.useState<{ status: Status; type: IncidentType }>({
    status: 'all',
    type: 'all',
  });

  const handleChange = (name: 'status' | 'type', value?: string) => {
    const next = {
      ...filters,
      [name]: (value ?? 'all') as Status | IncidentType,
    } as { status: Status; type: IncidentType };

    setFilters(next);
    try {
      onApplyFilters(next);
    } catch (e) {
    }
  };

  return (
    <Box className="bg-white p-4 shadow-md sticky top-0 z-10 space-y-3">
      <div className="flex space-x-2" style={{ marginTop: '4rem' }}>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Loại sự cố</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
    </Box>
  );
};

export default IncidentFilterBar;