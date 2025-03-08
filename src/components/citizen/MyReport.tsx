import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu } from '../ui/dropdown-menu';
import { DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DropdownMenuContent } from '../ui/dropdown-menu';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { Tooltip,TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { Avatar } from '../ui/avatar';
import { AvatarFallback } from '../ui/avatar';
import { AvatarImage } from '../ui/avatar';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Filter, 
  Download, 
  AlertCircle,
  ArrowUpDown,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Report {
  _id: string;
  referenceNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
  files: Array<{
    filename: string;
    url: string;
    mimetype: string;
    status: string;
    createdAt: string;
  }>;
  officer?: {
    name: string;
    avatar: string;
  };
}

const statuses = {
  pending: { label: 'In Review', color: 'bg-amber-500', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500', icon: CheckCircle2 },
  rejected: { label: 'Revisions Needed', color: 'bg-rose-500', icon: XCircle },
};

const StatusIndicator = ({ status }: { status: Report['status'] }) => {
  const { color, label, icon: Icon } = statuses[status];
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-full animate-pulse", color)} />
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

export default function MyReport() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Report['status']>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setError('Authentication required. Please login again.');
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/form/my-reports/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  const filteredReports = reports.filter(report => 
    filter === 'all' ? true : report.status === filter
  );

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sort === 'asc' ? dateA - dateB : dateB - dateA;
  });

  if (loading) return <ReportsSkeleton />;
  
  if (error) return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[50vh]">
      <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Unable to Load Reports</h2>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );

  if (!reports.length) return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[50vh]">
      <FileText className="w-16 h-16 text-primary mb-4" />
      <h2 className="text-2xl font-bold mb-2">No Reports Found</h2>
      <p className="text-muted-foreground mb-4">Get started by submitting a new document</p>
      <Button asChild>
        <Link to="/report/new" className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Report
        </Link>
      </Button>
    </div>
  );

  return (
    <TooltipProvider>
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Submissions</h1>
          <p className="text-muted-foreground mt-1">
            {reports.length} total documents • Last updated 2h ago
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button asChild className="gap-2">
            <Link to="/report/new">
              <Plus className="w-4 h-4" />
              New Submission
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Documents
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('pending')}>
                In Review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('approved')}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('rejected')}>
                Needs Revision
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-2xl font-bold mt-1">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold mt-1">
                  {reports.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/20 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Revision</p>
                <p className="text-2xl font-bold mt-1">
                  {reports.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <div className="bg-rose-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedReports.map((report) => (
          <Card 
            key={report._id}
            className="group hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className={cn(
              "absolute top-0 left-0 w-full h-1",
              statuses[report.status].color
            )} />
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {report.referenceNumber}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="w-5 h-5 text-muted-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <StatusIndicator status={report.status} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {Math.floor(
                        (new Date().getTime() - new Date(report.createdAt).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )}d
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Processing time
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {report.officer && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={report.officer.avatar} />
                      <AvatarFallback>
                        {report.officer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {report.officer?.name || 'Unassigned Officer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(report.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Document Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(report.data).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="truncate">
                      <span className="text-muted-foreground">{key}:</span>{' '}
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {report.files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {report.files.map((file) => (
                      <Tooltip key={file.url}>
                        <TooltipTrigger asChild>
                          <a
                            href={file.url}
                            download
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full text-sm hover:bg-muted/50 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="max-w-[120px] truncate">
                              {file.filename}
                            </span>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to download {file.filename}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/report/${report._id}`} className="gap-2">
                  View Details
                </Link>
              </Button>
              <div className="text-xs text-muted-foreground">
                Submitted {new Date(report.createdAt).toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </TooltipProvider>
  );
}

const ReportsSkeleton = () => (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);