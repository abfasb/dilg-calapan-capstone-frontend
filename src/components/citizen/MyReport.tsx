import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  MoreVertical,
  ArrowLeft,
  File,
  Image,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';

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

const FileIcon = ({ mimetype }: { mimetype: string }) => {
  if (mimetype.includes('image/')) return <Image className="w-4 h-4" />;
  if (mimetype.includes('pdf')) return <FileText className="w-4 h-4" />;
  if (mimetype.includes('spreadsheet')) return <FileSpreadsheet className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

export default function MyReport() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | Report['status']>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

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

  const navigateToHome = () => {
    navigate(`/account/citizen/${userId}`);
  }
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sort === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const lastUpdated = reports.length > 0 && reports[0].updatedAt
    ? formatDistanceToNow(new Date(reports[0].updatedAt), { addSuffix: true })
    : 'N/A';


  if (loading) return <ReportsSkeleton />;
  
  if (error) return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[50vh] space-y-4">
      <AlertCircle className="w-16 h-16 text-rose-500 animate-pulse" />
      <h2 className="text-2xl font-bold text-center">Unable to Load Reports</h2>
      <p className="text-muted-foreground text-center max-w-md">{error}</p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Home
          </Link>
        </Button>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    </div>
  );

  if (!reports.length) return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[50vh] space-y-6">
      <div className="relative">
        <FileText className="w-16 h-16 text-primary" />
        <div className="absolute -right-4 -top-4 bg-rose-100 text-rose-600 rounded-full p-2">
          <XCircle className="w-6 h-6" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center">No Reports Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Start your journey by submitting your first document for review
      </p>
      <Button asChild className="gap-2 shadow-lg hover:shadow-md transition-shadow">
        <Link to="/report/new">
          <Plus className="w-4 h-4" />
          Create New Report
        </Link>
      </Button>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-accent/50">
            <Button onClick={navigateToHome} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold flex-1">Document Submissions</h1>
        </div>

        <div className="grid gap-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Submission Overview</h2>
              <p className="text-muted-foreground">
                {reports.length} documents • Last updated {lastUpdated}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                {sort === 'asc' ? 'Oldest First' : 'Newest First'}
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
              <Button asChild className="gap-2 bg-black text-white hover:to-blue-700">
                <Link to="/report/new">
                  <Plus className="w-4 h-4" />
                  New Submission
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(statuses).map(([status, config]) => (
              <Card 
                key={status} 
                className="hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => setFilter(status as Report['status'])}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-2xl font-bold mt-1">
                        {reports.filter(r => r.status === status).length}
                      </p>
                      <Progress 
                       value={(reports.filter(r => r.status === status).length / reports.length) * 100}
                        className={`h-2 mt-3 ${config.color}`}
                      />
                    </div>
                    <div className={`p-3 rounded-full`}>
                      <config.icon className={`w-6 h-6 rounded-full ${config.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedReports.map((report) => (
            <Card 
              key={report._id}
              className="group hover:shadow-lg transition-all relative overflow-hidden hover:-translate-y-1"
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
                      <MoreVertical className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <a
                          href={report.files[0]?.url}
                          download
                          className="flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/report/${report._id}`} className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
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
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Created {new Date(report.createdAt).toLocaleDateString()}
                    </TooltipContent>
                  </Tooltip>
                </div>

                {report.officer && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={report.officer.avatar} />
                      <AvatarFallback>
                        {report.officer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{report.officer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned Officer
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Key Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(report.data).slice(0, 4).map(([key, value]) => (
                      <div 
                        key={key} 
                        className="truncate p-2 bg-muted/30 rounded-md"
                      >
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
                              <FileIcon mimetype={file.mimetype} />
                              <span className="max-w-[120px] truncate">
                                {file.filename}
                              </span>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            {file.filename} ({file.mimetype})
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/report/${report._id}`} className="gap-2">
                    View Full Details
                  </Link>
                </Button>
                <div className="text-xs text-muted-foreground">
                Updated {report.updatedAt ? formatDistanceToNow(new Date(report.updatedAt), { addSuffix: true }) : "N/A"}
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
  <div className="container mx-auto p-6 space-y-8">
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-24 rounded-lg" />
      <Skeleton className="h-6 w-px bg-border" />
      <Skeleton className="h-9 w-64 rounded-lg" />
    </div>

    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(3)].map((_, i) => (
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
            <div className="flex items-center gap-3 p-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
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