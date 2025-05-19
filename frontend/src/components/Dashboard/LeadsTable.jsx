import React from "react";
import Table from "../Common/Table.jsx"; // Using the generic Table component
import { formatDateToReadable } from "../../utils/formatDate.js";
import Button from "../Common/Button.jsx";

const LeadsTable = ({
  leads,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onEditLead, // Function to handle editing a lead
  onDeleteLead, // Function to handle deleting a lead
}) => {
  const columns = [
    { header: "Email", accessor: "email", key: "email" },
    {
      header: "Campaign",
      accessor: "campaign",
      key: "campaign",
      render: (campaign) => campaign?.name || "N/A",
    },
    { header: "Score", accessor: "score", key: "score", width: "80px" },
    { header: "Status", accessor: "status", key: "status", width: "120px" },
    { header: "Source", accessor: "source", key: "source" },
    {
      header: "Cost",
      accessor: "cost",
      key: "cost",
      render: (cost) => (cost ? `$${Number(cost).toFixed(2)}` : "$0.00"),
      width: "100px",
    },
    {
      header: "Created At",
      accessor: "createdAt",
      key: "createdAt",
      render: (date) => formatDateToReadable(date),
    },
    {
      header: "Actions",
      key: "actions",
      width: "150px",
      render: (_, row) => (
        <div className="table-actions">
          <Button
            onClick={() => onEditLead(row)}
            size="small"
            variant="secondary"
          >
            Edit
          </Button>
          <Button
            onClick={() => onDeleteLead(row._id)}
            size="small"
            variant="danger"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="leads-table-container">
      <h3>Recent Leads</h3>
      <Table
        columns={columns}
        data={leads}
        isLoading={isLoading && leads?.length === 0} // Show loader only if no data yet and loading
        noDataMessage="No leads found matching your criteria."
      />
      {totalPages > 1 && (
        <div className="pagination-controls card">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            size="small"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            size="small"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
// Add CSS for .table-actions and .pagination-controls in Dashboard.css or a new file
// Example for pagination-controls in Dashboard.css:
// .pagination-controls { display: flex; justify-content: center; align-items: center; gap: 15px; padding: 15px; margin-top: 20px; }
// .pagination-controls span { font-weight: 500; }
// .table-actions { display: flex; gap: 8px; }

export default LeadsTable;
