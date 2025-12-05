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
      // ignore
    }
  };

  return (
    <Box className="bg-white shadow-md" style={{ zIndex: 12 }}>
      <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</label>
          <select
            className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150"
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
          <label className="block text-sm font-medium mb-2 text-gray-700">Loại sự cố</label>
          <select
            className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-150"
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

        <div className="w-full sm:w-48 flex items-end">
          <button
            onClick={() => { setFilters({ status: 'all', type: 'all' }); try { onApplyFilters({ status: 'all', type: 'all' }); } catch {} }}
            className="w-full sm:w-auto bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </Box>
  );
};

export default IncidentFilterBar;