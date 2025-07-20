import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dashboard from "./SidebarImages/dashboard.png";
import ReportIcon from "./SidebarImages/Report.png";
import SearchIcon from "./SidebarImages/Search.png";
import setting from "./SidebarImages/setting.png";
import signoutIcon from "./SidebarImages/signout.png";
import Logo from './SidebarImages/housyslogo.png'
const menuItems = [
  { id: 1, name: "Dashboard", icon: dashboard, path: "/dashboard" },
  { id: 2, name: "Report", icon: ReportIcon, path: "/report" },
  { id: 3, name: "Boom Control", icon: SearchIcon, path: "/boom" },
  { id: 4, name: "Settings", icon: setting, path: "/settings" },
];

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // Handle Sign Out Click
  const handleSignOut = () => {
    navigate("/signout");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-white w-[100px] md:w-[100px] lg:w-[200px] min-h-screen shadow-md z-10">
        <div className="flex justify-center items-center mt-4">
          <img src={Logo} alt="" />
        </div>
        <div className="flex flex-col items-center mt-5">
          {menuItems.map((item) => (
            <Link key={item.id} to={item.path} className="flex flex-col items-center p-2 hover:bg-gray-100 cursor-pointer mb-[30px]">
              <img src={item.icon} alt={item.name} className="h-12 w-12 mb-2" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          {/* Sign Out Button */}
          <button onClick={handleSignOut} className="flex flex-col items-center p-2 hover:bg-gray-100 cursor-pointer mb-[30px]">
            <img src={signoutIcon} alt="Sign Out" className="h-12 w-12 mb-2" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-h-screen">{children}</div>
    </div>
  );
};

export default Layout;
