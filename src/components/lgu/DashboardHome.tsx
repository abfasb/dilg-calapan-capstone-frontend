import { useEffect, useState } from 'react';
import { 
  AreaChart, Area,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  FiActivity,
  FiBarChart,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import { StatsCard } from './StatsCard';
import { Skeleton } from '../ui/skeleton';
import { fetchDashboardStats, fetchReportTrends } from '../../api/analyticsApi';

interface DashboardStats {
  totalReports: number;
  resolutionRate: number;
  avgResponseTime: number;
  activeUsers: number;
  complaintsByCategory: Record<string, number>;
  appointmentStats: Record<string, number>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <p className="font-medium text-lg mb-2 text-gray-100">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div 
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-300 capitalize">{entry.name}</span>
              </div>
              <span className="font-medium text-gray-100">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardHome = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, trendsData] = await Promise.all([
          fetchDashboardStats(),
          fetchReportTrends()
        ]);
        
        setStats(statsData);
        setChartData(trendsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-32 rounded-xl bg-gray-800 animate-pulse" 
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-96 rounded-xl bg-gray-800 animate-pulse" 
            />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-900 text-gray-100 min-h-screen">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Reports" 
          value={stats!.totalReports} 
          trend="month"
          delta={12.5}
        />
        <StatsCard 
          title="Resolution Rate" 
          value={`3.8`} 
          trend="week"
          delta={-2.3}
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={`4.8`} 
          trend="month"
          delta={-15}
        />
        <StatsCard 
          title="Active Users" 
          value={stats!.activeUsers} 
          trend="week"
          delta={5.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FiTrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-100">Report Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.5}
              />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#374151' }}
                axisLine={{ stroke: '#374151' }}
                fontSize={12}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#374151' }}
                axisLine={{ stroke: '#374151' }}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="reports" 
                stroke="#3b82f6"
                fill="url(#colorReports)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981"
                fill="url(#colorResolved)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Bar Chart */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FiBarChart className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-100">Category Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={Object.entries(stats!.complaintsByCategory).map(([name, value]) => ({ name, value }))}
              margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.5}
              />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#374151' }}
                axisLine={{ stroke: '#374151' }}
                fontSize={12}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                tickLine={{ stroke: '#374151' }}
                axisLine={{ stroke: '#374151' }}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status Grid */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <FiActivity className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-gray-100">System Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-lg text-gray-100">Appointments</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(stats!.appointmentStats).map(([status, count]) => (
                <div 
                  key={status} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  <span className="capitalize text-sm text-gray-300">{status}</span>
                  <span className="font-medium text-blue-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-lg text-gray-100">Response Times</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-600">
                <div>
                  <p className="text-sm text-gray-400">Average</p>
                  <p className="text-2xl font-bold text-gray-100">4.8</p>
                </div>
                <span className="text-sm text-gray-400">days</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-600">
                  <p className="text-sm text-gray-400">Fastest</p>
                  <p className="text-lg font-semibold text-gray-100">1.2d</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-600">
                  <p className="text-sm text-gray-400">Longest</p>
                  <p className="text-lg font-semibold text-gray-100">9.8d</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          <div className="bg-gray-700 rounded-xl p-4 border border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <FiZap className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-lg text-gray-100">AI Insights</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-900/50 to-blue-900/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Report Prediction</span>
                  <span className="font-semibold text-blue-400">↓ 12%</span>
                </div>
                <div className="h-2 rounded-full bg-blue-900/30">
                  <div className="h-full rounded-full bg-blue-400 w-1 /5 transition-all duration-300" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-900/50 to-green-900/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Resolution Rate</span>
                  <span className="font-semibold text-green-400">↑ 3.2%</span>
                </div>
                <div className="h-2 rounded-full bg-green-900/30">
                  <div className="h-full rounded-full bg-green-400 w-1/12 transition-all duration-300" />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Busiest Day</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-100">Friday</span>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};