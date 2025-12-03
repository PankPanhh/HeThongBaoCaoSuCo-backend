// IncidentsListPage.tsx

import React, { useState, useEffect } from 'react';
import { navigateTo } from 'zmp-sdk';
import { Page, Box, Text, Header } from 'zmp-ui';
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

const useNavigateToDetail = (id: string) => {
    navigateTo({ path: `/incidents/${id}` });
};

const PAGE_SIZE = 5;

const IncidentsListPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadIncidents = (reset = false) => {
    setIsLoading(true);
    const pageToFetch = reset ? 1 : currentPage;
    
    setTimeout(() => {
      const result = fetchIncidents(filters, pageToFetch, PAGE_SIZE);
      
      if (reset) {
        setIncidents(result.incidents);
        setCurrentPage(1);
      } else {
        setIncidents(prev => [...prev, ...result.incidents]);
      }
      
      setHasMore(result.hasMore);
      setIsLoading(false);
    }, 500); 
  };

  useEffect(() => {
    loadIncidents(true);
  }, [filters]); 

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };
  
  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
      loadIncidents(false);
    }
  };
  
  const handleItemClick = (id: string) => {
    useNavigateToDetail(id);
  };

  return (
    <Page className="bg-gray-50">
      <Header title="Danh sách Sự cố" showBackIcon />

      <IncidentFilterBar onApplyFilters={handleApplyFilters} />

      <Box className="p-4">
        <Text.Title size="small" className="pb-2">
          Kết quả ({incidents.length} sự cố được hiển thị)
        </Text.Title>

        <IncidentList
          incidents={incidents}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          onItemClick={handleItemClick}
        />
      </Box>
    </Page>
  );
};

export default IncidentsListPage;