import React, { useState, useEffect } from "react";
import Search from "../DashboardImages/SearchIcon.png";

const ActivityLogs = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState(""); // state to track search input

  // Fetch data from the API endpoint
  useEffect(() => {
    const fetchData = () => {
    fetch("http://127.0.0.1:8000/activity_log/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          console.log(data);
          setActivityLogs(data);
          setFilteredLogs(data);
        } else {
          console.error("No activity logs found.");
          setActivityLogs([]);
          setFilteredLogs([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setActivityLogs([]);
        setFilteredLogs([]);
      });
}
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
  }, []);

  // Handle changes to the search input
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    // Filter logs based on search value
    const filtered = activityLogs.filter((log) => {
      const gateMatch = log.gate.toString().includes(value);
      const actionMatch = log.action.toLowerCase().includes(value);
      return gateMatch || actionMatch; // Match either gate or action
    });

    setFilteredLogs(filtered);
  };


  return (
    <div>
      {/* Activity Log section */}
      <div className="shadow-md p-4">
        <div className="flex flex-col justify-center items-center gap-2 md:flex-row md:justify-between p-4 shadow-lg">
          <div>
            <h1 className="font-bold text-[25px] text-[#211C37]">Activity Logs</h1>
            <p style={{ color: "#85878D" }}>View and Manage log</p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <input
                type="text"
                className="border border-gray-300 rounded-l-lg rounded-r-lg py-2 px-4 h-10"
                placeholder="Search by Gate or Activity..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <img src={Search} alt="Search Icon" className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold">
                <th className="px-4 py-2 text-center">Sr. No.</th>
                <th className="px-4 py-2 text-center">Gate</th>
                <th className="px-4 py-2 text-center">Activity</th>
                <th className="px-4 py-2 text-center">Date</th>
                <th className="px-4 py-2 text-center">Time</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : ""} cursor-pointer`}
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">Gate {log.gate}</td>
                  <td className="px-4 py-2 text-center capitalize">{log.action}</td>
                 <td className="px-4 py-2 text-center">
  {new Date(log.created_at).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata"
  })}
</td>
<td className="px-4 py-2 text-center">
  {new Date(log.created_at).toLocaleTimeString("en-IN", {
    hour12: false, // 24-hour format
    timeZone: "Asia/Kolkata", // IST
  })}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
