import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { 
  ExclamationTriangleIcon, 
  ArrowPathIcon, 
  DocumentMagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Input } from '../../ui/input';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../../ui/drawer';

interface CaseHistory {
  status: string;
  timestamp: string;
  notes?: string;
}

interface CaseData {
  _id: string;
  referenceNumber: string;
  status: string;
  lastUpdate: string;
  history: CaseHistory[];
  comments?: string;
  submittedDate: string;
  priority?: 'low' | 'medium' | 'high';
  caseType?: string;
}

const CaseTracking = ({ userId }: { userId: string }) => {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Status options with colors and descriptions
  const statusOptions = [
    { value: 'pending', label: 'Pending', variant: 'warning', description: 'Case is being reviewed' },
    { value: 'approved', label: 'Approved', variant: 'success', description: 'Case has been approved' },
    { value: 'rejected', label: 'Rejected', variant: 'destructive', description: 'Case has been rejected' },
    { value: 'on_hold', label: 'On Hold', variant: 'secondary', description: 'Case is temporarily paused' },
    { value: 'in_progress', label: 'In Progress', variant: 'info', description: 'Case is being processed' },
  ];

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/form/cases`, {
        params: {
          userId,
          status: selectedStatus.length > 0 ? selectedStatus.join(',') : undefined,
          page: currentPage,
          limit: 10,
          search: searchQuery || undefined,
          sortBy,
          sortOrder
        }
      });
      
      setCases(response.data.cases);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch cases. Please try again later.');
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [selectedStatus, currentPage, sortBy, sortOrder, refreshKey]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCases();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleRetry = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleViewDetails = (caseItem: CaseData) => {
    setSelectedCase(caseItem);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCase(null), 300);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusVariant = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.variant || 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = cases.reduce((acc, caseItem) => {
    acc[caseItem.status] = (acc[caseItem.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getBadgeVariant = (status: string) => {
    switch(status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      case 'on_hold': return 'secondary';
      case 'in_progress': return 'info';
      default: return 'secondary';
    }
  };

  const renderStatusBadge = (status: string) => (
    <Badge 
      variant={getBadgeVariant(status) as any}
      className="capitalize font-medium"
    >
      {status.replace('_', ' ')}
    </Badge>
  );

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    
    return (
      <span className="ml-1 inline-block">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : cases.length}
            </div>
          </CardContent>
        </Card>

        {statusOptions.slice(0, 3).map(status => (
          <Card key={status.value} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Badge variant={status.variant as any} className="w-2 h-2 p-0 rounded-full" />
                {status.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Skeleton className="h-8 w-16" /> : statusCounts[status.value] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Case Tracking</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor the status of your submitted cases
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetry}
                className="h-9"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastUpdate">Last Update</SelectItem>
                  <SelectItem value="submittedDate">Submission Date</SelectItem>
                  <SelectItem value="referenceNumber">Reference Number</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by reference number or comments"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8"
              />
              <DocumentMagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedStatus.length === 0 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedStatus([]);
                  setCurrentPage(1);
                }}
              >
                All
              </Button>
              
              {statusOptions.map((status) => (
                <TooltipProvider key={status.value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedStatus.includes(status.value) ? 'default' : 'outline'}
                        size="sm"
                        className="capitalize"
                        onClick={() => handleStatusToggle(status.value)}
                      >
                        <span className={`w-2 h-2 rounded-full mr-1.5 bg-${status.variant}-500`} />
                        {status.label}
                        {statusCounts[status.value] > 0 && (
                          <span className="ml-1.5 text-xs font-normal bg-background/20 px-1.5 py-0.5 rounded-full">
                            {statusCounts[status.value] || 0}
                          </span>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{status.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center">
                {error}
                <Button variant="link" className="ml-2 p-0 h-auto" onClick={handleRetry}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead 
                    className="w-[140px] cursor-pointer"
                    onClick={() => handleSort('referenceNumber')}
                  >
                    Reference #{renderSortIcon('referenceNumber')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Status {renderSortIcon('status')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('submittedDate')}
                  >
                    Submitted {renderSortIcon('submittedDate')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('lastUpdate')}
                  >
                    Last Update {renderSortIcon('lastUpdate')}
                  </TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : cases.length > 0 ? (
                  cases.map((caseItem) => (
                    <TableRow 
                      key={caseItem._id} 
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">#{caseItem.referenceNumber}</TableCell>
                      <TableCell>
                        {renderStatusBadge(caseItem.status)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {formatDate(caseItem.submittedDate || caseItem.lastUpdate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(caseItem.lastUpdate)}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {caseItem.comments ? (
                          <div className="truncate text-sm" title={caseItem.comments}>
                            {caseItem.comments}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No comments</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(caseItem)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-muted-foreground">
                          {error ? 'Failed to load cases' : searchQuery ? 'No cases match your search' : 'No cases found'}
                        </p>
                        {searchQuery && (
                          <Button 
                            variant="link" 
                            className="mt-2"
                            onClick={() => setSearchQuery('')}
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size="sm"
                    className={`${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Logic to show pages around current page
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        size="sm"
                        isActive={pageNumber === currentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    size="sm"
                    className={`${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader>
            <DrawerTitle className="text-xl flex items-center justify-between">
              <span>Case #{selectedCase?.referenceNumber}</span>
              {selectedCase?.status && renderStatusBadge(selectedCase.status)}
            </DrawerTitle>
            <DrawerDescription>
              Submitted on {selectedCase?.submittedDate ? formatDate(selectedCase.submittedDate) : 'Unknown date'}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2">
            <div className="border-b pb-4 mb-4">
              <h4 className="font-medium mb-2">Case Information</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Reference Number</p>
                  <p>#{selectedCase?.referenceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p>{selectedCase?.status && renderStatusBadge(selectedCase.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submission Date</p>
                  <p>{selectedCase?.submittedDate ? formatDate(selectedCase.submittedDate) : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p>{selectedCase?.lastUpdate ? formatDate(selectedCase.lastUpdate) : 'Unknown'}</p>
                </div>
                {selectedCase?.priority && (
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="capitalize">{selectedCase.priority}</p>
                  </div>
                )}
                {selectedCase?.caseType && (
                  <div>
                    <p className="text-sm text-muted-foreground">Case Type</p>
                    <p>{selectedCase.caseType}</p>
                  </div>
                )}
              </div>
            </div>
            
            {selectedCase?.comments && (
              <div className="border-b pb-4 mb-4">
                <h4 className="font-medium mb-2">Comments</h4>
                <p className="text-sm whitespace-pre-line">{selectedCase.comments}</p>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Status History</h4>
              <div className="space-y-4">
                {selectedCase?.history?.map((event, index) => (
                  <div key={index} className="relative pl-5 pb-4 border-l border-muted-foreground/30">
                    <div className="absolute left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-muted-foreground/70"></div>
                    <p className="text-sm font-medium flex items-center">
                      {renderStatusBadge(event.status)}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </p>
                    {event.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{event.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
          
          <DrawerFooter>
            <Button onClick={handleCloseDrawer}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CaseTracking;