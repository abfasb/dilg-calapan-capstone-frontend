import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Activity,
  AlertCircle,
  MapPin,
  PieChart
} from 'lucide-react';
import { Progress } from "../ui/progress";
import { 
  BarChart, 
  LineChart, 
  PieChart as RePieChart, 
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: string;
  subtitle?: string;
  progress?: number;
  chartData?: Array<{ month: string; count: number }>;
}

interface AlertType {
  _id: string;
  title: string;
  location: string;
  status: string;
  description: string;
}

interface ActivityType {
  _id: string;
  title: string;
  description: string;
  type: string;
  timestamp: string;
}

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [incidents, setIncidents] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          `${BASE_URL}/api/analytics/admin/stats`,
          `${BASE_URL}/api/analytics/admin/trends`,
          `${BASE_URL}/api/analytics/admin/incidents`,
          `${BASE_URL}/api/analytics/admin/activities`
        ].map(url => url.replace(/([^:]\/)\/+/g, "$1"));

        const [
          statsRes, 
          trendsRes, 
          incidentsRes, 
          activitiesRes
        ] = await Promise.all([
          axios.get(urls[0]),
          axios.get(urls[1]),
          axios.get(urls[2]),
          axios.get(urls[3]),
        ]);

        setStats(statsRes.data);
        setTrends(trendsRes.data);
        setIncidents(incidentsRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  if (isLoading) return (
    <div className="p-8 space-y-8">
      <Skeleton height={200} count={4} className="mb-4" />
      <Skeleton height={400} />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500">
      {error} - Please try refreshing the page
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-muted/40">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports" 
          value={stats?.totalReports || 0} 
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          delta="+12.3%"
          chartData={trends?.reports}
        />
        <StatCard 
          title="Resolved Cases" 
          value={stats?.resolvedCases || 0} 
          icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
          progress={(stats?.resolvedCases / stats?.totalReports) * 100 || 0}
        />
        <StatCard 
          title="Registered Users" 
          value={stats?.registeredUsers || 0} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          delta="+245"
          subtitle="new this week"
        />
        <StatCard 
          title="Avg. Resolution" 
          value={`${stats?.avgResolutionTime || 0}d`} 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          delta="-0.6d"
          subtitle="from last quarter"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" /> Report Trends
            </CardTitle>
            <CardDescription>Monthly report analysis</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.reports}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  fillOpacity={0.2}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incident Breakdown */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5" /> Incident Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={incidents}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                >
                  {incidents?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>


        {/* User Engagement */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" /> User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold">{stats?.activeUsers}</p>
                <p className="text-sm text-muted-foreground">Daily Active</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold">{stats?.satisfaction}%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" /> Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {activities?.map(activity => (
              <div key={activity._id} className="flex items-center gap-4 p-4 hover:bg-muted/50">
                <div className={`w-2 h-2 rounded-full ${activity.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description} • {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, delta, subtitle, progress, chartData }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow relative">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {progress !== undefined ? (
        <Progress value={progress} className="h-2 mt-2" />
      ) : (
        <div className="flex items-center gap-2 mt-2">
          {delta && (
            <span className={`text-xs ${delta.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {delta}
            </span>
          )}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </CardContent>
    {chartData && (
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-25">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              fill="url(#gradient)" 
              strokeWidth={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

export default Dashboard;