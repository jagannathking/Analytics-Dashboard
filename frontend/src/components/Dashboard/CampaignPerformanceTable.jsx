import React from "react";
import Table from "../Common/Table.jsx"; // Using the generic Table component

const CampaignPerformanceTable = ({ performanceData, isLoading }) => {
  const columns = [
    { header: "Campaign Name", accessor: "campaignName", key: "name" },
    { header: "Channel", accessor: "channel", key: "channel", width: "150px" },
    {
      header: "Total Leads",
      accessor: "totalLeads",
      key: "totalLeads",
      render: (val) => val?.toLocaleString(),
      width: "120px",
    },
    {
      header: "Converted",
      accessor: "convertedLeads",
      key: "converted",
      render: (val) => val?.toLocaleString(),
      width: "120px",
    },
    {
      header: "Conv. Rate",
      accessor: "conversionRate",
      key: "convRate",
      render: (val) => `${Number(val || 0).toFixed(1)}%`,
      width: "120px",
    },
    {
      header: "Avg. Score",
      accessor: "averageScore",
      key: "avgScore",
      render: (val) => Number(val || 0).toFixed(1),
      width: "120px",
    },
    {
      header: "Total Cost",
      accessor: "totalCost",
      key: "totalCost",
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
      width: "130px",
    },
    {
      header: "Cost/Lead",
      accessor: "costPerLead",
      key: "cpl",
      render: (val) => `$${Number(val || 0).toFixed(2)}`,
      width: "120px",
    },
  ];

  return (
    <div className="campaign-performance-container">
      <h3>Campaign Performance</h3>
      <Table
        columns={columns}
        data={performanceData}
        isLoading={isLoading && performanceData?.length === 0}
        noDataMessage="No campaign performance data available."
      />
    </div>
  );
};

export default CampaignPerformanceTable;
