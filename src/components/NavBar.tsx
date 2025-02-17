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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme , toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const navigate = useNavigate();
  let menuTimeout: NodeJS.Timeout;

  const handleLoginClick = () => {
    navigate("/account/login");
  };

  const handleRegisterClick = () => {
    navigate("/account/register");
  };

  const links = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services", hasDropdown: true },
    { name: "Contact", href: "#contact" },
    { name: "Blogs", href: "#blogs" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 ${
        theme === "dark" ? "bg-gray-950/90" : "bg-gray-100/90"
      } backdrop-blur-lg border-b ${
        theme === "dark" ? "border-gray-800" : "border-gray-300"
      } shadow-lg transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full shadow-md overflow-hidden">
            <img
              src="https://i.ibb.co/QFh5dS8r/images-1.png"
              alt="DILG Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
              DILG eGov
            </span>
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } mt-0.5`}
            >
              Calapan LGUs
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-8">
          {links.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => {
                if (link.hasDropdown) {
                  clearTimeout(menuTimeout);
                  setIsMegaMenuOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (link.hasDropdown) {
                  menuTimeout = setTimeout(() => setIsMegaMenuOpen(false), 200);
                }
              }}
            >
              <a
                href={link.href}
                className={`${
                  theme === "dark" ? "text-gray-200" : "text-gray-900"
                } font-medium hover:bg-gradient-to-r from-cyan-400 to-blue-400 hover:bg-clip-text hover:text-transparent transition-all duration-300`}
              >
                {link.name}
              </a>

              {/* Dropdown (Only for Services) */}
              {link.hasDropdown && isMegaMenuOpen && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-3 w-80 bg-white shadow-xl rounded-lg p-6 grid grid-cols-1 gap-4 border ${
                    theme === "dark"
                      ? "bg-gray-900 text-white border-gray-700"
                      : "bg-gray-100 text-gray-900 border-gray-300"
                  } transition-all duration-300`}
                  onMouseEnter={() => clearTimeout(menuTimeout)}
                  onMouseLeave={() => setIsMegaMenuOpen(false)}
                >
                  {[
                    {
                      icon: <FiBarChart2 className="text-blue-500" />,
                      title: "AI-Powered Reporting",
                      description: "Automated analytics & insights",
                    },
                    {
                      icon: <FiDatabase className="text-green-500" />,
                      title: "Real-Time Analytics",
                      description: "Live data tracking & visualization",
                    },
                    {
                      icon: <FiFileText className="text-red-500" />,
                      title: "Digital Document Mgmt",
                      description: "Secure and organized storage",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 hover:bg-gray-200 p-3 rounded-lg cursor-pointer transition-all duration-200"
                    >
                      {item.icon}
                      <div>
                        <p className="font-semibold text-black">{item.title}</p>
                        <span className="text-sm text-gray-500">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLoginClick}
            className={`px-4 py-2 rounded-md font-medium ${
              theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-all duration-300`}
          >
            <FiLogIn className="inline-block mr-2" /> Login
          </button>
          <button
            onClick={handleRegisterClick}
            className={`px-4 py-2 rounded-md font-medium ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-800 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            } transition-all duration-300`}
          >
            <FiUser className="inline-block mr-2" /> Register
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
            } shadow-md hover:opacity-90 transition-opacity`}
          >
            {theme === "dark" ? <FiSun size={22} /> : <FiMoon size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
