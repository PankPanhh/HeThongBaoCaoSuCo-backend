import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Header, Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import IncidentFilterBar from '../components/Incidents/IncidentFilterBar';
import IncidentList from '../components/Incidents/IncidentList';
import { Incident } from '@/types/incident';
import ALL_MOCK_INCIDENTS from '@/data/mockIncidents';

const fetchIncidents = (filters: any, page: number, pageSize: number): { incidents: Incident[], hasMore: boolean } => {
  let filtered = ALL_MOCK_INCIDENTS.filter(item => {
    const statusMatch = filters.status === 'all' || item.status === filters.status;
    const typeMatch = filters.type === 'all' || item.type === filters.type;
    return statusMatch && typeMatch;
  });
  
  filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const incidents = filtered.slice(start, end);
  
  const hasMore = end < filtered.length;

  return { incidents, hasMore };
};

const PAGE_SIZE = 5;

const IncidentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);

  const loadIncidents = (reset = false) => {
    setIsLoading(true);
    const pageToFetch = reset ? 1 : currentPage;
    
    setTimeout(() => {
      let filteredData = ALL_MOCK_INCIDENTS.filter(item => {
        const statusMatch = filters.status === 'all' || item.status === filters.status;
        const typeMatch = filters.type === 'all' || item.type === filters.type;
        return statusMatch && typeMatch;
      });
      filteredData.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setTotalFilteredCount(filteredData.length); 

      const start = (pageToFetch - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const resultIncidents = filteredData.slice(start, end);
      const hasMoreResult = end < filteredData.length;

      if (reset) {
        setIncidents(resultIncidents);
        setCurrentPage(1);
      } else {
        setIncidents(prev => [...prev, ...resultIncidents]);
      }
      
      setHasMore(hasMoreResult);
      setIsLoading(false);
    }, 500); 
  };

  useEffect(() => {
    loadIncidents(true);
  }, [filters]); 

  useEffect(() => {
    if (currentPage > 1) {
        loadIncidents(false);
    }
  }, [currentPage]);
  

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showFilters]);
  
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handleItemClick = (id: string) => {
    navigate(`/incidents/${id}`);
  };

  return (
    <Page className="bg-gray-50">
      <Header title="Danh sách Sự cố" showBackIcon />

      <div className="max-w-4xl mx-auto p-4 overflow-x-hidden">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo loại, vị trí hoặc mô tả..."
            className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            onChange={(e) => {  }}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="hidden md:block">
            <IncidentFilterBar onApplyFilters={handleApplyFilters} />
          </div>

          <div className="md:hidden w-full">
            <button
              onClick={() => setShowFilters(true)}
              className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left shadow-sm"
            >
              <span className="text-sm text-gray-700">Bộ lọc &darr;</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-50 flex items-start justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowFilters(false)} />
            <div className="relative w-full max-w-md mt-20 mx-4 bg-white rounded-lg shadow-xl overflow-auto">
              <div className="p-3 border-b flex items-center justify-between">
                <div className="font-medium">Bộ lọc</div>
                <button className="text-gray-600" onClick={() => setShowFilters(false)}>Đóng ✕</button>
              </div>
              <div className="p-4">
                <IncidentFilterBar onApplyFilters={(f:any) => { handleApplyFilters(f); setShowFilters(false); }} />
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <Icon icon={"zi-list" as any} className="mr-3 text-blue-600 text-xl" />
              <div>
                <Text.Title size="small" className="text-gray-800 font-semibold">
                  {totalFilteredCount} Sự cố được tìm thấy
                </Text.Title>
                <Text size="xSmall" className="text-gray-500">{incidents.length} đang hiển thị</Text>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <IncidentList
              incidents={incidents}
              isLoading={isLoading}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default IncidentsListPage;
