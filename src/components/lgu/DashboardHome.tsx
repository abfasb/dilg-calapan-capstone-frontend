import { useEffect, useState } from 'react';
import { 
  AreaChart, Area,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, 
  Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Activity,
  BarChart2,
  Calendar,
  Clock,
  TrendingUp,
  Zap,
  Info,
  Users,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { fetchDashboardStats, fetchReportTrends } from '../../api/analyticsApi';

// Enhanced stats card with animated transitions and better visual hierarchy
const StatsCard = ({ title, value, trend, delta, icon: Icon }) => {
  const isPositive = delta > 0;
  const isNeutral = delta === 0;
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gray-600 group">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-white group-hover:text-blue-400 transition-colors">{value}</p>
        </div>
        <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-blue-900/30 transition-colors">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium flex items-center gap-1
          ${isPositive ? 'text-green-400' : isNeutral ? 'text-gray-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : isNeutral ? '→' : '↓'} {Math.abs(delta)}%
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last {trend}</span>
      </div>
    </div>
  );
};

// Enhanced tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="bg-gray-800/90 border border-gray-700 rounded-lg p-4 shadow-xl"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <p className="font-medium text-lg mb-2 text-white">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div 
              key={index}
              className="flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-300 capitalize">{entry.name}</span>
              </div>
              <span className="font-medium text-white">
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

const formatResponseTime = (days) => {
  if (days === 0) return 'Less than a day';
  
  const wholeDays = Math.floor(days);
  const hours = Math.round((days - wholeDays) * 24);
  
  if (wholeDays === 0) return `${hours}hrs`;
  if (hours === 0) return `${wholeDays}d`;
  return `${wholeDays}d ${hours}hrs`;
};

// Panel component to standardize section styling
const Panel = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-900/30 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
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
              className="h-32 rounded-xl bg-gray-800/50 animate-pulse" 
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-96 rounded-xl bg-gray-800/50 animate-pulse" 
            />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl bg-gray-800/50 animate-pulse" />
      </div>
    );
  }

  const gradients = (
    <defs>
      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
      </linearGradient>
    </defs>
  );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-900 to-gray-950 text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Last updated:</span>
          <span className="font-medium text-white">{new Date().toLocaleDateString()}</span>
          <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <Info className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Reports" 
          value={stats.totalReports.toLocaleString()} 
          trend="month"
          delta={12.5}
          icon={BarChart2}
        />
        <StatsCard 
          title="Resolution Rate" 
          value={`${stats.resolutionRate.toFixed(1)}%`} 
          trend="week"
          delta={-2.3}
          icon={CheckCircle}
        />
        <StatsCard 
          title="Avg. Response Time" 
          value={`${stats.avgResponseTime.toFixed(1)}d`} 
          trend="month"
          delta={-15}
          icon={Clock}
        />
        <StatsCard 
          title="Active Users" 
          value={stats.activeUsers.toLocaleString()} 
          trend="week"
          delta={5.2}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Panel title="Report Trends" icon={TrendingUp} className="transition-all duration-300 hover:border-blue-800/40">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              {gradients}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
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
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: "16px" }}
              />
              <Area 
                type="monotone" 
                name="New Reports"
                dataKey="reports" 
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorReports)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                name="Resolved Reports"
                dataKey="resolved" 
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorResolved)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Category Distribution" icon={BarChart2} className="transition-all duration-300 hover:border-blue-800/40">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={Object.entries(stats.complaintsByCategory).map(([name, value]) => ({ name, value }))}
              margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                opacity={0.3}
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
                name="Reports"
                dataKey="value" 
                fill="url(#colorBar)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="System Insights" icon={Activity}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg hover:border-blue-900/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-lg text-white">Appointments</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(stats.appointmentStats).map(([status, count]) => (
                <div 
                  key={status} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <span className="capitalize text-sm text-gray-300">{status}</span>
                  <span className="font-medium text-blue-400">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg hover:border-blue-900/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-lg text-white">Response Times</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-br from-blue-900/20 to-gray-700/50">
                <div>
                  <p className="text-sm text-gray-400">Average</p>
                  <p className="text-2xl font-bold text-white">
                    {formatResponseTime(stats.avgResponseTime)}
                  </p>
                </div>
                <span className="text-sm text-gray-400">days</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <p className="text-sm text-gray-400">Fastest</p>
                  <p className="text-lg font-semibold text-white">
                    {formatResponseTime(stats.fastestResponseTime)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                  <p className="text-sm text-gray-400">Longest</p>
                  <p className="text-lg font-semibold text-white">
                    {formatResponseTime(stats.longestResponseTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg hover:border-blue-900/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-lg text-white">AI Insights</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-900/30 to-blue-900/10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Report Prediction</span>
                  </div>
                  <span className="font-semibold text-blue-400">↓ 12%</span>
                </div>
                <div className="h-2 rounded-full bg-blue-900/30">
                  <div className="h-full rounded-full bg-blue-400 w-1/5 transition-all duration-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">Projected decrease in next period</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-900/30 to-green-900/10">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Resolution Rate</span>
                  </div>
                  <span className="font-semibold text-green-400">↑ {stats.resolutionRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-green-900/30">
                  <div 
                    className="h-full rounded-full bg-green-400 transition-all duration-500" 
                    style={{ width: `${stats.resolutionRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Current period performance</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Busiest Day</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Friday</span>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
};