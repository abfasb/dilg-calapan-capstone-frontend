import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";
import { Badge } from "../../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Users, FileText, Clock, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "../../../lib/utils";
import { Activity, PieChart, FileStack, Paperclip } from 'lucide-react';
import { Cell, Pie } from 'recharts';
interface AnalyticsData {
  userStats?: {
    totalUsers: number;
    lguUsers: number;
    pendingApprovals: number;
    usersByBarangay: Array<{ _id: string; count: number }>;
    growthRate?: number;
  };
  formStats?: {
    totalForms: number;
    averageFields?: number;
    formsLastMonth?: number;
  };
  recentActivity?: {
    recentUsers: any[];
    recentForms: any[];
  };

  responseStats?: {
    totalResponses: number;
    responsesByStatus: Array<{ _id: string; count: number }>;
    averageProcessingTime: number;
    totalDocuments: number;
    avgDocumentsPerResponse: number;
  };
  formResponses?: {
    responsesPerForm: Array<{ formTitle: string; count: number }>;
    sectorDistribution: Array<{ _id: string; count: number }>;
  };
  submissionTrends?: Array<{ _id: { year: number; month: number; week: number }; count: number }>;
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const BASE_URL = import.meta.env.VITE_API_URL;

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, formStats, recentActivity, responseStats, formResponses, submissionTrends] = await Promise.all([
          fetch(`${BASE_URL}/analytics/user-stats`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch user stats');
            return res.json();
          }),
          fetch(`${BASE_URL}/analytics/form-stats`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch form stats');
            return res.json();
          }),
          fetch(`${BASE_URL}/analytics/recent-activity`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch recent activity');
            return res.json();
          }),

          fetch(`${BASE_URL}/analytics/response-stats`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch user stats');
            return res.json();
          }),
          fetch(`${BASE_URL}/analytics/form-responses`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch form stats');
            return res.json();
          }),
          fetch(`${BASE_URL}/analytics/submission-trends`).then(res => {
            if (!res.ok) throw new Error('Failed to fetch recent activity');
            return res.json();
          })
        ]);

        

        setData({ userStats, formStats, recentActivity, responseStats, formResponses, submissionTrends });
        setError(null);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-xl font-semibold">Error Loading Analytics</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-muted/40">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.userStats?.totalUsers}
          icon={<Users className="w-5 h-5" />}
          trend={data.userStats?.growthRate ?? 0}
          chartData={data.userStats?.usersByBarangay}
        />
        <MetricCard
          title="LGU Officials"
          value={data.userStats?.lguUsers}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={5.8}
        />
        <MetricCard
          title="Pending Approvals"
          value={data.userStats?.pendingApprovals}
          icon={<AlertCircle className="w-5 h-5" />}
          trend={-2.1}
        />
        <MetricCard
          title="Avg Form Fields"
          value={data.formStats?.averageFields?.toFixed(1) ?? '0.0'}
          icon={<FileText className="w-5 h-5" />}
          trend={data.formStats?.formsLastMonth ?? 0}
        />
      </div>

      {/* Data Visualization Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Users by Barangay */}
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Users Distribution by Barangay
            </h3>
            <Badge variant="secondary" className="px-3 py-1">
              Last 30 days
            </Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.userStats?.usersByBarangay}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis 
                  dataKey="_id" 
                  tick={{ fill: '#64748B' }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tick={{ fill: '#64748B' }}
                  label={{
                    value: 'Number of Users',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#64748B'
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={400}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <CardFooter className="mt-4 text-sm text-muted-foreground">
            Updated in real-time from municipal database
          </CardFooter>
        </Card>

        {/* Activity Overview */}
        <Card className="p-6 shadow-lg">
          <Tabs defaultValue="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-500" />
                Recent Activity
              </h3>
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="forms">Forms</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="users">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentActivity?.recentUsers?.map((user) => (
                      <TableRow key={user._id} className="hover:bg-muted/20 cursor-pointer">
                        <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.barangay}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : 'outline'}
                            className={cn({
                              'bg-green-100 text-green-800': user.role === 'user',
                              'bg-blue-100 text-blue-800': user.role === 'admin'
                            })}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="forms">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Form Title</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentActivity?.recentForms?.map((form) => (
                      <TableRow key={form._id} className="hover:bg-muted/20 cursor-pointer">
                        <TableCell className="font-medium">{form.title}</TableCell>
                        <TableCell>{form.fields?.length} fields</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            {form.type || 'General'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">User Growth</h4>
            <span className={cn(
              "flex items-center text-sm",
              (data.userStats?.growthRate ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
            )}>
              {(data.userStats?.growthRate ?? 0) >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(data.userStats?.growthRate ?? 0).toFixed(1)}%
            </span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.userStats?.usersByBarangay}>
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <StatCard 
          title="Total Forms Processed"
          value={data.formStats?.totalForms}
          subtitle={`${data.formStats?.formsLastMonth ?? 0} last month`}
          icon={<FileText className="w-6 h-6" />}
          color="bg-orange-100"
        />

        <StatCard 
          title="Active LGUs"
          value={data.userStats?.usersByBarangay?.length}
          subtitle="Across municipality"
          icon={<CheckCircle className="w-6 h-6" />}
          color="bg-green-100"
        />
     
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Responses"
        value={data.responseStats?.totalResponses}
        subtitle={`${data.responseStats?.totalDocuments} documents`}
        icon={<FileStack className="w-6 h-6" />}
        color="bg-blue-100"
      />
      <StatCard 
        title="Avg Processing Time"
        value={data.responseStats?.averageProcessingTime?.toFixed(1)}
        subtitle="Days per response"
        icon={<Clock className="w-6 h-6" />}
        color="bg-yellow-100"
      />
      <StatCard 
        title="Avg Documents/Response"
        value={data.responseStats?.avgDocumentsPerResponse?.toFixed(1)}
        subtitle="Files uploaded"
        icon={<Paperclip className="w-6 h-6" />}
        color="bg-green-100"
      />
      <MetricCard
        title="Sector Distribution"
        value={data.formResponses?.sectorDistribution?.length}
        icon={<PieChart className="w-5 h-5" />}
        chartData={data.formResponses?.sectorDistribution}
      />
    </div>

    {/* Form Response Breakdown */}
    <Card className="p-6 shadow-lg">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-orange-500" />
        Responses per Form
      </h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.formResponses?.responsesPerForm}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formTitle"
              angle={-45}
              textAnchor="end"
              tick={{ fill: '#64748B' }}
            />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="count" 
              fill="#f59e0b" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
      </div>
  )
};

const MetricCard = ({ title, value, icon, trend = 0, chartData }: any) => (
  <Card className="relative overflow-hidden shadow-lg">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-3xl font-bold mt-2">{value ?? '-'}</div>
        </div>
        <div className="p-3 rounded-full bg-blue-100">{icon}</div>
      </div>
      <div className="flex items-center text-sm">
        <span className={cn(
          "flex items-center",
          trend >= 0 ? 'text-green-500' : 'text-red-500'
        )}>
          {trend >= 0 ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          {Math.abs(trend).toFixed(1)}%
        </span>
        <span className="ml-2 text-muted-foreground">vs last month</span>
      </div>
    </div>
    {chartData && (
      <div className="h-20 bg-muted/20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

const StatCard = ({ title, value, subtitle, icon, color }: any) => (
  <Card className="p-6 shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-3xl font-bold mt-2">{value ?? '-'}</div>
        {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
      </div>
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    </div>
  </Card>
);

export default AdminAnalytics;