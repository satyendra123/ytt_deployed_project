import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Report from './Report/Report';
import Search from './SearchCar/SearchCar';
import Login from './Login/Login';
import Signout from './Signout/Signout'
import ProtectedRoute from './ProtectedRoute/ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State for tracking login status

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/report" element={<Report />} />
          <Route path="/boom" element={<Search />} />
          <Route path="/signout" element={<ProtectedRoute element={<Signout setIsLoggedIn={setIsLoggedIn} />} />} />

        </Routes>
      </Router>
  );
}

export default App;
