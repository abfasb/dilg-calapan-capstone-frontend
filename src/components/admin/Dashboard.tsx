import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "../ui/card";
import { Button } from "../ui/button";
import { 
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  PieChart,
  CalendarCheck,
  HardHat,
  FileBox,
  ClipboardCheck
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: string;
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

  const chartColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  if (isLoading) return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} height={150} className="rounded-xl" />
      ))}
      <div className="lg:col-span-2">
        <Skeleton height={400} className="rounded-xl" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton height={400} className="rounded-xl" />
      </div>
      <div className="lg:col-span-3">
        <Skeleton height={300} className="rounded-xl" />
      </div>
    </div>
  );

  if (error) return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-semibold">Unable to load dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()}>
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
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
          delta='11.8%'
        />
        <StatCard 
          title="Resolved Document" 
          value={stats?.resolvedCases.toLocaleString() || '0'} 
          icon={<CheckCircle2 className="h-5 w-5 text-muted-foreground" />}
          progress={((stats?.resolvedCases ?? 0) / (stats?.totalReports ?? 1)) * 100 || 0}
          delta='4.7%'
        />
        <StatCard 
          title="Registered Users" 
          value={stats?.registeredUsers.toLocaleString() || '0'} 
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
          delta='22.3%'
          subtitle="new this week"
        />
        <StatCard 
          title="Avg. Resolution" 
          value={`${stats?.avgResolutionTime || 0}d`} 
          icon={<Clock className="h-5 w-5 text-muted-foreground" />}
          delta='9.7%'
          subtitle="from last quarter"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Report Trends
                </CardTitle>
                <CardDescription>Monthly report analysis</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Last 12 months
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
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={{ stroke: '#e5e7eb' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
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
        </Card>

        {/* Incident Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="h-5 w-5" /> Issue Types
                </CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View details
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
                >
                  {stats?.categoryDistribution?.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={chartColors[index % chartColors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={10}
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

        {/* User Engagement */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50/50 rounded-lg border">
                <p className="text-2xl font-bold">{stats?.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Daily Active</p>
                <Badge variant="secondary" className="mt-2">
                  +14% from last month
                </Badge>
              </div>
              <div className="p-4 bg-green-50/50 rounded-lg border">
                <p className="text-2xl font-bold">{stats?.satisfaction}%</p>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction</p>
                <Badge variant="secondary" className="mt-2">
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
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
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
                  <CalendarCheck className="h-5 w-5" /> Appointments
                </CardTitle>
                <CardDescription>Current appointment status</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.appointmentStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'confirmed' ? 'bg-green-500' :
                      status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {!stats?.appointmentStatus && (
                <div className="text-center text-muted-foreground py-4">
                  No appointment data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Response Types */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileBox className="h-5 w-5" /> Submissions
                </CardTitle>
                <CardDescription>Response type distribution</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.responseTypes || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">{type === 'file' ? 'Bulk Upload' : 'Form'}</span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {!stats?.responseTypes && (
                <div className="text-center text-muted-foreground py-4">
                  No submission data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">

        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" /> Recent Activities
              </CardTitle>
              <Button variant="ghost" size="sm">
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
                      "w-2 h-2 rounded-full",
                      activity.type === 'complaint' ? 'bg-red-500' :
                      activity.type === 'appointment' ? 'bg-blue-500' :
                      'bg-green-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                ))}
                {!stats?.recentActivities?.length && (
                  <div className="p-8 text-center text-muted-foreground">
                    No recent activities
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, delta, subtitle, progress }: StatCardProps) => (
  <Card className="relative overflow-hidden transition-shadow hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      
    </CardContent>
  </Card>
);

export default Dashboard;