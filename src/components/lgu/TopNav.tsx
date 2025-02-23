// components/TopNav.tsx
import { FiBell, FiSearch } from "react-icons/fi";

export const TopNav = ({ user }: { user: { name: string; email: string } }) => {
  const Email = localStorage.getItem("adminEmail"); 
  const name = localStorage.getItem("name");


  return (
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
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-medium"></span>
          </div>
          <div className="text-left">
            <p className="text-gray-200 text-sm font-medium">{name}</p>
            <p className="text-gray-400 text-xs">{Email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
