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
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  WifiOff
} from 'lucide-react';
import { Badge } from '../../ui/badge';

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
}

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api';

const PerformanceMetrics = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/performance/metrics`);
      
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
    }
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
        return 'bg-green-100 text-green-800';
      case 'investigating':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'disconnected':
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCpuStatus = (usage: number) => {
    if (usage < 50) return { status: 'Optimal', class: 'bg-green-100 text-green-800' };
    if (usage < 80) return { status: 'Moderate', class: 'bg-yellow-100 text-yellow-800' };
    return { status: 'High', class: 'bg-red-100 text-red-800' };
  };

  const getMemoryStatus = (usage: number) => {
    if (usage < 60) return { status: 'Optimal', class: 'bg-green-100 text-green-800' };
    if (usage < 85) return { status: 'Moderate', class: 'bg-yellow-100 text-yellow-800' };
    return { status: 'High', class: 'bg-red-100 text-red-800' };
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-lg">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
          <p className="text-lg mb-4">Error: {error}</p>
          <Button onClick={fetchMetrics} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <p className="text-lg">No data available</p>
      </div>
    );
  }

  const cpuStatus = getCpuStatus(data.cpuUsage);
  const memoryStatus = getMemoryStatus(data.memoryUsage);

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
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className={`px-3 py-1 rounded-full text-sm ${
              data.databaseStatus === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {data.databaseStatus === 'normal' ? 'Operational' : 'Issues Detected'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMetrics}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto: {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        <Card className="md:col-span-2 lg:col-span-8 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-[#10aa50]" />
              <span>Cluster Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">Storage Usage</h3>
                <div className="text-2xl font-bold">
                  {data.storage.used}MB
                  <span className="text-sm text-gray-500 ml-2">
                    / {data.storage.total}MB
                  </span>
                </div>
                <div className="relative pt-4">
                  <Progress 
                    value={(data.storage.used / data.storage.total) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Used</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-600">Storage Breakdown</h3>
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
                      >
                        {data.storage.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          background: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-600">Document Count</h3>
                  <span className="text-xs text-[#10aa50]">+{data.documentGrowth}%</span>
                </div>
                <div className="text-2xl font-bold">{data.documentCount.toLocaleString()}</div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.cpuHistory}>
                      <Line 
                        type="monotone" 
                        dataKey="usage" 
                        stroke="#10aa50" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-[#10aa50]" />
              <span>Realtime Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">CPU Utilization</span>
                </div>
                <Badge variant="outline" className={cpuStatus.class}>
                  {cpuStatus.status}
                </Badge>
              </div>
              <div className="text-3xl font-bold">{data.cpuUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.cpuHistory}>
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#10aa50" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Memory Usage</span>
                </div>
                <Badge variant="outline" className={memoryStatus.class}>
                  {memoryStatus.status}
                </Badge>
              </div>
              <div className="text-3xl font-bold">{data.memoryUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Used', value: data.memoryUsage },
                        { name: 'Free', value: 100 - data.memoryUsage }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell key="used" fill="#10aa50" />
                      <Cell key="free" fill="#e9ecef" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Management */}
        <Card className="md:col-span-2 lg:col-span-12 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-[#10aa50]" />
                <span>Incident Management</span>
              </CardTitle>
              <Button variant="outline" size="sm">
                View All Incidents
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {data.recentIncidents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentIncidents.map((incident, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
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
                      <TableCell className="font-medium">{incident.service}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{incident.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent incidents</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Query Performance */}
        <Card className="md:col-span-2 lg:col-span-6 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-[#10aa50]" />
              <span>Query Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Avg. Query Latency</h3>
                <div className="text-3xl font-bold">{data.queryPerformance.avgLatency}ms</div>
                <div className="text-sm text-gray-500">
                  <span className={data.queryPerformance.latencyTrend > 0 ? "text-red-500" : "text-green-500"}>
                    {data.queryPerformance.latencyTrend > 0 ? "↑" : "↓"}
                  </span>
                  {" "}
                  {Math.abs(data.queryPerformance.latencyTrend)}% from last week
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-gray-600">Index Hit Ratio</h3>
                <div className="text-3xl font-bold">{data.queryPerformance.indexHitRatio}%</div>
                <div className="text-sm text-gray-500">
                  <span className={data.queryPerformance.indexTrend > 0 ? "text-green-500" : "text-red-500"}>
                    {data.queryPerformance.indexTrend > 0 ? "↑" : "↓"}
                  </span>
                  {" "}
                  {Math.abs(data.queryPerformance.indexTrend)}% from last week
                </div>
              </div>
            </div>
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.cpuHistory}>
                  <Line 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#10aa50" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sharding Distribution */}
        <Card className="md:col-span-2 lg:col-span-6 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-[#10aa50]" />
              <span>Sharding Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {data.sharding.map((shard) => (
                <div key={shard.name} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{shard.name}</span>
                    <Badge variant="outline" className={getStatusBadge(shard.status)}>
                      {shard.status}
                    </Badge>
                  </div>
                  <Progress 
                    value={shard.usage}
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{shard.size}</span>
                    <span>Chunks: {shard.chunks}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info Card */}
        <Card className="md:col-span-2 lg:col-span-12 bg-white dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-[#10aa50]" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10aa50]">{data.uptime}</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10aa50]">{data.networkLatency}ms</div>
                <div className="text-sm text-gray-600">Network Latency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#10aa50]">
                  {((data.storage.used / data.storage.total) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  data.databaseStatus === 'normal' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.databaseStatus === 'normal' ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-gray-600">Database Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;