// src/components/Dashboard.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
  CardFooter
} from "../ui/card";
import { Button } from "../ui/button";
import { 
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  PieChart as PieChartIcon,
  CalendarCheck,
  HardHat,
  FileBox,
  ClipboardCheck,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Progress } from "../ui/progress";
import { 
  BarChart, 
  PieChart as RechartsPieChart, 
  ResponsiveContainer, 
  Cell, 
  XAxis, 
  YAxis, 
  Bar,
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area,
  Pie
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Separator } from "../ui/separator";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: number;
  subtitle?: string;
  progress?: number;
  chartData?: Array<{ month: string; count: number }>;
}

interface DashboardStats {
  totalReports: number;
  resolvedCases: number;
  registeredUsers: number;
  avgResolutionTime: number;
  activeUsers: number;
  satisfaction: number;
  userGrowth: Array<{ month: string; count: number }>;
  appointmentStatus: Record<string, number>;
  responseTypes: Record<string, number>;
  categoryDistribution: Array<{ category: string; count: number }>;
  recentActivities: Array<ActivityType>;
  deltas: {
    reports: number;
    resolved: number;
    users: number;
    resolutionTime: number;
    satisfaction: number;
    activeUsers: number;
  };
}

interface ActivityType {
  _id: string;
  title: string;
  description: string;
  type: 'complaint' | 'appointment' | 'response';
  timestamp: string;
  status?: string;
}

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/analytics/admin/dashboard-data`);
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const statusColors = {
    confirmed: '#10b981',
    pending: '#f59e0b',
    cancelled: '#ef4444'
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-500">
            {payload[0].value} Reports
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="h-[180px]">
          <CardHeader className="space-y-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} />
          </CardHeader>
          <CardContent>
            <Skeleton width={100} height={24} />
            <div className="mt-4">
              <Skeleton width="100%" height={8} />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="lg:col-span-2">
        <Card className="h-[400px]">
          <CardHeader>
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent>
            <Skeleton height={300} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-[400px]">
          <CardHeader>
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent>
            <Skeleton height={300} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-4">
        <Card className="h-[400px]">
          <CardHeader>
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent>
            <Skeleton height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold">Unable to load dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          <ArrowUp className="w-4 h-4 mr-2" />
          Refresh Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-muted/40">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports" 
          value={stats?.totalReports.toLocaleString() || '0'} 
          icon={<FileText className="h-6 w-6 text-muted-foreground" />}
          delta={9.6}
          subtitle="Monthly reports"
        />
        <StatCard 
          title="Resolved Cases" 
          value={stats?.resolvedCases.toLocaleString() || '0'} 
          icon={<CheckCircle2 className="h-6 w-6 text-muted-foreground" />}
          progress={((stats?.resolvedCases ?? 0) / (stats?.totalReports ?? 1)) * 100 || 0}
          delta={13.4}
          subtitle="Case resolution rate"
        />
        <StatCard 
          title="Registered Users" 
          value={stats?.registeredUsers.toLocaleString() || '0'} 
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
          delta={6.9}
          subtitle="Active this month"
        />
        <StatCard 
          title="Avg. Resolution" 
          value={`${stats?.avgResolutionTime || 0}d`} 
          icon={<Clock className="h-6 w-6 text-muted-foreground" />}
          delta={-4.7}
          subtitle="Average handling time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" /> Report Trends
                </CardTitle>
                <CardDescription>Monthly report analysis</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                Last 12 months
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.userGrowth}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={{ stroke: '#e5e7eb' }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={80}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={0.2}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="border-t">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              <span>12% increase from last month</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-purple-500" /> Issue Types
                </CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={stats?.categoryDistribution || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={2}
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {stats?.categoryDistribution?.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={chartColors[index % chartColors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={12}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-muted-foreground text-sm">
                      {value}
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" /> User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <p className="text-2xl font-bold">{stats?.activeUsers.toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Daily Active</p>
                <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +14% from last month
                </Badge>
              </div>
              <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-2xl font-bold">{stats?.satisfaction}%</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +2.3% from Q3
                </Badge>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={80}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-orange-500" /> Appointments
                </CardTitle>
                <CardDescription>Current appointment status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.appointmentStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                    />
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <span className="text-muted-foreground text-sm">
                      ({((count / (stats?.totalReports || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileBox className="h-5 w-5 text-purple-500" /> Submissions
                </CardTitle>
                <CardDescription>Response type distribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.responseTypes || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">
                      {type === 'file' ? 'Bulk Upload' : 'Form Submission'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <span className="text-muted-foreground text-sm">
                      ({((count / (stats?.totalReports || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-500" /> Recent Activities
            </CardTitle>
            <Button variant="outline" size="sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72">
            <div className="divide-y">
              {stats?.recentActivities?.map(activity => (
                <div 
                  key={activity._id} 
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full flex-shrink-0",
                    activity.type === 'complaint' ? 'bg-red-500' :
                    activity.type === 'appointment' ? 'bg-blue-500' :
                    'bg-green-500'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{activity.title}</p>
                      {activity.status && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs capitalize",
                            activity.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                            activity.status === 'resolved' && 'bg-green-100 text-green-800',
                            activity.status === 'closed' && 'bg-blue-100 text-blue-800'
                          )}
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, delta, subtitle, progress }: StatCardProps) => (
  <Card className="group hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
    {(delta || progress) && (
      <CardFooter className="border-t pt-4">
        <div className="w-full space-y-2">
          {delta && (
            <div className="flex items-center gap-1 text-sm">
              {delta > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn(
                "font-medium",
                delta > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {Math.abs(delta).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
          {progress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </CardFooter>
    )}
  </Card>
);

export default Dashboard;