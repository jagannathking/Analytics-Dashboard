import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO, isValid } from 'date-fns'; // isValid for robust date parsing
import useAuth from '../../hooks/useAuth'; // To get theme for chart colors

const LeadsOverTimeChart = ({ data, isLoading }) => {
  const { theme } = useAuth(); // Get current theme

  const strokeColor = theme === 'light' ? '#007bff' : '#8884d8';
  const gridStrokeColor = theme === 'light' ? '#e0e0e0' : '#4a4a4a';
  const textColor = theme === 'light' ? '#333333' : '#c0c0c0';

  if (isLoading && (!data || data.length === 0)) {
    // You could show a skeleton loader for charts
    return <div className="chart-loading-placeholder card">Loading Chart...</div>;
  }
  if (!data || data.length === 0) {
    return <div className="no-data-message card">No lead data available for the selected period.</div>;
  }

  const chartData = data
    .map(item => {
      let dateLabel = String(item._id); // Default to string if complex object
      if (item._id && typeof item._id === 'string' && item._id.match(/^\d{4}-\d{2}-\d{2}$/)) { // YYYY-MM-DD
        const parsedDate = parseISO(item._id);
        if (isValid(parsedDate)) {
          dateLabel = format(parsedDate, 'MMM d'); // e.g., Oct 20
        }
      } else if (item._id && typeof item._id === 'object' && item._id.year && item._id.month) { // {year, month}
        dateLabel = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      }
      // Add more parsing for other groupBy formats if needed (e.g., week)
      return {
        name: dateLabel, // Recharts uses 'name' by default for XAxis if dataKey="name"
        Leads: item.count,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Ensure chronological order for string dates

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`custom-chart-tooltip ${theme === 'light' ? 'light' : 'dark'}`}>
          <p className="tooltip-label">{`Date: ${label}`}</p>
          <p className="tooltip-value">{`Leads: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 350 }} className="leads-over-time-chart-wrapper">
      <h4 style={{ color: textColor, marginBottom: '15px', textAlign: 'center' }}>Leads Trend Over Time</h4>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} dy={10} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: textColor }} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={{ fontSize: "13px", color: textColor, paddingTop: "10px" }} />
          <Line type="monotone" dataKey="Leads" stroke={strokeColor} strokeWidth={2} activeDot={{ r: 7 }} dot={{ r: 3, fill: strokeColor }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Add CSS for .custom-chart-tooltip and .chart-loading-placeholder if needed in Dashboard.css or a new file
// Example for tooltip in Dashboard.css:
// .custom-chart-tooltip.dark { background-color: rgba(30,30,30,0.9); color: #fff; padding: 10px; border-radius: 5px; border: 1px solid #555; }
// .custom-chart-tooltip.light { background-color: rgba(250,250,250,0.95); color: #333; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.2); }
// .tooltip-label { margin-bottom: 5px; font-weight: bold; }

export default LeadsOverTimeChart;