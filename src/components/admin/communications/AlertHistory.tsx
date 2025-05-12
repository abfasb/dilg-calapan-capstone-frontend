import React, { useEffect, useState, useMemo } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '../../ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../../ui/table';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FilterIcon,
  RefreshCwIcon,
  DownloadIcon
} from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';

// Utility function moved outside the component
const getActivityStatus = (count: number) => {
  if (count === 0) return 'Inactive';
  if (count <= 5) return 'Low Activity';
  if (count <= 15) return 'Moderate';
  return 'Highly Active';
};

// Type definitions
type BarangayData = {
  barangay: string;
  submissionCount: number;
  lastActivity: string;
  status: string;
  trend?: 'up' | 'down' | 'stable';
};

type SortField = keyof Pick<BarangayData, 'barangay' | 'submissionCount' | 'lastActivity'>;
type SortOrder = 'asc' | 'desc';

const ActivityStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Low Activity':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Moderate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Highly Active':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusStyles(status)} font-medium py-1 px-2 rounded-full`}
    >
      {status}
    </Badge>
  );
};

const AlertHistory: React.FC = () => {
  const [data, setData] = useState<{
    summary?: {
      totalBarangays: number;
      totalSubmissions: number;
      mostActive?: BarangayData;
      leastActive?: BarangayData;
    };
    details?: BarangayData[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ field: SortField; order: SortOrder }>({
    field: 'submissionCount',
    order: 'desc'
  });
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchBarangayActivity = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/analytics/barangay-activity`);
        if (!res.ok) throw new Error('Failed to fetch activity data');
        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarangayActivity();
  }, []);

  // Sorting and Filtering Logic
  const processedData = useMemo(() => {
    if (!data.details) return [];

    // Filter by status if selected
    let filteredData = filterStatus 
      ? data.details.filter(entry => 
          getActivityStatus(entry.submissionCount) === filterStatus
        )
      : data.details;

    // Sort the data
    return filteredData.sort((a, b) => {
      const multiplier = sortConfig.order === 'asc' ? 1 : -1;
      
      switch (sortConfig.field) {
        case 'barangay':
          return a.barangay.localeCompare(b.barangay) * multiplier;
        case 'submissionCount':
          return (a.submissionCount - b.submissionCount) * multiplier;
        case 'lastActivity':
          return (new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()) * multiplier;
        default:
          return 0;
      }
    });
  }, [data.details, sortConfig, filterStatus]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Export functionality (mock implementation)
  const handleExport = () => {
    // Implement export logic (CSV, Excel, etc.)
    console.log('Exporting data...');
  };

  // Refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    // Implement refresh logic
    // This could be a re-fetch of the data
  };

  if (error) return (
    <Card className="w-full border-red-500">
      <CardHeader>
        <CardTitle className="text-red-600">Error Loading Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-500">{error}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TooltipProvider>
          {[
            {
              label: 'Total Barangays',
              value: data.summary?.totalBarangays,
              icon: <ChevronUpIcon className="text-blue-500" />,
              tooltip: 'Number of barangays in the system'
            },
            {
              label: 'Total Submissions',
              value: data.summary?.totalSubmissions,
              icon: <ChevronUpIcon className="text-green-500" />,
              tooltip: 'Total number of submissions across all barangays'
            },
            {
              label: 'Most Active Barangay',
              value: data.summary?.mostActive?.barangay,
              icon: <ArrowUpIcon className="text-purple-500" />,
              tooltip: `Highest number of submissions: ${data.summary?.mostActive?.submissionCount || 0}`
            },
            {
              label: 'Least Active Barangay',
              value: data.summary?.leastActive?.barangay,
              icon: <ArrowDownIcon className="text-orange-500" />,
              tooltip: `Lowest number of submissions: ${data.summary?.leastActive?.submissionCount || 0}`
            }
          ].map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600">{item.label}</div>
                      <div className="text-2xl font-bold">
                        {isLoading ? <Skeleton className="h-8 w-20" /> : item.value || 'N/A'}
                      </div>
                    </div>
                    {item.icon}
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>{item.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Activity Table */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Barangay Activity Details</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Filter Dropdown */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FilterIcon className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Barangay Status</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {['Inactive', 'Low Activity', 'Moderate', 'Highly Active'].map(status => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      onClick={() => setFilterStatus(prev => prev === status ? null : status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Refresh and Export Buttons */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
            >
              <DownloadIcon className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: 'Barangay', field: 'barangay' },
                  { label: 'Submissions', field: 'submissionCount' },
                  { label: 'Last Activity', field: 'lastActivity' }
                ].map(({ label, field }) => (
                  <TableHead 
                    key={field} 
                    onClick={() => handleSort(field as SortField)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {label}
                      {sortConfig.field === field && (
                        sortConfig.order === 'asc' 
                          ? <ChevronUpIcon className="ml-2 h-4 w-4" /> 
                          : <ChevronDownIcon className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4].map(j => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                processedData.map((entry) => {
                  const status = getActivityStatus(entry.submissionCount);
                  return (
                    <TableRow key={entry.barangay} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{entry.barangay}</TableCell>
                      <TableCell>{entry.submissionCount}</TableCell>
                      <TableCell>
                        {new Date(entry.lastActivity).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <ActivityStatusBadge status={status} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {!isLoading && `Showing ${processedData.length} of ${data.details?.length || 0} barangays`}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlertHistory;