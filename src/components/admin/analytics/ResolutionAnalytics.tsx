import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";
import { Badge } from "../../ui/badge";
import { Users, FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface AnalyticsData {
  userStats?: {
    totalUsers: number;
    lguUsers: number;
    pendingApprovals: number;
    usersByBarangay: Array<{ _id: string; count: number }>;
  };
  formStats?: {
    totalForms: number;
    averageFields: number;
  };
  recentActivity?: {
    recentUsers: any[];
    recentForms: any[];
  };
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, formStats, recentActivity] = await Promise.all([
          fetch(`${BASE_URL}/analytics/user-stats`).then(res => res.json()),
          fetch(`${BASE_URL}/analytics/form-stats`).then(res => res.json()),
          fetch(`${BASE_URL}/analytics/recent-activity`).then(res => res.json())
        ]);

        setData({ userStats, formStats, recentActivity });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
          ))}
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
          trend="positive"
        />
        <MetricCard
          title="LGU Officials"
          value={data.userStats?.lguUsers}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <MetricCard
          title="Pending Approvals"
          value={data.userStats?.pendingApprovals}
          icon={<AlertCircle className="w-5 h-5" />}
          trend="negative"
        />
        <MetricCard
          title="Avg Form Fields"
          value={data.formStats?.averageFields?.toFixed(1)}
          icon={<FileText className="w-5 h-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Users by Barangay */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Users by Barangay
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.userStats?.usersByBarangay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">New Users</h4>
              <Table>
                <TableBody>
                  {data.recentActivity?.recentUsers?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.barangay}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Recent Forms</h4>
              <Table>
                <TableBody>
                  {data.recentActivity?.recentForms?.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell>{form.title}</TableCell>
                      <TableCell>{form.fields?.length} fields</TableCell>
                      <TableCell>
                        <Badge variant="outline">Form</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Forms" value={data.formStats?.totalForms} />
        <StatCard title="Active LGUs" value={data.userStats?.usersByBarangay?.length} />
        <StatCard title="AI Processed Docs" value="11k" />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {trend && (
        <span className={`text-sm ${trend === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'positive' ? '+12.3%' : '-5.2%'} from last month
        </span>
      )}
    </CardContent>
  </Card>
);

const StatCard = ({ title, value }: any) => (
  <Card className="p-4 text-center">
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{title}</div>
  </Card>
);

export default AdminAnalytics;