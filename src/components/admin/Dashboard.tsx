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
  ChevronRight
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType; 
  color?: keyof typeof colorClasses;
}

const colorClasses = {
  indigo: "bg-indigo-100 text-indigo-700",
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

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
  statusColor?: "default" | "secondary" | "destructive" | "outline";
  date?: string;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err : any) {
      setError('Network error. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafbfd] to-[#f1f5f9] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-[300px] mx-auto mb-4 rounded-lg" />
            <Skeleton className="h-6 w-[400px] mx-auto rounded-lg" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border rounded-xl shadow-sm transition-all hover:shadow-md">
                <CardHeader className="space-y-0 pb-4">
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/4 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2 rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-[350px] rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full rounded-lg" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fafbfd] to-[#f1f5f9] p-6 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-white" />
              <span>Error Loading Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <p className="text-red-500 mb-6 font-medium">{error}</p>
            <Button 
              onClick={fetchDashboardData}
              className="gap-2 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              variant="destructive"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overview, growth, charts, systemMetrics, recentActivities, insights } = dashboardData;

  const CHART_COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#0ea5e9'  // Sky
  ];

  const StatCard: React.FC<StatCardProps>  = ({ title, value, icon: Icon, change, changeType, description }) => (
    <Card className="group transition-all hover:shadow-lg border-0 rounded-2xl shadow-sm overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className={`p-2 rounded-lg transition-all duration-300 ${
          changeType === 'positive' ? 'bg-emerald-100 group-hover:bg-emerald-200' : 'bg-rose-100 group-hover:bg-rose-200'
        }`}>
          <Icon className={`h-5 w-5 ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
          }`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1 text-gray-800">{value?.toLocaleString()}</div>
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

  const MetricCard : React.FC<MetricCardProps> = ({ title, value, unit, icon: Icon, color = "indigo" }) => {
    const colorClasses = {
      indigo: 'bg-indigo-100 text-indigo-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      amber: 'bg-amber-100 text-amber-600',
      violet: 'bg-violet-100 text-violet-600',
      sky: 'bg-sky-100 text-sky-600',
    };
    
    return (
      <Card className="border-0 rounded-xl shadow-sm transition-all hover:shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
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

  const ActivityItem : React.FC<ActivityItemProps> = ({ title, subtitle, status, statusColor, date }) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
      </div>
      <Badge variant={statusColor} className="font-medium">{status}</Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafbfd] to-[#f1f5f9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
            <Button 
              onClick={fetchDashboardData}
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* System Metrics */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Registration Trend */}
          <Card className="col-span-1 lg:col-span-2 border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-gray-800">Registration & Activity Trends</CardTitle>
              </div>
              <CardDescription className="text-gray-500">Monthly trends across all system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis 
                    dataKey="month" 
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
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
                    data={charts.userRegistrationTrend}
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

          {/* Users by Role */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-gray-800">Users by Role</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#ffffff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaints by Status */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-gray-800">Complaint Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#ffffff'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[8, 8, 0, 0]} 
                    fill={CHART_COLORS[0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Barangays */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                <CardTitle className="text-gray-800">Most Active Barangays</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#ffffff'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill={CHART_COLORS[4]} 
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaint Categories */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-600" />
                <CardTitle className="text-gray-800">Top Complaint Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#ffffff'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill={CHART_COLORS[5]} 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Complaints */}
          <Card className="border-0 p-4 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Recent Complaints</CardTitle>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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

          {/* Recent Appointments */}
          <Card className="border-0 p-4 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Recent Appointments</CardTitle>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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

          {/* Recent Submissions */}
          <Card className="border-0 p-4 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Recent Submissions</CardTitle>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
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
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 rounded-2xl shadow-md">
            <CardHeader>
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

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 rounded-2xl shadow-md">
            <CardHeader>
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

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submission Status Breakdown */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-600" />
                <CardTitle className="text-gray-800">Form Submission Analysis</CardTitle>
              </div>
              <CardDescription className="text-gray-500">Distribution of submission statuses</CardDescription>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
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

          {/* Appointment Status Distribution */}
          <Card className="border-0 rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="bg-white">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-600" />
                <CardTitle className="text-gray-800">Appointment Status</CardTitle>
              </div>
              <CardDescription className="text-gray-500">Current appointment status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
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
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem',
                      color: '#ffffff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl shadow-xl overflow-hidden">
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

        {/* Footer */}
        <div className="text-center py-6">
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