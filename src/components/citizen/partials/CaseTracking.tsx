import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../../ui/pagination';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';


interface CaseData {
  _id: string;
  referenceNumber: string;
  status: string;
  lastUpdate: string;
  history: Array<{ status: string; timestamp: string }>;
  comments?: string;
}

const CaseTracking = ({ userId }: { userId: string }) => {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/form/cases`, {
        params: {
          userId,
          status: selectedStatus,
          page: currentPage,
          limit: 10
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
  }, [selectedStatus, currentPage]);

  const handleRetry = () => {
    fetchCases();
  };

  const statusCounts = cases.reduce((acc, caseItem) => {
    acc[caseItem.status as keyof typeof acc] = (acc[caseItem.status as keyof typeof acc] || 0) + 1;
    return acc;
  }, { pending: 0, approved: 0, rejected: 0 });

  return (
    <div className="dark:bg-gray-900 p-6 rounded-lg border dark:border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Case Tracking</h2>
          <p className="text-muted-foreground dark:text-gray-400">
            Monitor the status of your submitted reports
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto flex-wrap">
          <Button
            variant={selectedStatus.length === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus([])}
          >
            All
            <span className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs">
              {cases.length}
            </span>
          </Button>
          
          {(['pending', 'approved', 'rejected'] as Array<keyof typeof statusCounts>).map((status) => (
            <Button
              key={status}
              variant={selectedStatus.includes(status) ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
              onClick={() => setSelectedStatus(prev => 
                prev.includes(status) 
                  ? prev.filter(s => s !== status) 
                  : [...prev, status]
              )}
            >
              {status}
              <span className="ml-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs">
                {statusCounts[status]}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="link" className="ml-2 p-0 h-auto" onClick={handleRetry}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border dark:border-gray-700 overflow-hidden">
        <Table className="relative">
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="w-[200px]">Reference #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[160px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : cases.length > 0 ? (
              cases.map((caseItem) => (
                <TableRow key={caseItem._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <TableCell className="font-medium">#{caseItem.referenceNumber}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        caseItem.status === 'approved' ? 'default' :
                        caseItem.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(caseItem.lastUpdate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {caseItem.comments || 'No comments'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => console.log('View details:', caseItem._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {error ? 'Failed to load cases' : 'No cases found'}
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
                className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
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
                className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CaseTracking;