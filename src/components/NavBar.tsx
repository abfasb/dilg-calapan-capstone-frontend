import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiUser,
  FiLogIn,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const navigate = useNavigate();

  const servicesDropdown = [
    {
      icon: <FiBarChart2 className="w-5 h-5 text-blue-400" />,
      title: "Analytics",
      description: "Comprehensive data analysis and reporting",
      image: "https://source.unsplash.com/random/800x600?analytics",
    },
    {
      icon: <FiFileText className="w-5 h-5 text-green-400" />,
      title: "Documentation",
      description: "Official documents and legal paperwork",
      image: "https://source.unsplash.com/random/800x600?documents",
    },
    {
      icon: <FiDatabase className="w-5 h-5 text-purple-400" />,
      title: "Database",
      description: "Secure data storage and management",
      image: "https://source.unsplash.com/random/800x600?database",
    },
  ];

  const handleLoginClick = () => navigate("/account/login");
  const handleRegisterClick = () => navigate("/account/register");
  const handleLGURegisterClick = () => navigate("/account/lgu/register");

  const links = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services", hasDropdown: true },
    { name: "Team", href: "/meet-the-team" },
    { name: "Blogs", href: "/blogs" },
    { name: "LGUs", href: "/account/lgu/register" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 ${
        theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
      } backdrop-blur-lg border-b ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      } shadow-xl transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 flex justify-between items-center">
     
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg shadow-lg overflow-hidden p-1 ">
            <img
              src="https://i.ibb.co/QFh5dS8r/images-1.png"
              alt="DILG Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DILG eGov
            </span>
            <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mt-0.5`}>
              Calapan City
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-8 ml-8">
          {links.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.hasDropdown && setIsServicesOpen(true)}
              onMouseLeave={() => link.hasDropdown && setIsServicesOpen(false)}
            >
              <a
                href={link.href}
                className={`flex items-center space-x-1 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                } hover:text-blue-400 transition-colors duration-300 ${
                  isServicesOpen ? "text-blue-400" : ""
                }`}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <FiChevronDown className="w-4 h-4" />}
              </a>

              {link.hasDropdown && isServicesOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl mt-4 p-8 grid grid-cols-3 gap-8 border dark:border-gray-700"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  {servicesDropdown.map((service) => (
                    <a
                      key={service.title}
                      href="#"
                      className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="h-48 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 dark:from-gray-600/50 dark:to-gray-700/50 rounded-xl overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-400/20 to-blue-500/20">
                            {service.icon}
                          </div>
                          <h3 className={`font-semibold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {service.title}
                          </h3>
                        </div>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                          {service.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl ${
              theme === "dark" 
                ? "bg-gray-800 hover:bg-gray-700 text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            } transition-colors duration-300 shadow-sm`}
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          <div className="flex items-center gap-2 border-l pl-4 dark:border-gray-700">
            <button
              onClick={handleLoginClick}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } transition-all duration-300`}
            >
              <FiLogIn className="w-5 h-5" />
              <span>Login</span>
            </button>
            <button
              onClick={handleRegisterClick}
              className={`px-5 py-2.5 rounded-xl font-medium flex items-center space-x-2 ${
                theme === "dark"
                  ? "border border-gray-600 hover:border-gray-500 text-gray-200 hover:bg-gray-800"
                  : "border border-gray-200 hover:border-gray-300 text-gray-800 hover:bg-gray-50"
              } transition-all duration-300`}
            >
              <FiUser className="w-5 h-5" />
              <span>Register</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <div className="px-6 py-4 space-y-4">
            {links.map((link) => (
              <div key={link.name} className="relative">
                <a
                  href={link.href}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    theme === "dark" 
                      ? "text-gray-200 hover:bg-gray-800" 
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => link.hasDropdown && setIsServicesOpen(!isServicesOpen)}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <FiChevronDown className="w-5 h-5" />}
                </a>

                {link.hasDropdown && isServicesOpen && (
                  <div className="ml-4 mt-2 space-y-4">
                    {servicesDropdown.map((service) => (
                      <a
                        key={service.title}
                        href="#"
                        className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex items-center space-x-3">
                          {service.icon}
                          <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                            {service.title}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t dark:border-gray-800 space-y-4">
              <button
                onClick={handleLoginClick}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              <button
                onClick={handleRegisterClick}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium ${
                  theme === "dark"
                    ? "border border-gray-600 hover:border-gray-500 text-gray-200"
                    : "border border-gray-200 hover:border-gray-300 text-gray-800"
                }`}
              >
                <FiUser className="w-5 h-5" />
                <span>Register</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;