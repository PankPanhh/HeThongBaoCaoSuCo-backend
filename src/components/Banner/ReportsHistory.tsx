import React from 'react';

interface Incident {
  id?: string | number;
  time?: string;
  location?: string;
  depth?: string;
  type?: string;
}

interface Props {
  incidents?: Incident[];
}

const ReportsHistory: React.FC<Props> = ({ incidents = [] }) => {
  // Filter to only flood / ngập nước incidents
  const filtered = incidents.filter((it) => {
    const t = (it.type || '').toString().toLowerCase();
    const loc = (it.location || '').toString().toLowerCase();
    return (
      t.includes('flood') ||
      t.includes('ngập') ||
      t.includes('ngap') ||
      loc.includes('ngập') ||
      loc.includes('ngap')
    );
  });

  if (filtered.length === 0) {
    return (
      <div className="mt-4">
        <div className="font-medium text-gray-800 mb-2">Lịch sử báo cáo liên quan</div>
        <div className="text-sm text-gray-600">Không tìm thấy báo cáo ngập nước trong khoảng thời gian này.</div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="font-medium text-gray-800 mb-2">Lịch sử báo cáo liên quan</div>
      <ul className="space-y-2 text-sm">
        {filtered.map((it, idx) => (
          <li key={it.id ?? idx} className="flex items-center justify-between bg-white p-2 rounded border">
            <div className="text-gray-700">
              <div className="font-medium">{it.time || '—'} – {it.location || '—'}</div>
              <div className="text-xs text-gray-500">{it.depth ? `Ngập ${it.depth}` : ''}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsHistory;
