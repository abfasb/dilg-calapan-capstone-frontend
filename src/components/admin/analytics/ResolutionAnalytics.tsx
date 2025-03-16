import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../ui/card";
import { BarChart,AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell, Pie, PieChart } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";
import { Separator } from '../../ui/separator';
import { Badge } from "../../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Users, FileText, Clock, RefreshCw, Download, AlertCircle, CheckCircle, ArrowUp, ArrowDown, Activity, PieChart as PieChartIcon, FileStack, Paperclip } from 'lucide-react';
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

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
          fetch(`${BASE_URL}/analytics/user-stats`).then(handleResponse),
          fetch(`${BASE_URL}/analytics/form-stats`).then(handleResponse),
          fetch(`${BASE_URL}/analytics/recent-activity`).then(handleResponse),
          fetch(`${BASE_URL}/analytics/response-stats`).then(handleResponse),
          fetch(`${BASE_URL}/analytics/form-responses`).then(handleResponse),
          fetch(`${BASE_URL}/analytics/submission-trends`).then(handleResponse)
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

    const handleResponse = (res: Response) => {
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      return res.json();
    };

    fetchData();
  }, []);

  const renderLoading = () => (
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

  const renderError = () => (
    <div className="p-8 flex items-center justify-center h-screen">
      <div className="text-center space-y-4 max-w-md">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-xl font-semibold">Error Loading Analytics</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    </div>
  );

  if (error) return renderError();
  if (loading) return renderLoading();

  return (
    <div className="p-8 space-y-8 bg-muted/40">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Municipal Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time insights and performance metrics</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={data.userStats?.totalUsers}
          icon={<Users className="w-5 h-5" />}
          trend={data.userStats?.growthRate ?? 0}
          chartData={data.userStats?.usersByBarangay}
          color="#3B82F6"
        />
        <MetricCard
          title="LGU Officials"
          value={data.userStats?.lguUsers}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={5.8}
          color="#10B981"
        />
        <MetricCard
          title="Pending Approvals"
          value={data.userStats?.pendingApprovals}
          icon={<AlertCircle className="w-5 h-5" />}
          trend={-2.1}
          color="#EF4444"
        />
        <MetricCard
          title="Avg Form Fields"
          value={data.formStats?.averageFields?.toFixed(1)}
          icon={<FileText className="w-5 h-5" />}
          trend={data.formStats?.formsLastMonth ?? 0}
          color="#F59E0B"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">User Distribution</h3>
                <p className="text-sm text-muted-foreground">By barangay</p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Real-time
              </Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={data.userStats?.usersByBarangay}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="_id"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    label={{ 
                      value: 'Users', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#6B7280'
                    }}
                  />
                  <Tooltip 
                    cursor={false}
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Tabs defaultValue="responses">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Form Analytics</h3>
                  <p className="text-sm text-muted-foreground">Response trends and distribution</p>
                </div>
                <TabsList>
                  <TabsTrigger value="responses">Responses</TabsTrigger>
                  <TabsTrigger value="sectors">Sectors</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="responses">
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.formResponses?.responsesPerForm}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="formTitle"
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={false}
                        contentStyle={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#F59E0B" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="sectors">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.formResponses?.sectorDistribution}
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {data.formResponses?.sectorDistribution?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value) => <span className="text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Users</span>
                  <span className="font-medium">{data.recentActivity?.recentUsers?.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {data.recentActivity?.recentUsers?.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{user.barangay}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Form Submissions</span>
                  <span className="font-medium">{data.recentActivity?.recentForms?.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {data.recentActivity?.recentForms?.map((form) => (
                    <div key={form._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{form.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {form.fields?.length} fields • {form.type || 'General'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Response Status</h3>
            <div className="grid grid-cols-2 gap-4">
              {data.responseStats?.responsesByStatus?.map((status, index) => (
                <div key={status._id} className="flex items-center p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-2 h-10 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <div className="ml-4">
                    <p className="font-medium">{status._id}</p>
                    <p className="text-2xl font-bold">{status.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend, color }: any) => (
  <Card className="relative overflow-hidden transition-all hover:shadow-md">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            {title}
          </div>
          <div className="text-3xl font-bold">{value ?? '-'}</div>
        </div>
        <div className="relative w-24 h-16">
          <ResponsiveContainer width="100%" height="100%">
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                fill={color}
                fillOpacity={0.2}
                strokeWidth={1.5}
              />
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm">
        <span className={cn(
          "flex items-center",
          trend >= 0 ? 'text-green-500' : 'text-red-500'
        )}>
          {trend >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(trend).toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs previous month</span>
      </div>
    </CardContent>
  </Card>
);

export default AdminAnalytics;