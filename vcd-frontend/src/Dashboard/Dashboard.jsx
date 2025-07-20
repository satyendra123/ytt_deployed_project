import { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Navbar from './Navbar/Navbar';
import LiveStreaming from './LiveStreaming/LiveStreaming';
import ActivityLogs from './ActivityLogs/ActivityLogs';

const Dashboard = () => {

  const [data, setData] = useState({
    total_entry: 0,
    total_exit: 0,
    total_car: 0,
    total_registration: 0
  });

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/dashboard_data/");
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (e) {
        console.log("Error while fetching the data:", e);
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);
  },[]);

  return (
    <Layout>
      <Navbar data="Dashboard" />
      <div className="p-3">
        <LiveStreaming x={data}/>
      </div>
      <ActivityLogs />
    </Layout>
  );
};

export default Dashboard;
