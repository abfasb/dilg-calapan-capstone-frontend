import { useEffect, useState } from 'react';
import { 
  AreaChart, Area,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Cell,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Activity,
  BarChart2,
  CheckCircle,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Skeleton } from '../ui/skeleton';
import { fetchDashboardStats, fetchReportTrends } from '../../api/analyticsApi';
import { cn } from '../../lib/utils';

interface DashboardStats {
  totalReports: number;
  resolutionRate: number;
  avgResponseTime: number;
  fastestResponseTime: number;
  longestResponseTime: number;
  activeUsers: number;
  complaintsByCategory: Record<string, number>;
  appointmentStats: Record<string, number>;
}

const formatResponseTime = (days: number) => {
  if (days === 0) return 'Less than a day';
  
  const wholeDays = Math.floor(days);
  const hours = Math.round((days - wholeDays) * 24);
  
  if (wholeDays === 0) return `${hours}hrs`;
  if (hours === 0) return `${wholeDays}d`;
  return `${wholeDays}d & ${hours}hrs`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl backdrop-blur-sm transition-all duration-300 transform translate-y-0 opacity-100">
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
                {entry.value.toLocaleString()}
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
  const [refreshing, setRefreshing] = useState(false);

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

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-32 rounded-xl bg-gray-800/60 animate-pulse" 
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-96 rounded-2xl bg-gray-800/60 animate-pulse" 
            />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl bg-gray-800/60 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-900 text-gray-100 min-h-screen transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time insights and metrics</p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg text-white shadow-lg disabled:opacity-70"
        >
          <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Reports" 
          value={stats!.totalReports.toLocaleString()} 
          icon={<TrendingUp className="w-5 h-5" />}
          trend="month"
          delta={12.5}
          className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-700/20 border border-blue-800/40 shadow-xl shadow-blue-900/10"
        />
        <StatsCard 
          title="Resolution Rate" 
          value={`${stats!.resolutionRate.toFixed(1)}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          trend="week"
          delta={-2.3}
          className="bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-700/20 border border-green-800/40 shadow-xl shadow-green-900/10"
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={formatResponseTime(stats!.avgResponseTime)}
          icon={<Clock className="w-5 h-5" />}
          trend="month"
          delta={-15}
          className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-700/20 border border-purple-800/40 shadow-xl shadow-purple-900/10"
        />
        <StatsCard 
          title="Active Users" 
          value={stats!.activeUsers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="week"
          delta={5.2}
          className="bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-amber-700/20 border border-amber-800/40 shadow-xl shadow-amber-900/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transform transition-all hover:shadow-blue-900/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-900/40 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Report Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
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
                strokeWidth={2}
                fill="url(#colorReports)"
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e3a8a' }}
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorResolved)"
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#064e3b' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transform transition-all hover:shadow-purple-900/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-900/40 rounded-xl">
              <BarChart2 className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Category Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={Object.entries(stats!.complaintsByCategory).map(([name, value], index) => ({ 
                name, 
                value,
                fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
              }))}
              margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
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
                radius={[6, 6, 0, 0]}
                fillOpacity={0.8}
              >
                {Object.entries(stats!.complaintsByCategory).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transform transition-all hover:shadow-cyan-900/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-900/40 rounded-xl">
            <Activity className="w-6 h-6 text-cyan-300" />
          </div>
          <h3 className="text-xl font-semibold text-white">System Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Appointments</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(stats!.appointmentStats).map(([status, count]) => (
                <div 
                  key={status}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-600/30 backdrop-blur-sm hover:bg-gray-600/40 transition-all cursor-pointer"
                >
                  <span className="capitalize text-sm text-gray-300">{status}</span>
                  <span className="font-medium text-blue-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">Response Times</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-600/30 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Average</span>
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-xs">15% faster</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {formatResponseTime(stats!.avgResponseTime)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-600/30 backdrop-blur-sm">
                  <p className="text-sm text-gray-400 mb-1">Fastest</p>
                  <p className="text-lg font-semibold text-white">
                    {formatResponseTime(stats!.fastestResponseTime)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-600/30 backdrop-blur-sm">
                  <p className="text-sm text-gray-400 mb-1">Longest</p>
                  <p className="text-lg font-semibold text-white">
                    {formatResponseTime(stats!.longestResponseTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/50 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <h4 className="font-semibold text-white">AI Insights</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-300">Report Prediction</span>
                  <span className="text-blue-400 font-medium">↓ 12%</span>
                </div>
                <div className="relative pt-2">
                  <div className="overflow-hidden h-2 rounded-full bg-gray-700">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" 
                      style={{ width: '20%' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-900/40 to-green-800/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-300">Resolution Rate</span>
                  <span className="text-green-400 font-medium">↑ {stats!.resolutionRate.toFixed(1)}%</span>
                </div>
                <div className="relative pt-2">
                  <div className="overflow-hidden h-2 rounded-full bg-gray-700">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500" 
                      style={{ width: `${stats!.resolutionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-900/40 to-purple-800/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Peak Activity</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Friday</span>
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
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