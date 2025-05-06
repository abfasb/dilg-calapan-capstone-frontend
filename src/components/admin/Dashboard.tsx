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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
  ArrowDown,
  MoreHorizontal,
  Download,
  RefreshCw,
  Calendar,
  Star,
  Filter,
  Search,
  Bell
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
  Pie,
  LineChart,
  Line
} from 'recharts';
import Skeleton from 'react-loading-skeleton';
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { cn } from '../../lib/utils';
import { format, subDays } from 'date-fns';
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  delta?: number;
  subtitle?: string;
  progress?: number;
  chartData?: Array<{ month: string; count: number }>;
  loading?: boolean;
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
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
  user?: {
    name: string;
    avatar?: string;
  };
}

const Dashboard = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/analytics/admin/dashboard-data?period=${selectedPeriod}`);
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again later.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const chartColors = {
    blue: '#3b82f6', 
    red: '#ef4444', 
    green: '#10b981', 
    yellow: '#f59e0b', 
    purple: '#8b5cf6', 
    pink: '#ec4899'
  };

  const gradients = {
    blue: 'url(#blueGradient)',
    green: 'url(#greenGradient)',
    purple: 'url(#purpleGradient)',
    orange: 'url(#orangeGradient)'
  };

  const statusColors = {
    confirmed: '#10b981',
    pending: '#f59e0b',
    cancelled: '#ef4444'
  };

  // Enhanced tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-sm mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`item-${index}`} 
              className="text-sm flex items-center gap-2"
              style={{ color: entry.color }}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium">{entry.name}: {entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="h-[180px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-background" />
          <CardHeader className="space-y-2">
            <Skeleton width={120} height={20} />
            <Skeleton width={80} height={20} />
          </CardHeader>
          <CardContent className="relative z-10">
            <Skeleton width={100} height={24} />
            <div className="mt-4">
              <Skeleton width="100%" height={8} />
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="lg:col-span-2">
        <Card className="h-[400px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-background" />
          <CardHeader className="relative z-10">
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent className="relative z-10">
            <Skeleton height={300} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-[400px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-background" />
          <CardHeader className="relative z-10">
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent className="relative z-10">
            <Skeleton height={300} />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-4">
        <Card className="h-[400px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-background/30 to-background" />
          <CardHeader className="relative z-10">
            <Skeleton width={180} height={24} />
          </CardHeader>
          <CardContent className="relative z-10">
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
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Dashboard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-muted/40 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Analytics and reporting for {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="w-full md:w-64 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="h-9"
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="default" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="month" value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 w-auto">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="year">This Year</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4 mr-1" />
                {format(subDays(new Date(), 30), 'MMM dd')} - {format(new Date(), 'MMM dd')}
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports" 
          value={stats?.totalReports.toLocaleString() || '0'} 
          icon={<FileText className="h-6 w-6 text-blue-500" />}
          delta={45}
          subtitle="Monthly reports"
          loading={isLoading}
          color="blue"
        />
        <StatCard 
          title="Resolved Cases" 
          value={stats?.resolvedCases.toLocaleString() || '0'} 
          icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
          progress={((stats?.resolvedCases ?? 0) / (stats?.totalReports ?? 1)) * 100 || 0}
          delta={45}
          subtitle="Case resolution rate"
          loading={isLoading}
          color="green"
        />
        <StatCard 
          title="Registered Users" 
          value={stats?.registeredUsers.toLocaleString() || '0'} 
          icon={<Users className="h-6 w-6 text-purple-500" />}
          delta={45}
          subtitle="Active this month"
          loading={isLoading}
          color="purple"
        />
        <StatCard 
          title="Avg. Resolution" 
          value={`${stats?.avgResolutionTime || 0}d`} 
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          delta={45}
          subtitle="Average handling time"
          loading={isLoading}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" /> Report Trends
                </CardTitle>
                <CardDescription>Monthly report submission analysis</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Last 12 months
                    <ArrowDown className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 6 months</DropdownMenuItem>
                  <DropdownMenuItem>Last 12 months</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={48}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: '#d1d5db', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count"
                    name="Reports" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#blueGradient)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Total Reports", value: "7", change: "+12.3%", status: "increase" },
                { title: "Avg. Resolution", value: "4.2d", change: "-2.1d", status: "increase" },
                { title: "Response Rate", value: "92%", change: "+5.4%", status: "increase" },
                { title: "User Satisfaction", value: "4.8/5", change: "+0.2", status: "increase" }
              ].map((item, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">{item.title}</div>
                  <div className="text-xl font-semibold mt-1">{item.value}</div>
                  <div className={cn(
                    "text-xs mt-1 flex items-center gap-1",
                    item.status === "increase" ? "text-green-600" : "text-red-600"
                  )}>
                    {item.status === "increase" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {item.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-purple-500" /> Issue Distribution
                </CardTitle>
                <CardDescription>Report categories breakdown</CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Actions</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <defs>
                    {Object.entries(chartColors).map(([key, color], i) => (
                      <linearGradient key={i} id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={stats?.categoryDistribution || []}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={65}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    strokeWidth={3}
                    stroke="rgba(255,255,255,0.5)"
                  >
                    {stats?.categoryDistribution?.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#color${index % Object.keys(chartColors).length})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconSize={10}
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span className="text-sm" style={{ color: entry.color }}>
                        {value}
                      </span>
                    )}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Issues</span>
                <span className="font-medium">{stats?.totalReports || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Top Category</span>
                <span className="font-medium">
                  {stats?.categoryDistribution?.sort((a, b) => b.count - a.count)[0]?.category || 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" /> User Engagement
                </CardTitle>
                <CardDescription>Active users and satisfaction</CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Actions</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-card shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 opacity-60" />
                <div className="flex items-center justify-between gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-50 text-blue-800 ml-auto">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +14%
                  </Badge>
                </div>
                <p className="text-3xl font-bold mt-3">{stats?.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Daily Active Users</p>
              </div>
              <div className="p-4 rounded-lg border bg-card shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-400 opacity-60" />
                <div className="flex items-center justify-between gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <Badge variant="secondary" className="bg-green-50 text-green-800 ml-auto">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +2.3%
                  </Badge>
                </div>
                <p className="text-3xl font-bold mt-3">{stats?.satisfaction}%</p>
                <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.userGrowth.slice(-6)}>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    width={30}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Active Users"
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Users</span>
                  <span className="font-medium">+142</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Retention</span>
                  <span className="font-medium">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Status */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-orange-500" /> Appointment Status
                </CardTitle>
                <CardDescription>Current appointment tracking</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
                <Calendar className="h-3.5 w-3.5 mr-2" />
                View Calendar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {Object.entries(stats?.appointmentStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-2 hover:bg-muted/60 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                    />
                    <span className="capitalize font-medium">{status}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${((count / (stats?.totalReports || 1)) * 100).toFixed(1)}%`,
                          backgroundColor: statusColors[status as keyof typeof statusColors]
                        }}
                      />
                    </div>
                    <span className="font-semibold w-8 text-right">{count}</span>
                    <span className="text-muted-foreground text-sm w-14 text-right">
                      {((count / (stats?.totalReports || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Upcoming Today</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">View All</Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Site Inspection</p>
                      <p className="text-xs text-muted-foreground">2:30 PM</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    Confirmed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/40 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Follow-up Meeting</p>
                      <p className="text-xs text-muted-foreground">4:00 PM</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                    Pending
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Types */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileBox className="h-5 w-5 text-purple-500" /> Submission Methods
                </CardTitle>
                <CardDescription>How users submit reports</CardDescription>
              </div>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Actions</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={Object.entries(stats?.responseTypes || {}).map(([type, count]) => ({
                    name: type === 'file' ? 'Bulk Upload' : 'Form Submission',
                    value: count
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <Bar 
                    dataKey="value"
                    name="Count" 
                    fill="url(#purpleGradient)" 
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-4">
              {Object.entries(stats?.responseTypes || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 hover:bg-muted/60 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    {type === 'file' ? (
                      <FileBox className="h-4 w-4 text-purple-500" />
                    ) : (
                      <ClipboardCheck className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm capitalize">
                      {type === 'file' ? 'Bulk Upload' : 'Form Submission'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <span className="text-muted-foreground text-xs">
                      ({((count / (stats?.totalReports || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" /> Recent Activity
                </CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Filter
                </Button>
                <Button variant="default" size="sm" className="h-8">
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[320px]">
              <div className="space-y-4">
                {stats?.recentActivities?.map((activity, index) => (
                  <div 
                    key={activity._id} 
                    className="flex items-start gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage src={`/api/placeholder/32/32`} alt="User" />
                        <AvatarFallback className={cn(
                          activity.type === 'complaint' ? 'bg-red-100 text-red-800' :
                          activity.type === 'appointment' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        )}>
                          {activity.user?.name?.[0] || 
                            (activity.type === 'complaint' ? 'C' : 
                             activity.type === 'appointment' ? 'A' : 'R')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{activity.title}</p>
                          {activity.status && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs capitalize",
                                activity.status === 'pending' && 'bg-amber-50 text-amber-800 border-amber-200',
                                activity.status === 'resolved' && 'bg-green-50 text-green-800 border-green-200',
                                activity.status === 'closed' && 'bg-blue-50 text-blue-800 border-blue-200'
                              )}
                            >
                              {activity.status}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t py-3 flex justify-center">
            <Button variant="outline">View All Activities</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-500" /> Performance Overview
                </CardTitle>
                <CardDescription>Key metrics summary</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resolution Rate</span>
                    <span className="text-sm font-medium text-green-600">87%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm font-medium text-amber-600">72%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Satisfaction</span>
                    <span className="text-sm font-medium text-blue-600">94%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Jan', resolved: 65, pending: 35 },
                      { name: 'Feb', resolved: 70, pending: 30 },
                      { name: 'Mar', resolved: 75, pending: 25 },
                      { name: 'Apr', resolved: 80, pending: 20 },
                      { name: 'May', resolved: 85, pending: 15 },
                      { name: 'Jun', resolved: 87, pending: 13 },
                    ]}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#10b981" />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" /> Action Required
                </CardTitle>
                <CardDescription>Priority items needing attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="p-3 border border-amber-200 bg-amber-50/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Overdue Responses</p>
                    <p className="text-xs text-muted-foreground mt-1">12 reports need immediate attention</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">Review</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border border-red-200 bg-red-50/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Escalated Issues</p>
                    <p className="text-xs text-muted-foreground mt-1">5 issues have been escalated</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">Address</Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border border-blue-200 bg-blue-50/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upcoming Meetings</p>
                    <p className="text-xs text-muted-foreground mt-1">3 meetings scheduled today</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">View Calendar</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  icon, 
  delta, 
  subtitle, 
  progress, 
  loading,
  color = "blue"
}: StatCardProps) => {
  const gradientColors = {
    blue: 'from-blue-50 to-blue-100/20',
    green: 'from-green-50 to-green-100/20',
    purple: 'from-purple-50 to-purple-100/20',
    orange: 'from-orange-50 to-orange-100/20',
    red: 'from-red-50 to-red-100/20'
  };

  const borderColors = {
    blue: 'border-blue-100',
    green: 'border-green-100',
    purple: 'border-purple-100',
    orange: 'border-orange-100',
    red: 'border-red-100'
  };

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-300 relative overflow-hidden border",
      borderColors[color as keyof typeof borderColors]
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        gradientColors[color as keyof typeof gradientColors]
      )} />
      <div className="absolute top-0 left-0 w-full h-1" style={{
        backgroundColor: color === 'blue' ? '#3b82f6' :
                          color === 'green' ? '#10b981' :
                          color === 'purple' ? '#8b5cf6' :
                          color === 'orange' ? '#f59e0b' : '#ef4444',
        opacity: 0.6
      }} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-lg flex items-center justify-center",
          `bg-${color}-100/50 text-${color}-600 group-hover:bg-${color}-100`
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-2 relative">
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
      {(delta !== undefined || progress !== undefined) && (
        <CardFooter className="border-t pt-3 relative">
          <div className="w-full space-y-2">
            {delta !== undefined && (
              <div className="flex items-center gap-1 text-sm">
                {delta > 0 ? (
                  <ArrowUp className={`h-4 w-4 text-${delta > 0 ? 'green' : 'red'}-600`} />
                ) : (
                  <ArrowDown className={`h-4 w-4 text-${delta > 0 ? 'green' : 'red'}-600`} />
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
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-in-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: color === 'blue' ? '#3b82f6' :
                                        color === 'green' ? '#10b981' :
                                        color === 'purple' ? '#8b5cf6' :
                                        color === 'orange' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Dashboard;