import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { FiUsers, FiAlertTriangle,FiFileText, FiCheckCircle, FiClock, FiActivity, FiArrowUpRight } from 'react-icons/fi';

const PerformanceMetrics : React.FC = () => {
  const metrics = {
    totalUsers: { current: 23, change: +12.4 },
    activeReports: { current: 7, change: +8.2 },
    resolvedCases: { current: 12, change: -3.1 },
    avgResolutionTime: '2.4d'
  };

  const incidentTrends = [
    { month: 'Jan', Crime: 15, Infrastructure: 12, Environmental: 3 },
    { month: 'Feb', Crime: 12, Infrastructure: 18, Environmental: 17 },
    { month: 'Mar', Crime: 18, Infrastructure: 11, Environmental: 11 },
  ];

  const resolutionData = [
    { barangay: 'Brgy Masipit', resolved: 85, pending: 15 },
    { barangay: 'Bgy Managpi', resolved: 78, pending: 22 },
    { barangay: 'Bgy Dulangan', resolved: 92, pending: 8 },
  ];

  const systemHealth = {
    uptime: '94.98%',
    activeSessions: 142,
    storageUsed: '14.2/558MB'
  };

  return (
    <div className="h-full w-full bg-gray-50 p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          icon={<FiUsers className="w-5 h-5" />}
          title="Total Users"
          value={metrics.totalUsers.current}
          trend={metrics.totalUsers.change}
          color="bg-blue-100 text-blue-600"
        />
        <MetricCard
          icon={<FiAlertTriangle className="w-5 h-5" />}
          title="Active Reports"
          value={metrics.activeReports.current}
          trend={metrics.activeReports.change}
          color="bg-amber-100 text-amber-600"
        />
        <MetricCard
          icon={<FiCheckCircle className="w-5 h-5" />}
          title="Resolved Cases"
          value={metrics.resolvedCases.current}
          trend={metrics.resolvedCases.change}
          color="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          icon={<FiClock className="w-5 h-5" />}
          title="Avg. Resolution"
          value={metrics.avgResolutionTime}
          color="bg-purple-100 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Incident Trends</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" /> Crime
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" /> Infrastructure
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" /> Environmental
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incidentTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Crime" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Infrastructure" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Environmental" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Rates */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Resolution Rates</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="barangay" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="resolved" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="pending" 
                  fill="#e5e7eb" 
                  radius={[4, 4, 0, 0]}
                />
                <Legend 
                  formatter={(value) => (
                    <span className="text-gray-500 capitalize">{value}</span>
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">System Uptime</p>
              <p className="text-2xl font-semibold">{systemHealth.uptime}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <FiActivity className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Active Sessions</span>
              <span className="font-medium">{systemHealth.activeSessions}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Storage Used</span>
              <span className="font-medium">{systemHealth.storageUsed}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
              View All <FiArrowUpRight className="ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            <ActivityItem 
              type="policy"
              title="Updated system policies"
              timestamp="2h ago"
              user="Admin"
            />
            <ActivityItem
              type="resolved"
              title="Resolved case #3"
              timestamp="4h ago"
              user="LGU Staff"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, title, value, trend, color }: any) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      {trend && (
        <span className={`text-sm ${
          trend > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        } px-2 py-1 rounded-full`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ type, title, timestamp, user }: any) => {
  const iconConfig = {
    policy: { icon: <FiFileText />, color: 'bg-purple-100 text-purple-600' },
    resolved: { icon: <FiCheckCircle />, color: 'bg-emerald-100 text-emerald-600' },
    alert: { icon: <FiAlertTriangle />, color: 'bg-amber-100 text-amber-600' }
  };

  return (
    <div className="flex items-start space-x-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${iconConfig[type].color}`}>
        {iconConfig[type].icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-500">{user}</span>
          <span className="text-sm text-gray-400">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;