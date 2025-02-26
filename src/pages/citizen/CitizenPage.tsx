import React from 'react'
import CitizenPanel from '../../components/citizen/MainCitizen'
import NavBar from '../../components/citizen/NavBar';

const CitizenPage = () => {

    const user = {
        name: "Juan Dela Cruz",
        avatar: "https://i.pravatar.cc/300", 
        role: "Citizen",
      };
    
      // Dummy alerts
      const alerts = [
        { id: "1", type: "emergency", title: "Flood Warning", date: new Date() },
        { id: "2", type: "warning", title: "Road Closure", date: new Date() },
        { id: "3", type: "info", title: "LGU Announcement", date: new Date() },
      ];
    
      // Dummy reports
      const reports = [
        { id: "101", status: "submitted" },
        { id: "102", status: "in-review" },
        { id: "103", status: "resolved" },
        { id: "104", status: "closed" },
      ];

  return (
    <>
        <NavBar reports={reports} alerts={alerts} user={user} />
        <CitizenPanel />
    </>
  )
}

export default CitizenPage