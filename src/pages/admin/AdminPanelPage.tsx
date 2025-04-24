import { useState, useEffect } from "react";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/admin/Sidebar";
import { Navbar } from "../../components/admin/NavBar";
import { Navigate } from "react-router-dom";
export default function AdminPanelPage() {

  const role = localStorage.getItem('role');
  
  if (role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/account/login"); 
    }
    
    if (location.pathname === `/account/admin/${id}`) {
      navigate(`/account/admin/${id}/dashboard`, { replace: true });
    }
  }, [navigate, id, location]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        adminId={id!}
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 p-6 pt-20 lg:pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
              <div className="p-6 sm:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-100 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} DILG Calapan. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}