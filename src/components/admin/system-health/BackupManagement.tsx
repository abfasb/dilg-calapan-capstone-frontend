// src/components/ServiceMonitoring.tsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ClipboardList, 
  FileText, 
  Users,
  Clock,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';

interface SystemMetrics {
  users: number;
  activeUsers: number;
  pendingLGUs: number;
  forms: number;
  submissions: Record<string, number>;
  complaints: Record<string, number>;
  events: Record<string, number>;
}

interface ActivityItem {
  firstName: string;
  lastName: string;
  lastActivity: Date;
  role: string;
}

const BackupManagement: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/system-health`);
        if (!response.ok) throw new Error('Failed to fetch system health');
        
        const data = await response.json();
        setMetrics(data.metrics);
        setActivity(data.latestActivity);
      } catch (err : any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderMetricCard = (
    title: string, 
    value: number | string, 
    icon: JSX.Element,
    description?: string
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  const renderStatusCard = (
    title: string,
    data: Record<string, number>,
    icon: JSX.Element,
    statusConfig: Record<string, { color: string; icon: JSX.Element }>
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(data).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`mr-2 ${statusConfig[status]?.color || 'text-gray-500'}`}>
                  {statusConfig[status]?.icon || <span>•</span>}
                </span>
                <span className="capitalize">{status}</span>
              </div>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-center text-destructive">
          <AlertTriangle className="mx-auto h-12 w-12" />
          <h3 className="mt-4 text-lg font-medium">System Health Unavailable</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">System Data Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {renderMetricCard(
          "Total Users", 
          metrics?.users || 0, 
          <Users className="h-5 w-5 text-blue-500" />
        )}
        
        {renderMetricCard(
          "Active Users", 
          metrics?.activeUsers || 0, 
          <Activity className="h-5 w-5 text-green-500" />,
          "Last 7 days"
        )}
        
        {renderMetricCard(
          "Pending LGUs", 
          metrics?.pendingLGUs || 0, 
          <AlertCircle className="h-5 w-5 text-amber-500" />
        )}
        
        {renderMetricCard(
          "Report Forms", 
          metrics?.forms || 0, 
          <FileText className="h-5 w-5 text-indigo-500" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {renderStatusCard(
          "Submissions",
          metrics?.submissions || {},
          <ClipboardList className="h-5 w-5 text-purple-500" />,
          {
            pending: { color: "text-amber-500", icon: <Clock className="h-4 w-4" /> },
            approved: { color: "text-green-500", icon: <CheckCircle2 className="h-4 w-4" /> },
            rejected: { color: "text-red-500", icon: <AlertCircle className="h-4 w-4" /> }
          }
        )}
        
        {renderStatusCard(
          "Complaints",
          metrics?.complaints || {},
          <AlertCircle className="h-5 w-5 text-rose-500" />,
          {
            Pending: { color: "text-amber-500", icon: <Clock className="h-4 w-4" /> },
            'In Review': { color: "text-blue-500", icon: <Activity className="h-4 w-4" /> },
            Resolved: { color: "text-green-500", icon: <CheckCircle2 className="h-4 w-4" /> }
          }
        )}
        
        {renderStatusCard(
          "Events",
          metrics?.events || {},
          <Calendar className="h-5 w-5 text-cyan-500" />,
          {
            draft: { color: "text-gray-500", icon: <FileText className="h-4 w-4" /> },
            published: { color: "text-green-500", icon: <CheckCircle2 className="h-4 w-4" /> }
          }
        )}
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Time Since</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.length > 0 ? (
                activity.map((user, index) => {
                  const timeSince = new Date(user.lastActivity);
                  const hoursAgo = Math.floor(
                    (Date.now() - timeSince.getTime()) / (1000 * 60 * 60)
                  );
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        {timeSince.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {hoursAgo === 0 
                          ? "Just now" 
                          : `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No recent activity found
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

export default BackupManagement;