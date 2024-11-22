import React, { useState, useEffect } from "react";
import { Pagination } from "@/components/ui/pagination";

// Sample time-series data
const initialData = [
  { date: "2023-01-01", value1: 10, value2: 20 },
  { date: "2023-01-02", value1: 15, value2: 25 },
  { date: "2023-01-03", value1: 20, value2: 30 },
  { date: "2023-01-04", value1: 25, value2: 35 },
  // ... more data points
];

function DataDashboard() {
  const [data, setData] = useState(initialData);
  const [visibleFields, setVisibleFields] = useState(["value1", "value2"]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on date range and search term
  const filteredData = data.filter(
    (item) =>
      (!dateRange.start || item.date >= dateRange.start) &&
      (!dateRange.end || item.date <= dateRange.end) &&
      (item.date.includes(searchTerm) ||
        String(item.value1).includes(searchTerm) ||
        String(item.value2).includes(searchTerm))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Helper function to draw charts
  const drawLineChart = (ctx, data, field) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const maxValue = Math.max(...data.map((item) => item[field]));
    const stepX = ctx.canvas.width / (data.length - 1);
    const stepY = ctx.canvas.height / maxValue;

    ctx.beginPath();
    ctx.moveTo(0, ctx.canvas.height - data[0][field] * stepY);
    data.forEach((item, index) => {
      ctx.lineTo(index * stepX, ctx.canvas.height - item[field] * stepY);
    });
    ctx.stroke();
  };

  const drawBarChart = (ctx, data) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const barWidth = ctx.canvas.width / data.length;
    const maxValue = Math.max(
      ...data.map((item) => Math.max(item.value1, item.value2))
    );
    const scale = ctx.canvas.height / maxValue;

    data.forEach((item, index) => {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        index * barWidth,
        ctx.canvas.height - item.value1 * scale,
        barWidth / 2,
        item.value1 * scale
      );
      ctx.fillStyle = "red";
      ctx.fillRect(
        index * barWidth + barWidth / 2,
        ctx.canvas.height - item.value2 * scale,
        barWidth / 2,
        item.value2 * scale
      );
    });
  };

  const drawPieChart = (ctx, data) => {
    if (!ctx) return;
    const total = data.reduce(
      (sum, { value1, value2 }) => sum + value1 + value2,
      0
    );
    let startAngle = 0;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    data.forEach((item) => {
      const sliceAngle = (item.value1 / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = "blue";
      ctx.fill();
      startAngle += sliceAngle;

      const sliceAngle2 = (item.value2 / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle2);
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
      startAngle += sliceAngle2;
    });
  };

  useEffect(() => {
    const lineCtx = document.getElementById("lineChart").getContext("2d");
    const barCtx = document.getElementById("barChart").getContext("2d");
    const pieCtx = document.getElementById("pieChart").getContext("2d");

    drawLineChart(lineCtx, filteredData, "value1");
    drawBarChart(barCtx, filteredData.slice(0, 5)); // Only first 5 for bar chart for simplicity
    drawPieChart(pieCtx, filteredData.slice(0, 1)); // Only first item for pie chart for simplicity
  }, [filteredData, visibleFields]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Data Dashboard</h1>

      {/* Data Input */}
      <div className="mb-4">
        <label>Edit Data:</label>
        {/* Here you would implement a way to edit data, for simplicity, this isn't fully implemented */}
      </div>

      {/* Interactive Elements */}
      <div className="flex mb-4">
        <div>
          <label>Show: </label>
          <input
            type="checkbox"
            checked={visibleFields.includes("value1")}
            onChange={() =>
              setVisibleFields((v) =>
                v.includes("value1")
                  ? v.filter((f) => f !== "value1")
                  : [...v, "value1"]
              )
            }
          />{" "}
          Value 1
          <input
            type="checkbox"
            checked={visibleFields.includes("value2")}
            onChange={() =>
              setVisibleFields((v) =>
                v.includes("value2")
                  ? v.filter((f) => f !== "value2")
                  : [...v, "value2"]
              )
            }
          />{" "}
          Value 2
        </div>
        <div className="ml-4">
          <input
            type="date"
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>
      </div>

      {/* Visualizations */}
      <div className="flex flex-wrap gap-4">
        <canvas
          id="lineChart"
          width="400"
          height="200"
          className="border p-2"
        ></canvas>
        <canvas
          id="barChart"
          width="400"
          height="200"
          className="border p-2"
        ></canvas>
        <canvas
          id="pieChart"
          width="200"
          height="200"
          className="border p-2"
        ></canvas>
      </div>

      {/* Searchable Data Table */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Value 1</th>
              <th className="px-4 py-2">Value 2</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.value1}</td>
                <td className="border px-4 py-2">{item.value2}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          total={totalPages}
          current={currentPage}
          onChange={setCurrentPage}
          className="mt-4"
        />
      </div>
    </div>
  );
}

export default DataDashboard;
