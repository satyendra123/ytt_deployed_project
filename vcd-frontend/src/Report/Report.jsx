import React, { useState, useEffect } from "react";
import Layout from "../Layout/Layout";
import Navbar from "../Dashboard/Navbar/Navbar";
import { jsPDF } from "jspdf";
import reload from "./ReportIcons/reload.png";
import download from "./ReportIcons/download.png";
import threedots from "./ReportIcons/threedots.png";

const Report = () => {
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [selectedValues, setSelectedValues] = useState({
    gate_number:"All",
    activity: "All",
    fromDate: null,
    toDate: null,
  });

  const [reportData, setReportData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // Fetch report data from backend
  const fetchReportData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate_report/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_date: selectedValues.fromDate,
          to_date: selectedValues.toDate,
          action: selectedValues.activity,
          gate: selectedValues.gate_number,
        }),
      });

      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        setReportData(data);
        setIsDataFetched(true);
      } else {
        console.error("Invalid data format received:", data);
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleSelect = (key, value) => {
    setSelectedValues({ ...selectedValues, [key]: value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(8);

    const columns = [
      "Sr. No.",
      "Gate",
      "Activity",
      "Date",
      "Time",
    ];

    const rows = reportData.map((item, index) => [
      index + 1,
      item.gate || "N/A",
      item.action || "N/A",
      new Date(item.created_at).toLocaleDateString(),
      new Date(item.created_at).toLocaleTimeString(),
    ]);

    const startX = 10;
    let startY = 20;

    const columnWidths = [45, 45, 45, 45, 45];

    columns.forEach((col, idx) => {
      const x = startX + columnWidths.slice(0, idx).reduce((a, b) => a + b, 0);
      doc.text(col, x, startY);
    });

    startY += 5;
    doc.line(startX, startY, startX + columnWidths.reduce((a, b) => a + b, 0), startY);

    rows.forEach((row, rowIndex) => {
      const y = startY + 10 + rowIndex * 10;
      row.forEach((cell, cellIndex) => {
        const value = cell || "N/A";
        const x = startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
        doc.text(value.toString(), x, y);
      });
    });

    doc.save("vehicle-data-report.pdf");
  };

  return (
    <Layout>
      {/* Navbar section */}
      <Navbar data="Report" />
      {/* Report section */}
      <div className="shadow-md">
        <div className="flex justify-between p-4">
          <div>
            <h1 className="font-bold text-[25px] text-[#211C37]">Report</h1>
            <p style={{ color: "#85878D" }}>View and Analyze Reports</p>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 p-2 bg-gray-100 rounded-md shadow-md overflow-x-auto">
          {/* From Date */}
          <div className="flex flex-col">
            <label htmlFor="entry-date" className="text-center text-sm font-semibold text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              id="entry-date"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSelect("fromDate", e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label htmlFor="exit-date" className="text-center text-sm font-semibold text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              id="exit-date"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSelect("toDate", e.target.value)}
            />
          </div>

          {/* Activity */}
          <div className="flex flex-col">
            <label htmlFor="activity" className="text-center text-sm font-semibold text-gray-700 mb-1">Activity</label>
            <select
              id="activity"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSelect("activity", e.target.value)}
            >
              <option value="All">All</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </select>
          </div>

          {/* Gate */}
          <div className="flex flex-col">
            <label htmlFor="gate-number" className="text-center text-sm font-semibold text-gray-700 mb-1">Gate</label>
            <select
              id="gate-number"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSelect("gate_number", e.target.value)}
            >
              <option value="All">All</option>
              <option value="1">Gate 1</option>
              <option value="2">Gate 2</option>
              <option value="3">Gate 3</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={fetchReportData}
            className="px-4 py-2 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Report
          </button>
        </div>

        <div className="flex justify-between p-4">
          <p className="font-semibold text-[#242533]">Cross Channel Analysis</p>
          <div className="flex">
            <div><img src={reload} alt="" /></div>
            <div><img src={download} alt="" className="cursor-pointer" onClick={generatePDF} /></div>
            <div><img src={threedots} alt="" /></div>
          </div>
        </div>

        {/* Display Report Data */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold">
                <th className="px-4 py-2 text-center">Sr. No.</th>
                <th className="px-4 py-2 text-center">Gate</th>
                <th className="px-4 py-2 text-center">Activity</th>
                <th className="px-4 py-2 text-center">Date</th>
                <th className="px-4 py-2 text-center">Time</th>
              </tr>
            </thead>

            <tbody>
              {reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">Gate {item.gate}</td>
                    <td className="px-4 py-2 text-center capitalize">{item.action}</td>
                    <td className="px-4 py-2 text-center">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">{new Date(log.created_at).toLocaleTimeString("en-IN", {hour12: false,timeZone: "Asia/Kolkata",})}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
