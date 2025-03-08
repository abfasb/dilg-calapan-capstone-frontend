import { FormEventHandler, useState } from 'react';
import { endOfDay, subDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { DropdownMenu } from '../../ui/dropdown-menu';
import { DropdownMenuContent } from '../../ui/dropdown-menu';
import { DropdownMenuItem } from '../../ui/dropdown-menu';
import { DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Input } from '../../ui/input';

import { 
  ArrowUpDown, 
  MoreHorizontal, 
  Search, 
  Download,
  Calendar,
  Activity,
  Eye,
  Flag
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DatePickerWithRange = ({ dateRange, onDateRangeChange, className }: {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  className?: string;
}) => (
  <div className={className}>
    <div className="flex items-center gap-2 border rounded-md p-2">
      <Calendar className="h-4 w-4" />
      <span className="text-sm">
        {dateRange?.from?.toLocaleDateString() || 'Start'} - {dateRange?.to?.toLocaleDateString() || 'End'}
      </span>
    </div>
  </div>
);

const Combobox = ({ options, value, onChange, placeholder, className }: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className={className}>
        {value === 'all' ? placeholder : value}
        <MoreHorizontal className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {options.map(option => (
        <DropdownMenuItem key={option} onClick={() => onChange(option)}>
          {option}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Type definition for audit log
type AuditLog = {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  status: string;
  ipAddress: string;
  device: string;
};

// Dummy data with type annotation
const auditData: AuditLog[] = [...Array(45)].map((_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  user: [
    'admin@dilg.gov.ph',
    'clerk@calapan.gov.ph',
    'auditor@lgu.ph',
    'mayor.office@calapan.gov.ph',
    'it.support@calapan.gov.ph'
  ][i % 5],
  action: [
    'Document Approval', 'File Upload', 'Policy Update', 
    'Login Attempt', 'User Permission Changed', 'Report Generated',
    'Data Export', 'System Configuration Changed'
  ][i % 8],
  target: [
    'BP-2024-00123.pdf', 
    'Annual-Report-2023.docx', 
    'Ordinance-No-2024',
    'N/A',
    'User: Juan Dela Cruz',
    'Financial-Q3-Report.xlsx',
    'System Settings',
    'Backup-20240215.zip'
  ][i % 8],
  status: ['Success', 'Failed', 'Pending'][i % 3],
  ipAddress: [
    '192.168.1.' + (101 + i % 5),
    '124.106.34.' + (78 + i % 5),
    '203.87.129.' + (45 + i % 5)
  ][i % 3],
  device: ['Windows Chrome', 'Mac Safari', 'Android App', 'iOS App'][i % 4]
}));

const useAuditLog = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof AuditLog; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = auditData.filter(log => {
    const logDate = new Date(log.timestamp);
    const matchesDate = (!dateRange.from || logDate >= dateRange.from) &&
      (!dateRange.to || logDate <= endOfDay(dateRange.to));
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    return matchesDate && matchesSearch && matchesAction;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    selectedAction,
    setSelectedAction,
    sortConfig,
    setSortConfig,
    data: paginatedData,
    currentPage,
    setCurrentPage,
    totalItems: sortedData.length,
    totalPages: Math.ceil(sortedData.length / itemsPerPage),
  };
};

const AuditLogs = () => {
  const {
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    selectedAction,
    setSelectedAction,
    sortConfig,
    setSortConfig,
    data,
    currentPage,
    setCurrentPage,
    totalItems,
    totalPages,
  } = useAuditLog();

  const actionTypes = Array.from(new Set(auditData.map(log => log.action)));

  const handleSort = (key: keyof AuditLog) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Audit Trail Console
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive system activity monitoring for DILG eGov Nexus
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Full Logs
        </Button>
      </div>

      {/* Stats & Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold mt-1">{totalItems}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <div className="lg:col-span-3 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <DatePickerWithRange
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-full sm:w-[300px]"
          />
          <Combobox 
            options={['all', ...actionTypes]}
            value={selectedAction}
            onChange={setSelectedAction}
            placeholder="Filter Actions"
            className="w-full sm:w-[200px]"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <Card className="overflow-hidden shadow-sm">
        <Table className="relative">
          <TableHeader className="bg-gray-50">
            <TableRow>
              {[
                ['Timestamp', 'timestamp'],
                ['User', 'user'],
                ['Action', 'action'],
                ['Target', 'target'],
                ['Status', 'status'],
                ['Device', 'device'],
                ['IP Address', 'ipAddress'],
              ].map(([label, key]) => (
                <TableHead key={key}>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(key as keyof AuditLog)}
                    className="px-0 font-semibold"
                  >
                    {label}
                    <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    {sortConfig?.key === key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </Button>
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {log.user}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {log.target}
                </TableCell>
                <TableCell>
                <Badge 
                variant={log.status === "Failed" ? "destructive" : "secondary"} 
                className={log.status === "Success" ? "bg-green-500 text-white" : ""}
              >
                    {log.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>{log.device}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-red-600">
                        <Flag className="h-4 w-4" />
                        Report Incident
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalItems)} of {totalItems} results
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;