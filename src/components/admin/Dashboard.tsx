import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-[300px] mx-auto mb-4" />
            <Skeleton className="h-6 w-[400px] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border rounded-xl shadow-sm">
                <CardHeader className="space-y-0 pb-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-[350px]">
                <Skeleton className="h-full w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span>Error Loading Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-red-500 mb-6">{error}</p>
            <Button 
              onClick={fetchDashboardData}
              className="gap-2"
              variant="outline"
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

  const StatCard = ({ title, value, icon: Icon, change, changeType, description }) => (
    <Card className="group transition-all hover:shadow-md border rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${
          changeType === 'positive' ? 'bg-emerald-100' : 'bg-rose-100'
        }`}>
          <Icon className={`h-5 w-5 ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
          }`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{value?.toLocaleString()}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {changeType === 'positive' ? 
              <TrendingUp className="h-4 w-4 mr-1" /> : 
              <TrendingDown className="h-4 w-4 mr-1" />
            }
            {Math.abs(change)}% from last month
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );

  const MetricCard = ({ title, value, unit, icon: Icon, color = "indigo" }) => (
    <Card className="border rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            <Icon className={`h-4 w-4 text-${color}-600`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{unit}</div>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ title, subtitle, status, statusColor, date }) => (
    <div className="flex items-start justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {date && <p className="text-xs text-muted-foreground mt-1">{date}</p>}
      </div>
      <Badge variant={statusColor}>{status}</Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your system performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Activity className="h-4 w-4 mr-1" />
              System Health: {insights.systemHealth.status} ({insights.systemHealth.score}%)
            </Badge>
            <Button 
              onClick={fetchDashboardData}
              variant="outline"
              size="icon"
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
            changeType={growth.userGrowth >= 0 ? 'positive' : 'negative'}
            description={`${overview.activeUsers} active users`}
          />
          <StatCard
            title="Total Complaints"
            value={overview.totalComplaints}
            icon={AlertCircle}
            changeType={growth.complaintGrowth >= 0 ? 'positive' : 'negative'}
            description={`${systemMetrics.complaintResolutionRate.toFixed(1)}% resolution rate`}
          />
          <StatCard
            title="Appointments"
            value={overview.totalAppointments}
            icon={Calendar}
            changeType={growth.appointmentGrowth >= 0 ? 'positive' : 'negative'}
            description={`${overview.upcomingAppointments} upcoming`}
          />
          <StatCard
            title="Form Submissions"
            value={overview.totalSubmissions}
            icon={FileText}
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
          <Card className="col-span-1 lg:col-span-2 border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <CardTitle>Registration & Activity Trends</CardTitle>
              </div>
              <CardDescription>Monthly trends across all system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke={CHART_COLORS[0]} 
                    strokeWidth={2}
                    data={charts.userRegistrationTrend}
                    name="New Users"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="complaints" 
                    stroke={CHART_COLORS[1]} 
                    strokeWidth={2}
                    data={charts.complaintsTrend}
                    name="Complaints"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke={CHART_COLORS[2]} 
                    strokeWidth={2}
                    data={charts.appointmentsTrend}
                    name="Appointments"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke={CHART_COLORS[3]} 
                    strokeWidth={2}
                    data={charts.submissionsTrend}
                    name="Submissions"
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Users by Role */}
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <CardTitle>Users by Role</CardTitle>
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
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Complaints by Status */}
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <CardTitle>Complaint Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={charts.complaintsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
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

          {/* Top Barangays */}
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-600" />
                <CardTitle>Most Active Barangays</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={charts.usersByBarangay.slice(0, 5)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis 
                    dataKey="barangay" 
                    type="category" 
                    width={80} 
                    stroke="#94a3b8" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
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

          {/* Complaint Categories */}
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-600" />
                <CardTitle>Top Complaint Categories</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={charts.complaintsByCategory.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
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

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Complaints */}
          <Card className="border rounded-xl p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Complaints</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
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
          <Card className="border rounded-xl p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Appointments</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
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
          <Card className="border rounded-xl p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
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
          

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 rounded-xl">
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

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 rounded-xl">
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
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-600" />
                <CardTitle>Form Submission Analysis</CardTitle>
              </div>
              <CardDescription>Distribution of submission statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={charts.submissionsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="status" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
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
          <Card className="border rounded-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-600" />
                <CardTitle>Appointment Status</CardTitle>
              </div>
              <CardDescription>Current appointment status breakdown</CardDescription>
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
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#1e293b',
                      borderRadius: '0.5rem'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <CardTitle className="text-xl font-bold">Performance Summary</CardTitle>
            </div>
            <CardDescription className="text-gray-300">
              Key performance indicators for system efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  {systemMetrics.complaintResolutionRate.toFixed(0)}%
                </div>
                <p className="text-sm text-gray-300 mt-1">Resolution Rate</p>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
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
                    className="bg-amber-400 h-2 rounded-full transition-all duration-500"
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
                    className="bg-violet-400 h-2 rounded-full transition-all duration-500"
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
                    className="bg-sky-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(systemMetrics.avgResolutionTime * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-muted-foreground text-sm">
            Last updated: {new Date().toLocaleString()} | 
            <button 
              onClick={fetchDashboardData}
              className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Refresh Data
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;