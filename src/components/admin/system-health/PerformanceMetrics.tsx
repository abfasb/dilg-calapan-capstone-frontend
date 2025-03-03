import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Progress } from '../../ui/progress'
import { 
  Activity,
  AlertCircle,
  CpuIcon,
  Database,
  MemoryStick,
  Timer,
  Users,
  Server,
  HardDrive
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  CartesianGrid
} from 'recharts'
import { Skeleton } from '../../ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { getSystemMetrics, getHistoricalData, } from '../../../api/systemMetricsApi'
import { SystemMetrics } from '../../../types/systemMetrics'



export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [history, setHistory] = useState<any[]>([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [realTimeData, historicalData] = await Promise.all([
          getSystemMetrics(),
          getHistoricalData()
        ]);
        
        setMetrics(realTimeData)
        setHistory(historicalData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => `${(bytes / 1024 ** 3).toFixed(2)} GB`
  const formatUptime = (seconds: number) => `${(seconds / 3600).toFixed(1)} Hours`

  const HealthStatus = ({ value }: { value: number }) => (
    <div className="relative w-12 h-12">
      <div className={`absolute inset-0 rounded-full ${value > 90 ? 'bg-red-500' : value > 75 ? 'bg-yellow-500' : 'bg-green-500'} opacity-20`} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-xl font-bold ${value > 90 ? 'text-red-500' : value > 75 ? 'text-yellow-500' : 'text-green-500'}`}>
          {value}%
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Performance Dashboard</h1>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          <span className="font-mono">{metrics?.os.platform} {metrics?.os.version}</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="storage">Storage Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <HealthStatus value={parseFloat(metrics?.cpu.utilization || '0')} />
                <HealthStatus value={parseFloat(metrics?.memoryUsage.percentage || '0')} />
                <HealthStatus value={parseFloat(metrics?.mongoStorage.percentage || '0')} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">MongoDB Connections</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics?.connections.current}</div>
                <div className="text-sm text-muted-foreground">
                  {metrics?.connections.available} available
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Query Activity</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics?.connections.active}</div>
                <div className="text-sm text-muted-foreground">
                  Active operations
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Database Collections</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metrics?.mongoStorage.collections}</div>
                <div className="text-sm text-muted-foreground">
                  {metrics?.mongoStorage.indexes} indexes
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-80">
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cpu.utilization" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memoryUsage.percentage" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="h-80">
              <CardHeader>
                <CardTitle>Storage Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[metrics?.mongoStorage]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="used" 
                      fill="#10b981" 
                      name="Used Space"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#6b7280" 
                      name="Total Space" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {/* Add advanced analytics components */}
        </TabsContent>

        <TabsContent value="storage">
          {/* Add storage details components */}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {alerts.map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
              <div className="flex items-center gap-3">
                <AlertCircle className={`h-5 w-5 ${alert.level === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                <span>{alert.message}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}