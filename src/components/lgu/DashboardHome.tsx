import { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { StatsCard, ChartCard, RecentReportsTable } from './DashboardComponents';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, AlertCircle, CheckCircle2, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface Stats {
  reports: number;
  resolution: number;
  users: number;
  avgResponseTime: number;
}

interface ChartDataPoint {
  name: string;
  reports: number;
  resolved: number;
  pending: number;
}

interface Report {
  id: number;
  title: string;
  status: 'resolved' | 'pending' | 'in-progress';
  category: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
}

export const DashboardHome = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [selectedChart, setSelectedChart] = useState<'reports' | 'resolved'>('reports');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const dummyStats: Stats = { 
        reports: 120, 
        resolution: 85, 
        users: 432,
        avgResponseTime: 2.4
      };
      
      const dummyChartData: ChartDataPoint[] = [
        { name: 'Jan', reports: 30, resolved: 18, pending: 12 },
        { name: 'Feb', reports: 50, resolved: 35, pending: 15 },
        { name: 'Mar', reports: 20, resolved: 15, pending: 5 },
        { name: 'Apr', reports: 80, resolved: 60, pending: 20 },
        { name: 'May', reports: 40, resolved: 30, pending: 10 },
        { name: 'Jun', reports: 100, resolved: 85, pending: 15 },
      ];

      const dummyReports: Report[] = [
        { id: 1, title: 'Payment Gateway Issue', status: 'resolved', category: 'Finance', priority: 'high', date: '2024-02-15' },
        { id: 2, title: 'User Login Failure', status: 'pending', category: 'Authentication', priority: 'high', date: '2024-02-14' },
        { id: 3, title: 'Dashboard Loading Slow', status: 'in-progress', category: 'Performance', priority: 'medium', date: '2024-02-13' },
        { id: 4, title: 'Dark Mode Request', status: 'resolved', category: 'Feature', priority: 'low', date: '2024-02-12' },
        { id: 5, title: 'Chart Data Inaccuracy', status: 'pending', category: 'Bug', priority: 'medium', date: '2024-02-11' },
      ];

      setStats(dummyStats);
      setChartData(dummyChartData);
      setRecentReports(dummyReports);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-muted/50" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl bg-muted/50" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl bg-muted/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Reports" 
          value={stats!.reports} 
          trend="month"
        />
        <StatsCard 
          title="Resolution Rate" 
          value={`${stats!.resolution}%`} 
          trend="week"
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={`${stats!.avgResponseTime}d`} 
          trend="month"
        />
        <StatsCard 
          title="Active Users" 
          value={stats!.users} 
          trend="week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title="Report Trends"
          
        >
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )}
              />
              <Area 
                type="monotone" 
                dataKey={selectedChart === 'reports' ? 'reports' : 'resolved'} 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorReports)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Category Distribution"
         
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="reports" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar 
                dataKey="resolved" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar 
                dataKey="pending" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Recent Activity">
        <RecentReportsTable 
          reports={recentReports} 
        />
      </ChartCard>
    </div>
  );
};