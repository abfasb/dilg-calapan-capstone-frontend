import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Button } from "../ui/button"
import { 
  BarChart4, 
  Users,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react'
import { Progress } from "../ui/progress";

const Dashboard: React.FC = () => {
  const stats = {
    totalReports: 1245,
    resolvedCases: 892,
    pendingCases: 353,
    registeredUsers: 2450,
    avgResolutionTime: '2.4',
    citizenSatisfaction: 82
  }

  const incidentCategories = [
    { name: 'Infrastructure', count: 345, color: 'bg-blue-500' },
    { name: 'Public Safety', count: 287, color: 'bg-red-500' },
    { name: 'Environmental', count: 198, color: 'bg-green-500' },
    { name: 'Sanitation', count: 165, color: 'bg-yellow-500' },
  ]

  return (
    <div className="p-2 space-y-8 bg-muted/40">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3" />
              +12.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedCases}</div>
            <Progress value={(stats.resolvedCases/stats.totalReports)*100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registeredUsers}</div>
            <div className="text-xs text-muted-foreground">
              +245 new this week
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionTime}d</div>
            <div className="text-xs text-muted-foreground">
              -0.6d from last quarter
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Trends Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-semibold text-lg">Report Trends</h3>
              <p className="text-sm text-muted-foreground">Monthly report analysis</p>
            </div>
            <Button variant="outline" size="sm">Last 30 days</Button>
          </div>
          <div className="h-64">
            {/* Replace with your chart implementation (e.g., Recharts) */}
            <div className="flex items-center justify-center h-full bg-muted/50 rounded-lg">
              <BarChart4 className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Incident Breakdown */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Incident Breakdown</h3>
            <p className="text-sm text-muted-foreground">Top categories by barangay</p>
          </div>
          <div className="space-y-4">
            {incidentCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${category.color}`} />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Alerts */}
        <Card className="lg:col-span-2 p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="font-semibold text-lg text-red-600">Active Emergency</h3>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Flood Warning - Barangay IV</p>
            <p className="text-sm text-muted-foreground">
              Severe flooding reported in coastal areas. Evacuation centers activated.
            </p>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <MapPin className="h-4 w-4" />
              <span>3 barangays affected</span>
            </div>
          </div>
        </Card>

        {/* Citizen Engagement */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Citizen Engagement</h3>
            <p className="text-sm text-muted-foreground">Platform activity metrics</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              {/* Replace with donut chart */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{stats.citizenSatisfaction}%</span>
              </div>
              <div className="w-full h-full bg-muted/50 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <p className="font-semibold">1.2k</p>
                <p className="text-sm text-muted-foreground">Daily Active</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">84%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
          <CardDescription>System audit trail and user actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Map your audit log data here */}
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">Report #245 marked as resolved</p>
              <p className="text-sm text-muted-foreground">By Admin • 2h ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">New user registered</p>
              <p className="text-sm text-muted-foreground">Citizen • 4h ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard