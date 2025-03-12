// Reports.tsx
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyReportData = [
  { category: 'Infrastructure', resolved: 45, pending: 12 },
  { category: 'Sanitation', resolved: 32, pending: 8 },
  { category: 'Public Safety', resolved: 28, pending: 5 },
  { category: 'Licensing', resolved: 51, pending: 3 },
];

export default function Reports () {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Reports Management</h1>
        <select 
          className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reports</option>
          <option value="resolved">Resolved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total Reports</h3>
          <p className="text-3xl font-bold text-cyan-400 mt-2">1,234</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Resolution Rate</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">82%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm">Avg. Resolution Time</h3>
          <p className="text-3xl font-bold text-purple-400 mt-2">4.2d</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Report Trends</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyReportData}>
              <XAxis dataKey="category" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a202c', border: 'none' }}
                itemStyle={{ color: '#cbd5e0' }}
              />
              <Bar dataKey="resolved" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f472b6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-gray-300">Report ID</th>
              <th className="px-6 py-4 text-left text-gray-300">Category</th>
              <th className="px-6 py-4 text-left text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-gray-300">Date Filed</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((item) => (
              <tr key={item} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="px-6 py-4 text-gray-400">#{12300 + item}</td>
                <td className="px-6 py-4 text-gray-300">Sample Category {item}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    Resolved
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">2024-03-{10 + item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}