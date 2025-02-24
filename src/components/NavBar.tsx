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

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
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

  const handleLGURegisterClick = () => {
    navigate("/account/lgu/register");
  };

  const links = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services", hasDropdown: true },
    { name: "Contact", href: "#contact" },
    { name: "Blogs", href: "#blogs" },
    { name: "LGUs", href: "/account/lgu/register" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 ${
        theme === "dark" ? "bg-gray-950/90" : "bg-gray-100/90"
      } backdrop-blur-lg border ${
        theme === "dark" ? "border-gray-800" : "border-gray-300"
      } shadow-lg transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-4 flex justify-between items-center">
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
            <a
              key={link.name}
              href={link.href}
              className={`${
                theme === "dark" ? "text-gray-200" : "text-gray-900"
              } font-medium hover:bg-gradient-to-r from-cyan-400 to-blue-400 hover:bg-clip-text hover:text-transparent transition-all duration-300`}
            >
              {link.name}
            </a>
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
