// MainDashboard.tsx
import { useState } from 'react';
import { FiMenu, FiX, FiBell, FiSearch, FiBarChart2, FiFileText, FiUsers, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', reports: 45 },
  { name: 'Feb', reports: 68 },
  { name: 'Mar', reports: 81 },
  { name: 'Apr', reports: 31 },
  { name: 'May', reports: 51 },
  { name: 'July', reports: 77 },
  { name: 'August', reports: 35 },
  { name: 'September', reports: 67 },
  { name: 'October', reports: 88 },
  { name: 'November', reports: 91 },
  { name: 'December', reports: 79 },
];

export default function Dashboard(){
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className={`transition-all ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TopNav />
        
        <main className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Total Reports" value="1,234" trend="+12%" />
            <StatsCard title="Resolution Rate" value="84%" trend="+3.2%" />
            <StatsCard title="Active Users" value="32.1k" trend="-1.4%" />
          </div>

          <ChartSection />

          <RecentReportsTable />
        </main>
      </div>
    </div>
  );
}

// Sidebar Component
const Sidebar = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => (
  <motion.nav
    className={`fixed h-full bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl`}
    style={{ width: isOpen ? '16rem' : '5rem' }}
  >
    <div className="p-4 flex justify-between items-center">
      {isOpen && <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">LGU Portal</h1>}
      <button onClick={onToggle} className="text-gray-400 hover:text-cyan-400">
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
    </div>
    <div className="space-y-2 px-4">
      <NavItem icon={<FiBarChart2 />} text="Dashboard" isOpen={isOpen} />
      <NavItem icon={<FiFileText />} text="Reports" isOpen={isOpen} />
      <NavItem icon={<FiUsers />} text="Staff" isOpen={isOpen} />
      <NavItem icon={<FiSettings />} text="Settings" isOpen={isOpen} />
    </div>
  </motion.nav>
);

const NavItem = ({ icon, text, isOpen }: { icon: React.ReactNode; text: string; isOpen: boolean }) => (
  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center p-3 text-gray-400 hover:bg-gray-700/30 rounded-lg cursor-pointer">
    <span className="text-xl">{icon}</span>
    {isOpen && <span className="ml-3">{text}</span>}
  </motion.div>
);

// Top Navigation Component
const TopNav = () => (
  <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
    <div className="flex items-center bg-gray-800/50 rounded-lg px-4 py-2 w-96">
      <FiSearch className="text-gray-500" />
      <input
        type="text"
        placeholder="Search reports..."
        className="ml-3 bg-transparent outline-none text-gray-300 placeholder-gray-500 w-full"
      />
    </div>
    <div className="flex items-center space-x-6">
      <button className="text-gray-400 hover:text-cyan-400 relative">
        <FiBell size={24} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
      </button>
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
    </div>
  </div>
);

// Stats Card Component
const StatsCard = ({ title, value, trend }: { title: string; value: string; trend: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all"
  >
    <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
    <div className="flex justify-between items-center">
      <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{value}</span>
      <span className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{trend}</span>
    </div>
  </motion.div>
);

// Chart Section Component
const ChartSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <ChartCard title="Monthly Report Trends">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="reports" stroke="#00f2fe" strokeWidth={2} />
          <CartesianGrid stroke="#2d3748" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Category Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <Bar dataKey="reports" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <CartesianGrid stroke="#2d3748" />
          <XAxis dataKey="name" stroke="#718096" />
          <YAxis stroke="#718096" />
          <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
    <h3 className="text-gray-300 text-lg mb-4">{title}</h3>
    {children}
  </div>
);

// Recent Reports Table Component
const RecentReportsTable = () => (
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
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="hover:bg-gray-700/20 transition-colors">
              <td className="py-4 text-gray-300">#CASE-00{i}</td>
              <td className="py-4 text-gray-400">Infrastructure</td>
              <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">Resolved</span>
              </td>
              <td className="py-4">
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">High</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);