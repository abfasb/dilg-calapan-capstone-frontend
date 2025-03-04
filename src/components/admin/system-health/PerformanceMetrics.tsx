import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../ui/card'
import { Progress } from '../../ui/progress'
import { Button } from '../../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { LineChart, Line, PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Server, Database, Cpu, MemoryStick, Activity, AlertCircle, Clock, HardDrive } from 'lucide-react'
import { Badge } from '../../ui/badge'

const dummyData = {
  cpuUsage: 45,
  memoryUsage: 68,
  databaseStatus: 'normal',
  uptime: '94.87%',
  networkLatency: 98,
  storage: {
    used: 48,
    total: 512,
    breakdown: [
      { type: 'Data', value: 160, color: '#10aa50' },
      { type: 'Indexes', value: 50, color: '#023430' },
      { type: 'Logs', value: 24, color: '#12b575' }
    ]
  },
  recentIncidents: [
    { timestamp: '2024-02-15T14:30:00Z', service: 'Query Engine', status: 'resolved' },
    { timestamp: '2024-02-14T09:15:00Z', service: 'Storage Engine', status: 'investigating' },
    { timestamp: '2024-02-13T16:45:00Z', service: 'Sharding', status: 'monitoring' }
  ],
  cpuHistory: Array(24).fill(0).map((_, i) => ({ 
    time: `${i}:00`, 
    usage: Math.floor(Math.random() * (60 - 30 + 1)) + 30 
  }))
}

const PerformanceMetrics = () => {
  return (
    <div className="min-h-screen bg-mongodb-light dark:bg-mongodb-dark p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-[#023430] p-2 rounded-lg">
            <Database className="h-6 w-6 text-[#10aa50]" />
          </div>
          <h1 className="text-2xl font-bold text-[#023430] dark:text-white">
            MongoDB Atlas Performance Metrics
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Operational
          </span>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Updated 2h ago</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
        {/* Cluster Overview */}
        <Card className="md:col-span-2 lg:col-span-8 bg-[#f8f9fa] dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-[#10aa50]" />
              <span>Cluster Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Storage Usage</h3>
                <div className="text-2xl font-bold">
                  {dummyData.storage.used}MB
                  <span className="text-sm text-muted-foreground ml-2">
                    / {dummyData.storage.total}MB
                  </span>
                </div>
                <div className="relative pt-4">
                  <Progress 
                    value={(dummyData.storage.used / dummyData.storage.total) * 100}
                    className="h-2 bg-gray-200"
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Data</span>
                    <span>Free</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Storage Breakdown</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dummyData.storage.breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {dummyData.storage.breakdown.map((entry, index) => (
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
                  <h3 className="text-sm font-medium text-muted-foreground">Document Count</h3>
                  <span className="text-xs text-[#10aa50]">+12.4%</span>
                </div>
                <div className="text-2xl font-bold">98</div>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyData.cpuHistory}>
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

        {/* Realtime Metrics */}
        <Card className="md:col-span-2 lg:col-span-4 bg-[#f8f9fa] dark:bg-[#023430]">
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
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">CPU Utilization</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Optimal
                </Badge>
              </div>
              <div className="text-3xl font-bold">{dummyData.cpuUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyData.cpuHistory}>
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
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Memory Usage</span>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Moderate
                </Badge>
              </div>
              <div className="text-3xl font-bold">{dummyData.memoryUsage}%</div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Used', value: dummyData.memoryUsage },
                        { name: 'Free', value: 100 - dummyData.memoryUsage }
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
        <Card className="md:col-span-2 lg:col-span-12 bg-[#f8f9fa] dark:bg-[#023430]">
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
                {dummyData.recentIncidents.map((incident) => (
                  <TableRow key={incident.timestamp} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
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
                      <Badge 
                        variant="outline" 
                        className={
                          incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">2h 15m</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Query Performance */}
        <Card className="md:col-span-2 lg:col-span-6 bg-[#f8f9fa] dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-[#10aa50]" />
              <span>Query Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm text-muted-foreground">Avg. Query Latency</h3>
                <div className="text-3xl font-bold">98ms</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-red-500">↑</span> 8% from last week
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-muted-foreground">Index Hit Ratio</h3>
                <div className="text-3xl font-bold">98.6%</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-500">↓</span> 2% from last week
                </div>
              </div>
            </div>
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dummyData.cpuHistory}>
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
          </CardContent>
        </Card>

        {/* Sharding Status */}
        <Card className="md:col-span-2 lg:col-span-6 bg-[#f8f9fa] dark:bg-[#023430]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-[#10aa50]" />
              <span>Sharding Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {['Shard-1', 'Shard-2', 'Shard-3'].map((shard) => (
                <div key={shard} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{shard}</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.floor(Math.random() * 40) + 60}
                    className="h-2 bg-gray-200"
                    indicatorColor="#10aa50"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>448GB</span>
                    <span>Chunks: 42</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerformanceMetrics