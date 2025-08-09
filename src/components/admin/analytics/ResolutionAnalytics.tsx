"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { Skeleton } from "../../ui/skeleton"
import { Separator } from "../../ui/separator"
import { Badge } from "../../ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs"
import {
  Users,
  FileText,
  Clock,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  TrendingUp,
  MoreHorizontal,
  Eye,
  Settings,
} from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback } from "../../ui/avatar"
import { Progress } from "../../ui/progress"

interface AnalyticsData {
  userStats?: {
    totalUsers: number
    lguUsers: number
    pendingApprovals: number
    usersByBarangay: Array<{ _id: string; count: number }>
    growthRate?: number
  }
  formStats?: {
    totalForms: number
    averageFields?: number
    formsLastMonth?: number
  }
  recentActivity?: {
    recentUsers: any[]
    recentForms: any[]
  }
  responseStats?: {
    totalResponses: number
    responsesByStatus: Array<{ _id: string; count: number }>
    averageProcessingTime: number
    totalDocuments: number
    avgDocumentsPerResponse: number
  }
  formResponses?: {
    responsesPerForm: Array<{ formTitle: string; count: number }>
    sectorDistribution: Array<{ _id: string; count: number }>
  }
  submissionTrends?: Array<{ _id: { year: number; month: number; week: number }; count: number }>
}

const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  const BASE_URL = import.meta.env.VITE_API_URL
  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStats, formStats, recentActivity, responseStats, formResponses, submissionTrends] =
          await Promise.all([
            fetch(`${BASE_URL}/analytics/user-stats`).then(handleResponse),
            fetch(`${BASE_URL}/analytics/form-stats`).then(handleResponse),
            fetch(`${BASE_URL}/analytics/recent-activity`).then(handleResponse),
            fetch(`${BASE_URL}/analytics/response-stats`).then(handleResponse),
            fetch(`${BASE_URL}/analytics/form-responses`).then(handleResponse),
            fetch(`${BASE_URL}/analytics/submission-trends`).then(handleResponse),
          ])

        setData({ userStats, formStats, recentActivity, responseStats, formResponses, submissionTrends })
        setError(null)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    const handleResponse = (res: Response) => {
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
      return res.json()
    }

    fetchData()
  }, [timeRange])

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Metrics Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderError = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Unable to Load Analytics</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  if (error) return renderError()
  if (loading) return renderLoading()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="p-6 lg:p-8 space-y-8">
        {/* Enhanced Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Municipal Analytics Dashboard
                </h1>
                <p className="text-gray-600 font-medium">Real-time insights and performance metrics</p>
              </div>
            </div>
          </div>

        </div>

        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <EnhancedMetricCard
            title="Total Users"
            value={data.userStats?.totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="from-blue-500 to-blue-600"
            bgColor="bg-blue-50"
            description="Active registered users"
          />
          <EnhancedMetricCard
            title="LGU Officials"
            value={data.userStats?.lguUsers}
            icon={<CheckCircle className="w-6 h-6" />}
            color="from-emerald-500 to-emerald-600"
            bgColor="bg-emerald-50"
            description="Verified officials"
          />
          <EnhancedMetricCard
            title="Pending Approvals"
            value={data.userStats?.pendingApprovals}
            icon={<Clock className="w-6 h-6" />}
            color="from-amber-500 to-amber-600"
            bgColor="bg-amber-50"
            description="Awaiting review"
          />
          <EnhancedMetricCard
            title="Avg Response Time"
            value={`${data.responseStats?.averageProcessingTime?.toFixed(1) || "2.4"}h`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="from-purple-500 to-purple-600"
            bgColor="bg-purple-50"
            description="Processing efficiency"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Distribution Chart */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-gray-900">User Distribution</CardTitle>
                    <p className="text-sm text-gray-600">Active users across barangays</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                      Live
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.userStats?.usersByBarangay}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
                      <XAxis
                        dataKey="_id"
                        tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        stroke="#9CA3AF"
                      />
                      <YAxis
                        tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }}
                        stroke="#9CA3AF"
                        label={{
                          value: "Active Users",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "#6B7280", fontSize: "12px", fontWeight: 500 },
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(99, 102, 241, 0.1)", radius: 4 }}
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.95)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          backdropFilter: "blur(8px)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                        labelStyle={{ color: "#374151", fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        stroke="#6366F1"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Form Analytics */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-gray-900">Form Analytics</CardTitle>
                    <p className="text-sm text-gray-600">Response trends and sector distribution</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="responses" className="space-y-6">
                  <TabsList className="bg-gray-100/80 backdrop-blur-sm p-1">
                    <TabsTrigger
                      value="responses"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Form Responses
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="responses" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.formResponses?.responsesPerForm}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <defs>
                            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
                          <XAxis
                            dataKey="formTitle"
                            tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            stroke="#9CA3AF"
                          />
                          <YAxis tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 500 }} stroke="#9CA3AF" />
                          <Tooltip
                            cursor={{ fill: "rgba(245, 158, 11, 0.1)", radius: 4 }}
                            contentStyle={{
                              background: "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                              backdropFilter: "blur(8px)",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="url(#responseGradient)"
                            radius={[6, 6, 0, 0]}
                            stroke="#F59E0B"
                            strokeWidth={1}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="sectors" className="space-y-4">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            {COLORS.map((color, index) => (
                              <linearGradient key={index} id={`sectorGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={data.formResponses?.sectorDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={3}
                            dataKey="count"
                            stroke="#fff"
                            strokeWidth={2}
                          >
                            {data.formResponses?.sectorDistribution?.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={`url(#sectorGradient${index % COLORS.length})`} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                              backdropFilter: "blur(8px)",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          />
                          <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            wrapperStyle={{ fontSize: "13px", fontWeight: 500 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity & Status */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                    <p className="text-sm text-gray-600">Latest updates</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Eye className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                {/* New Users Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      New Users
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {data.recentActivity?.recentUsers?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {data.recentActivity?.recentUsers?.slice(0, 4).map((user, index) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                      >
                        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-semibold">
                            {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {`${user.firstName} ${user.lastName}`}
                          </p>
                          <p className="text-xs text-gray-500">{user.barangay}</p>
                        </div>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Recent Forms Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Form Submissions
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {data.recentActivity?.recentForms?.length || 0}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {data.recentActivity?.recentForms?.slice(0, 3).map((form, index) => (
                      <div
                        key={form._id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{form.title}</p>
                          <p className="text-xs text-gray-500">
                            {form.fields?.length} fields • {form.type || "General"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Response Status</CardTitle>
                <p className="text-sm text-gray-600">Current processing status</p>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {data.responseStats?.responsesByStatus?.map((status, index) => {
                  const percentage = (status.count / (data.responseStats?.totalResponses || 1)) * 100
                  return (
                    <div key={status._id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-gray-900 text-sm capitalize">{status._id}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">{status.count}</p>
                          <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2 bg-gray-100"
                        style={
                          {
                            "--progress-background": COLORS[index % COLORS.length],
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const EnhancedMetricCard = ({
  title,
  value,
  icon,
  color,
  bgColor,
  description,
}: {
  title: string
  value: any
  icon: React.ReactNode
  color: string
  bgColor: string
  description: string
}) => (
  <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
          {value ?? "-"}
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:opacity-10 transition-opacity duration-300`}
      />
    </CardContent>
  </Card>
)

export default AdminAnalytics
