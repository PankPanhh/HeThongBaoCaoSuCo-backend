import React from 'react';
import HeaderAlert from './HeaderAlert';
import Summary from './Summary';
import AreasAtRisk from './AreasAtRisk';
import ReportsHistory from './ReportsHistory';
import UserGuidance from './UserGuidance';
import CTAButtons from './CTAButtons';
import mockIncidents from '../../data/mockIncidents';

const DetailBanner: React.FC = () => {
  // Try to reuse mockIncidents if available. It's optional — keep component resilient.
  const incidents: any[] = Array.isArray(mockIncidents) ? mockIncidents : [];

  // Aggregate simple areas summary from incidents if possible
  const areas = incidents
    .filter((it: any) => {
      const t = (it.type || '').toString().toLowerCase();
      return t.includes('flood') || t.includes('ngập') || t.includes('ngap');
    })
    .slice(0, 5)
    .map((it: any) => ({ name: it.location || '—', status: it.depth ? `Ngập ${it.depth}` : 'Ngập nhẹ' }));

  return (
    <div className="max-w-4xl mx-auto p-4 mt-12">
      <HeaderAlert updatedAt={'14:20 – 10/12/2025'} />
      <Summary />
      <AreasAtRisk areas={areas} />
      <ReportsHistory incidents={incidents} />
      <UserGuidance />
      <CTAButtons />
    </div>
  );
};

export default DetailBanner;
