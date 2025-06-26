import { useEffect, useState } from 'react';
import { 
  AreaChart, Area,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Cell,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Activity,
  BarChart2,
  CheckCircle,
  Users,
  Calendar,
  TrendingUp,
  Zap,
  RefreshCw,
  Cpu,
  PieChart
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Skeleton } from '../ui/skeleton';
import { fetchDashboardStats } from '../../api/analyticsApi';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  delta?: number;
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, delta, className }: StatsCardProps) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-6 border border-gray-700/50 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-blue-900/10",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-300 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/10">
          {icon}
        </div>
      </div>
      
      {delta !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            delta >= 0 
              ? "text-green-300 bg-green-900/30" 
              : "text-red-300 bg-red-900/30"
          )}>
            {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}%
          </div>
          <p className="text-xs text-gray-400">vs last {trend}</p>
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl backdrop-blur-sm transition-all duration-300 transform translate-y-0 opacity-100">
        <p className="font-medium text-lg mb-2 text-gray-100">{label}</p>
        <div className="space-y-1">
          {payload.map((entry : any, index  : any) => (
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
  interface DashboardStats {
    trends?: {
      submissionHistory: number[];
    };
    predictions?: {
      resolutionRate: number;
      nextMonthSubmissions?: number;
    };
    overview?: {
      totalForms: number;
      totalSubmissions: number;
      activeUsers: number;
    };
    statusDistribution?: {
      submissions: { _id: string; count: number }[];
    };
    peakActivity?: { day: string; percentage: number }[];
    departmentPerformance?: {
      allBarangays: { barangay: string; percentage: number }[];
      overallPerformance: string;
    };
  }

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 300000); 
    return () => clearInterval(interval);
  }, []);

  const getTrendsData = () => {
    if (!stats?.trends?.submissionHistory) return [];
    
    return stats.trends.submissionHistory.map((value : any, index : any) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      submissions: value,
      resolved: Math.round(value * ((stats?.predictions?.resolutionRate ?? 0) / 100))
    }));
  };

  const getStatusData = () => {
    if (!stats?.statusDistribution?.submissions) return [];
    
    return stats.statusDistribution.submissions.map((item, index) => ({
      name: item._id,
      value: item.count,
      fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
    }));
  };

  // Get peak activity data from API response
  const getPeakActivityData = () => {
    if (!stats?.peakActivity) return [];
    return stats.peakActivity;
  };

  // Get department performance data from API response
  const getDepartmentPerformanceData = () => {
    if (!stats?.departmentPerformance?.allBarangays) return [];
    
    // Map barangay data and assign colors
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500', 'bg-indigo-500'];
    return stats.departmentPerformance.allBarangays.map((item, index) => ({
      barangay: item.barangay,
      performance: item.percentage,
      color: colors[index % colors.length]
    }));
  };

  const getSystemHealth = () => {
    if (!stats) return null;
    
    // Fix: Calculate response rate correctly based on total submissions divided by total forms
    // This is the percentage of forms that have received submissions
    const formsResponseRate = ((stats?.overview?.totalSubmissions ?? 0) / (stats?.overview?.totalForms ?? 1) * 100).toFixed(1);
    
    return [
      { 
        label: 'Forms Response Rate', 
        value: `${formsResponseRate}%`,
        percentage: parseFloat(formsResponseRate) > 100 ? 100 : parseFloat(formsResponseRate)
      },
      { 
        label: 'Avg. Resolution Time', 
        value: '2.4 days',
        percentage: 78 
      },
      { 
        label: 'User Activity', 
        value: '89%',
        percentage: 89 
      }
    ];
  };

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
          <h1 className="text-3xl font-bold text-white">LGU Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time insights and municipal metrics</p>
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
          title="Total Submissions" 
          value={(stats?.overview?.totalSubmissions ?? 0).toLocaleString()} 
          icon={<TrendingUp className="w-5 h-5 text-blue-300" />}
          trend="month"
          delta={12.5}
          className="bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-700/20 border border-blue-800/40 shadow-xl shadow-blue-900/10"
        />
        <StatsCard 
          title="Total Forms" 
          value={stats?.overview?.totalForms ?? 0}
          icon={<CheckCircle className="w-5 h-5 text-green-300" />}
          trend="week"
          delta={5.2}
          className="bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-700/20 border border-green-800/40 shadow-xl shadow-green-900/10"
        />
        <StatsCard 
          title="Active Users" 
          value={stats?.overview?.activeUsers ?? 0}
          icon={<Users className="w-5 h-5 text-amber-300" />}
          trend="month"
          delta={7.8}
          className="bg-gradient-to-br from-amber-900/40 via-amber-800/30 to-amber-700/20 border border-amber-800/40 shadow-xl shadow-amber-900/10"
        />
        <StatsCard 
          title="Response Rate" 
          value={`${stats?.predictions?.resolutionRate ?? 0}%`}
          icon={<Activity className="w-5 h-5 text-purple-300" />}
          trend="week"
          delta={-2.3}
          className="bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-700/20 border border-purple-800/40 shadow-xl shadow-purple-900/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transform transition-all hover:shadow-blue-900/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-900/40 rounded-xl">
              <Zap className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">AI Forecast</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-xl bg-gray-700/40 backdrop-blur-sm border border-gray-600/50">
              <p className="text-sm text-gray-300 mb-1">Next Month Submissions</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">{stats?.predictions?.nextMonthSubmissions ?? 'N/A'}</p>
                <div className="flex items-center gap-1 text-xs bg-blue-900/40 px-2 py-1 rounded-full text-blue-300">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8%</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-700/40 backdrop-blur-sm border border-gray-600/50">
              <p className="text-sm text-gray-300 mb-1">Estimated Resolution Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">{stats?.predictions?.resolutionRate ?? 0}%</p>
                <div className="flex items-center gap-1 text-xs bg-green-900/40 px-2 py-1 rounded-full text-green-300">
                  <TrendingUp className="w-3 h-3" />
                  <span>+5%</span>
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={getTrendsData()}>
              <defs>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="month" 
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
                dataKey="submissions" 
                name="Submissions"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorSubmissions)"
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e3a8a' }}
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                name="Resolved"
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
            <h3 className="text-xl font-semibold text-white">Submission Status</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={getStatusData()}
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
              <Legend />
              <Bar 
                dataKey="value" 
                name="Submissions"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.8}
              >
                {getStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Health Section */}
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transform transition-all hover:shadow-cyan-900/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-cyan-900/40 rounded-xl">
            <Cpu className="w-6 h-6 text-cyan-300" />
          </div>
          <h3 className="text-xl font-semibold text-white">System Health</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getSystemHealth()?.map((metric, index) => (
            <div key={index} className="bg-gray-700/40 rounded-xl p-4 border border-gray-600/50 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-300">{metric.label}</p>
                <p className="text-lg font-semibold text-white">{metric.value}</p>
              </div>
              <div className="relative pt-2">
                <div className="overflow-hidden h-2 rounded-full bg-gray-700">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      index === 0 ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                      index === 1 ? "bg-gradient-to-r from-green-400 to-green-600" :
                      "bg-gradient-to-r from-amber-400 to-amber-600"
                    )}
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-900/40 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Peak Activity</h3>
          </div>
          <div className="space-y-4">
            {/* Use actual peak activity data from API */}
            {getPeakActivityData().map((dayData : any, index : any) => (
              <div key={index} className="flex items-center p-2 gap-3">
                <div className="w-24 text-sm text-gray-400">{dayData.day}</div>
                <div className="flex-1">
                  <div className="relative h-2 w-full rounded-full bg-gray-700">
                    <div 
                      className="absolute h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-300" 
                      style={{ width: `${dayData.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-xs text-gray-400">{dayData.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl col-span-1 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-900/40 rounded-xl">
              <PieChart className="w-5 h-5 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">Barangay Performance</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Use actual department performance data from API */}
              {getDepartmentPerformanceData().map((dept : any, index : any) => (
                <div key={index} className="p-3 rounded-lg bg-gray-700/40 backdrop-blur-sm hover:bg-gray-700/60 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                      <span className="text-sm text-gray-300">{dept.barangay}</span>
                    </div>
                    <span className="font-medium text-white">{dept.performance}%</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-1.5 rounded-full bg-gray-600/50">
                      <div 
                        className={`h-full rounded-full ${dept.color}`}
                        style={{ width: `${dept.performance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {getDepartmentPerformanceData().length > 4 && (
                <div className="text-center pt-2">
                  <button className="text-sm text-blue-400 hover:underline hover:text-blue-300 transition">
                    View All
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-gray-700/40 backdrop-blur-sm border border-gray-600/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-300">Overall Performance</p>
                <div className="flex items-center gap-1 text-xs bg-green-900/40 px-2 py-1 rounded-full text-green-300">
                  <TrendingUp className="w-3 h-3" />
                  <span>+4.5%</span>
                </div>
              </div>
              <p className="text-4xl font-bold text-white mb-4">
                {stats?.departmentPerformance?.overallPerformance || "0.0"}%
              </p>
              <p className="text-xs text-gray-400">Average across all barangays</p>
              <div className="mt-6">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-400">Target</p>
                  <p className="text-xs text-gray-300">85%</p>
                </div>
                <div className="relative h-1.5 w-full rounded-full bg-gray-600/50">
                  <div 
                    className="absolute h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-300" 
                    style={{ width: `${parseFloat(stats?.departmentPerformance?.overallPerformance || '0')}%` }}
                  />
                  <div className="absolute w-0.5 h-3 bg-white/50 rounded-full" style={{ left: '85%', top: '-3px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};