import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Progress } from '../../ui/progress'
import { 
  Activity,
  CpuIcon,
  Database,
  MemoryStick,
  Timer,
  Users
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
  Legend
} from 'recharts'
import { Skeleton } from '../../ui/skeleton'
import { getSystemMetrics } from '../../../api/systemMetricsApi'

interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  mongoStorage: {
    used: number
    total: number
  }
  activeSessions: number
  uptime: string
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await getSystemMetrics()
        setMetrics(data)
      } catch (error) {
        console.error('Error loading metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
    const interval = setInterval(loadMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 ** 3)
    return `${gb.toFixed(2)} GB`
  }

  if (loading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const storageData = [
    {
      name: 'Storage',
      value: ((metrics!.mongoStorage.used / metrics!.mongoStorage.total) * 100),
      fill: '#10b981'
    }
  ]

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">System Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics!.cpuUsage}%</div>
            <Progress value={metrics!.cpuUsage} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics!.memoryUsage}%</div>
            <Progress value={metrics!.memoryUsage} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database Storage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="90%"
                  data={storageData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    formatter={() => (
                      <span className="text-sm">
                        {formatBytes(metrics!.mongoStorage.used)} /{' '}
                        {formatBytes(metrics!.mongoStorage.total)}
                      </span>
                    )}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Active Sessions</span>
              </div>
              <span className="font-semibold">{metrics!.activeSessions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>Uptime</span>
              </div>
              <span className="font-semibold">{metrics!.uptime}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance History</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[] /* Add your historical data here */}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 bg-green-500 rounded-full" />
              <span>Database backup completed</span>
            </div>
            <span className="text-sm text-muted-foreground">2h ago</span>
          </div>
          <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 bg-blue-500 rounded-full" />
              <span>System update applied</span>
            </div>
            <span className="text-sm text-muted-foreground">4h ago</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}