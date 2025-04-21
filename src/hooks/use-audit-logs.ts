import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';


export interface AuditLog {
  _id: string;
  userId: string;
  email: string;
  role: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
} 

interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  totalPages: number;
  currentPage: number;
}


export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
          ...(searchQuery && { search: searchQuery }),
          ...(dateRange.from && { startDate: dateRange.from.toISOString() }),
          ...(dateRange.to && { endDate: dateRange.to.toISOString() }),
          ...(selectedAction !== 'all' && { action: selectedAction })
        });

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audit-logs?${params}`);
        const data: AuditLogsResponse = await response.json();

        setLogs(data.data);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
      } catch (err) {
        setError('Failed to fetch audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage, searchQuery, dateRange, selectedAction]);

  return {
    logs,
    loading,
    error,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    selectedAction,
    setSelectedAction,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems
  };
};