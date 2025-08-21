import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, Legend } from 'recharts';
import { 
  Server, 
  Database, 
  Cpu, 
  MemoryStick, 
  Activity, 
  AlertCircle, 
  Clock, 
  HardDrive,
  RefreshCw,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';

interface PerformanceData {
  cpuUsage: number;
  memoryUsage: number;
  databaseStatus: string;
  uptime: string;
  networkLatency: number;
  storage: {
    used: number;
    total: number;
    breakdown: Array<{
      type: string;
      value: number;
      color: string;
    }>;
  };
  recentIncidents: Array<{
    timestamp: string;
    service: string;
    status: string;
    duration: string;
  }>;
  cpuHistory: Array<{
    time: string;
    usage: number;
  }>;
  queryPerformance: {
    avgLatency: number;
    indexHitRatio: number;
    latencyTrend: number;
    indexTrend: number;
  };
  sharding: Array<{
    name: string;
    status: string;
    usage: number;
    size: string;
    chunks: number;
  }>;
  documentCount: number;
  documentGrowth: number;
  memoryHistory: Array<{
    time: string;
    usage: number;
  }>;
  networkHistory: Array<{
    time: string;
    latency: number;
  }>;
}


const PerformanceMetrics = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/performance/metrics`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date());
        setIsConnected(true);
      } else {
        throw new Error(result.error || 'Failed to fetch metrics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch performance metrics';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'connected':
      case 'resolved':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'investigating':
      case 'moderate':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'disconnected':
      case 'critical':
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getCpuStatus = (usage: number) => {
    if (usage < 50) return { status: 'Optimal', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    if (usage < 80) return { status: 'Moderate', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    return { status: 'High', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
  };

  const getMemoryStatus = (usage: number) => {
    if (usage < 60) return { status: 'Optimal', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
    if (usage < 85) return { status: 'Moderate', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
    return { status: 'High', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatUptime = (uptime: string) => {
    // If it's already a formatted string with %, return as is
    if (uptime.includes('%')) return uptime;
    
    // If it's seconds, format to days, hours, minutes
    const seconds = parseInt(uptime);
    if (!isNaN(seconds)) {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (days > 0) return `${days}d ${hours}h ${minutes}m`;
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    }
    
    return uptime;
  };

  const renderTrendIndicator = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{value.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-green-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>{value.toFixed(1)}%</span>
        </div>
      );
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#023430] p-2 rounded-lg">
              <Database className="h-6 w-6 text-[#10aa50]" />
            </div>
            <h1 className="text-2xl font-bold text-[#023430] dark:text-white">
              MongoDB Atlas Performance Metrics
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {[8, 4, 12, 6, 6, 12].map((span, index) => (
            <Card key={index} className={`md:col-span-2 lg:col-span-${span} bg-white dark:bg-[#023430]`}>
              <CardHeader className="border-b">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-gray-600 dark:text-gray-400">No performance data available</p>
          <Button onClick={handleRefresh} className="mt-4 bg-green-600 hover:bg-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const cpuStatus = getCpuStatus(data.cpuUsage);
  const memoryStatus = getMemoryStatus(data.memoryUsage);
  const storagePercentage = (data.storage.used / data.storage.total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-[#023430] p-2 rounded-lg">
            <Database className="h-6 w-6 text-[#10aa50]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#023430] dark:text-white">
              MongoDB Atlas Performance Metrics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time monitoring and analytics dashboard
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className={`px-3 py-1 rounded-full text-sm ${
              data.databaseStatus === 'normal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {data.databaseStatus === 'normal' ? 'Operational' : 'Issues Detected'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Auto: {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Cluster Overview Card */}
        <Card className="md:col-span-2 lg:col-span-8 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <HardDrive className="h-5 w-5 text-[#10aa50]" />
              <span>Cluster Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Usage</h3>
                <div className="text-2xl font-bold dark:text-white">
                  {formatBytes(data.storage.used * 1024 * 1024)}
                  <span className="text-sm text-gray-500 ml-2">
                    / {formatBytes(data.storage.total * 1024 * 1024)}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{storagePercentage.toFixed(1)}% used</span>
                    <span>{(100 - storagePercentage).toFixed(1)}% free</span>
                  </div>
                 <Progress 
                    value={storagePercentage}
                    className="h-2 [&>div]:bg-[#10aa50]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Breakdown</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.storage.breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {data.storage.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} MB`, 'Usage']}
                        contentStyle={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          color: '#023430'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Document Count</h3>
                  {renderTrendIndicator(data.documentGrowth)}
                </div>
                <div className="text-2xl font-bold dark:text-white">{data.documentCount.toLocaleString()}</div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.cpuHistory}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Line 
                        type="monotone" 
                        dataKey="usage" 
                        stroke="#10aa50" 
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={!refreshing}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'CPU Usage']}
                        contentStyle={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          color: '#023430'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Realtime Metrics Card */}
        <Card className="md:col-span-2 lg:col-span-4 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Activity className="h-5 w-5 text-[#10aa50]" />
              <span>Realtime Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">CPU Utilization</span>
                </div>
                <Badge variant="outline" className={cpuStatus.class}>
                  {cpuStatus.status}
                </Badge>
              </div>
              <div className="text-3xl font-bold dark:text-white">{data.cpuUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.cpuHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#10aa50" 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={!refreshing}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'CPU Usage']}
                      contentStyle={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        color: '#023430'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</span>
                </div>
                <Badge variant="outline" className={memoryStatus.class}>
                  {memoryStatus.status}
                </Badge>
              </div>
              <div className="text-3xl font-bold dark:text-white">{data.memoryUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.memoryHistory || data.cpuHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#12b575" 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={!refreshing}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Memory Usage']}
                      contentStyle={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        color: '#023430'
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Management Card */}
        <Card className="md:col-span-2 lg:col-span-12 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <AlertCircle className="h-5 w-5 text-[#10aa50]" />
                <span>Incident Management</span>
              </CardTitle>
              <Button variant="outline" size="sm" className="border-[#10aa50] text-[#10aa50] hover:bg-[#10aa50] hover:text-white">
                View All Incidents
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {data.recentIncidents && data.recentIncidents.length > 0 ? (
              <div className="rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentIncidents.map((incident, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            {new Date(incident.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium dark:text-white">{incident.service}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadge(incident.status)}>
                            {incident.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right dark:text-white">{incident.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent incidents</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Query Performance Card */}
        <Card className="md:col-span-2 lg:col-span-6 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Server className="h-5 w-5 text-[#10aa50]" />
              <span>Query Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Avg. Query Latency</h3>
                <div className="text-3xl font-bold dark:text-white">{data.queryPerformance.avgLatency}ms</div>
                <div className="text-sm">
                  {renderTrendIndicator(data.queryPerformance.latencyTrend)}
                  <span className="text-gray-500 ml-2">from last week</span>
                </div>
              </div>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <h3 className="text-sm text-gray-600 dark:text-gray-400">Index Hit Ratio</h3>
                <div className="text-3xl font-bold dark:text-white">{data.queryPerformance.indexHitRatio}%</div>
                <div className="text-sm">
                  {renderTrendIndicator(data.queryPerformance.indexTrend)}
                  <span className="text-gray-500 ml-2">from last week</span>
                </div>
              </div>
            </div>
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.networkHistory || data.cpuHistory}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 'dataMax + 20']} />
                  <Tooltip 
                    formatter={(value) => [`${value}ms`, 'Latency']}
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      color: '#023430'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#10aa50" 
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={!refreshing}
                    name="Network Latency"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sharding Distribution Card */}
        <Card className="md:col-span-2 lg:col-span-6 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Database className="h-5 w-5 text-[#10aa50]" />
              <span>Sharding Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {data.sharding && data.sharding.map((shard, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium dark:text-white">{shard.name}</span>
                    <Badge variant="outline" className={getStatusBadge(shard.status)}>
                      {shard.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Usage</span>
                      <span>{shard.usage}%</span>
                    </div>
                    <Progress 
                      value={shard.usage}
                      className={`h-2 ${
                        shard.usage < 60 
                          ? "[&>div]:bg-green-500" 
                          : shard.usage < 85 
                            ? "[&>div]:bg-yellow-500" 
                            : "[&>div]:bg-red-500"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{shard.size}</span>
                    <span>Chunks: {shard.chunks}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info Card */}
        <Card className="md:col-span-2 lg:col-span-12 bg-white dark:bg-[#023430] dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Activity className="h-5 w-5 text-[#10aa50]" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="text-2xl font-bold text-[#10aa50]">{formatUptime(data.uptime)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="text-2xl font-bold text-[#10aa50]">{data.networkLatency}ms</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Network Latency</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="text-2xl font-bold text-[#10aa50]">
                  {storagePercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className={`text-2xl font-bold ${
                  data.databaseStatus === 'normal' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.databaseStatus === 'normal' ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Database Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;