import { motion } from 'framer-motion';

export const StatsCard = ({ title, value, trend }: { 
  title: string; 
  value: string | number; 
  trend: string 
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all"
  >
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <div className="flex justify-between items-center">
      <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {value}
      </span>
      <span className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </span>
    </div>
  </motion.div>
);

export const ChartCard = ({ title, children }: { 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
    <h3 className="text-gray-300 text-lg mb-4">{title}</h3>
    {children}
  </div>
);

export const RecentReportsTable = ({ reports }: { reports: any[] }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
    <h3 className="text-gray-300 text-lg mb-6">Recent Reports</h3>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700/50">
            <th className="pb-4 text-left">Case ID</th>
            <th className="pb-4 text-left">Category</th>
            <th className="pb-4 text-left">Status</th>
            <th className="pb-4 text-left">Priority</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-700/20 transition-colors">
              <td className="py-4 text-gray-300">#{report.caseId}</td>
              <td className="py-4 text-gray-400">{report.category}</td>
              <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  {report.status}
                </span>
              </td>
              <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                  {report.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);