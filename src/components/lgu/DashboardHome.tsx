import { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { StatsCard, ChartCard, RecentReportsTable } from './DashboardComponents';

interface Stats {
  reports: number;
  resolution: number;
  users: number;
}

interface ChartDataPoint {
  name: string;
  reports: number;
}

interface Report {
  id: number;
  title: string;
  status: string;
  date: string;
}

export const DashboardHome = () => {
  const [stats, setStats] = useState<Stats>({ reports: 0, resolution: 0, users: 0 });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    const dummyStats: Stats = { reports: 120, resolution: 85, users: 432 };
    const dummyChartData: ChartDataPoint[] = [
      { name: 'Jan', reports: 30 },
      { name: 'Feb', reports: 50 },
      { name: 'Mar', reports: 20 },
      { name: 'Apr', reports: 80 },
      { name: 'May', reports: 40 },
      { name: 'Jun', reports: 100 },
    ];
    const dummyReports: Report[] = [
      { id: 1, title: 'Issue with Payment', status: 'Resolved', date: '2024-02-15' },
      { id: 2, title: 'Login Issue', status: 'Pending', date: '2024-02-14' },
      { id: 3, title: 'App Crash on Load', status: 'In Progress', date: '2024-02-13' },
      { id: 4, title: 'Feature Request: Dark Mode', status: 'Resolved', date: '2024-02-12' },
      { id: 5, title: 'Bug in Dashboard Graph', status: 'Pending', date: '2024-02-11' },
    ];

    // Set dummy data
    setStats(dummyStats);
    setChartData(dummyChartData);
    setRecentReports(dummyReports);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Reports" value={stats.reports} trend="+12%" />
        <StatsCard title="Resolution Rate" value={`${stats.resolution}%`} trend="+3.2%" />
        <StatsCard title="Active Users" value={stats.users} trend="-1.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Monthly Report Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="reports" stroke="#00f2fe" strokeWidth={2} />
              <CartesianGrid stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <Bar dataKey="reports" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <CartesianGrid stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <RecentReportsTable reports={recentReports} />
    </div>
  );
};
