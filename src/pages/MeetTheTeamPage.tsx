import React, { useEffect, useState} from 'react'
import MeetTheTeam from '../components/LandingPage/MeetTheTeam';
import Navbar from '../components/NavBar';

const MeetTheTeamPage : React.FC= () => {

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.add(savedTheme);
      } else {
        document.documentElement.classList.add("dark"); 
      }
    }, []);
  
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    };
  
  return (
    
    <>
        <Navbar toggleTheme={toggleTheme} theme={theme}/>
        <MeetTheTeam />
    </>
  )
}

export default MeetTheTeamPage;