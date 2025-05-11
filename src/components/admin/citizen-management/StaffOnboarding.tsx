import { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Skeleton } from '../../ui/skeleton';
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from '../../ui/alert';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Download,
  Filter,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import clsx from 'clsx';

type ApprovalRate = {
  lguId: string;
  lguName: string;
  approved: number;
  rejected: number;
  approvalRate: number;
};

type CitizenSubmission = {
  referenceNumber: string;
  citizen: {
    name: string;
    email: string;
  };
  lgu: {
    name: string;
    barangay: string;
  };
  approvedAt: string;
  formTitle?: string;
};

const StaffOnboarding = () => {
  const [approvalRates, setApprovalRates] = useState<ApprovalRate[]>([]);
  const [approvedCitizens, setApprovedCitizens] = useState<CitizenSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratesRes, citizensRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/staff/approval-rates`),
          fetch(`${import.meta.env.VITE_API_URL}/api/staff/approved-citizens`)
        ]);

        if (!ratesRes.ok || !citizensRes.ok) {
          throw new Error('Network response was not ok');
        }

        const ratesData = await ratesRes.json();
        const citizensData = await citizensRes.json();

        setApprovalRates(ratesData.data || []);
        setApprovedCitizens(formatCitizenData(citizensData.data || []));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCitizenData = (data: any[]): CitizenSubmission[] => {
    return data.map(submission => ({
      referenceNumber: submission._id,
      citizen: {
        name: submission.userId ? `${submission.userId.firstName} ${submission.userId.lastName}` : 'Unknown',
        email: submission.userId?.email || 'N/A'
      },
      lgu: {
        name: submission.history?.length > 0 && submission.history[submission.history.length - 1].lguId 
          ? `${submission.history[submission.history.length - 1].lguId.firstName} ${submission.history[submission.history.length - 1].lguId.lastName}`
          : 'Unknown',
        barangay: submission.userId?.barangay || 'N/A'
      },
      approvedAt: submission.updatedAt || '',
      formTitle: submission.formId?.title || 'N/A'
    }));
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedCitizens = [...approvedCitizens].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let valA: any, valB: any;
    
    switch (sortColumn) {
      case 'name':
        valA = a.citizen.name;
        valB = b.citizen.name;
        break;
      case 'email':
        valA = a.citizen.email;
        valB = b.citizen.email;
        break;
      case 'lgu':
        valA = a.lgu.name;
        valB = b.lgu.name;
        break;
      case 'barangay':
        valA = a.lgu.barangay;
        valB = b.lgu.barangay;
        break;
      case 'date':
        valA = new Date(a.approvedAt).getTime();
        valB = new Date(b.approvedAt).getTime();
        break;
      default:
        return 0;
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const exportToCSV = () => {
    if (approvedCitizens.length === 0) return;
    
    const headers = ['Citizen Name', 'Email', 'Approved By', 'Barangay', 'Date Approved', 'Form'];
    const csvRows = [
      headers.join(','),
      ...approvedCitizens.map(item => [
        `"${item.citizen.name}"`,
        `"${item.citizen.email}"`,
        `"${item.lgu.name}"`,
        `"${item.lgu.barangay}"`,
        `"${new Date(item.approvedAt).toLocaleDateString()}"`,
        `"${item.formTitle}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `approved-citizens-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="w-full h-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-20 w-full mb-4" />
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="py-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96 mt-1" />
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Onboarding Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor approval rates and citizen onboarding progress
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Custom Range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            disabled={approvedCitizens.length === 0}
            className="bg-white hover:bg-gray-50 border-gray-200"
          >
            <Download className="h-4 w-4 mr-2 text-gray-600" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Approval Performance</CardTitle>
                <CardDescription className="text-sm">By Local Government Unit</CardDescription>
              </div>
              <Badge variant="outline" className="text-gray-600 bg-gray-50">
                Last 30 days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approvalRates}>
                <defs>
                  <linearGradient id="approvalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="lguName"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#f3f4f6' }}
                />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  formatter={(value) => [`${value}%`, 'Approval Rate']}
                />
                <Bar
                  dataKey="approvalRate"
                  fill="url(#approvalGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">LGU Statistics</CardTitle>
            <CardDescription className="text-sm">Detailed approval breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
              {approvalRates.map((lgu) => (
                <div 
                  key={lgu.lguId} 
                  className="p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors shadow-xs"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{lgu.lguName}</h3>
                      <p className="text-xs text-gray-500">{lgu.lguId}</p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={clsx(
                        "px-2.5 py-1 text-xs font-medium",
                        lgu.approvalRate > 70 ? "bg-green-50 text-green-700 border-green-100" :
                        lgu.approvalRate > 40 ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                        "bg-red-50 text-red-700 border-red-100"
                      )}
                    >
                      {lgu.approvalRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1.5">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
                        <span className="text-gray-600">{lgu.approved} Approved</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <XCircle className="h-4 w-4 mr-1.5 text-red-500" />
                        <span className="text-gray-600">{lgu.rejected} Rejected</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total</div>
                      <div className="font-medium text-gray-900">{lgu.approved + lgu.rejected}</div>
                    </div>
                  </div>
                </div>
              ))}
              {approvalRates.length === 0 && (
                <div className="text-center p-6">
                  <div className="text-gray-400 text-sm">No approval data available</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="py-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Approved Citizens</CardTitle>
              <CardDescription className="text-sm">
                {approvedCitizens.length} total submissions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-600">
                Last 30 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                {[
                  { id: 'name', label: 'Citizen' },
                  { id: 'email', label: 'Email' },
                  { id: 'lgu', label: 'Approved By' },
                  { id: 'barangay', label: 'Barangay' },
                  { id: 'date', label: 'Date Approved' },
                  { id: 'form', label: 'Form' },
                ].map((header) => (
                  <TableHead key={header.id} className="py-3 text-gray-600 font-medium">
                    <button
                      onClick={() => handleSort(header.id)}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      {header.label}
                      {sortColumn === header.id && (
                        <ArrowUpDown className="h-4 w-4 ml-1.5 text-gray-500" />
                      )}
                    </button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCitizens.map((citizen) => (
                <TableRow key={citizen.referenceNumber} className="hover:bg-gray-50">
                  <TableCell className="py-3">
                    <div className="font-medium text-gray-900">{citizen.citizen.name}</div>
                    <div className="text-xs text-gray-500">{citizen.referenceNumber}</div>
                  </TableCell>
                  <TableCell className="py-3">{citizen.citizen.email}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      <span className="text-gray-900">{citizen.lgu.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      <span className="text-gray-900">{citizen.lgu.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-gray-600 bg-gray-50">
                      {citizen.lgu.barangay}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        {citizen.formTitle || 'General Application'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {sortedCitizens.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <div className="text-gray-400 text-sm">
                      No approved citizens found
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffOnboarding;