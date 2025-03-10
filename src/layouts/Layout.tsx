import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const Layout = () => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    
      
      const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
      };
  return (
    <>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <Outlet />
    </>
  );
};

export default Layout;
