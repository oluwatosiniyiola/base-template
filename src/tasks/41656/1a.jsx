import React, { useState, useEffect } from "react";

// Sample data
const initialData = [
  { date: "2023-01-01", value1: 100, value2: 150 },
  { date: "2023-02-01", value1: 120, value2: 130 },
  { date: "2023-03-01", value1: 140, value2: 160 },
  { date: "2023-04-01", value1: 160, value2: 140 },
  { date: "2023-05-01", value1: 180, value2: 170 },
  { date: "2023-06-01", value1: 200, value2: 190 },
];

const Dashboard = () => {
  const [data, setData] = useState(initialData);
  const [showValue1, setShowValue1] = useState(true);
  const [showValue2, setShowValue2] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredData = data
    .filter(
      (item) =>
        (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate) &&
        (item.date.includes(searchTerm) ||
          item.value1.toString().includes(searchTerm) ||
          item.value2.toString().includes(searchTerm))
    )
    .sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const LineChart = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.value1, d.value2)));
    const width = 600;
    const height = 300;
    const padding = 40;

    const xScale = (index) =>
      (width - 2 * padding) * (index / (data.length - 1)) + padding;
    const yScale = (value) =>
      height - padding - (height - 2 * padding) * (value / maxValue);

    return (
      <svg width={width} height={height}>
        {showValue1 && (
          <path
            d={data
              .map(
                (d, i) =>
                  `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.value1)}`
              )
              .join(" ")}
            stroke="blue"
            fill="none"
          />
        )}
        {showValue2 && (
          <path
            d={data
              .map(
                (d, i) =>
                  `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(d.value2)}`
              )
              .join(" ")}
            stroke="red"
            fill="none"
          />
        )}
        {data.map((d, i) => (
          <g key={i}>
            {showValue1 && (
              <circle cx={xScale(i)} cy={yScale(d.value1)} r="4" fill="blue">
                <title>{`Date: ${d.date}, Value1: ${d.value1}`}</title>
              </circle>
            )}
            {showValue2 && (
              <circle cx={xScale(i)} cy={yScale(d.value2)} r="4" fill="red">
                <title>{`Date: ${d.date}, Value2: ${d.value2}`}</title>
              </circle>
            )}
          </g>
        ))}
        <text x={width / 2} y={height - 5} textAnchor="middle">
          Date
        </text>
        <text
          x={5}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 5 ${height / 2})`}
        >
          Value
        </text>
      </svg>
    );
  };

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => Math.max(d.value1, d.value2)));
    const width = 600;
    const height = 300;
    const padding = 40;
    const barWidth = (width - 2 * padding) / (data.length * 2) - 5;

    const xScale = (index) =>
      padding + index * ((width - 2 * padding) / data.length);
    const yScale = (value) =>
      height - padding - (height - 2 * padding) * (value / maxValue);

    return (
      <svg width={width} height={height}>
        {data.map((d, i) => (
          <g key={i}>
            {showValue1 && (
              <rect
                x={xScale(i)}
                y={yScale(d.value1)}
                width={barWidth}
                height={height - padding - yScale(d.value1)}
                fill="blue"
              >
                <title>{`Date: ${d.date}, Value1: ${d.value1}`}</title>
              </rect>
            )}
            {showValue2 && (
              <rect
                x={xScale(i) + barWidth + 5}
                y={yScale(d.value2)}
                width={barWidth}
                height={height - padding - yScale(d.value2)}
                fill="red"
              >
                <title>{`Date: ${d.date}, Value2: ${d.value2}`}</title>
              </rect>
            )}
          </g>
        ))}
        <text x={width / 2} y={height - 5} textAnchor="middle">
          Date
        </text>
        <text
          x={5}
          y={height / 2}
          textAnchor="middle"
          transform={`rotate(-90 5 ${height / 2})`}
        >
          Value
        </text>
      </svg>
    );
  };

  const PieChart = ({ data }) => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const total = data.reduce((sum, d) => sum + d.value1 + d.value2, 0);
    let startAngle = 0;

    const slices = data
      .flatMap((d) => [
        { value: d.value1, color: "blue" },
        { value: d.value2, color: "red" },
      ])
      .filter(
        (slice) =>
          (slice.color === "blue" && showValue1) ||
          (slice.color === "red" && showValue2)
      );

    return (
      <svg width={width} height={height}>
        {slices.map((slice, i) => {
          const angle = (slice.value / total) * 360;
          const endAngle = startAngle + angle;

          const x1 = centerX + radius * Math.cos((Math.PI * startAngle) / 180);
          const y1 = centerY + radius * Math.sin((Math.PI * startAngle) / 180);
          const x2 = centerX + radius * Math.cos((Math.PI * endAngle) / 180);
          const y2 = centerY + radius * Math.sin((Math.PI * endAngle) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            "Z",
          ].join(" ");

          startAngle = endAngle;

          return <path key={i} d={pathData} fill={slice.color} />;
        })}
      </svg>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Dashboard</h1>

      <div className="mb-4">
        <label className="mr-2">
          <input
            type="checkbox"
            checked={showValue1}
            onChange={() => setShowValue1(!showValue1)}
          />
          Show Value 1
        </label>
        <label>
          <input
            type="checkbox"
            checked={showValue2}
            onChange={() => setShowValue2(!showValue2)}
          />
          Show Value 2
        </label>
      </div>

      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mr-2 p-1 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-1 border rounded"
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Line Chart</h2>
        <LineChart data={filteredData} />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Bar Chart</h2>
        <BarChart data={filteredData} />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Pie Chart</h2>
        <PieChart data={filteredData} />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-1 border rounded"
        />
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Date
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("value1")}
            >
              Value 1
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("value2")}
            >
              Value 2
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.date}</td>
              <td className="border p-2">{item.value1}</td>
              <td className="border p-2">{item.value2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${pageCount}`}</span>
        <button
          onClick={() =>
            setCurrentPage(
              currentPage < pageCount ? currentPage + 1 : pageCount
            )
          }
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
