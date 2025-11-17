import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '../ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  Users,
  FileText,
  Calendar,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Eye,
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Define all types
interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType; 
  color?: "indigo" | "emerald" | "amber" | "violet" | "sky";
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType; 
  change?: number; 
  changeType?: "positive" | "negative";
  description?: string;
}

interface ActivityItemProps {
  title: string;
  subtitle?: string;
  status: string;
  statusColor?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  date?: string;
}

interface ChartDataItem {
  month?: string;
  users?: number;
  complaints?: number;
  appointments?: number;
  submissions?: number;
  role?: string;
  count?: number;
  percentage?: number;
  status?: string;
  category?: string;
  barangay?: string;
}

interface OverviewData {
  totalUsers: number;
  activeUsers: number;
  totalComplaints: number;
  totalAppointments: number;
  upcomingAppointments: number;
  totalSubmissions: number;
  pendingSubmissions: number;
}

interface GrowthData {
  userGrowth: number;
  complaintGrowth: number;
  appointmentGrowth: number;
  submissionGrowth: number;
}

interface SystemMetrics {
  complaintResolutionRate: number;
  formApprovalRate: number;
  appointmentConfirmationRate: number;
  avgResolutionTime: number;
}

interface ChartsData {
  userRegistrationTrend: ChartDataItem[];
  complaintsTrend: ChartDataItem[];
  appointmentsTrend: ChartDataItem[];
  submissionsTrend: ChartDataItem[];
  usersByRole: ChartDataItem[];
  complaintsByStatus: ChartDataItem[];
  usersByBarangay: ChartDataItem[];
  complaintsByCategory: ChartDataItem[];
  submissionsByStatus: ChartDataItem[];
  appointmentsByStatus: ChartDataItem[];
}

interface RecentActivityItem {
  title: string;
  location?: string;
  status: string;
  date: string;
  referenceNumber?: string;
  formId?: { title: string };
  user?: { firstName: string; lastName: string };
}

interface RecentActivities {
  complaints: RecentActivityItem[];
  appointments: RecentActivityItem[];
  submissions: RecentActivityItem[];
}

interface SystemHealth {
  status: string;
  score: number;
}

interface Insights {
  topComplaintCategory: string;
  systemHealth: SystemHealth;
}

interface DashboardData {
  overview: OverviewData;
  growth: GrowthData;
  charts: ChartsData;
  systemMetrics: SystemMetrics;
  recentActivities: RecentActivities;
  insights: Insights;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/analytics/admin/dashboard-data`);
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-9 w-64 mb-2 rounded-md" />
              <Skeleton className="h-5 w-80 rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-32 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="h-80 rounded-xl overflow-hidden border-0 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-48 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white py-6">
            <CardTitle className="flex items-center justify-center gap-2 text-white">
              <AlertCircle className="h-8 w-8" />
              <span>Error Loading Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p className="text-red-500 mb-6 font-medium">{error}</p>
            <Button 
              onClick={fetchDashboardData}
              className="gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const defaultDashboardData: DashboardData = {
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalComplaints: 0,
      totalAppointments: 0,
      upcomingAppointments: 0,
      totalSubmissions: 0,
      pendingSubmissions: 0
    },
    growth: {
      userGrowth: 0,
      complaintGrowth: 0,
      appointmentGrowth: 0,
      submissionGrowth: 0
    },
    charts: {
      userRegistrationTrend: [],
      complaintsTrend: [],
      appointmentsTrend: [],
      submissionsTrend: [],
      usersByRole: [],
      complaintsByStatus: [],
      usersByBarangay: [],
      complaintsByCategory: [],
      submissionsByStatus: [],
      appointmentsByStatus: []
    },
    systemMetrics: {
      complaintResolutionRate: 0,
      formApprovalRate: 0,
      appointmentConfirmationRate: 0,
      avgResolutionTime: 0
    },
    recentActivities: {
      complaints: [],
      appointments: [],
      submissions: []
    },
    insights: {
      topComplaintCategory: "",
      systemHealth: {
        status: "Good",
        score: 0
      }
    }
  };

  const data = dashboardData || defaultDashboardData;
  const {
    overview,
    growth,
    charts,
    systemMetrics,
    recentActivities,
    insights
  } = data;

  const CHART_COLORS = [
    '#4f46e5',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6', 
    '#0ea5e9'  
  ];

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, changeType, description }) => (
    <Card className="group transition-all hover:shadow-lg border-0 rounded-xl shadow-sm overflow-hidden bg-white relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg transition-all duration-300 ${
          changeType === 'positive' ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-rose-100 group-hover:bg-rose-200'
        }`}>
          <Icon className={`h-5 w-5 ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
          }`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1 text-gray-800">{value.toLocaleString()}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {changeType === 'positive' ? 
              <TrendingUp className="h-4 w-4 mr-1" /> : 
              <TrendingDown className="h-4 w-4 mr-1" />
            }
            {Math.abs(change)}% from last month
          </div>
        )}
        {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
      </CardContent>
    </Card>
  );

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, color = "indigo" }) => {
    const colorClasses = {
      indigo: 'bg-indigo-100 text-indigo-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      amber: 'bg-amber-100 text-amber-600',
      violet: 'bg-violet-100 text-violet-600',
      sky: 'bg-sky-100 text-sky-600',
    };
    
    return (
      <Card className="border-0 rounded-xl shadow-sm transition-all hover:shadow-md overflow-hidden bg-white">
        <CardHeader className="pb-2 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-800">{value}{unit}</div>
        </CardContent>
      </Card>
    );
  };

  const ActivityItem: React.FC<ActivityItemProps> = ({ title, subtitle, status, statusColor, date }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
      </div>
      <Badge variant={statusColor as any} className="font-medium">{status}</Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Comprehensive insights into your system performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 px-3 py-1.5">
              <Activity className="h-4 w-4 mr-1" />
              System Health: {insights.systemHealth.status} ({insights.systemHealth.score}%)
            </Badge>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="gap-2 rounded-md"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button 
                onClick={fetchDashboardData}
                variant="outline"
                size="icon"
                className="rounded-md shadow-sm hover:shadow-md transition-all"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Overview</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Performance</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-md data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard
                title="Total Users"
                value={overview.totalUsers}
                icon={Users}
                change={Math.abs(growth.userGrowth)}
                changeType={growth.userGrowth >= 0 ? 'positive' : 'negative'}
                description={`${overview.activeUsers} active users`}
              />
              <StatCard
                title="Total Complaints"
                value={overview.totalComplaints}
                icon={AlertCircle}
                change={Math.abs(growth.complaintGrowth)}
                changeType={growth.complaintGrowth >= 0 ? 'positive' : 'negative'}
                description={`${systemMetrics.complaintResolutionRate.toFixed(1)}% resolution rate`}
              />
              <StatCard
                title="Appointments"
                value={overview.totalAppointments}
                icon={Calendar}
                change={Math.abs(growth.appointmentGrowth)}
                changeType={growth.appointmentGrowth >= 0 ? 'positive' : 'negative'}
                description={`${overview.upcomingAppointments} upcoming`}
              />
              <StatCard
                title="Form Submissions"
                value={overview.totalSubmissions}
                icon={FileText}
                change={Math.abs(growth.submissionGrowth)}
                changeType={growth.submissionGrowth >= 0 ? 'positive' : 'negative'}
                description={`${overview.pendingSubmissions} pending`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Resolution Rate"
                value={systemMetrics.complaintResolutionRate.toFixed(1)}
                unit="%"
                icon={CheckCircle}
                color="emerald"
              />
              <MetricCard
                title="Approval Rate"
                value={systemMetrics.formApprovalRate.toFixed(1)}
                unit="%"
                icon={Star}
                color="amber"
              />
              <MetricCard
                title="Confirmation Rate"
                value={systemMetrics.appointmentConfirmationRate.toFixed(1)}
                unit="%"
                icon={Calendar}
                color="violet"
              />
              <MetricCard
                title="Avg Resolution"
                value={systemMetrics.avgResolutionTime.toFixed(1)}
                unit=" days"
                icon={Clock}
                color="sky"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 lg:col-span-2 border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-gray-800">Registration & Activity Trends</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-500">Monthly trends across all system activities</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={charts.userRegistrationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                        itemStyle={{ color: '#ffffff' }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke={CHART_COLORS[0]} 
                        strokeWidth={3}
                        name="New Users"
                        dot={{ r: 4, strokeWidth: 2, stroke: CHART_COLORS[0], fill: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#ffffff', stroke: CHART_COLORS[0], strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="complaints" 
                        stroke={CHART_COLORS[1]} 
                        strokeWidth={3}
                        data={charts.complaintsTrend}
                        name="Complaints"
                        dot={{ r: 4, strokeWidth: 2, stroke: CHART_COLORS[1], fill: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#ffffff', stroke: CHART_COLORS[1], strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="appointments" 
                        stroke={CHART_COLORS[2]} 
                        strokeWidth={3}
                        data={charts.appointmentsTrend}
                        name="Appointments"
                        dot={{ r: 4, strokeWidth: 2, stroke: CHART_COLORS[2], fill: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#ffffff', stroke: CHART_COLORS[2], strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="submissions" 
                        stroke={CHART_COLORS[3]} 
                        strokeWidth={3}
                        data={charts.submissionsTrend}
                        name="Submissions"
                        dot={{ r: 4, strokeWidth: 2, stroke: CHART_COLORS[3], fill: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#ffffff', stroke: CHART_COLORS[3], strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-emerald-600" />
                      <CardTitle className="text-gray-800">Users by Role</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={charts.usersByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ role, percentage }) => `${role}: ${percentage}%`}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {charts.usersByRole.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-gray-800">Complaint Status</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={charts.complaintsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="status" 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]} 
                        fill={CHART_COLORS[0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-rose-600" />
                      <CardTitle className="text-gray-800">Most Active Barangays</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={charts.usersByBarangay.slice(0, 5)} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        type="number" 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        dataKey="barangay" 
                        type="category" 
                        width={80} 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar 
                        dataKey="count" 
                        fill={CHART_COLORS[4]} 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-violet-600" />
                      <CardTitle className="text-gray-800">Top Complaint Categories</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={charts.complaintsByCategory.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="category" 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                      <Bar 
                        dataKey="count" 
                        fill={CHART_COLORS[5]} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800">Recent Complaints</CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="divide-y divide-gray-100">
                    {recentActivities.complaints.map((complaint, index) => (
                      <ActivityItem
                        key={index}
                        title={complaint.title}
                        subtitle={complaint.location}
                        status={complaint.status}
                        statusColor={
                          complaint.status === 'Resolved' ? 'success' :
                          complaint.status === 'In Review' ? 'warning' : 'destructive'
                        }
                        date={complaint.date}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800">Recent Appointments</CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="divide-y divide-gray-100">
                    {recentActivities.appointments.map((appointment, index) => (
                      <ActivityItem
                        key={index}
                        title={appointment.title}
                        subtitle={
                          appointment.user ? 
                          `${appointment.user.firstName} ${appointment.user.lastName}` : 
                          'Unknown User'
                        }
                        status={appointment.status}
                        statusColor={
                          appointment.status === 'confirmed' ? 'success' :
                          appointment.status === 'cancelled' ? 'destructive' : 'warning'
                        }
                        date={appointment.date}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-800">Recent Submissions</CardTitle>
                    <Button variant="ghost" size="sm" className="text-indigo-600">
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="divide-y divide-gray-100">
                    {recentActivities.submissions.map((submission, index) => (
                      <ActivityItem
                        key={index}
                        title={`#${submission.referenceNumber}`}
                        subtitle={submission.formId?.title || 'Form Submission'}
                        status={submission.status}
                        statusColor={
                          submission.status === 'approved' ? 'success' :
                          submission.status === 'rejected' ? 'destructive' : 'warning'
                        }
                        date={submission.date}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-amber-900">Top Complaint Type</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900">{insights.topComplaintCategory}</div>
                  <p className="text-sm text-amber-700 mt-1">Most reported issue</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 rounded-xl shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <CardTitle className="text-emerald-900">System Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-900">{insights.systemHealth.score}%</div>
                  <p className="text-sm text-emerald-700 mt-1">{insights.systemHealth.status} performance</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-violet-600" />
                      <CardTitle className="text-gray-800">Form Submission Analysis</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-500">Distribution of submission statuses</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={charts.submissionsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis 
                        dataKey="status" 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke={CHART_COLORS[0]} 
                        fill={CHART_COLORS[0]} 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-sky-600" />
                      <CardTitle className="text-gray-800">Appointment Status</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-gray-500">Current appointment status breakdown</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={charts.appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        label={({ status, percentage }) => `${status}: ${percentage}%`}
                      >
                        {charts.appointmentsByStatus.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: 'none',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          color: '#ffffff'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <CardTitle className="text-xl font-bold">Performance Summary</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Key performance indicators for system efficiency
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">
                      {systemMetrics.complaintResolutionRate.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Resolution Rate</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemMetrics.complaintResolutionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">
                      {systemMetrics.formApprovalRate.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Approval Rate</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemMetrics.formApprovalRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-violet-400">
                      {systemMetrics.appointmentConfirmationRate.toFixed(0)}%
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Confirmation Rate</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-gradient-to-r from-violet-400 to-violet-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${systemMetrics.appointmentConfirmationRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-sky-400">
                      {systemMetrics.avgResolutionTime.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-300 mt-1">Avg Days to Resolve</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div 
                        className="bg-gradient-to-r from-sky-400 to-sky-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(systemMetrics.avgResolutionTime * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6">
            <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis across all system components</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">System Health Score</h3>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-indigo-600">
                            {insights.systemHealth.score}%
                          </span>
                        </div>
                      </div>
                      <Progress value={insights.systemHealth.score} className="h-2 mt-2" />
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mt-6">Resolution Times</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Resolution Time</span>
                        <span className="text-sm font-medium text-gray-800">{systemMetrics.avgResolutionTime} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fastest Resolution</span>
                        <span className="text-sm font-medium text-gray-800">2 days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Longest Resolution</span>
                        <span className="text-sm font-medium text-gray-800">14 days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Success Rates</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Complaint Resolution</span>
                        <span className="text-sm font-medium text-gray-800">{systemMetrics.complaintResolutionRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Form Approval</span>
                        <span className="text-sm font-medium text-gray-800">{systemMetrics.formApprovalRate}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Appointment Confirmation</span>
                        <span className="text-sm font-medium text-gray-800">{systemMetrics.appointmentConfirmationRate}%</span>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-700 mt-6">User Engagement</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Users</span>
                        <span className="text-sm font-medium text-gray-800">{overview.activeUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monthly Growth</span>
                        <span className="text-sm font-medium text-gray-800">{growth.userGrowth}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card className="border-0 rounded-xl shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle>Reports & Exports</CardTitle>
                <CardDescription>Generate and download detailed reports</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">User Activity Report</CardTitle>
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-500 mb-4">Detailed report on user registration and activity patterns</p>
                      <Button size="sm" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Complaint Analysis</CardTitle>
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-500 mb-4">Comprehensive analysis of complaints by category and status</p>
                      <Button size="sm" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-500 mb-4">System performance and efficiency metrics report</p>
                      <Button size="sm" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Last updated: {new Date().toLocaleString()} | 
            <button 
              onClick={fetchDashboardData}
              className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Data
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;