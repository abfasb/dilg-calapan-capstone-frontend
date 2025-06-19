import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '../../ui/tooltip';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  XCircle,
  History
} from 'lucide-react';

const ReportOversight: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, submissionsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/report-oversight/analytics`),
          fetch(`${import.meta.env.VITE_API_URL}/api/report-oversight/submission`)
        ]);
        
        const analyticsData = await analyticsRes.json();
        const submissionsData = await submissionsRes.json();
        
        setAnalytics(analyticsData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved': 
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Report Oversight Dashboard</h1>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-gray-500">All submissions</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pending}</div>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.approved}</div>
            <p className="text-xs text-gray-500">Accepted reports</p>
          </CardContent>
        </Card>
        
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.rejected}</div>
            <p className="text-xs text-gray-500">Returned reports</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Submissions Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">All Submissions</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Reference #</TableHead>
                  <TableHead>Form Title</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>History</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission._id}>
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                              {submission.referenceNumber.substring(0, 8)}...
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{submission.referenceNumber}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{submission.formId?.title || 'N/A'}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{submission.userId?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{submission.userId?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell>
                      <div className="max-h-24 overflow-y-auto">
                        {submission.history.map((entry, idx) => (
                          <div key={idx} className="py-1 border-b last:border-b-0">
                            <div className="flex items-center gap-2">
                              <History className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">
                                  {entry.lguName || entry.assignedLgu?.name || 'System'}
                                </p>
                                <div className="flex gap-1 items-center">
                                  <Badge variant="outline" className="text-xs">
                                    {entry.status}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(entry.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                {entry.comments && (
                                  <p className="text-xs mt-1">
                                    {entry.comments}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {submissions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportOversight;