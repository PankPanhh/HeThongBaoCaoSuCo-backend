import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Header, Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import IncidentFilterBar from '../components/Incidents/IncidentFilterBar';
import IncidentList from '../components/Incidents/IncidentList';
import { Incident } from '@/types/incident';
import apiFetch from '@/lib/api';

const PAGE_SIZE = 10;

const IncidentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: 'all', type: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all incidents from API
  const fetchAllIncidents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[IncidentsListPage] Fetching incidents from API...');
      
      const response = await apiFetch('/api/incidents');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        console.log('[IncidentsListPage] Fetched', result.data.length, 'incidents');
        setAllIncidents(result.data);
      } else {
        console.warn('[IncidentsListPage] API returned no data, using empty array');
        setAllIncidents([]);
      }
    } catch (error: any) {
      console.error('[IncidentsListPage] Error fetching incidents:', error);
      setError(error.message || 'Không thể kết nối đến máy chủ');
      setAllIncidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load and filter incidents based on filters
  const loadIncidents = (reset = false) => {
    let filtered = allIncidents.filter(item => {
      const statusMatch = filters.status === 'all' || item.status === filters.status;
      const typeMatch = filters.type === 'all' || item.type === filters.type;
      return statusMatch && typeMatch;
    });
    
    // Sort by newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.time).getTime();
      const dateB = new Date(b.createdAt || b.time).getTime();
      return dateB - dateA;
    });

    setTotalFilteredCount(filtered.length);

    const pageToFetch = reset ? 1 : currentPage;
    const start = (pageToFetch - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const resultIncidents = filtered.slice(start, end);
    const hasMoreResult = end < filtered.length;

    if (reset) {
      setIncidents(resultIncidents);
      setCurrentPage(1);
    } else {
      setIncidents(prev => [...prev, ...resultIncidents]);
    }
    
    setHasMore(hasMoreResult);
  };

  // Fetch on mount
  useEffect(() => {
    fetchAllIncidents();
  }, []);

  // Filter when all incidents or filters change
  useEffect(() => {
    loadIncidents(true);
  }, [filters, allIncidents]);

  // Load more when page changes
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

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="font-semibold mb-1">Lỗi kết nối máy chủ</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs mt-2 opacity-70">
              Gợi ý: Kiểm tra xem backend Railway đã chạy chưa và MongoDB Atlas đã whitelist IP 0.0.0.0/0 chưa.
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
